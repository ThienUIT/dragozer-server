import { Application } from "express";

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
  const versionOne = (routeName: string) => `/api/v1/${routeName}`;

  app.use(versionOne("auth"), authRoutes);
  app.use(versionOne("users"), userRoutes);
  app.use(versionOne("categories"), categoryRoutes);
  app.use(versionOne("videos"), videoRoutes);
  app.use(versionOne("comments"), commentRoutes);
  app.use(versionOne("replies"), replyRoutes);
  app.use(versionOne("feelings"), feelingRoutes);
  app.use(versionOne("subscriptions"), subscriptionRoutes);
  app.use(versionOne("histories"), historiesRoutes);
  app.use(versionOne("search"), searchRoutes);
}

module.exports = route;
