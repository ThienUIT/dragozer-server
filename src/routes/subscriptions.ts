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

const routerSubscription = express.Router();

const advancedResultsSubscrip = require("@/shared/middleware/advancedResults");
const { protect } = require("@/shared/middleware/auth");

routerSubscription.post("/", protect, createSubscriber);

routerSubscription.post("/check", protect, checkSubscription);

routerSubscription
  .route("/subscribers")
  .get(
    protect,
    advancedResultsSubscrip(Subscription, [{ path: "subscriberId" }], {
      status: "private",
      filter: "channel",
    }),
    getSubscribers
  );

routerSubscription
  .route("/channels")
  .get(
    advancedResultsSubscrip(Subscription, [
      { path: "channelId", select: "photoUrl channelName" },
    ]),
    getChannels
  );

routerSubscription.route("/videos").get(protect, getSubscribedVideos);
routerSubscription.route("/videos/:id").get(protect, getVideosSubscriber);
module.exports = routerSubscription;
