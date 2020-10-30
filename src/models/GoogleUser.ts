import { DefaultSchemaConst } from "@/shared/const/default_schema.const";
import { SchemaEnum } from "@/shared/enum/schema.enum";
import mongoose from "mongoose";
import { COOKIE_EXPIRE, TEXT_SECRET } from "@/config/database/config_env";

const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const UserByGoogleSchema = new Schema(
  {
    googleId: { type: String },
    photoUrl: {
      type: String,
      default: DefaultSchemaConst.IMG_USER_DEFAULT,
    },
    role: {
      type: String,
      enum: SchemaEnum.ROLE,
      default: DefaultSchemaConst.ROLE_USER,
    },
    channelName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      uniqueCaseInsensitive: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

UserByGoogleSchema.index({ channelName: "text" });
UserByGoogleSchema.virtual("subscribers", {
  ref: "Subscription",
  localField: "_id",
  foreignField: "channelId",
  justOne: false,
  count: true,
});
UserByGoogleSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this.googleId }, TEXT_SECRET, {
    expiresIn: 24 * 60 * 60 * 1000 * COOKIE_EXPIRE,
  });
};
module.exports = mongoose.model("GoogleUser", UserByGoogleSchema);
