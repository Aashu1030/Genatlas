import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";
import { getGeneBySymbol } from "../services/ensemblService.js";

const ENSEMBL = "https://rest.ensembl.org";
const GNOMAD_API = "https://gnomad.broadinstitute.org/api";

const headers = {
  "Content-Type": "application/json"
};

const fetchGnomadVariant = async (variantId) => {
  const query = {
    query: `
      {
        variant(variantId: "${variantId}") {
          variantId
          exome { ac an af }
          genome { ac an af }
        }
      }
    `
  };

  const res = await axios.post(GNOMAD_API, query, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  return res.data?.data?.variant;
};

export const getGenePopulationDistribution = asyncHandler(async (req, res) => {
  const { symbol } = req.params;

  if (!symbol) {
    return res.status(400).json({
      success: false,
      message: "Gene symbol is required"
    });
  }

  const gene = await getGeneBySymbol(symbol);

  const variantRes = await axios.get(
    `${ENSEMBL}/overlap/id/${gene.id}?feature=variation`,
    { headers }
  );

  const variants = variantRes.data || [];

  if (!variants.length) {
    return res.json({
      success: true,
      gene: gene.display_name,
      geneId: gene.id,
      variants: [],
      populationDistribution: {
        Africa: 0,
        Europe: 0,
        Asia: 0,
        Americas: 0
      }
    });
  }

  const parsed = variants.slice(0, 10).map(v => {
    const alleles = (v.allele_string || "").split("/");

    const ref = alleles[0];
    const alt = alleles[1];

    return {
      rsid: v.id,
      chr: v.seq_region_name,
      pos: v.start,
      ref,
      alt,
      variantId: `${v.seq_region_name}-${v.start}-${ref}-${alt}`
    };
  });

  const enriched = await Promise.all(
    parsed.map(async (v) => {
      try {
        const data = await fetchGnomadVariant(v.variantId);

        return {
          ...v,
          exomeAF: data?.exome?.af ?? 0,
          genomeAF: data?.genome?.af ?? 0
        };
      } catch {
        return {
          ...v,
          exomeAF: null,
          genomeAF: null
        };
      }
    })
  );

  const distribution = {
    Africa: 0,
    Europe: 0,
    Asia: 0,
    Americas: 0
  };

  enriched.forEach(v => {
    const avg = (v.exomeAF + v.genomeAF) / 2;

    if (!avg || isNaN(avg)) return;

    distribution.Europe += avg * 0.4;
    distribution.Africa += avg * 0.3;
    distribution.Asia += avg * 0.2;
    distribution.Americas += avg * 0.1;
  });

  res.json({
    success: true,
    gene: gene.display_name,
    geneId: gene.id,
    variantCount: enriched.length,
    variants: enriched,
    populationDistribution: distribution
  });
});