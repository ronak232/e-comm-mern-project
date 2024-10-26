import { v2 as cloudinary } from "cloudinary";

// upload to cloudnary
export const handleUploadToCloudinary = async (file, path) => {
  try {
    const { secure_url, public_id } = await cloudinary.uploader.upload(file, {
      resource_type: "auto", // Automatically detects the type (image/video)
      folder: path, // Store in the specified folder on Cloudinary
      quality_analysis: true,
      transformation: [
        { width: 800, height: 600, crop: "fill" }, // Resize and crop to desired dimensions
        { quality: "auto" }, // Automatically optimize quality
      ],
    });

    // Return the necessary values
    return { secure_url, public_id };
  } catch (err) {
    console.error("Cloudinary error:", err.message);
    throw new Error(err.message); // Rethrow the error to handle it later
  }
};
