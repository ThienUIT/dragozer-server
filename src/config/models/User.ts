import crypto from "crypto";
import { HookNextFunction } from "mongoose";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    channelName: {
      type: String,
      required: [true, "Please add a channel name"],
      unique: true,
      uniqueCaseInsensitive: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      uniqueCaseInsensitive: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    photoUrl: {
      type: String,
      default: "no-photo.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [8, "Must be eight characters long"],
      select: false,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Please add a valid password",
      ],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

UserSchema.index({ channelName: "text" });

UserSchema.virtual("subscribers", {
  ref: "Subscription",
  localField: "_id",
  foreignField: "channelId",
  justOne: false,
  count: true,
  match: { userId: UserSchema._id },
});
UserSchema.virtual("videos", {
  ref: "Video",
  localField: "_id",
  foreignField: "userId",
  justOne: false,
  count: true,
});

UserSchema.plugin(uniqueValidator, { message: "{PATH} already exists." });

UserSchema.pre("find", function () {
  UserSchema.populate({ path: "subscribers" });
});

// Ecrypt Password
UserSchema.pre("save", async function (next: HookNextFunction) {
  if (!UserSchema.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  UserSchema.password = await bcrypt.hash(UserSchema.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
