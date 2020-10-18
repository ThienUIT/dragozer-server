import mongoose from "mongoose";
import { SchemaEnum } from "../shared/enum/schema.enum";

const Schema = mongoose.Schema;
const feelingSchema = new Schema(
  {
    type: {
      type: String,
      enum: SchemaEnum.FEELING,
      required: [true, "Type is required either like or dislike"],
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: [true, "Video id is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feeling", feelingSchema);
