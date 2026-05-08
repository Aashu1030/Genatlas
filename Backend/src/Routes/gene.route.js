import express from "express";

import {
  getGeneInfo,
  getSequence,
  getVariants
} from "../controllers/geneController.js";

const router = express.Router();

router.get("/info/:symbol", getGeneInfo);

router.get("/sequence/:symbol", getSequence);

router.get("/variants/:symbol", getVariants);

export default router;