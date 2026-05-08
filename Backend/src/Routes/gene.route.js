import express from "express";

import { getGeneReport } from "../Controller/report.controller.js";

const router = express.Router();
router.get("/report/:gene", getGeneReport);

export default router;