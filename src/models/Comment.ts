import mongoose from "mongoose";

const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    text: {
      type: String,
      minlength: [3, "Must be three characters long"],
      required: [true, "Text is required"],
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

commentSchema.virtual("replies", {
  ref: "Reply",
  localField: "_id",
  foreignField: "commentId",
  justOne: false,

  options: { sort: { createdAt: -1 } },
});
module.exports = mongoose.model("Comment", commentSchema);
