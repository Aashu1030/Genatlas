import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";
import { getGeneBySymbol } from "../services/ensemblService.js";

const ENSEMBL_BASE = "https://rest.ensembl.org";
const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

const ensemblHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

function clampSnippet(seq, maxLen = 220) {
  if (!seq) return "";
  const cleaned = String(seq).replace(/\s+/g, "");
  if (cleaned.length <= maxLen) return cleaned;
  return `${cleaned.slice(0, maxLen)}…`;
}

function computeSequenceStats(seq) {
  const cleaned = (seq || "").toUpperCase().replace(/[^ATGC]/g, "");
  const length = cleaned.length;
  const counts = { A: 0, T: 0, G: 0, C: 0 };
  for (const ch of cleaned) {
    if (counts[ch] !== undefined) counts[ch] += 1;
  }
  const gc = length > 0 ? ((counts.G + counts.C) / length) * 100 : 0;
  return {
    length,
    gcContent: Number(gc.toFixed(2)),
    baseComposition: counts,
    snippet: clampSnippet(cleaned),
  };
}


function extractAlleles(variant) {
  if (variant.allele_string && String(variant.allele_string).trim()) {
    const raw = String(variant.allele_string).trim();
    const parts = raw.split("/");
    const ref = parts[0] || null;
    const alt = parts.slice(1).join("/") || null;
    const change = ref && alt ? `${ref}→${alt}` : raw;
    return { ref, alt, change };
  }
  if (Array.isArray(variant.alleles) && variant.alleles.length > 0) {
    const ref = variant.alleles[0] || null;
    const alt = variant.alleles.slice(1).join("/") || null;
    const change = ref && alt ? `${ref}→${alt}` : variant.alleles.join("/");
    return { ref, alt, change };
  }
  return { ref: null, alt: null, change: "" };
}

function classifyMutationType(ref, alt) {
  if (!ref || !alt) return "unknown";
  const refLen = String(ref).replace(/-/g, "").length;
  const altLen = String(alt).replace(/-/g, "").length;
  if (refLen === 1 && altLen === 1) return "snp";
  if (altLen > refLen) return "insertion";
  if (refLen > altLen) return "deletion";
  return "substitution";
}


function normalizeConsequence(raw) {
  if (!raw) return "unknown";
  if (Array.isArray(raw)) {
    return raw.length > 0 ? raw.join(", ") : "unknown";
  }
  return String(raw).trim() || "unknown";
}

function buildVariantSummary(variants = []) {
  const typeDistribution = {
    snp: 0,
    insertion: 0,
    deletion: 0,
    substitution: 0,
    unknown: 0,
  };
  const consequenceDistribution = {};

  for (const v of variants) {
    const { ref, alt } = extractAlleles(v);
    const t = classifyMutationType(ref, alt);
    typeDistribution[t] = (typeDistribution[t] || 0) + 1;

    const consequence = normalizeConsequence(v.consequence_type);
    const parts = consequence.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    for (const p of parts) {
      consequenceDistribution[p] = (consequenceDistribution[p] || 0) + 1;
    }
  }

  const topVariants = variants.map((v) => {
    const { ref, alt, change } = extractAlleles(v);
    const mutationType = classifyMutationType(ref, alt);
    const consequence = normalizeConsequence(v.consequence_type);

    return {
      id: v.id || v.variation_name || "",
      chromosome: v.seq_region_name || "",
      position: v.start ?? null,
      end: v.end ?? null,
      alleleChange: change || (Array.isArray(v.alleles) ? v.alleles.join("/") : "") || v.allele_string || "",
      strand: v.strand ?? null,
      mutationType,
      consequence,
      clinicalSignificance: Array.isArray(v.clinical_significance)
        ? v.clinical_significance.filter(Boolean).join(", ")
        : v.clinical_significance || null,
    };
  });

  return {
    totalVariants: variants.length,
    snpCount: typeDistribution.snp || 0,
    insertionCount: typeDistribution.insertion || 0,
    deletionCount: typeDistribution.deletion || 0,
    typeDistribution,
    consequenceDistribution,
    topVariants,
  };
}

function deriveDiseaseAssociations({ geneDescription, papers }) {
  const text = `${geneDescription || ""}\n${(papers || [])
    .map((p) => `${p.title || ""} ${p.journal || ""}`)
    .join("\n")}`.toLowerCase();

  const rules = [
    { tag: "Cancer relevance", keywords: ["cancer", "tumor", "carcinoma", "oncogen", "metast", "neoplasm", "malignant"] },
    { tag: "DNA repair / genome stability", keywords: ["dna repair", "genome stability", "double-strand break", "homologous recombination", "brca", "rad51", "atm", "atr", "mismatch repair"] },
    { tag: "Immune / inflammation", keywords: ["immune", "interferon", "inflammation", "cytokine", "tnf", "nf-kb", "nuclear factor kappa", "autoimmune"] },
    { tag: "Neurobiology", keywords: ["neuro", "brain", "synaptic", "neuronal", "alzheimer", "parkinson", "dementia", "cognitive"] },
    { tag: "Cardiometabolic", keywords: ["cardio", "heart", "lipid", "cholesterol", "diabetes", "metabolic", "atherosclerosis"] },
    { tag: "Cell cycle / Apoptosis", keywords: ["apoptosis", "cell cycle", "programmed cell death", "tumor suppressor", "p53", "checkpoint", "senescence"] },
    { tag: "Signal transduction", keywords: ["kinase", "phosphorylation", "signal transduction", "receptor", "egfr", "pathway", "signaling"] },
    { tag: "Hereditary disorder", keywords: ["hereditary", "familial", "inherited", "germline", "predisposition", "syndrome"] },
  ];

  const hits = [];
  for (const rule of rules) {
    const matched = rule.keywords.find((k) => text.includes(k));
    if (!matched) continue;
    hits.push({
      tag: rule.tag,
      evidence: `Matched keyword: "${matched}"`,
      source: "Gene description / PubMed titles",
    });
  }

  return hits.slice(0, 8);
}

