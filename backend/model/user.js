import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    postID: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "UserBlog"
    },
    savedPosts: [{
      type: Schema.Types.ObjectId,
      ref: 'UserBlog' 
    }],
    likedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserBlog.content.userBlogs"
    }],
    dislikedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserBlog.content.userBlogs"
    }]
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
