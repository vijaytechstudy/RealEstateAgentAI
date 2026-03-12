import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    amenities: [{ type: String }],
    inputDescription: { type: String },
    generated: {
      headline: { type: String },
      description: { type: String },
      highlights: [{ type: String }],
      marketingCopy: { type: String },
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", ListingSchema);

export default Listing;