async function fetchEnsemblSequence(geneId) {
  const r = await axios.get(`${ENSEMBL_BASE}/sequence/id/${geneId}`, {
    headers: ensemblHeaders,
    timeout: 20000,
  });
  if (typeof r.data === "string") return r.data;
  return r.data?.seq || "";
}

async function fetchEnsemblVariants(geneId, geneLookup) {
  const chr = geneLookup?.seq_region_name;
  const geneStart = geneLookup?.start;
  const geneEnd = geneLookup?.end;

  if (chr && geneStart && geneEnd) {
    const CHUNK_SIZE = 5_000_000; 
    const allVariants = [];
    let start = geneStart;

    while (start <= geneEnd) {
      const end = Math.min(start + CHUNK_SIZE - 1, geneEnd);
      try {
        const r = await axios.get(
          `${ENSEMBL_BASE}/overlap/region/human/${chr}:${start}-${end}?feature=variation`,
          {
            headers: ensemblHeaders,
            timeout: 60000,
          }
        );
        if (Array.isArray(r.data)) {
          allVariants.push(...r.data);
        }
      } catch (chunkErr) {
        console.warn(`Variant chunk ${chr}:${start}-${end} failed:`, chunkErr.message);

      }
      start = end + 1;
    }

    const seen = new Set();
    const unique = [];
    for (const v of allVariants) {
      const key = v.id || v.variation_name || `${v.seq_region_name}:${v.start}:${v.allele_string}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(v);
      }
    }

    console.log(`Fetched ${unique.length} unique variants for ${chr}:${geneStart}-${geneEnd}`);
    return unique;
  }

  const r = await axios.get(`${ENSEMBL_BASE}/overlap/id/${geneId}?feature=variation`, {
    headers: ensemblHeaders,
    timeout: 60000,
  });
  return Array.isArray(r.data) ? r.data : [];
}

async function fetchPubMedPapers(geneSymbol) {
  const term = `${geneSymbol}[Title/Abstract] AND Homo sapiens[Organism]`;
  const searchRes = await axios.get(`${PUBMED_BASE}/esearch.fcgi`, {
    params: { db: "pubmed", term, retmode: "json", retmax: 12, sort: "relevance" },
    timeout: 20000,
  });

  const pmids = searchRes.data?.esearchresult?.idlist || [];
  if (!pmids.length) return [];

  const summaryRes = await axios.get(`${PUBMED_BASE}/esummary.fcgi`, {
    params: { db: "pubmed", id: pmids.join(","), retmode: "json" },
    timeout: 20000,
  });

  const results = summaryRes.data?.result || {};
  return pmids
    .map((id) => {
      const item = results[id];
      if (!item) return null;
      return {
        pmid: id,
        title: item.title || "",
        journal: item.fulljournalname || item.source || null,
        pubDate: item.pubdate || null,
        authors: item.authors?.map((a) => a.name).filter(Boolean) || [],
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      };
    })
    .filter(Boolean);
}

export const getGeneReport = asyncHandler(async (req, res) => {
  const geneSymbol = String(req.params.gene || "").trim().toUpperCase();
  if (!geneSymbol) {
    return res.status(400).json({ success: false, message: "Gene symbol is required" });
  }

  const geneLookup = await getGeneBySymbol(geneSymbol);
  if (!geneLookup?.id) {
    return res.status(404).json({ success: false, message: `Gene not found: ${geneSymbol}` });
  }

  const [seqRes, varRes, papersRes] = await Promise.allSettled([
    fetchEnsemblSequence(geneLookup.id),
    fetchEnsemblVariants(geneLookup.id, geneLookup),
    fetchPubMedPapers(geneSymbol),
  ]);

  const seq = seqRes.status === "fulfilled" ? seqRes.value : "";
  const variantsRaw = varRes.status === "fulfilled" ? varRes.value : [];
  const papers = papersRes.status === "fulfilled" ? papersRes.value : [];

  const description = geneLookup.description
    ? String(geneLookup.description).replace(/\s*\[Source:.*?\]\s*$/, "")
    : "";

  const response = {
    success: true,
    gene: {
      name: geneLookup.display_name || geneSymbol,
      id: geneLookup.id || "",
      description,
      chromosome: geneLookup.seq_region_name || "",
      start: geneLookup.start || 0,
      end: geneLookup.end || 0,
      strand: geneLookup.strand ?? 0,
      biotype: geneLookup.biotype || "",
      assembly: geneLookup.assembly_name || "GRCh38",
    },
    sequence: computeSequenceStats(seq),
    variants: buildVariantSummary(variantsRaw),
    diseaseAssociations: deriveDiseaseAssociations({ geneDescription: description, papers }),
    researchPapers: papers,
  };

  res.json(response);
});
