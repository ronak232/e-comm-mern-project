import { v2 as cloudinary } from "cloudinary";

// upload to cloudnary
export const handleUploadToCloudinary = async (file, path) => {
  try {
    const { secure_url, public_id } = await cloudinary.uploader.upload(file, {
      resource_type: "auto", // Automatically detects the type (image/video)
      folder: path, // Store in the specified folder on Cloudinary
      public_id: "product_images",
      quality_analysis: true,
    });
    cloudinary.url("product_images", {
      transformation: [
        { width: 1000, crop: "scale" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    // Return the necessary values
    return { secure_url, public_id };
  } catch (err) {
    console.error("Cloudinary error:", err.message);
    throw new Error(err.message); // Rethrow the error to handle it later
  }
};
