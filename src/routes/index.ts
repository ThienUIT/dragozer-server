import { Application } from "express";
import { Routes } from "../shared/enum/routes.enum";

const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/users");
const categoryRoutes = require("../routes/categories");
const videoRoutes = require("../routes/videos");
const commentRoutes = require("../routes/comments");
const replyRoutes = require("../routes/replies");
const feelingRoutes = require("../routes/feelings");
const subscriptionRoutes = require("../routes/subscriptions");
const historiesRoutes = require("../routes/histories");
const searchRoutes = require("../routes/search");

function route(app: Application) {
  const versionOne = (routeName: string) => `${Routes.route_api}${routeName}`;

  app.use(versionOne(Routes.auth), authRoutes);
  app.use(versionOne(Routes.users), userRoutes);
  app.use(versionOne(Routes.categories), categoryRoutes);
  app.use(versionOne(Routes.videos), videoRoutes);
  app.use(versionOne(Routes.comments), commentRoutes);
  app.use(versionOne(Routes.replies), replyRoutes);
  app.use(versionOne(Routes.feelings), feelingRoutes);
  app.use(versionOne(Routes.subscriptions), subscriptionRoutes);
  app.use(versionOne(Routes.histories), historiesRoutes);
  app.use(versionOne(Routes.search), searchRoutes);
}

module.exports = route;
