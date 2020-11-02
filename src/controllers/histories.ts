import { NextFunction, Request, Response } from "express";
import { UserRequest } from "@/config/request/user.requestt";

const asyncHandler = require("@/shared/middleware/async");
const { success, errors } = require("@/shared/utils/responseApi");

const History = require("@/models/History");
const Video = require("@/models/Video");

// @desc    Get Histories
// @route   GET /api/v1/histories
// @access  Private
exports.getHistories = asyncHandler(
  async (req: Request, res: any, next: NextFunction) => {
    res
      .status(200)
      .json(success("OK", { data: res.advancedResults }, res.statusCode));
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
        return res
          .status(404)
          .json(
            errors(
              `No video with that id of ${req.body.videoId}`,
              res.statusCode
            )
          );
      }
    }
    const history = await History.create({
      ...req.body,
      userId: req.user.id,
    });

    return res
      .status(200)
      .json(success("OK", { data: history }, res.statusCode));
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
      return res
        .status(404)
        .json(errors(`No history with id of ${req.params.id}`, res.statusCode));
    }

    await history.remove();

    return res.status(200).json(success("Delete success", {}, res.statusCode));
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

    return res.status(200).json(success("Delete success", {}, res.statusCode));
  }
);
