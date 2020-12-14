const {
  getHistories,
  createHistory,
  deleteHistory,
  deleteHistories,
} = require("../controllers/histories");
import express from "express";

const History = require("../models/History");

const routerHistories = express.Router();

const advancedResultsHistories = require("../shared/middleware/advancedResults");
const { protect } = require("../shared/middleware/auth");

routerHistories.use(protect);

routerHistories
  .route("/")
  .get(
    advancedResultsHistories(
      History,
      [{ path: "videoId" }, { path: "userId" }],
      {
        status: "private",
      }
    ),
    getHistories
  )
  .post(createHistory);

routerHistories.route("/:id").delete(deleteHistory);

routerHistories.delete("/:type/all", deleteHistories);

module.exports = routerHistories;
