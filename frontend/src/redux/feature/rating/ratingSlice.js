import { createSlice } from "@reduxjs/toolkit";
import {
  handleGetAsyncThunk,
  handlePostAsyncThunk,
} from "../../thunk/ratingThunk";

const initialState = {
  allRatings: [],
  rateOnSelect: 0,
  onHover: 0,
  startStarIndex: 0,
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
    builder.addCase(handleGetAsyncThunk.fulfilled, (state, action) => {
      state.loading = true;
      state.allRatings = action.payload;
    });
    builder.addCase(handleGetAsyncThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { rateOnHover, setSelectRating, resetStarRating } =
  userRatingSlice.actions;
export default userRatingSlice.reducer;
