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
      "https://image.plo.vn/Uploaded/2020/xpckxpiu/2019_10_21/lisa-plo-1_jttt.jpg",
  },
  userId: [{ type: Number, ref: "User" }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
module.exports = mongoose.model("Video", videoSchema);
