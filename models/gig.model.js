import mongoose from "mongoose";
import { Schema } from "mongoose";

const GigSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },

  ownerid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "assigned"],
    default: "open",
  },
  hired: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  acceptbid: {
    type: Schema.Types.ObjectId,
    ref: "Bid",
    default: null,
  },
});

export const Gig = mongoose.model("Gig", GigSchema);
