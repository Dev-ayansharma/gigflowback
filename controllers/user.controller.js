import asynchandler from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const generatethetoken = async (userid) => {
  const user = await User.findById(userid);
  const generatedtoken = user.generatetoken(user.id);

  return generatedtoken || "";
};
export const createUser = asynchandler(async (req, res) => {
  const { name, email, password } = req.body;
  if ([email, name, password].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, "all fields should be filled"));
  }
  if (!email.includes("@")) {
    return res
      .status(400)
      .json(new ApiResponse(400, "the email address is not valid"));
  }

  const existeduser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existeduser) {
    return res
      .status(409)
      .json(new ApiResponse(409, "the user is already existed"));
  }
  const user = await User.create({ name, email, password });
  const createduser = await User.findById(user._id).select("-password -token");
  if (!createduser) {
    return res
      .status(401)
      .json(new ApiResponse(401, "failed while creating user"));
  }
  return res
    .status(201)
    .json(new ApiResponse(200, "registration successful", createduser));
});

export const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, "all fields should be filled"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.isPasswordCorrect(password))) {
    return res
      .status(401)
      .json(new ApiResponse(401, "invalid email or password"));
  }
  const token = await generatethetoken(user._id);
  if (!token || token === "") {
    return res
      .status(500)
      .json(new ApiResponse(500, "failed to generate token"));
  }
  user.token = token;
  await user.save({ validateBeforeSave: false });
  const options = {
    httpOnly: true,
    secure: true, // REQUIRED in production (HTTPS)
  };
  return res
    .cookie("token", token, options)
    .status(200)
    .json(new ApiResponse(200, "login successful", { token, user }));
});

export const logoutuser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { token: undefined },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true, // REQUIRED in production (HTTPS)
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, "the user is succesfully logged out"));
});

export const getUser = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -token");
  if (!user) {
    return res
      .status(500)
      .json(new ApiResponse(401, "failed while retrieving user"));
  }
  return res
    .status(201)
    .json(new ApiResponse(200, "retrieval successful", user));
});
