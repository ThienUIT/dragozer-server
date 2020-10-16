import { Request, Response } from "express";

const { multipleMongooseToObject } = require("../utils/mongoose");
const Video = require("../config/models/video");

class OnePageController {
  // [GET]
  home(req: Request, res: Response) {
    res.send("Home");
  }

  // [GET] /search
  search(req: Request, res: Response) {
    res.send("searching");
  }

  // [GET] /history
  history(req: Request, res: Response) {
    res.send("history");
  }
}

module.exports = new OnePageController();
