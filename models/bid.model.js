import mongoose from "mongoose";
import { Schema } from "mongoose";

const BidSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "hired", "rejected"],
    default: "pending",
  },
  gigid: {
    type: Schema.Types.ObjectId,
    ref: "Gig",
    required: true,
  },
  freelancerid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Bid = mongoose.model("Bid", BidSchema);
