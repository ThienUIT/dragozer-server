import { NextFunction, Request, Response } from "express";
import { UserRequest } from "@/config/request/user.requestt";

const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("@/shared/utils/errorResponse");
const User = require("@/models/User");

exports.protect = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Set token from cookie
    // else if (req.cookies.token) {
    //   token = req.cookies.token
    // }

    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).populate("subscribers");
      console.log("req.user", req.user);
      next();
    } catch (err) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
  }
);

// Grant access to specific roles
exports.authorize = (...roles: string[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};