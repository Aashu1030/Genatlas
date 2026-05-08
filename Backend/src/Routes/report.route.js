import express from "express";
import { getGeneSummary } from "../Controller/gemini.controller.js";
import { getGeneReport } from "../Controller/report.controller.js";

const router = express.Router();
router.get("/report/:gene", getGeneReport);
router.get("/gemini-summary/:gene", getGeneSummary);

export default router;