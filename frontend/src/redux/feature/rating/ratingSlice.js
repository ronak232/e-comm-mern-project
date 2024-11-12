import { createSlice } from "@reduxjs/toolkit";
import {
  handleGetUserRating,
  handlePostAsyncThunk,
} from "../../thunk/ratingThunk";

export const initialState = {
  getProductRating: [],
  rateOnSelect: 0,
  onHover: 0,
  error: null,
  success: false,
  loading: false,
};

const userRatingSlice = createSlice({
  name: "userRating",
  initialState,
  reducers: {
    rateOnHover: (state, action) => {
      state.onHover = action.payload;
    },
    setSelectRating: (state, action) => {
      state.rateOnSelect = {
        ...state.rateOnSelect,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(handlePostAsyncThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(handlePostAsyncThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.rateOnSelect = action.payload;
    });
    builder.addCase(handlePostAsyncThunk.rejected, (state, action) => {
      state.loading = true;
      state.success = action.error.message;
    });
    builder.addCase(handleGetUserRating.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(handleGetUserRating.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.getProductRating = action.payload || [];
    });
    builder.addCase(handleGetUserRating.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { rateOnHover, setSelectRating } = userRatingSlice.actions;
export default userRatingSlice.reducer;
