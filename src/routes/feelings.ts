const {
  createFeeling,
  checkFeeling,
  getLikedVideos,
} = require("../controllers/feelings");
import express from "express";

const routerFeelings = express.Router();

const { protect } = require("../shared/middleware/auth");

routerFeelings.use(protect);

routerFeelings.route("/").post(createFeeling);

routerFeelings.route("/check").post(checkFeeling);

routerFeelings.route("/videos").get(getLikedVideos);

module.exports = routerFeelings;
