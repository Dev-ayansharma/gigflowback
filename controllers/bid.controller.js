import { Gig } from "../models/gig.model.js";
import { Bid } from "../models/bid.model.js";
import asynchandler from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { connectedUsers } from "../socket/connectedUsers.js";

export const postbid = asynchandler(async (req, res) => {
  const { gigId } = req.params;
  const { message, price } = req.body;
   

  if (!mongoose.Types.ObjectId.isValid(gigId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Invalid gig ID"));
  }
  
  if (!price || isNaN(price) || price <= 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Invalid price"));
  }

  const gig = await Gig.findById(gigId);
  if (gig.isDeleted) {
  return res
    .status(400)
    .json(new ApiResponse(400, "Gig is no longer available"));
}

  if (!gig) {
    return res.status(404).json(new ApiResponse(404, "Gig not found"));
  }

  if (gig.status !== "open") {
    return res
      .status(400)
      .json(new ApiResponse(400, "Gig is not open for bidding"));
  }

  
  if (gig.ownerid.toString() === req.user._id.toString()) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Cannot bid on your own gig"));
  }

  const bid = await Bid.create({
    gigid: gigId,
    message,
    price,
    status: "pending",
    freelancerid: req.user._id,
  });

  
  req.user.bids?.push(bid._id);
  await req.user.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(201, "Bid placed successfully", bid));
});
export const acceptbid = asynchandler(async (req, res) => {
  const { bidId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bidId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Invalid bid ID"));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findOne(
      { _id: bidId, status: "pending" },
      null,
      { session }
    );

    if (!bid) {
      throw new Error("Bid not found or already processed");
    }

    const gig = await Gig.findOne(
      { _id: bid.gigid, status: "open" },
      null,
      { session }
    );

    if (gig.isDeleted) {
  return res
    .status(400)
    .json(new ApiResponse(400, "Gig is no longer available"));
}

    if (!gig) {
      throw new Error("Gig not open or already assigned");
    }
   
   
    if (gig.ownerid.toString() !== req.user._id.toString()) {
      throw new Error("Not authorized to accept this bid");
    }


    gig.status = "assigned";
    gig.hired = bid.freelancerid;
    gig.acceptbid = bid._id;

  
    bid.status = "hired";

    await gig.save({ session, validateBeforeSave: false });
    await bid.save({ session, validateBeforeSave: false });


    await Bid.updateMany(
      {
        gigid: gig._id,
        _id: { $ne: bid._id },
        status: "pending",
      },
      { status: "rejected" },
      { session }
    );

    await session.commitTransaction();

  
    const io = req.app.get("io");
    const freelancerId = bid.freelancerid.toString();
    const freelancerSocketId = connectedUsers.get(freelancerId);

    if (freelancerSocketId) {
      io.to(freelancerSocketId).emit("hired", {
        message: `You have been hired for "${gig.title}"`,
      });
    }

    return res.status(200).json(
      new ApiResponse(200, "Freelancer hired successfully", {
        notified: !!freelancerSocketId,
      })
    );
  } catch (error) {
    await session.abortTransaction();

    return res
      .status(400)
      .json(new ApiResponse(400, error.message));
  } finally {
    session.endSession(); 
  }
});

export const fetchallbids = asynchandler(async (req, res) => {
  const { gigId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gigId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Invalid gig ID"));
  }

  const gig = await Gig.findById(gigId);

  if (!gig) {
    return res.status(404).json(new ApiResponse(404, "Gig not found"));
  }


  if (gig.ownerid.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json(new ApiResponse(403, "Not authorized"));
  }

  const bids = await Bid.find({ gigid: gigId })
    .populate("freelancerid", "name email");

  return res
    .status(200)
    .json(new ApiResponse(200, "Bids fetched successfully", bids));
});

