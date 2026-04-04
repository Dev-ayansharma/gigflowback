import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const checkAuth = async (req, res, next) => {
  try {
   
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?._id) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Invalid token payload"));
    }

  
    const user = await User.findById(decoded._id).select("-password -token");

    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, "User not found"));
    }

   
    req.user = user;

    next();
  } catch (error) {
   
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(new ApiResponse(401, "Token expired"));
    }

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json(new ApiResponse(401, "Invalid token"));
    }

    return res
      .status(500)
      .json(new ApiResponse(500, "Authentication failed"));
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(new ApiResponse(403, "Access denied"));
    }
    next();
  };
};