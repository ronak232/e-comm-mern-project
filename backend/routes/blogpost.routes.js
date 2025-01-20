import express from "express";
import {
  handleCreatePost,
  handleFetchBySlug,
  handleUserBlogPost,
} from "../controller/blogs/Userblogpost.js";
import { authenticateToken } from "../middleware/validateToken.js";
import { handleDeleteComments, handleGetComments, handlePostComments } from "../controller/blogs/postcomment.js";

const blogRoutes = express.Router();

blogRoutes.get("/api/blog/fetch", handleUserBlogPost);
blogRoutes.get("/api/blog/:slug", handleFetchBySlug);
blogRoutes.post("/api/blog/post", authenticateToken, handleCreatePost);

// Comments...
blogRoutes.post("/api/blog/comment/:postId", authenticateToken, handlePostComments);
blogRoutes.get("/api/blog/comment/:postId", handleGetComments);
blogRoutes.delete("/api/blog/comment/delete/:id",authenticateToken, handleDeleteComments);

export default blogRoutes;
