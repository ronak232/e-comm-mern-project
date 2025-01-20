import axios from "axios";
import { getAuth } from "firebase/auth";

/**
 * Uploads an image to Cloudinary.
 * @param {string} url - The Cloudinary API endpoint.
 * @param {string} uploadPreset - The upload preset for your Cloudinary account.
 * @param {File} file - The image file to upload.
 * @param {object} config - Optional Axios configuration.
 * @returns {Promise<string>} The secure URL of the uploaded image.
 */

export const uploadToCloudinary = async (url, imageFile, config = {}) => {
  try {
    const tokenId = getAuth().currentUser?.getIdToken(true);

    const imageUrlData = new FormData();
    imageUrlData.append("file", imageFile);
    imageUrlData.append("upload_preset", "my_images_preset");

    const resp = await axios.post(url, imageUrlData, {
      headers: `Bearer ${tokenId}`, 
      ...config,
    });
    console.log("image_url", resp.data.secure_url)
    return resp.data.secure_url;
  } catch (error) {
    if (error.response) {
      // Server-side error
      throw new Error(
        `Cloudinary Error: ${error.response.status} - ${error.response.data.error.message}`
      );
    } else if (error.message) {
      // Client-side error
      throw new Error(`Upload Error: ${error.message}`);
    } else {
      throw new Error("An unexpected error occurred during upload");
    }
  }
};
