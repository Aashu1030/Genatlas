import asyncHandler from "../middleware/asyncHandler.js";
import { getGeneBySymbol } from "../services/ensemblService.js";
import axios from "axios";

const BASE_URL = "https://rest.ensembl.org";
const headers = { "Content-Type": "application/json" };

export const getGeneInfo = asyncHandler(async (req, res) => {
  const { symbol } = req.params;

  const data = await getGeneBySymbol(symbol);

  res.json({
    success: true,
    data
  });
});

export const getGeneSequence = asyncHandler(async (req, res) => {
  const { symbol } = req.params;

  const gene = await getGeneBySymbol(symbol);

  const sequence = await axios.get(
    `${BASE_URL}/sequence/id/${gene.id}`,
    { headers }
  );

  res.json({
    success: true,
    gene: symbol,
    geneId: gene.id,
    sequence: sequence.data
  });
});


export const getGeneVariants = asyncHandler(async (req, res) => {
  const { symbol } = req.params;

  const gene = await getGeneBySymbol(symbol);

  const variants = await axios.get(
    `${BASE_URL}/overlap/id/${gene.id}?feature=variation`,
    { headers }
  );

  res.json({
    success: true,
    gene: symbol,
    geneId: gene.id,
    totalVariants: variants.data.length,
    variants: variants.data
  });
});