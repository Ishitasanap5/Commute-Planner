import Alert from "../models/Alert.js";
import Route from "../models/Route.js";

// ✅ Create Alert
export const createAlert = async (req, res) => {
  try {
    const { routeId, type, message, delay } = req.body;

    // Check route exists and belongs to user
    const route = await Route.findById(routeId);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    if (route.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const alert = await Alert.create({
      routeId,
      type,
      message,
      delay
    });

    res.status(201).json(alert);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};