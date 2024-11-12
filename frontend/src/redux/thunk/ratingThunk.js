import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setSelectRating } from "../feature/rating/ratingSlice";
const baseURL = process.env.REACT_APP_BASE_URL;

const handlePostAsyncThunk = createAsyncThunk(
  "api/post/rating",
  async (data, thunkApi) => {
    try {
      await axios
        .post(`/api/comment/product_review/rating/post`, data)
        .then((resp) => {
          return thunkApi.dispatch(setSelectRating(resp.data));
        })
        .catch((err) => {
          console.error("Enable to post rating");
        });
    } catch (err) {
      return thunkApi.rejectWithValue({ err: err.message });
    }
  }
);

const handleGetUserRating = createAsyncThunk(
  "api/get/rating",
  async (pId, thunkApi) => {
    try {
      const resp = await axios.get(`/api/comment/product_review/rating`, {
        params: { productId: pId },
      });
      return resp.data.data; // Ensure this returns an array
    } catch (err) {
      return thunkApi.rejectWithValue({ err: err.message });
    }
  }
);

export { handleGetUserRating, handlePostAsyncThunk };
