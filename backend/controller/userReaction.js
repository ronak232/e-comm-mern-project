import { UserComment } from "../model/comment.js";

export const handleLikedReaction = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;
  await UserComment.findByIdAndUpdate(
    id,
    {
      $inc: {
        likes: 1,
      },
    },
    {
      new: true,
    }
  )
    .then((items) => {
      if (items) {
        res.status(200).json({
          success: true,
          data: likes,
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "Internal Server Error",
      });
    });
};

export const handleDislikedReaction = async (req, res) => {
  const { id } = req.params;
  const { dislikes } = req.body;
  await UserComment.findByIdAndUpdate(
    id,
    {
      $inc: {
        dislikes: 1,
      },
    },
    {
      new: true,
    }
  )
    .then((items) => {
      if (items) {
        res.status(200).json({
          success: true,
          data: dislikes,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Bad Request",
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "Internal Server Error",
      });
    });
};
