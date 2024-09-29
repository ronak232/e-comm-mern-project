import { UserComment } from "../model/comment.js";

export const handleEditComment = async (req, res) => {
  const { commentText } = req.body;
  const { id } = req.params;

  await UserComment.findByIdAndUpdate(id, {
    $set: {
      commentText,
    },
    new: true,
  })
    .then(() => {
      if (!commentText) {
        res.status(404).send({ err: "Failed due to server error" });
      } else {
        res.status(200).send({
          success: true,
          data: commentText,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        err: "Failed to edit comment",
      });
    });
};
