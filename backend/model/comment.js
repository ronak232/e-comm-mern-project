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
    required: true,
  },
  userName: {
    type: String,
    ref: "UserName",
  },
  commentText: { type: String, required: true },
  emojis: [String],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: {
    type: String,
  },
  editedAt: Date,
  flagged: { type: Boolean, default: false },
  replied_comment_id: { String },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const UserComment = mongoose.model("user_comment", CommentAndReview);
