import mongoose from "mongoose";
const Schema = mongoose.Schema;
const commentSchema = new Schema({
  id: { type: Number, required: true },
  text: { type: String, default: "" },
  videoId: { type: Number, ref: "Video" },
  userId: [{ type: Number, ref: "User" }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
module.exports = mongoose.model("Comment", commentSchema);
