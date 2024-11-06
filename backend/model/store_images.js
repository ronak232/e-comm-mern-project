import mongoose from "mongoose";

const UserUploadedImgs = new mongoose.Schema({
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
    ref: "User",
  },

  editedAt: Date,
  flagged: { type: Boolean, default: false },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  product_images: [
    {
      secure_url: { type: [String] },
      img_id: String,
      likes: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
      postDate: {
        type: String,
      },
    },
  ],
});

export const UploadedImgs = mongoose.model(
  "user_uploaded_imges",
  UserUploadedImgs
);
