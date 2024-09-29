import { UserComment } from "../model/comment.js";

export const handleFetchComment = async (req, res) => {
  const { productId } = req.params;

  let pageNo = parseInt(req.query.page) || 1; // tracks page number...

  let commentCount = parseInt(req.query.limit) || 5; // number of comments...

  const totalItems = await UserComment.countDocuments({ productId }); // total document in database...

  const totalPage = Math.ceil(totalItems / commentCount); // number of pages...

  const commentsList = UserComment.find({ productId })
    .skip((pageNo - 1) * commentCount) // skip the items and show comments as per visiting page...
    .limit(commentCount); // limit the number of comments to show on the frontend...
  commentsList
    .then((data) => {
      if (!commentsList || pageNo > totalPage) {
        return res.status(404).json({
          success: false,
          err: "No more Comments Server Error",
        });
      } else {
        return res.status(200).json({
          success: true,
          pageNo,
          commentCount,
          totalPage,
          comments: data,
          showPagination: totalItems > commentCount, // Condition to show pagination controls --> 10 > 5
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "internal Server error" });
    });
};
