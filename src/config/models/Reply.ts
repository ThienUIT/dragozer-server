import mongoose from "mongoose";

const Schema = mongoose.Schema;
const replySchema = new Schema(
  {
    text: {
      type: String,
      minlength: [3, "Must be three characters long"],
      required: [true, "Text is required"],
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);
replySchema.pre("find", function () {
  this.populate({
    path: "userId",
    select: "channelName photoUrl",
    sort: "+createdAt",
  });
});
module.exports = mongoose.model("Reply", replySchema);
