import rateLimit from "express-rate-limit";

// ================= GLOBAL API LIMIT =================
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
});

// ================= AUTH LIMIT (Stricter for login/register) =================
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // only 10 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

// ================= COMPARISON API LIMIT (Protect API quota) =================
export const comparisonLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 comparison calls per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many comparison requests. Please slow down.",
  },
});