import mongoose from "mongoose";

const uploadedImages = new mongoose.Schema({
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
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: {
    type: String,
  },
  editedAt: Date,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  product_images: [
    {
      secure_url: { type: [String] },
      img_id: String,
    },
  ],
});

export const CustomerProductUploadedImages = mongoose.model(
  "customer_Uploaded_Images",
  uploadedImages
);
