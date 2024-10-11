import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadingImage from "../../Images/uploadImage.svg";

function App() {
  const [imageFile, setImageFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState({});
  const { id } = useParams();

  let options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    hour12: true,
  };

  let prnDt = new Date().toLocaleDateString("en-us", options);
  let currDate = prnDt.split(",").join("") || undefined;

  const user = {
    productId: id,
    userId: getAuth().currentUser?.uid || null,
    userName: getAuth().currentUser?.displayName,
    createdAt: currDate,
  };

  const handleSelectFile = (e) => {
    const selectedImages = e.target.files; // Access the selected files
    console.log("Selected Images - ", selectedImages);
    let uploadedFiles = []; // To store the base64 previews
    let actualFiles = []; // Copy the current imageFile state (if it's already populated)

    if (selectedImages.length > 0) {
      for (let i = 0; i < selectedImages.length; i++) {
        const reader = new FileReader();
        // On file load, store the base64 preview and actual file
        reader.onload = () => {
          uploadedFiles.push(reader.result); // for- base64 image preview

          // After all files are processed, update the state
          if (uploadedFiles.length === selectedImages.length) {
            setImageFile({
              previews: [...(imageFile?.previews || []), ...uploadedFiles], // Append previews
              files: [...actualFiles, ...selectedImages], // Append actual files for upload
            });
          }
        };

        reader.readAsDataURL(selectedImages[i]); // Read file as a data URL
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    setLoading(true);
    const data = new FormData();
    data.append("userId", user.userId);
    data.append("pId", user.productId);
    data.append("user-name", user.userName);

    // Loop through the stored files and append them to the FormData
    imageFile.files.forEach((file) => {
      data.append("product_images", file); // Append each file object
    });

    await axios
      .post(`/api/images/upload`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        console.log(resp?.data);
        setLoading(false);
        setRes(res.data);
        setImageFile({ previews: [], files: [] });
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <>
      <div className="flex items-center p-2 absolute top-10 right-0">
        <input
          type="file"
          id="file"
          className="hidden"
          onChange={handleSelectFile}
          name="product_images"
          multiple
          title="Upload Image"
        />

        <label htmlFor="file" className="cursor-pointer" title="upload image">
          <FaCloudUploadAlt className="text-xl text-green-400" />
        </label>
      </div>

      <div className="flex flex-col w-full">
        {imageFile && (
          <div className="mt-2">
            {[...Array.from(imageFile)].map((item) => {
              console.log(item);
              return (
                <img
                  src={item.productImage_url}
                  alt="Uploaded_preview"
                  className="max-w-full"
                  id="image-preview"
                />
              );
            })}
          </div>
        )}

        {/* Popup on select images... */}
        <div className="mt-4">
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {loading ? (
              <img src={uploadingImage} alt="loading" />
            ) : (
              "upload to cloudinary"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
export default App;
