import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createRoute,
  getUserRoutes,
  updateRoute,
  deleteRoute,
  getRouteAnalytics,
  getCostTrend,
  getModeBreakdown,
  getMonthlyAnalytics,
} from "../controllers/routeController.js";
import { validateRoute } from "../middleware/validationMiddleware.js";

const router = express.Router();

// ================= CREATE ROUTE =================
router.post("/", protect, validateRoute, createRoute);

// ================= GET ROUTES =================
router.get("/", protect, getUserRoutes);

// ================= ANALYTICS (Specific Routes First) =================
router.get("/analytics", protect, getRouteAnalytics);
router.get("/analytics/monthly", protect, getMonthlyAnalytics);
router.get("/analytics/mode-breakdown", protect, getModeBreakdown);
router.get("/analytics/cost-trend", protect, getCostTrend);

// ================= DYNAMIC ROUTES (LAST) =================
router.put("/:id", protect, updateRoute);
router.delete("/:id", protect, deleteRoute);

export default router;