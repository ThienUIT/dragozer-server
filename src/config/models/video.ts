import mongoose from "mongoose";

const Schema = mongoose.Schema;
const videoSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  categoryId: [{ type: Number, ref: "Category" }],
  views: { type: Number, default: 0 },
  photoUrl: {
    type: String,
    default:
      "https://i.pinimg.com/564x/27/65/e9/2765e93b591665f09e94bb59940d37f6.jpg",
  },
  userId: [{ type: Number, ref: "User" }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
module.exports = mongoose.model("Video", videoSchema);
