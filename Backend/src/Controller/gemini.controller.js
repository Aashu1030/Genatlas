import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent";

export const getGeneSummary = asyncHandler(async (req, res) => {
  const geneSymbol = String(req.params.gene || "").trim().toUpperCase();
  if (!geneSymbol) {
    return res.status(400).json({ success: false, message: "Gene symbol is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: "Gemini API key is not configured. Add GEMINI_API_KEY to your .env file.",
    });
  }

  const description = req.query.description || "";
  const biotype = req.query.biotype || "";
  const chromosome = req.query.chromosome || "";

  const prompt = `You are a clinical geneticist and medical researcher. Provide a highly informative, disease-focused overview of the gene "${geneSymbol}". 

Here is some technical information about this gene:
- Official description: ${description || "Not available"}
- Biotype: ${biotype || "Not available"}  
- Chromosome location: ${chromosome || "Not available"}

Please structure your response into the following clear sections (use bold text for the section names instead of large markdown headers):
1. **Associated Diseases & Conditions**: What specific genetic disorders, cancers, or syndromes are caused by mutations or variants in this gene? Be specific and informative.
2. **Clinical Impact**: How do defects in this gene actually cause disease? Explain the pathomechanism (e.g., loss of tumor suppression, metabolic buildup, structural failure).
3. **Biological Function**: A brief explanation of the gene's normal, healthy function and the protein it produces.
4. **Key Pathways**: What cellular pathways this gene is actively involved in (e.g., DNA repair, metabolism, cell division).

Rules:
- Focus heavily on clinical relevance, pathology, and disease mechanisms
- Keep the tone professional, medical, and highly informative
- Briefly define complex medical terms inline if necessary
- Do NOT use markdown headers (no # symbols)`;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 512,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return res.status(502).json({
        success: false,
        message: "Gemini returned an empty response",
      });
    }

    res.json({
      success: true,
      gene: geneSymbol,
      summary: text.trim(),
    });
  } catch (err) {
    const status = err.response?.status || 500;
    const msg =
      err.response?.data?.error?.message ||
      err.message ||
      "Failed to get summary from Gemini";
    console.error(`Gemini API error for ${geneSymbol}:`, msg);
    res.status(status).json({ success: false, message: msg });
  }
});
