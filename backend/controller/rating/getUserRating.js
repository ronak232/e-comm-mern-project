import { InteractiveRating } from "../../model/rating.js";

export const getAllUserRatings = async (req, res) => {
  const { productId } = req.query;
  try {
    const ratings = await InteractiveRating.find(
      { productId },
      { "userRating.userName": 1, "userRating.rating": 1 }
    );

    if (ratings && ratings.length > 0) {
      const getProductRating = ratings.flatMap((rating) =>
        rating.userRating.map((item) => ({
          userName: item.userName,
          rating: item.rating,
        }))
      );
      return res.status(200).json({
        success: true,
        data: getProductRating,
      });
    } else {
      return res.status(404).json({
        msg: "No ratings...",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};
