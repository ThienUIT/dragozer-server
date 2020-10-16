import mongoose from "mongoose";

const Schema = mongoose.Schema;
const replySchema = new Schema({
  id: { type: Number, required: true },
  text: { type: String, default: "" },
  videoId: { type: Number, ref: "Video" },
  commentId: [{ type: Number, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
module.exports = mongoose.model("Reply", replySchema);
