import { Request, Response } from "express";

const { multipleMongooseToObject } = require("../utils/mongoose");
const Videos = require("../config/models/Video");

class VideoController {
  // [GET] /watch

  index(req: Request, res: Response) {
    Videos.find({}).then((Video: any) => {
      res.send(multipleMongooseToObject(Video));
    });
  }

  // [GET] /watch/:slug

  show(req: Request, res: Response) {
    res.send(`Watch/${req.params.slug}`);
  }
}

module.exports = new VideoController();
