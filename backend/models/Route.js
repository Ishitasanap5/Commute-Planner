import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    start: { type: String, required: true },
    end: { type: String, required: true },
    mode: {
      type: String,
      enum: ["bus", "train", "cab", "walk"],
      required: true,
    },
    distance: { type: Number, required: true },
    time: { type: Number, required: true },
    cost: { type: Number, required: true },
    estimatedTime: { type: Number },
    actualTime: { type: Number },
    weatherCondition: { type: String },
    trafficLevel: {
      type: String,
      enum: ["Low", "Medium", "Heavy"],
    },
  },
  { timestamps: true }
);

// ================= INDEXES FOR PERFORMANCE =================
routeSchema.index({ userId: 1, createdAt: 1 });
routeSchema.index({ userId: 1, mode: 1 });

export default mongoose.model("Route", routeSchema);