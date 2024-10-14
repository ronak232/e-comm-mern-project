import { handleUploadToCloudinary } from "../../utils/cloudinaryUploadImage.js";
import { CustomerProductUploadedImages } from "../../model/storeImages.js";

// function to handle user uploaded images
const handleUserUploadImage = async (req, res) => {
  const { productId, userName, product_images } = req.body;
  const _id = req.body._id; // For form data, req.body._id should have the value
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
    const customerImageSchema = CustomerProductUploadedImages.findByIdAndUpdate(
      _id,
      {
        $push: {
          //to ensure that the first element in the product_images array is updated i.e. secure_url array inside the first element of product_images is updated.
          "product_images.0.secure_url": {
            $each: uploadedImages.map((image) => image.secure_url),
          }, // Add URLs to the existing array
        },
      },
      {
        new: true,
      }
    );
    const saveImages = await customerImageSchema.save()
  } catch (error) {
    console.error("Error in update:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

export { handleUploadToCloudinary, handleUserUploadImage };
