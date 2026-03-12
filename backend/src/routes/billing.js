import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

const PLAN_KEYS = ["starter", "professional", "agency"];

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return null;
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

const getKeySecret = () => process.env.RAZORPAY_KEY_SECRET || "";

const PLAN_AMOUNT_INR = {
  starter: 499,
  professional: 999,
  agency: 2999,
};

router.get("/debug/plan/:planId", authMiddleware, async (req, res) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(500).json({
        message:
          "Razorpay keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env",
      });
    }

    const plan = await razorpay.plans.fetch(req.params.planId);
    res.json({ ok: true, plan });
  } catch (err) {
    res.status(400).json({
      ok: false,
      message:
        err?.error?.description ||
        err?.error?.reason ||
        err?.error?.code ||
        err?.message ||
        "Failed to fetch plan",
      raw: { statusCode: err?.statusCode, error: err?.error },
    });
  }
});

router.get("/debug/env", authMiddleware, async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || "";
  const mask = (v) => {
    if (!v) return null;
    if (v.length <= 6) return "***";
    return `${v.slice(0, 4)}…${v.slice(-2)}`;
  };

  res.json({
    ok: true,
    razorpayKeyId: mask(keyId),
    hasKeySecret: Boolean(process.env.RAZORPAY_KEY_SECRET),
    plans: {
      starter: process.env.RAZORPAY_PLAN_STARTER || null,
      professional: process.env.RAZORPAY_PLAN_PROFESSIONAL || null,
      agency: process.env.RAZORPAY_PLAN_AGENCY || null,
    },
  });
});

router.post("/create-subscription", authMiddleware, async (req, res) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(500).json({
        message:
          "Razorpay keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env",
      });
    }

    const { plan } = req.body;
    if (!PLAN_AMOUNT_INR[plan]) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const planId = process.env[`RAZORPAY_PLAN_${plan.toUpperCase()}`];
    if (!planId) {
      return res.status(500).json({
        message: `Missing Razorpay plan id env: RAZORPAY_PLAN_${plan.toUpperCase()}`,
      });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      // Razorpay requires total_count >= 1 in many setups.
      // For test mode we create a 1-cycle subscription.
      total_count: 1,
      notes: {
        userId: String(req.user._id),
        selectedPlan: plan,
      },
    });

    // Proper flow: mark subscription as created, activate only after verify/webhook.
    await User.findByIdAndUpdate(req.user._id, {
      subscription: {
        status: "created",
        planKey: plan,
        planId: subscription.id,
        currentPeriodEnd: subscription.current_end
          ? new Date(subscription.current_end * 1000)
          : undefined,
      },
    });

    res.json({
      subscriptionId: subscription.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    const razorpayDetails =
      err?.error?.description ||
      err?.error?.reason ||
      err?.error?.code ||
      err?.message;

    console.error("Create subscription error", {
      message: err?.message,
      statusCode: err?.statusCode,
      error: err?.error,
    });

    res.status(500).json({
      message: "Failed to create subscription",
      details: razorpayDetails,
    });
  }
});

router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;
    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing Razorpay verification fields" });
    }

    const user = await User.findById(req.user._id);
    if (!user?.subscription?.planId || user.subscription.planId !== razorpay_subscription_id) {
      return res.status(400).json({ message: "Subscription does not match user" });
    }

    const payload = `${razorpay_payment_id}|${razorpay_subscription_id}`;
    const expected = crypto
      .createHmac("sha256", getKeySecret())
      .update(payload)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const planKey = user.subscription.planKey;
    if (!planKey || !PLAN_KEYS.includes(planKey)) {
      return res.status(400).json({ message: "Missing planKey on subscription" });
    }

    user.plan = planKey;
    user.subscription.status = "active";
    await user.save();

    res.json({ ok: true, plan: user.plan, subscription: user.subscription });
  } catch (err) {
    res.status(500).json({ message: "Failed to verify payment" });
  }
});

router.post("/webhook", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const rawBody = req.rawBody;
  const body = rawBody ? rawBody.toString("utf8") : JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const event = req.body;

  try {
    if (event.event === "subscription.activated") {
      const { id: subscriptionId, current_end } = event.payload.subscription.entity;
      const userId = event.payload.subscription.entity.notes?.userId;
      const selectedPlan = event.payload.subscription.entity.notes?.selectedPlan;
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          ...(selectedPlan && PLAN_KEYS.includes(selectedPlan) ? { plan: selectedPlan } : {}),
          subscription: {
            status: "active",
            planId: subscriptionId,
            planKey: selectedPlan,
            currentPeriodEnd: current_end ? new Date(current_end * 1000) : undefined,
          },
        });
      }
    }
  } catch (err) {
    console.error("Webhook handling error", err);
  }

  res.json({ received: true });
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    plan: user.plan,
    subscription: user.subscription,
  });
});

export default router;

