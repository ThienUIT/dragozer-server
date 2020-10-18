import mongoose from "mongoose";

const Schema = mongoose.Schema;
const historySchema = new Schema(
  {
    searchText: {
      type: String,
    },
    type: {
      type: String,
      enum: ["watch", "search"],
      required: [true, "Type is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("History", historySchema);
