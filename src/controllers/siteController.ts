import { Request, Response } from "express";

const { multipleMongooseToObject } = require("@/shared/utils/mongoose");

class SiteController {
  // [GET]
  home(req: Request, res: Response) {
    res.send("HELLO THIS IS HOME PAGE WITH VIDEOS");
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

module.exports = new SiteController();
