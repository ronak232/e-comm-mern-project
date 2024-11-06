import mongoose from "mongoose";

const UserInteractiveRating = new mongoose.Schema({
  productId: {
    type: String,
    ref: "Product",
  },
  userRating: [
    {
      userId: {
        type: String || "",
        ref: "User",
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      rating: { type: Number, required: true },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const InteractiveRating = mongoose.model(
  "user_interactive_rating",
  UserInteractiveRating
);
