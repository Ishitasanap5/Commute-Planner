import express from "express";
import { getLiveComparison } from "../controllers/comparisonController.js";
import protect from "../middleware/authMiddleware.js";
import { comparisonLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/", protect, comparisonLimiter, getLiveComparison);

export default router;