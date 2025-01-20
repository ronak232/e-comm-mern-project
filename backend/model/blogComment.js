import { Schema } from "mongoose";
import mongoose from "mongoose";

const blogComment = new Schema(
  {
    userComment: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "UserBlog",
      required: true,
    },
  },
  { timestamps: true }
);

export const BlogComment = mongoose.model("PostComment", blogComment);
