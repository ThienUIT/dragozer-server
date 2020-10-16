import { Request, Response } from "express";

const { multipleMongooseToObject } = require("../utils/mongoose");
const Videos = require("../config/models/video");

class VideoController {
  // [GET] /videos

  index(req: Request, res: Response) {
    Videos.find({}).then((Video: any) => {
      res.send(multipleMongooseToObject(Video));
    });
  }

  // [GET] /videos/:id

  show(req: Request, res: Response) {
    res.send("NEW DETAILS");
  }
}

module.exports = new VideoController();
