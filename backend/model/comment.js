import mongoose from "mongoose";

const CommentAndReview = new mongoose.Schema({
  productId: {
    type: String,
    ref: "Product",
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.String || null,
    ref: "User",
  },
  userName: {
    type: String,
    ref: "UserName",
  },
  commentText: { type: String, required: false },
  emojis: [String],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: {
    type: String,
  },
  flagged: { type: Boolean, default: false },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const UserComment = mongoose.model("user_comment", CommentAndReview);
