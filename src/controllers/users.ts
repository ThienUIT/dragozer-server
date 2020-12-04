import { NextFunction, Request, Response } from "express";
import { ResultsResponse } from "@/config/response/advance_results.response";

const { success, errors } = require("@/shared/utils/responseApi");

const asyncHandler = require("@/shared/middleware/async");

const User = require("@/models/User");

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.getUsers = asyncHandler(
  async (req: Request, res: ResultsResponse, next: NextFunction) => {
    res
      .status(200)
      .json(success("OK", { data: res.advancedResults }, res.statusCode));
  }
);

// @desc    Get single user
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id).populate("subscribers");
    if (!user)
      return res
        .status(404)
        .json(
          errors(`No user with that id of ${req.params.id}`, res.statusCode)
        );

    res.status(200).json(success("OK", { data: user }, res.statusCode));
  }
);

// @desc    Create user
// @route   POST /api/v1/auth/users
// @access  Private/Admin
exports.createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);

    res.status(201).json(success("OK", { data: user }, res.statusCode));
  }
);

// @desc    Update user
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body.password = "";
    delete req.body.password;

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!user)
      return res
        .status(404)
        .json(
          errors(`No user with that id of ${req.params.id}`, res.statusCode)
        );

    res.status(200).json(success("OK", { data: user }, res.statusCode));
  }
);

// @desc    Delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user)
      return res
        .status(404)
        .json(
          errors(`No user with that id of ${req.params.id}`, res.statusCode)
        );

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json(success("Delete", {}, res.statusCode));
  }
);
