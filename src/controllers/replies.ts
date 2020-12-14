import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../config/request/user.request";
import { ResultsResponse } from "../config/response/advance_results.response";

const asyncHandler = require("../shared/middleware/async");
const { success, errors } = require("../shared/utils/responseApi");

const Comment = require("../models/Comment");
const Reply = require("../models/Reply");

// @desc    Get comments
// @route   GET /api/v1/replies
// @access  Public
exports.getReplies = asyncHandler(
  async (req: Request, res: ResultsResponse, next: NextFunction) => {
    res
      .status(200)
      .json(success("OK", { data: res.advancedResults }, res.statusCode));
  }
);

// @desc    Create reply
// @route   POST /api/v1/replies/
// @access  Private
exports.createReply = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let comment = await Comment.findOne({
      _id: req.body.commentId,
    });

    if (!comment) {
      return res
        .status(404)
        .json(
          errors(`No comment with id of ${req.body.commentId}`, res.statusCode)
        );
    }
    const reply = await Reply.create({
      ...req.body,
      userId: req.user._id,
    });

    return res.status(200).json(success("OK", { data: reply }, res.statusCode));
  }
);

// @desc    Update comment
// @route   PUT /api/v1/comments/:id
// @access  Private
exports.updateReply = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let reply = await Reply.findById(req.params.id).populate({
      path: "commentId",
      select: "userId videoId",
      populate: { path: "videoId", select: "userId" },
    });

    if (!reply) {
      return res
        .status(404)
        .json(errors(`No reply with id of ${req.params.id}`, res.statusCode));
    }

    if (
      reply.userId.toString() == req.user._id.toString() ||
      reply.commentId.videoId.userId.toString() != req.user._id.toString()
    ) {
      reply = await Reply.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(200).json(success("OK", { data: reply }, res.statusCode));
    } else {
      return res
        .status(400)
        .json(
          errors(`You are not authorized to update this reply`, res.statusCode)
        );
    }
  }
);

// @desc    Delete comment
// @route   DELETE /api/v1/comments/:id
// @access  Private
exports.deleteReply = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let reply = await Reply.findById(req.params.id).populate({
      path: "commentId",
      select: "userId videoId",
      populate: { path: "videoId", select: "userId" },
    });

    if (!reply) {
      return res
        .status(404)
        .json(errors(`No reply with id of ${req.params.id}`, res.statusCode));
    }

    if (
      reply.userId.toString() == req.user._id.toString() ||
      reply.commentId.videoId.userId.toString() == req.user._id.toString()
    ) {
      await reply.remove();
    } else {
      return res
        .status(400)
        .json(
          errors(`You are not authorized to delete this reply`, res.statusCode)
        );
    }

    return res.status(200).json(success("OK", { data: reply }, res.statusCode));
  }
);
