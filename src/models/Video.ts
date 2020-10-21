import mongoose from "mongoose";
import { DefaultSchemaConst } from "@/shared/const/default_schema.const";
import { SchemaEnum } from "@/shared/enum/schema.enum";

const Schema = mongoose.Schema;
const videoSchema = new Schema(
  {
    title: {
      type: String,
      minlength: [3, "Must be three characters long"],
    },
    description: {
      type: String,
      default: "",
    },
    thumbnailUrl: {
      type: String,
      default: DefaultSchemaConst.IMG_VIDEO_DEFAULT,
    },
    views: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
    },
    status: {
      type: String,
      enum: SchemaEnum.PRIVACY,
      default: DefaultSchemaConst.PRIVACY_DRAFT,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
videoSchema.index({ title: "text" });

videoSchema.virtual("dislikes", {
  ref: "Feeling",
  localField: "_id",
  foreignField: "videoId",
  justOne: false,
  count: true,
  match: { type: "dislike" },
});

videoSchema.virtual("likes", {
  ref: "Feeling",
  localField: "_id",
  foreignField: "videoId",
  justOne: false,
  count: true,
  match: { type: "like" },
});

videoSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "videoId",
  justOne: false,
  count: true,
});
module.exports = mongoose.model("Video", videoSchema);
