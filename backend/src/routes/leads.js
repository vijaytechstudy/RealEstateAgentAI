import express from "express";
import Lead from "../models/Lead.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(lead);
  } catch (err) {
    console.error("Create lead error", err);
    res.status(500).json({ message: "Failed to create lead" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const leads = await Lead.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(leads);
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json(lead);
  } catch (err) {
    console.error("Update lead error", err);
    res.status(500).json({ message: "Failed to update lead" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const result = await Lead.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!result) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Delete lead error", err);
    res.status(500).json({ message: "Failed to delete lead" });
  }
});

export default router;

