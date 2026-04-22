import asynchandler from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { registerSchema, loginSchema } from "../validators/user.validator.js";

// 🔹 CREATE USER
export const createUser = asynchandler(async (req, res) => {

  const parsed = registerSchema.safeParse(req.body);

 
  if (!parsed.success) {
    return res
      .status(400)
      .json(new ApiResponse(400, parsed.error.errors[0].message));
  }

  const { name, email, password, role } = parsed.data;

  const existeduser = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (existeduser) {
    return res
      .status(409)
      .json(new ApiResponse(409, "User already exists"));
  }

  const user = await User.create({ name, email, password, role });

  const createduser = await User.findById(user._id).select("-password -token");

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Registration successful", createduser)
    );
});

// 🔹 LOGIN USER
export const loginUser = asynchandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json(new ApiResponse(400, parsed.error.errors[0].message));
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.isPasswordCorrect(password))) {
    return res
      .status(401)
      .json(new ApiResponse(401, "Invalid email or password"));
  }

  const token = user.generatetoken();

  user.token = token;
  await user.save({ validateBeforeSave: false });

  const safeUser = await User.findById(user._id).select("-password -token");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .cookie("token", token, options)
    .status(200)
    .json(
      new ApiResponse(200, "Login successful", { user: safeUser })
    );
});

// 🔹 LOGOUT USER
export const logoutuser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { token: "" }, 
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(
      new ApiResponse(200, "User logged out successfully")
    );
});

// 🔹 GET CURRENT USER
export const getUser = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -token"
  );

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, "User not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User retrieved successfully", user)
    );
});