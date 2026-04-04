import asynchandler from "../utils/asynchandler.js";
import { Gig } from "../models/gig.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";


export const GigUpload = asynchandler(async (req, res) => {
  const { title, description, budget } = req.body;

 
  if (!title?.trim() || !description?.trim() || !budget) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required"));
  }

  if (isNaN(budget) || budget <= 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Budget must be a valid number"));
  }


  const newGig = await Gig.create({
    title,
    description,
    budget,
    ownerid: req.user._id,
  });


  req.user.gigs?.push(newGig._id);
  await req.user.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(201, "Gig created successfully", newGig));
});



export const Allgigs = asynchandler(async (req, res) => {
  const { title, page = 1, limit = 10 } = req.query;

  let filter = {};


  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }


  const skip = (parseInt(page) - 1) * parseInt(limit);

  const gigs = await Gig.find(filter)
    .populate("hired", "name email") 
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Gig.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, "Gigs fetched successfully", {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      gigs,
    })
  );
});

export const deleteGig = asynchandler(async (req, res) => {
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


  if (gig.status === "assigned") {
    return res
      .status(400)
      .json(new ApiResponse(400, "Cannot delete assigned gig"));
  }

  
  gig.isDeleted = true;
  gig.deletedAt = new Date();

  await gig.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Gig deleted successfully"));
});
