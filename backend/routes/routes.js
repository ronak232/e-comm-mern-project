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

routes.post(
  "/api/images/upload",
  imageUpload.array("product_images", 3),
  handleUserUploadImage
);

export default routes;
