import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Apply stricter limiter
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);

export default router;