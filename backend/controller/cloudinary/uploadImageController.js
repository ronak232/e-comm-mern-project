import { handleUploadToCloudinary } from "../../utils/cloudinaryUploadImage.js";
import { UploadedImgs } from "../../model/store_images.js";

// function to handle user uploaded images
const handleUserUploadImage = async (req, res) => {
  const { userId, productId, userName } = req.body;
  // const uploadedImages = req.body.uploadedImages; // Assuming images are sent in the request
  // if not file uploaded...
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }
  const imageFiles = req.files; // Access all uploaded files
  let uploadedImages = []; // Store uploaded images for MongoDB

  // Process each file
  for (let i = 0; i < imageFiles.length; i++) {
    const imageBuffer = Buffer.from(imageFiles[i].buffer).toString("base64");

    // Create the data URI for Cloudinary upload
    const dataURI = `data:${
      imageFiles[i].mimetype
    };base64,${imageBuffer.replace(/^data:image\/[a-z]+;base64,/, "")}`;

    // Upload to Cloudinary
    const cloudImage = await handleUploadToCloudinary(dataURI, "/my-images");

    // Push the Cloudinary result to the array
    uploadedImages
      .push({
        secure_url: cloudImage.secure_url,
        img_id: cloudImage?.public_id,
      })
      .toString();
  }
  try {
    // Check if user already exists in the database
    const user = await UploadedImgs.findOne({ productId, userName });

    if (user) {
      // If user exists, push the image URL to the existing user's product_images array
      await UploadedImgs.findByIdAndUpdate(
        user._id,
        {
          $push: {
            product_images: {
              $each: uploadedImages.map((image) => ({
                secure_url: image.secure_url,
                img_id: image.img_id,
              })),
            },
          },
        },
        { new: true }
      )
        .then((updatedUser) => {
          res.status(200).json({
            success: true,
            message: "Image URLs added to existing user",
            data: updatedUser,
          });
        })
        .catch((err) => {
          console.error("Error updating user: ", err);
          res
            .status(500)
            .json({ error: "Failed to update user", details: err.message });
        });
    } else {
      // If user doesn't exist, create a new user document and add the image URL
      const newUser = new UploadedImgs({
        userId,
        userName,
        productId,
        product_images: uploadedImages.map((image) => ({
          secure_url: image.secure_url,
          img_id: image.img_id,
        })),
      });

      await newUser
        .save()
        .then((savedUser) => {
          res.status(201).json({
            success: true,
            message: "New user created and image URLs saved",
            data: savedUser,
          });
        })
        .catch((err) => {
          console.error("Error creating new user: ", err);
          res
            .status(500)
            .json({ error: "Failed to create new user", details: err.message });
        });
    }
  } catch (error) {
    console.error("Error in update:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

export { handleUploadToCloudinary, handleUserUploadImage };
