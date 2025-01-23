import { Schema } from "mongoose";
import mongoose from "mongoose";

const postBlog = new Schema(
  {
    content: {
      userBlogs: [
        {
          postTitle: {
            type: String,
            required: true,
          },
          coverImage: {
            type: String,
          },
          userName: {
            type: String,
            required: true,
          },
          blogContent: {
            type: String,
            required: true,
          },
          slug: {
            type: String,
            required: true,
            unique: true,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
          likes: {
            type: Number,
            default: 0,
          },
          dislikes: {
            type: Number,
            default: 0,
          },
          likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
          dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        },
      ],
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const PostBlog = mongoose.model("UserBlog", postBlog);
