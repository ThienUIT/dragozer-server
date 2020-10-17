import mongoose from "mongoose";

const Schema = mongoose.Schema;
const subscriptionSchema = new Schema(
  {
    subscriberId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Subscriber id is required"],
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Subscription", subscriptionSchema);
