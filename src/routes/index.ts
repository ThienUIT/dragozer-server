import { Application } from "express";

const videosRouter = require("./videos.route");
const onePageRouter = require("./onePage.route");
function route(app: Application) {
  app.use("/videos", videosRouter);
  app.use("/", onePageRouter);
}

module.exports = route;
