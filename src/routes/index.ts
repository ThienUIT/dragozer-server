import { Application } from "express";
import { Route } from "@/shared/const/router.const";
const authRoutes = require("@/routes/auth");
const userRoutes = require("@/routes/users");
const categoryRoutes = require("@/routes/categories");
const videoRoutes = require("@/routes/videos");
const commentRoutes = require("@/routes/comments");
const replyRoutes = require("@/routes/replies");
const feelingRoutes = require("@/routes/feelings");
const subscriptionRoutes = require("@/routes/subscriptions");
const historiesRoutes = require("@/routes/histories");
const searchRoutes = require("@/routes/search");

function route(app: Application) {
  const versionOne = (routeName: string) => `${Route.ROUTE_API}${routeName}`;

  app.use(versionOne(Route.AUTH), authRoutes);
  app.use(versionOne(Route.USERS), userRoutes);
  app.use(versionOne(Route.CATEGORIES), categoryRoutes);
  app.use(versionOne(Route.VIDEOS), videoRoutes);
  app.use(versionOne(Route.COMMENTS), commentRoutes);
  app.use(versionOne(Route.REPLIES), replyRoutes);
  app.use(versionOne(Route.FEELINGS), feelingRoutes);
  app.use(versionOne(Route.SUBSCRIPTIONS), subscriptionRoutes);
  app.use(versionOne(Route.HISTORIES), historiesRoutes);
  app.use(versionOne(Route.SEARCH), searchRoutes);
}

module.exports = route;
