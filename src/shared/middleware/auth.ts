import { NextFunction, Request, Response } from "express";
import { UserRequest } from "@/config/request/user.requestt";

const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("@/shared/utils/errorResponse");
const User = require("@/models/User");
const GoogleUser = require("@/models/GoogleUser");
// protect route from away guest
exports.protect = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.googleUser = await GoogleUser.findById(decoded.id).populate(
        "subscribers"
      );
      // prototype.virtual subscribers count is
      req.user = await User.findById(decoded.id).populate("subscribers");
      console.log("req.user", typeof req.user._id);
      next();
    } catch (err) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
  }
);
exports.oauthProtect = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.redirect("/api/v1/auth/google");
    } else {
      next();
    }
  }
);
// Grant access to specific roles
exports.authorize = (...roles: string[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Your role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
