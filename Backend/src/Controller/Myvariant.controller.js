import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";
import { getGeneBySymbol } from "../services/ensemblService.js";

const ENSEMBL_BASE = "https://rest.ensembl.org";
const MYVARIANT_BASE = "https://myvariant.info/v1/variant";

const headers = {
  "Content-Type": "application/json"
};

const buildId = (chr, pos, ref, alt) => {
  if (!chr || !pos || !ref || !alt) return null;
  return `chr${chr}:g.${pos}${ref}>${alt}`;
};

export const getGeneClinicalVariants = asyncHandler(async (req, res) => {
  const gene = await getGeneBySymbol(req.params.symbol);

  const response = await axios.get(
    `${ENSEMBL_BASE}/overlap/id/${gene.id}?feature=variation`,
    { headers }
  );

  const parsed = response.data.map((v) => {
    const alleles = (v.allele_string || "").split("/");

    const ref = alleles[0];
    const alt = alleles[1];

    const id = buildId(v.seq_region_name, v.start, ref, alt);

    return {
      ensemblVariantId: v.id,
      chr: v.seq_region_name,
      pos: v.start,
      ref,
      alt,
      myVariantId: id
    };
  }).filter(v => v.myVariantId);

  const enriched = await Promise.all(
    parsed.slice(0, 10).map(async (v) => {
      try {
        const r = await axios.get(`${MYVARIANT_BASE}/${v.myVariantId}`);

        return {
          ...v,
          clinical: r.data
        };
      } catch {
        return { ...v, clinical: null };
      }
    })
  );

  res.json({
    success: true,
    gene: gene.display_name,
    geneId: gene.id,
    total: parsed.length,
    variants: enriched
  });
});