import { Router } from "express";
import { handlePostComment } from "../controller/postcomment.js";
import { handleFetchComment } from "../controller/getcomment.js";
import { handleDeleteComment } from "../controller/deletecomment.js";

import { handleEditComment } from "../controller/edit.js";
import {
  handleDislikedReaction,
  handleLikedReaction,
} from "../controller/userReaction.js";
import { handleUserUploadImage } from "../controller/cloudinary/uploadImageController.js";
import { imageUpload } from "../middleware/uploadfile.js";
import { getUserCloudImages } from "../controller/cloudinary/getCloudinaryImages.js";
import {
  handleDislikedImage,
  handleLikedImage,
} from "../controller/cloudinary/imageIxpression.js";
import { handleProductRating } from "../controller/rating/interactiverating.js";
import { getAllUserRatings } from "../controller/rating/getUserRating.js";
import { handleGenerativePrompt } from "../lib/gemini/GenerativeAI.js";

const routes = Router();

// get
routes.get("/api/comment/product_reviews/:productId", handleFetchComment);

// post
routes.post("/api/comment/post_comment", handlePostComment);

// delete
routes.delete("/api/comment/delete/:id", handleDeleteComment);

// Edit comment
routes.patch("/api/comment/update/edit_comment/:id", handleEditComment);

// Likecomment endpoint
routes.patch("/api/comment/update/user_react/like/:id", handleLikedReaction);

// dislike endpoint
routes.patch(
  "/api/comment/update/user_react/dislike/:id",
  handleDislikedReaction
);

//get Images

routes.get("/api/images/fetchimages/images=:productId", getUserCloudImages);

routes.post(
  "/api/images/upload",
  imageUpload.array("product_images", 3),
  handleUserUploadImage
);

routes.post("/api/images/upload/:id/likes/post", handleLikedImage);
routes.post("/api/images/upload/:id/dislikes/post", handleDislikedImage);

routes.post("/api/comment/product_review/rating/post", handleProductRating);

routes.get("/api/comment/product_review/rating", getAllUserRatings);

routes.patch("/api/comment/product_review/post/genAI", handleGenerativePrompt);

export default routes;
