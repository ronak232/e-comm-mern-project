import { UploadedImgs } from "../../model/store_images.js";

// like function
export const handleLikedImage = async (req, res) => {
  const { imageId } = req.body;

  try {
    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: "imageId is required",
      });
    }
    // Find the product by productId and imageId
    const updatedProduct = await UploadedImgs.findOneAndUpdate(
      { "product_images._id": imageId }, // Filter by productId and image `_id`
      {
        $inc: {
          "product_images.$.likes": 1, // Increment `likes` for the matched image in product_images and $ --> positional operator - return the first element that matches the query condition on the array.
        },
      },
      {
        new: true, // return the updated document
      }
    );

    return res.status(200).json({
      success: true,
      message: "Likes updated successfully",
      data: updatedProduct, // Optionally return the updated product data
    });
  } catch (err) {
    console.error("Error updating likes:", err);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating likes",
    });
  }
};

// dislike function
export const handleDislikedImage = async (req, res) => {
  const { imageId } = req.body;

  try {
    if (!imageId) {
      return res.status(400).json({
        success: false,
        message: "imageId is required",
      });
    }
    // Find the product by productId and imageId
    const updatedProduct = await UploadedImgs.findOneAndUpdate(
      { "product_images._id": imageId }, // Filter by productId and image `_id`
      {
        $inc: {
          "product_images.$.dislikes": -1, // Increment `likes` for the matched image in product_images and $ --> positional operator - return the first element that matches the query condition on the array.
        },
      },
      {
        new: true, // return the updated document
      }
    );

    return res.status(200).json({
      success: true,
      message: "Likes updated successfully",
      data: updatedProduct, // Optionally return the updated product data
    });
  } catch (err) {
    console.error("Error updating likes:", err);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating likes",
    });
  }
};
