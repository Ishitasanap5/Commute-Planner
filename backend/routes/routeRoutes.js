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
  getMonthlyAnalytics
} from "../controllers/routeController.js";

const router = express.Router();

router.post("/", protect, createRoute);
router.get("/", protect, getUserRoutes);
router.get("/analytics", protect, getRouteAnalytics);
router.put("/:id", protect, updateRoute);
router.delete("/:id", protect, deleteRoute);
router.get("/analytics/monthly", protect, getMonthlyAnalytics);
router.get("/analytics/mode-breakdown", protect, getModeBreakdown);
router.get("/analytics/cost-trend", protect, getCostTrend);

export default router;