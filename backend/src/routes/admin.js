import express from "express";
import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Lead from "../models/Lead.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  const [totalUsers, totalListings, totalLeads] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments(),
    Lead.countDocuments(),
  ]);

  res.json({
    totalUsers,
    totalListings,
    totalLeads,
    // Revenue tracking could be implemented via Razorpay APIs or separate collection.
  });
});

export default router;

