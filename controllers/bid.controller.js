import { Gig } from "../models/gig.model.js";
import { Bid } from "../models/bid.model.js";
import asynchandler from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { connectedUsers } from "../socket/connectedUsers.js";

export const postbid = asynchandler(async (req, res) => {
  const { gigId } = req.params;
  const { message, price } = req.body;

  const gig = await Gig.findById({ _id: gigId });

  if (!gig) {
    return res.status(404).json(new ApiResponse(404, "Gig not found"));
  }

  if (gig.status !== "open") {
    return res
      .status(400)
      .json(new ApiResponse(400, "Gig is not open for bidding"));
  }

  if (gig.ownerid.toString() === req.user.id.toString()) {
    return res
      .status(400)
      .json(new ApiResponse(400, "You cannot bid on your own gig"));
  }

  const bid = await Bid.create({
    gigid: gigId,
    message,
    status: "pending",
    price,
    freelancerid: req.user.id,
  });

  if (!bid) {
    return res.status(500).json(new ApiResponse(500, "Error creating bid"));
  }

  await bid.save({ validateBeforeSave: false });
  await req.user.bids.push(bid._id);
  await req.user.save({ validateBeforeSave: false });
  res.status(201).json(new ApiResponse(201, "Bid placed successfully", bid));
});

export const acceptbid = asynchandler(async (req, res) => {
  const { bidId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findOne({ _id: bidId, status: "pending" }, null, {
      session,
    });

    if (!bid) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Bid not found or already processed"));
    }

    const gig = await Gig.findOne({ _id: bid.gigid, status: "open" }, null, {
      session,
    });

    if (!gig) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Gig not open or already hired"));
    }

    gig.status = "assigned";
    gig.hired = bid.freelancerid;
    gig.acceptbid = bid._id;
    await gig.save({ session, validateBeforeSave: false });

    bid.status = "hired";
    await bid.save({ session, validateBeforeSave: false });

    await Bid.updateMany(
      {
        gigid: gig._id,
        _id: { $ne: bid._id },
        status: "pending",
      },
      { status: "rejected" },
      { session },
    );

    await session.commitTransaction();

    const io = req.app.get("io");
    const freelancerId = bid.freelancerid.toString();
    const freelancerSocketId = connectedUsers.get(freelancerId);
    if (freelancerSocketId) {
      io.to(freelancerSocketId).emit("hired", {
        message: `Congratulations! You have been hired for "${gig.title}"`,
      });
      console.log(`Notification sent to freelancer ${freelancerId}`);
    } else {
      console.log(`Freelancer ${freelancerId} is not currently online`);
    }

    res.status(200).json(
      new ApiResponse(200, "freelancer hired successfully", {
        freelancerNotified: !!freelancerSocketId,
      }),
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res
      .status(409)
      .json(new ApiResponse(409, error.message || "Bid acceptance failed"));
  } finally {
    session.endSession();
  }
});

export const fetchallbids = asynchandler(async (req, res) => {
  const { gigId } = req.params;
  const bids = await Bid.find({ gigid: gigId }).populate("freelancerid");

  return res
    .status(200)
    .json(new ApiResponse(200, "Bids fetched successfully", bids));
});
