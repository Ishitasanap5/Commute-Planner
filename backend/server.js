import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/alerts", alertRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});