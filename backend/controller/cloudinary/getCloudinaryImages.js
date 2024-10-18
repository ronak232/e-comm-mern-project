import { UploadedImgs } from "../../model/store_images.js";

export const getUserCloudImages = (req, res) => {
  const { productId } = req.params;

  const uploadedImage = UploadedImgs.find({ productId });
  uploadedImage
    .then((resp) => {
      console.log(resp);
      if (!uploadedImage && uploadedImage.length === 0) {
        res.status(404).json({
          success: false,
          message: "No image Uploaded",
        });
      }
      res.status(200).json({
        success: true,
        data: resp,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "internal server error",
      });
    });
};
