import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setSelectRating } from "../feature/rating/ratingSlice";

const baseURL = process.env.REACT_APP_BASE_URL;
const handlePostAsyncThunk = createAsyncThunk(
  "api/post/rating",
  async (data, thunkApi) => {
    await axios
      .post(`${baseURL}/api/comment/product_review/rating/post`, data)
      .then((resp) => {
        return thunkApi.dispatch(setSelectRating(resp.data));
      })
      .catch((err) => {
        return thunkApi.rejectWithValue({ err: err.message });
      });
  }
);

const handleGetAsyncThunk = createAsyncThunk(
  "api/get/rating",
  async (_, thunkApi) => {
    await axios
      .post(`/api/comment/product_review/rating/post`)
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        return thunkApi.rejectWithValue({ err: err.message });
      });
  }
);

export { handleGetAsyncThunk, handlePostAsyncThunk };
