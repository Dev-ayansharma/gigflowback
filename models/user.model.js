import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔥 important
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["owner", "client"],
      default: "owner",
    },

    gigs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Gig",
      },
    ],

    bids: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],

    // ❌ Optional: remove if not needed
    token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);


// 🔐 Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// 🔑 Generate JWT
UserSchema.methods.generatetoken = function () {
  return jwt.sign(
    {
      _id: this._id.toString(),
      role: this.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.TOKEN_SECRET_EXPIRES_IN,
    }
  );
};


// 🔐 Compare password
UserSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);