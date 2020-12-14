import { NextFunction, Response } from "express";
import { UserRequest } from "../config/request/user.request";

const asyncHandler = require("../shared/middleware/async");
const { success, errors } = require("../shared/utils/responseApi");

const advancedResultsFunc = require("../shared/utils/advancedResultsFunc");

const Video = require("../models/Video");
const Feeling = require("../models/Feeling");

// @desc    Create feeling
// @route   POST /api/v1/feelings/
// @access  Private
exports.createFeeling = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    req.body.userId = req.user._id;
    const { type, userId, videoId } = req.body;

    // check video
    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .json(errors(`No video with video id of ${videoId}`, res.statusCode));
    }

    if (video.status !== "public") {
      return res
        .status(400)
        .json(
          errors(
            `You can't like/dislike this video until it's made pulbic`,
            res.statusCode
          )
        );
    }

    // Check if feeling exists
    let feeling = await Feeling.findOne({
      videoId,
      userId,
    });
    // if not - create feeling

    if (!feeling) {
      feeling = await Feeling.create({
        type,
        videoId,
        userId,
      });
      return res
        .status(200)
        .json(success("create", { data: feeling }, res.statusCode));
    }
    // else - check req.body.feeling if equals to feeling.type remove
    if (type == feeling.type) {
      await feeling.remove();
      return res.status(200).json(success("remove", {}, res.statusCode));
    }
    // else - change feeling type
    feeling.type = type;
    feeling = await feeling.save();

    res.status(200).json(success("update", { data: feeling }, res.statusCode));
  }
);

// @desc    Check feeling
// @route   POST /api/v1/feelings/check
// @access  Private
exports.checkFeeling = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const feeling = await Feeling.findOne({
      videoId: req.body.videoId,
      userId: req.user._id,
    });

    if (!feeling) {
      return res.status(200).json(success("No feelings", {}, res.statusCode));
    }

    return res
      .status(200)
      .json(success("OK", { data: feeling.type }, res.statusCode));
  }
);

// @desc    Get liked videos
// @route   GET /api/v1/feelings/videos
// @access  Private
exports.getLikedVideos = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const likes = await Feeling.find({
      userId: req.user._id,
      type: "like",
    });

    if (likes.length === 0)
      return res.status(200).json(success("OK", {}, res.statusCode));

    const videosId = likes.map((video: any) => {
      return {
        _id: video.videoId.toString(),
      };
    });

    const populates = [{ path: "userId", select: "photoUrl channelName" }];
    advancedResultsFunc(req, res, Video, populates, "public", videosId);
  }
);
