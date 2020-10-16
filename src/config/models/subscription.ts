import mongoose from "mongoose";

const Schema = mongoose.Schema;
const subscriptionSchema = new Schema({
  id: { type: Number, required: true },
  subscriberId: { type: Number, ref: "User" },
  channelId: [{ type: Number, ref: "User" }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
module.exports = mongoose.model("Subscription", subscriptionSchema);
