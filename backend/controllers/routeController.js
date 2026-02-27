import Route from "../models/Route.js";
import asyncHandler from "../utils/asyncHandler.js";

/* ================= CREATE ROUTE ================= */
export const createRoute = asyncHandler(async (req, res) => {
  const { start, end, mode, distance, time, cost } = req.body;

  const route = await Route.create({
    userId: req.user._id,
    start,
    end,
    mode,
    distance,
    time,
    cost,
  });

  res.status(201).json(route);
});

/* ================= GET USER ROUTES ================= */
export const getUserRoutes = asyncHandler(async (req, res) => {
  const routes = await Route.find({ userId: req.user._id });
  res.status(200).json(routes);
});

/* ================= UPDATE ROUTE ================= */
export const updateRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);

  if (!route) {
    res.status(404);
    throw new Error("Route not found");
  }

  if (route.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedRoute = await Route.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedRoute);
});

/* ================= DELETE ROUTE ================= */
export const deleteRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);

  if (!route) {
    res.status(404);
    throw new Error("Route not found");
  }

  if (route.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await route.deleteOne();

  res.status(200).json({ message: "Route deleted successfully" });
});

/* ================= BASIC ANALYTICS ================= */
export const getRouteAnalytics = asyncHandler(async (req, res) => {
  const result = await Route.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: null,
        totalRoutes: { $sum: 1 },
        totalCost: { $sum: "$cost" },
        averageCommuteTime: { $avg: "$time" },
      },
    },
  ]);

  res.status(200).json(
    result[0] || {
      totalRoutes: 0,
      totalCost: 0,
      averageCommuteTime: 0,
    }
  );
});