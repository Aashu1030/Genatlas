import axios from "axios";
import asyncHandler from "../middleware/asyncHandler.js";

const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export const getPaperCards = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const searchRes = await axios.get(`${BASE}/esearch.fcgi`, {
    params: {
      db: "pubmed",
      term: query,
      retmode: "json",
      retmax: 10
    }
  });

  const pmids = searchRes.data.esearchresult.idlist;

  if (!pmids.length) {
    return res.json({ success: true, papers: [] });
  }

  const summaryRes = await axios.get(`${BASE}/esummary.fcgi`, {
    params: {
      db: "pubmed",
      id: pmids.join(","),
      retmode: "json"
    }
  });

  const results = summaryRes.data.result;

  const papers = pmids.map(id => {
    const item = results[id];
    if (!item) return null;

    return {
      pmid: id,
      title: item.title,
      description: item.snippet || item.title,
      url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      journal: item.fulljournalname || null,
      pubDate: item.pubdate || null,
      authors: item.authors?.map(a => a.name) || []
    };
  }).filter(Boolean);

  res.json({
    success: true,
    query,
    count: papers.length,
    papers
  });
});