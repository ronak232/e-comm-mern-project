import { handleUploadToCloudinary } from "../utils/cloudinaryUploadImage.js";
import { UserComment } from "../model/comment.js";

// function to handle user uploaded images
const handleUserUploadImage = async (req, res) => {
  const { id } = req.params;

  const { productId, userName } = req.body;
  // if not file uploaded...
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const imageTob64 = Buffer.from(req.files[0].buffer).toString("base64");
  let dataURI = `data:${req.files[0].mimetype};base64,${imageTob64}`;
  const cloudImage = await handleUploadToCloudinary(dataURI, "/my-images");

  try {
    await UserComment.findOneAndUpdate(
      { id },
      {
        $push: {
          product_images: {
            $each: [
              {
                secure_url: cloudImage.secure_url,
                img_id: cloudImage.public_id,
              },
            ],
          },
        },
      }
    )
      .then(() => {
        res.status(200).json({
          success: "true",
          productImage_url: cloudImage?.secure_url,
          id,
          productId,
          userName,
        });
      })
      .catch((err) => {
        console.log("Upload file Error ", err);
      });
  } catch (err) {
    console.log("500 error", err.message);
    res.status(500).json({ err: "Internal Server error" });
  }
};

export { handleUploadToCloudinary, handleUserUploadImage };
