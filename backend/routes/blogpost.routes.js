import express from "express";
import {
  fetchUserPosts,
  handleBlogPostLikes,
  handleCreatePost,
  handleFetchBySlug,
  handleFetchSavePost,
  handleSavingPost,
  handleUserBlogPost,
} from "../controller/blogs/Userblogpost.js";
import { authenticateToken } from "../middleware/validateToken.js";
import {
  handleDeleteComments,
  handleGetComments,
  handlePostComments,
} from "../controller/blogs/postcomment.js";

const blogRoutes = express.Router();

//Blog post routes
blogRoutes.get("/api/blog/fetch", handleUserBlogPost);
blogRoutes.get("/api/blog/:slug", handleFetchBySlug);
blogRoutes.post("/api/blog/post", authenticateToken, handleCreatePost);
blogRoutes.patch(
  "/api/blog/post/like/:postId",
  authenticateToken,
  handleBlogPostLikes
);
blogRoutes.patch(
  "/api/blog/post/like/:postId",
  authenticateToken,
  handleBlogPostLikes
);
blogRoutes.get(
  "/api/blog/post/saved",
  authenticateToken,
  handleFetchSavePost
);
blogRoutes.put("/api/blog/post/save", authenticateToken, handleSavingPost);
blogRoutes.get("/api/blog/user/fetch", authenticateToken, fetchUserPosts);

// Comments routes...
blogRoutes.post(
  "/api/blog/comment/post/:postId",
  authenticateToken,
  handlePostComments
);
blogRoutes.get("/api/blog/comment/:postId", handleGetComments);
blogRoutes.delete(
  "/api/blog/comment/delete/:id",
  authenticateToken,
  handleDeleteComments
);

export default blogRoutes;
