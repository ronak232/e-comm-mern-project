import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    img: {
      type: String,
    },
    savedPosts: {
      type: [String],
      default: [],
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserBlog",
      },
    ],
    dislikedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserBlog",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
