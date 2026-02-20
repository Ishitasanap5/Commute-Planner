import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  mode: { type: String, enum: ["bus","train","cab","walk"], required: true },
  distance: { type: Number, required: true }, // in km or meters
  time: { type: Number, required: true },     // in minutes
  cost: { type: Number, required: true },
}, { timestamps:true });

export default mongoose.model("Route", routeSchema);