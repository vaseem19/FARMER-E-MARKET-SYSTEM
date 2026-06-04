import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// 🌱 Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ===============================
// 📁 STATIC FILES (IMPORTANT FOR PROFILE IMAGES)
// ===============================
app.use("/uploads", express.static("uploads"));

// ===============================
// ROUTES
// ===============================
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import bapRoutes from "./routes/bapRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import weatherRoutes from "./routes/weather.js";
import yieldRoutes from "./routes/yieldRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import fertilizerRoutes from "./routes/fertilizerRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

console.log("🔥 All routes loaded");

// Test route
app.get("/api/weather/test", (req, res) => {
  res.send("Weather route working ✅");
});

// API Routes
app.use("/api/disease", diseaseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bap", bapRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/yield", yieldRoutes);
app.use("/api/fertilizer", fertilizerRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/payment", paymentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Farmer E-Market Backend Running...");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});