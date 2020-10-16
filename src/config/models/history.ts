import mongoose from "mongoose";

const Schema = mongoose.Schema;
const historySchema = new Schema({
  id: { type: Number, required: true },
  searchText: { type: String, default: "" },
  type: { type: String, enum: ["video", "channel"], default: "video" },
  videoId: { type: Number, ref: "Video" },
  userId: [{ type: Number, ref: "User" }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
module.exports = mongoose.model("History", historySchema);
