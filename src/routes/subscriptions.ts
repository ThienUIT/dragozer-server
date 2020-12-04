const {
  getChannels,
  getSubscribers,
  createSubscriber,
  checkSubscription,
  getSubscribedVideos,
  getVideosSubscriber,
} = require("@/controllers/subscriptions");
import express from "express";

const Subscription = require("@/models/Subscription");

const routerSubscrip = express.Router();

const advancedResultsSubscrip = require("@/shared/middleware/advancedResults");
const { protect } = require("@/shared/middleware/auth");

routerSubscrip.post("/", protect, createSubscriber);

routerSubscrip.post("/check", protect, checkSubscription);

routerSubscrip.route("/subscribers").get(
  protect,
  advancedResultsSubscrip(Subscription, [{ path: "subscriberId" }], {
    status: "private",
    filter: "channel",
  }),
  getSubscribers
);

routerSubscrip
  .route("/channels")
  .get(
    advancedResultsSubscrip(Subscription, [
      { path: "channelId", select: "photoUrl channelName" },
    ]),
    getChannels
  );

routerSubscrip.route("/videos").get(protect, getSubscribedVideos);
routerSubscrip.route("/videos/:id").get(protect, getVideosSubscriber);

module.exports = routerSubscrip;
