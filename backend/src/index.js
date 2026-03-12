import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listings.js";
import socialRoutes from "./routes/social.js";
import leadRoutes from "./routes/leads.js";
import billingRoutes from "./routes/billing.js";
import whatsappRoutes from "./routes/whatsapp.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

console.log("OPENAI KEY:", process.env.OPENAI_API_KEY ? "Loaded" : "Missing");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});