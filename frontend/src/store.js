import { configureStore } from "@reduxjs/toolkit";
import userRating from "./redux/feature/rating/ratingSlice.js";

export const store = configureStore({
  reducer: {
    rating: userRating,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
