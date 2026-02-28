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
// Add at the bottom of routeController.js
export const getCostTrend = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const trend = await Route.aggregate([
    {
      $match: {
        userId: req.user._id,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        totalCost: { $sum: "$cost" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ])

  res.status(200).json(trend)
})
export const getModeBreakdown = asyncHandler(async (req, res) => {
  const breakdown = await Route.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: "$mode",            // group by mode: cab, bus, train, walk
        count: { $sum: 1 },      // number of trips per mode
        totalCost: { $sum: "$cost" } // total cost per mode
      }
    },
    { $sort: { count: -1 } }    // sort by most used mode
  ]);

  res.status(200).json(breakdown);
});

/* ================= GET MONTHLY ANALYTICS ================= */
export const getMonthlyAnalytics = asyncHandler(async (req, res) => {
  const analytics = await Route.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        totalCost: { $sum: "$cost" },
        totalTime: { $sum: "$time" },
        totalRoutes: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } } // sort by date
  ]);

  res.status(200).json(analytics);
});