import { Application } from "express";
import { RouterConst } from "../shared/const/router.const";

const videosRouter = require("@/routes/videos.route");
const onePageRouter = require("@/routes/site.route");

function route(app: Application) {
  app.use(RouterConst.WATCH, videosRouter);
  app.use(RouterConst.ROUTER_BASE, onePageRouter);
}

module.exports = route;
