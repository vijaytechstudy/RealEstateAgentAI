import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["agent", "admin"], default: "agent" },
    plan: {
      type: String,
      enum: ["free", "starter", "professional", "agency"],
      default: "free",
    },
    razorpayCustomerId: { type: String },
    subscription: {
      planId: { type: String },
      status: {
        type: String,
        enum: ["inactive", "created", "active", "cancelled"],
        default: "inactive",
      },
      planKey: {
        type: String,
        enum: ["starter", "professional", "agency"],
      },
      currentPeriodEnd: { type: Date },
    },
    listingGenerationsThisMonth: { type: Number, default: 0 },
    listingGenerationMonth: { type: Number }, // 0-11
    listingGenerationYear: { type: Number }, // YYYY
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;

