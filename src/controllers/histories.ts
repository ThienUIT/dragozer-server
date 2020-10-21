import { NextFunction, Request, Response } from "express";
import { UserRequest } from "@/config/request/user.requestt";

const asyncHandler = require("@/shared/middleware/async");
const ErrorResponse = require("@/shared/utils/errorResponse");

const History = require("@/models/History");
const Video = require("@/models/Video");

// @desc    Get Histories
// @route   GET /api/v1/histories
// @access  Private
exports.getHistories = asyncHandler(
  async (req: Request, res: any, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Create History
// @route   POST /api/v1/histories/
// @access  Private
exports.createHistory = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.body.type == "watch") {
      const video = await Video.findById(req.body.videoId);
      if (!video) {
        return next(
          new ErrorResponse(`No video with that id of ${req.body.videoId}`)
        );
      }
    }
    const history = await History.create({
      ...req.body,
      userId: req.user.id,
    });

    return res.status(200).json({ sucess: true, data: history });
  }
);

// @desc    Delete History
// @route   DELETE /api/v1/histories/:id
// @access  Private
exports.deleteHistory = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let history = await History.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!history) {
      return next(
        new ErrorResponse(`No history with id of ${req.params.id}`, 404)
      );
    }

    await history.remove();

    return res.status(200).json({ success: true, data: {} });
  }
);

// @desc    Delete Histories
// @route   DELETE /api/v1/histories/:type/all
// @access  Private
exports.deleteHistories = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    await History.deleteMany({
      type: req.params.type,
      userId: req.user._id,
    });

    return res.status(200).json({ success: true, data: {} });
  }
);
