import { NextFunction, Request, Response } from "express";
import { UserRequest } from "@/config/request/user.requestt";
const asyncHandler = require("@/shared/middleware/async");
const ErrorResponse = require("@/shared/utils/errorResponse");
const advancedResultsFunc = require("@/shared/utils/advancedResultsFunc");

const Video = require("@/models/Video");
const Subscription = require("@/models/Subscription");

// @desc    Get all subscribers
// @route   GET /api/v1/subscriptions/subscribers
// @access  Private
exports.getSubscribers = asyncHandler(
  async (req: Request, res: any, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Get all channels subscribed to
// @route   GET /api/v1/subscriptions/channels
// @access  Private
exports.getChannels = asyncHandler(
  async (req: Request, res: any, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Check subscription
// @route   POST /api/v1/subscriptions/check
// @access  Private
exports.checkSubscription = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const channel = await Subscription.findOne({
      channelId: req.body.channelId,
      subscriberId: req.user._id,
    });

    if (!channel) {
      return res.status(200).json({ success: true, data: {} });
    }

    return res.status(200).json({ success: true, data: channel });
  }
);

// @desc    Create subscriber
// @route   Post /api/v1/subscriptions
// @access  Private
exports.createSubscriber = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const { channelId } = req.body;

    if (channelId.toString() == req.user._id.toString()) {
      return next(new ErrorResponse(`You can't subscribe to your own channle`));
    }

    let subscription = await Subscription.findOne({
      channelId: channelId,
      subscriberId: req.user._id,
    });

    if (subscription) {
      await subscription.remove();
      return res.status(200).json({ success: true, data: {} });
    } else {
      subscription = await Subscription.create({
        subscriberId: req.user._id,
        channelId: channelId,
      });
    }

    res.status(200).json({ success: true, data: subscription });
  }
);

// @desc    Get subscribed videos
// @route   GET /api/v1/subscriptions/videos
// @access  Private
exports.getSubscribedVideos = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const channels = await Subscription.find({
      subscriberId: req.user._id,
    });

    if (channels.length === 0)
      return res.status(200).json({ success: true, data: {} });

    const channelsId = channels.map((channel: any) => {
      return {
        userId: channel.channelId.toString(),
      };
    });

    const populates = [{ path: "userId", select: "photoUrl channelName" }];
    advancedResultsFunc(req, res, Video, populates, "public", channelsId);
  }
);