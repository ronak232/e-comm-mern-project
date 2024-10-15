import { handleUploadToCloudinary } from "../../utils/cloudinaryUploadImage.js";
import { UserComment } from "../../model/comment.js";

// function to handle user uploaded images
const handleUserUploadImage = async (req, res) => {
  const { _id, product_images, productId, userName } = req.body; // For form data, req.body._id should have the value
  console.log("_id received:", _id);
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
    let userImg = await UserComment.findById(_id);
    if (!userImg) {
      let userUploadedImg = new UserComment({
        _id,
        productId,
        userName,
        product_images: uploadedImages.map((image) => ({
          secure_url: image.secure_url, // Assign the URL directly
          img_id: image.img_id, // Assign the img_id as a string directly
        })),
      });
      await userUploadedImg.save();
      return res.status(201).json({
        success: true,
        message: "User created and images uploaded successfully",
        data: userUploadedImg,
      });
    } else {
      const uploadImage = await UserComment.findByIdAndUpdate(
        _id,
        {
          //to ensure that the first element in the product_images array is updated i.e. secure_url array inside the first element of product_images is updated.
          $push: {
            product_images: {
              $each: uploadedImages.map((image) => ({
                secure_url: image.secure_url, // Push each URL directly
                img_id: image.img_id, // Push each img_id directly as a string
              })),
            },
          },
        },
        {
          new: true,
        }
      )

        .then(() => {
          res.status(200).json({
            success: "true",
            mssg: "Successfully uploaded",
            data: uploadImage,
          });
        })
        .catch((err) => {
          console.log("Upload file Error ", err);
          res
            .status(400)
            .json({ error: "Upload failed", details: err.message });
        });
      console.log("Final", uploadedImages);
    }
  } catch (error) {
    console.error("Error in update:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

export { handleUploadToCloudinary, handleUserUploadImage };
