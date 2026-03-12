import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    propertyInterestedIn: { type: String },
    preferredLanguage: {
      type: String,
      enum: ["english", "hindi", "marathi", "english_hindi", "english_marathi"],
      default: "english",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Visit scheduled", "Closed"],
      default: "New",
    },
    lastContactDate: { type: Date },
    notes: { type: String },
    visits: [
      {
        date: { type: Date, required: true },
        property: { type: String },
        notes: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", LeadSchema);

export default Lead;

