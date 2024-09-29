import { ObjectId } from "mongodb";
import { UserComment } from "../model/comment.js";

export const handleDeleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await UserComment.findByIdAndDelete(id).then((data) => {
      if (data) {
        res.status(200).json({
          success: true,
          data,
        });
      } else {
        res.status(404).json({ err: "Error to delete the comment" });
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, err: "Cannot delete the comment" });
  }
};
