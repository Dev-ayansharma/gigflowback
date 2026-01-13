import { User } from "../models/user.model.js";
import asynchandler from "../utils/asynchandler.js";
import { Gig } from "../models/gig.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const GigUpload = asynchandler(async (req, res) => {
  const { title, description, budget } = req.body;
  if (!title || !description || !budget) {
    return res.status(400).json(new ApiResponse(400, "Please fill all fields"));
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, "not a valid user"));
  }

  const newGig = await Gig.create({
    title,
    description,
    budget,
    ownerid: user._id,
  });
  if (!newGig) {
    return res.status(400).json(new ApiResponse(400, "Gig creation failed"));
  }
  user.gigs.push(newGig._id);
  await user.save();
  res
    .status(201)
    .json(new ApiResponse(201, "Gig created successfully", newGig));
});

export const Allgigs = asynchandler(async (req, res) => {
  const { title } = req.query ?? {};
  if (title == "") {
    const gigs = await Gig.find().populate("hired");
    res
      .status(200)
      .json(new ApiResponse(200, "Gigs fetched successfully", gigs));
  }
  let filter = {};
  if (title) {
    filter.title = { $regex: title, $options: "i" };
    const gigs = await Gig.find(filter);
    res
      .status(200)
      .json(
        new ApiResponse(200, "Gigs fetched with parameter successfully", gigs),
      );
  }
});
