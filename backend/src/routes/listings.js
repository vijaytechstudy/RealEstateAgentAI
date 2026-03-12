import express from "express";
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const FREE_PLAN_LIMIT = 3;

const ensureListingQuota = async (user) => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  if (user.listingGenerationMonth !== month || user.listingGenerationYear !== year) {
    user.listingGenerationMonth = month;
    user.listingGenerationYear = year;
    user.listingGenerationsThisMonth = 0;
  }

  if (user.plan === "free" && user.listingGenerationsThisMonth >= FREE_PLAN_LIMIT) {
    return false;
  }

  user.listingGenerationsThisMonth += 1;
  await user.save();
  return true;
};

router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      location,
      price,
      bedrooms,
      bathrooms,
      amenities,
      description,
    } = req.body;

    if (!title || !location || !price) {
      return res.status(400).json({ message: "Title, location and price are required" });
    }

    const user = await User.findById(req.user._id);
    const allowed = await ensureListingQuota(user);

    if (!allowed) {
      return res.status(403).json({
        message: "Free plan limit reached. Upgrade to generate more listings.",
      });
    }

    const headline = `${bedrooms || ""} BHK in ${location} for ${price}`.trim();

    const generated = {
      headline: headline || title,
      description:
        description ||
        `Discover this property in ${location} priced at ${price}.` +
          (amenities && amenities.length
            ? ` Key amenities include ${amenities.join(", ")}.`
            : ""),
      highlights: [
        bedrooms ? `${bedrooms} spacious bedrooms` : "Comfortable layout",
        bathrooms ? `${bathrooms} modern bathrooms` : "Well-appointed bathrooms",
        location ? `Prime location in ${location}` : "Conveniently located",
      ],
      marketingCopy:
        `Book a visit today for this ${bedrooms || ""} BHK in ${location || "a prime area"} ` +
        `priced at ${price}. Contact your agent to schedule a viewing and explore this opportunity.`,
    };

    const listing = await Listing.create({
      userId: req.user._id,
      title,
      location,
      price,
      bedrooms,
      bathrooms,
      amenities,
      inputDescription: description,
      generated,
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error("Listing generate error (no‑AI stub):", err);
    res.status(500).json({ message: "Failed to generate listing" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const listings = await Listing.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(listings);
});

export default router;