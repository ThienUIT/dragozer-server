import mongoose from "mongoose";

const Schema = mongoose.Schema;
const feelingSchema = new Schema({
  id: { type: Number, required: true },
  type: {
    type: String,
    enum: ["like", "dislike", "love", "none"],
    default: "none",
  },
  videoId: { type: Number, ref: "Video" },
  userId: [{ type: Number, ref: "User" }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
module.exports = mongoose.model("Feeling", feelingSchema);
