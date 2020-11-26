import { NextFunction, Request, Response } from "express";
import { MAX_FILE_UPLOAD } from "@/config/database/config_env";
import { UserRequest } from "@/config/request/user.requestt";

const { success, errors } = require("@/shared/utils/responseApi");

const path = require("path");
const fs = require("fs");
const asyncHandler = require("@/shared/middleware/async");

const Video = require("../models/Video");

// @desc    Get videos
// @route   GET /api/v1/videos/public or /api/v1/videos/private
// @access  Public Or Private
exports.getVideos = asyncHandler(
  async (req: Request, res: any, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Get single video
// @route   GET /api/v1/videos/:id
// @access  Public
exports.getVideo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const video = await Video.findById(req.params.id)
      .populate({
        path: "categoryId",
      })
      .populate({ path: "userId", select: "channelName subscribers photoUrl" })
      .populate({ path: "likes" })
      .populate({ path: "dislikes" })
      .populate({ path: "comments" });
    if (!video) {
      return res
        .status(404)
        .json(
          errors(`No video with that id of ${req.params.id}`, res.statusCode)
        );
    }
    console.log(video);
    res.status(200).json(success("OK", { data: video }, res.statusCode));
  }
);

// @desc    Upload video
// @route   POST /api/v1/videos
// @access  Private
exports.videoUpload = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { id } = req.user;
    const {
      title,
      description,
      status,
      category,
      url,
      thumbnailUrl,
    } = req.body;
    const video = await Video.create({
      userId: id,
      thumbnailUrl: thumbnailUrl,
      title: title,
      description: description,
      categoryId: category,
      status: status,
      url: url,
    });
    return res.status(200).json(success("Ok", { data: video }, res.statusCode));
  }
);
// @desc    Update video
// @route   PUT /api/v1/videos/:id
// @access  Private
exports.updateVideo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!video)
      return res
        .status(404)
        .json(
          errors(`No video with that id of ${req.params.id}`, res.statusCode)
        );

    res.status(200).json(success("OK", { data: video }, res.statusCode));
  }
);

// @desc    Update video views
// @route   PUT /api/v1/videos/:id/views
// @access  Public
exports.updateViews = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let video = await Video.findById(req.params.id);

    if (!video)
      return res
        .status(404)
        .json(
          errors(`No video with that id of ${req.params.id}`, res.statusCode)
        );
    video.views++;

    await video.save();

    res.status(200).json(success("OK", { data: video }, res.statusCode));
  }
);

// @desc    Upload thumbnail
// @route   PUT /api/v1/videos/:id/thumbnail
// @access  Private
exports.uploadVideoThumbnail = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const video = await Video.findById(req.params.id);
    if (!video)
      return res
        .status(404)
        .json(
          errors(`No video with that id of ${req.params.id}`, res.statusCode)
        );

    if (!req.files) {
      return res.status(404).json(errors(`Please upload file`, res.statusCode));
    }

    const file = req.files.thumbnail;

    if (!file.mimetype.startsWith("image")) {
      return res
        .status(404)
        .json(errors(`Please update an image file`, res.statusCode));
    }

    if (file.size > MAX_FILE_UPLOAD) {
      return res
        .status(404)
        .json(
          errors(
            `Please upload an image less than ${
              MAX_FILE_UPLOAD / 1000 / 1000
            }mb`,
            res.statusCode
          )
        );
    }

    file.name = `thumbnail-${video._id}${path.parse(file.name).ext}`;

    file.mv(
      `${process.env.FILE_UPLOAD_PATH}/thumbnails/${file.name}`,
      async (err: Error) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json(errors(`Problem with file upload`, res.statusCode));
        }

        await Video.findByIdAndUpdate(req.params.id, {
          thumbnailUrl: file.name,
        });

        res
          .status(200)
          .json(success("OK", { data: file.name }, res.statusCode));
      }
    );
  }
);

// @desc    Delete video
// @route   DELETE /api/v1/videos/:id
// @access  Private
exports.deleteVideo = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    let video = await Video.findOne({
      userId: req.user._id,
      _id: req.params.id,
    });

    if (!video) {
      return res
        .status(404)
        .json(
          errors(`No video with that id of ${req.params.id}`, res.statusCode)
        );
    }

    await video.remove();
    console.log("video::", video);
    res.status(200).json(success("OK", { data: video }, res.statusCode));
  }
);
