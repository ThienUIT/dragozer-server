import { NextFunction, Request, Response } from "express";
import {
  COOKIE_EXPIRE,
  GOOGLE_CLIENT_ID,
  MAX_FILE_UPLOAD,
} from "@/config/database/config_env";
import { UserRequest } from "@/config/request/user.requestt";

const { OAuth2Client } = require("google-auth-library");

const crypto = require("crypto");
const path = require("path");
const asyncHandler = require("@/shared/middleware/async");
const ErrorResponse = require("@/shared/utils/errorResponse");
const sendEmail = require("@/shared/utils/sendEmail");
const User = require("@/models/User");
// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { channelName, email, password } = req.body;

    email = email.toLowerCase();
    const randomId = "_" + Math.random().toString(36).substr(2, 9);
    const user = await User.create({
      channelName: channelName,
      email: email,
      password: password,
      googleId: `Local ${randomId}`,
    });

    sendTokenResponse(user, 200, res);
  }
);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }

    email = email.toLowerCase();

    let user = await User.findOne({ email: email }).select("+password");
    console.log(user);

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 400));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 400));
    }

    sendTokenResponse(user, 200, res);
  }
);

//@desc OAuth with google
//@route POST /api/v1/auth/google
//@access  Public
exports.google = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, provider } = req.body;
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let currentUser = await User.findOne({ googleId: payload.sub });
    if (!currentUser) {
      currentUser = await User.create({
        googleId: payload.sub,
        channelName: payload.name,
        email: payload.email,
        photoUrl: payload.picture,
        provider: provider,
      });
    }
    sendTokenResponse(currentUser, 200, res);
  }
);

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    req.logout();
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ success: true, data: {} });
  }
);

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    console.log("get-me::", user);
    res.status(200).json({ success: true, data: user });
  }
);

// @desc    Update user details
// @route   PUT /api/v1/auth/update_details
// @access  Private
exports.updateDetails = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const fieldsToUpdate = {
      channelName: req.body.channelName,
      email: req.body.email.toLowerCase(),
    };
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
      context: "query",
    });

    res.status(200).json({ success: true, data: user });
  }
);

// @desc    Upload avatar
// @route   PUT /api/v1/users
// @access  Private
exports.uploadChannelAvatar = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 404));
    }

    const file = req.files.avatar;

    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an image file`, 404));
    }

    if (file.size > MAX_FILE_UPLOAD!) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${MAX_FILE_UPLOAD / 1000 / 1000}mb`,
          404
        )
      );
    }

    file.name = `avatar-${req.user._id}${path.parse(file.name).ext}`;

    file.mv(
      `${process.env.FILE_UPLOAD_PATH}/avatars/${file.name}`,
      async (err: Error) => {
        if (err) {
          console.error(err);
          return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        // await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
        req.user.photoUrl = file.name;
        await req.user.save();
        res.status(200).json({ success: true, data: file.name });
      }
    );
  }
);

// @desc    Update password
// @route   PUT /api/v1/auth/update_password
// @access  Private
exports.updatePassword = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id).select("+password");

    if (!(await user.matchPassword(req.body.currentPassword))) {
      // return next(new ErrorResponse('Password is incorrect', 401))
      return res.status(400).json({
        success: false,
        error: [
          {
            field: "currentPassword",
            message: "Current password is incorrect",
          },
        ],
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot_password
// @access  Public
exports.forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });

    if (!user) {
      return next(new ErrorResponse("There is no user with that email", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset_password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });
      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  }
);

// @desc    Reset password
// @route   PUT /api/v1/auth/reset_password/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    console.log(resetPasswordToken, "-", req.params.resettoken);

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid token", 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

// Get token from model, create cookie and send response
const sendTokenResponse = (
  user: typeof User,
  statusCode: number,
  res: Response
) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === "production") {
    options["secure"] = true;
  }

  console.log("TOKEN::", token);
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
