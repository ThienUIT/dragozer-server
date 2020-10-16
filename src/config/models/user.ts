import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
  id: { type: Number, required: true },
  email: { type: String, required: true },
  channelName: { type: String, required: true },
  password: { type: String, required: true },
  photoUrl: {
    type: String,
    default:
      "https://image.plo.vn/Uploaded/2020/xpckxpiu/2019_10_21/lisa-plo-1_jttt.jpg",
  },
  role: { type: Number, default: 2 },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
//name of model is snake-case linking to collection in database
module.exports = mongoose.model("User", userSchema);
