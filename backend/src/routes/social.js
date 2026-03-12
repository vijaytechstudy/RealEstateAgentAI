import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/generate", (req, res) => {
  res.json({
    message: "Use POST /api/social/generate with JSON body to generate content.",
  });
});

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

    const baseTitle =
      title ||
      `${bedrooms ? `${bedrooms}BHK ` : ""}${location ? `in ${location}` : "Property"}`.trim();

    const amenityText =
      amenities && Array.isArray(amenities) && amenities.length
        ? `Amenities: ${amenities.join(", ")}. `
        : "";

    const instagramCaption =
      `${baseTitle} • ${price || "Price on request"}\n` +
      `${location ? `${location}\n` : ""}\n` +
      `${amenityText}` +
      `${description ? `${description}\n\n` : ""}` +
      `DM for details & to schedule a visit.`;

    const facebookAdText =
      `New listing: ${baseTitle} ${location ? `in ${location}` : ""} ${price ? `for ${price}` : ""}.\n` +
      `${amenityText}` +
      `Book a site visit today — call or message for full details.`;

    const linkedinPost =
      `Just listed: ${baseTitle} ${location ? `(${location})` : ""}. ` +
      `A strong option for buyers seeking a well-located home ${price ? `at ${price}` : ""}. ` +
      `If you’d like the full details or to arrange a walkthrough, feel free to reach out.\n\n` +
      (description || "");

    const hashtags = [
      "#RealEstate",
      "#Property",
      "#NewListing",
      "#HomeForSale",
      location ? `#${String(location).replace(/[^a-zA-Z0-9]/g, "")}` : "#CityLiving",
    ];

    res.json({
      instagramCaption,
      facebookAdText,
      linkedinPost,
      hashtags,
    });

  } catch (err) {
    console.error("Social generate error (no‑AI stub)", err);
    res.status(500).json({ message: "Failed to generate social content" });
  }
});

export default router;