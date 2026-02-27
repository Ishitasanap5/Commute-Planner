import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createAlert } from "../controllers/alertController.js";

const router = express.Router();

router.post("/", protect, createAlert);

export default router;