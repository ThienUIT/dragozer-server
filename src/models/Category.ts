import mongoose from "mongoose";
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
const categorySchema = new Schema(
  {
    title: {
      type: String,
      minlength: [3, "Title must be three characters long"],
      trim: true,
      unique: true,
      uniqueCaseInsensitive: true,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      minlength: [3, "Description must be three characters long"],
      required: [true, "Description is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
categorySchema.plugin(uniqueValidator, { message: "{PATH} already exists." });

module.exports = mongoose.model("Category", categorySchema);
