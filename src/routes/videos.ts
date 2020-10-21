const {
  getVideos,
  getVideo,
  videoUpload,
  updateVideo,
  updateViews,
  uploadVideoThumbnail,
  deleteVideo,
} = require("@/controllers/videos");
import express from "express";

const Video = require("@/models/Video");

const routerVideos = express.Router();

const advancedResultsVideos = require("@/shared/middleware/advancedResults");
const { protect } = require("@/shared/middleware/auth");

routerVideos.post("/", protect, videoUpload);

routerVideos.route("/private").get(
  protect,
  advancedResultsVideos(
    Video,
    [
      { path: "userId" },
      { path: "categoryId" },
      { path: "likes" },
      { path: "dislikes" },
      { path: "comments" },
    ],
    {
      status: "private",
    }
  ),
  getVideos
);

routerVideos
  .route("/public")
  .get(
    advancedResultsVideos(
      Video,
      [
        { path: "userId" },
        { path: "categoryId" },
        { path: "likes" },
        { path: "dislikes" },
      ],
      { status: "public" }
    ),
    getVideos
  );

routerVideos
  .route("/:id")
  .get(getVideo)
  .put(protect, updateVideo)
  .delete(protect, deleteVideo);

routerVideos.route("/:id/thumbnails").put(protect, uploadVideoThumbnail);
routerVideos.route("/:id/views").put(protect, updateViews);

module.exports = routerVideos;
