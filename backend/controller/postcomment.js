import { updateDatabase } from "../db/db.js";
import { UserComment } from "../model/comment.js";

export const handlePostComment = async (req, res) => {
  try {
    const { productId, userId, commentText, userName, createdAt } = req.body;
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Product ID, User ID, and Comment Text are required." });
    }
    const newCommment = UserComment({
      productId,
      userId,
      commentText,
      userName,
      createdAt,
    });
    const isUserCommentSaved = await newCommment.save(req.body);
    const checkDBUpdate = await updateDatabase(isUserCommentSaved);

    if (!checkDBUpdate) {
      return res.status(500).json({ message: "Internal server error" });
    } else {
      return res.status(200).json({ Comments: [isUserCommentSaved] });
    }
  } catch (error) {
    console.error("Failed to handle user comment:", error);
    return res.status(404).json({ message: "Failed to save the db" });
  }
};
