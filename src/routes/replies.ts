const {
  getReplies,
  createReply,
  updateReply,
  deleteReply,
} = require("../controllers/replies");
import express from "express";

const Reply = require("../models/Reply");

const routerReplies = express.Router();

const advancedResultsReplies = require("../shared/middleware/advancedResults");
const { protect } = require("../shared/middleware/auth");

routerReplies
  .route("/")
  .get(advancedResultsReplies(Reply), getReplies)
  .post(protect, createReply);

routerReplies
  .route("/:id")
  .put(protect, updateReply)
  .delete(protect, deleteReply);

module.exports = routerReplies;
