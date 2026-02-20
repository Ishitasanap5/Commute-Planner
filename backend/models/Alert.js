import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  type: { type: String, enum: ["traffic","weather"], required: true },
  message: { type: String, required: true },
  delay: { type: Number },   // delay in minutes
}, { timestamps: true });

export default mongoose.model("Alert", alertSchema);