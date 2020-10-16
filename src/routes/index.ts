import { Application } from "express";
import { RouterConst } from "../shared/const/router.const";

const videosRouter = require("./videos.route");
const onePageRouter = require("./onePage.route");

function route(app: Application) {
  app.use(RouterConst.VIDEO, videosRouter);
  app.use(RouterConst.ROUTER_BASE, onePageRouter);
}

module.exports = route;
