import { NextFunction, Request, Response } from "express";
import { UserRequest } from "@/config/request/user.requestt";

const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const { validation } = require("@/shared/utils/responseApi");
const User = require("@/models/User");
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
      return res
        .status(401)
        .json(
          validation("Not authorized to access this route", res.statusCode)
        );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.TEXT_SECRET);
      // prototype.virtual subscribers count is
      req.user = await User.findById(decoded.id).populate("subscribers");
      console.log("middleWare::req.user::", req.user._id);
      next();
    } catch (err) {
      return res
        .status(401)
        .json(
          validation("Not authorized to access this route", res.statusCode)
        );
    }
  }
);
// Grant access to specific roles
exports.authorize = (...roles: string[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(
          validation(
            `Your role ${req.user.role} is not authorized to access this route`,
            403
          )
        );
    }
    next();
  };
};
