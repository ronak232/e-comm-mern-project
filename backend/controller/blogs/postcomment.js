import mongoose from "mongoose";
import { BlogComment } from "../../model/blogComment.js";
import { User } from "../../model/user.js";

export const handleGetComments = async (req, res) => {
  //populate is analogous of joins
  const userComments = await BlogComment.find({
    post: req.params.postId,
  })
    .populate({
      path: "user",
      select: "userName",
      model: "User",
    })
    .sort({ timestamp: -1 });
  return res.status(200).json({
    userComments,
  });
};

//add comments
export const handlePostComments = async (req, res) => {
  try {
    const { user_id, name } = req.user;
    const { postId } = req.params;
    const { userComment } = req.body;
    // Find user
    let user = await User.findOne({ user_id });

    if (!user) {
      user = new User({
        user_id,
        userName: name,
      });
      await user.save();
    }

    // Create and save the new comment
    const newComment = new BlogComment({
      user: user._id,
      post: postId,
      userComment,
    });

    const savedComment = await newComment.save().then((comment) => {
      comment.populate("user");
    });

    return res.status(201).json({
      message: "Comment added successfully",
      comment: savedComment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// delete comment
export const handleDeleteComments = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { id } = req.params;

    if (!user_id) {
      return res.status(401).json("Not authenticated");
    }
    const user = await User.findOne({ user_id });

    const deleteComment = await BlogComment.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!deleteComment) {
      return res.status(403).json({
        message: "You are not allowed to delete comment...",
      });
    }
    return res.status(200).json({ message: "Comment deleted..." });
  } catch (err) {
    return res.status(500).json({
      message: "Something wrong happened",
    });
  }
};
