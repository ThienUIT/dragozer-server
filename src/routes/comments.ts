const {
  getCommentByVideoId,
  createComment,
  updateComment,
  deleteComment,
} = require("@/controllers/comments");
import express from "express";

const routerComments = express.Router();

// const advancedResults = require('../middleware/advancedResults')
const { protect } = require("@/shared/middleware/auth");

routerComments
  .route("/")
  // .get(advancedResults(Category), getCategories)
  .post(protect, createComment);

routerComments
  .route("/:id")
  .put(protect, updateComment)
  .delete(protect, deleteComment);

routerComments.route("/:videoId/videos").get(getCommentByVideoId);

module.exports = routerComments;
