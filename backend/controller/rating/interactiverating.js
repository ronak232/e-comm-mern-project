import { InteractiveRating } from "../../model/rating.js";

export const handleProductRating = async (req, res) => {
  const { rating, userName, pId, userId } = req.body;

  if (!rating || !pId) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  let isRated = null;

  try {
    // Check if the user rating already exists for this product
    const isUserRated = await InteractiveRating.findOne({
      productId: pId,
      "userRating.userId": userId,
    });

    const checkExistingRating = isUserRated?.userRating?.find(
      (rating) => (rating.userId = userId)
    );

    if (checkExistingRating) {
      isRated = true;
      // If the rating exists, update the rating and userName fields
      await InteractiveRating.findOneAndUpdate(
        { productId: pId, "userRating.userId": userId },
        {
          $set: {
            "userRating.$.rating": rating,
            "userRating.$.userName": userName,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        msg: "Rating updated",
        data: req.body,
        isRated,
      });
    } else {
      isRated = false;
      // If the rating does not exist, add a new entry for this user
      const addNewUserRating = await InteractiveRating.findOneAndUpdate(
        { productId: pId },
        {
          $push: {
            userRating: { rating, userName, userId },
          },
        },
        { new: true, upsert: true }
      );

      if (addNewUserRating) {
        return res.status(201).json({
          success: true,
          msg: "Rating added.",
          data: req.body,
          isRated,
        });
      }
    }

    // If neither condition matched, return an error
    return res.status(500).json({
      success: false,
      msg: "Failed to update or add rating.",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
};
