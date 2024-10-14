import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadingImage from "../../Images/uploadImage.svg";

function App() {
  const [imageFile, setImageFile] = useState(null);
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
  console.log(user);

  const handleSelectFile = (e) => {
    const selectedImages = e.target.files; // Access the selected files
    console.log("Selected Images - ", selectedImages);
    let uploadedFiles = []; // To store the base64 previews
    let actualFiles = []; // To store actual file objects

    if (selectedImages.length > 0) {
      for (let i = 0; i < selectedImages.length; i++) {
        const reader = new FileReader();
        // On file load, store the base64 preview
        reader.onload = () => {
          uploadedFiles.push(reader.result); // Store base64 for preview
          console.log("Preview image base64: ", reader.result);

          // After all files are processed, update the state
          if (uploadedFiles.length === selectedImages.length) {
            setImageFile((prevImages) => {
              return {
                ...prevImages,
                previews: uploadedFiles, // Store base64 for display
                files: actualFiles, // Store actual file objects for upload
              };
            });
          }
        };

        reader.readAsDataURL(selectedImages[i]); // Read file as base64
        actualFiles.push(selectedImages[i]); // Store actual file object
      }
    }
    console.log(actualFiles);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    setLoading(true);

    const data = new FormData();
    data.append("pId", user.productId);
    data.append("user-name", user.userName);
    data.append("userId", user.userId);
    // Loop through the stored files and append them to the FormData

    // Check if there are actual files to upload
    if (!imageFile.files || imageFile.files.length === 0) {
      console.log("No file selected");
      setLoading(false);
      return;
    }

    // Append each file object from imageFile.files to FormData
    imageFile.files.forEach((file) => {
      data.append("product_images", file); // Append actual file object
    });

    console.log("Imagess....", imageFile);

    await axios
      .post(`/api/images/upload`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setLoading();
        },
      })
      .then((resp) => {
        console.log(resp.data.secure_url);
        setLoading(false);
        setImageFile({
          img: resp.data.secure_url,
          img_id: resp.data.public_id,
        });
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
            {imageFile?.secure_url?.map((item) => {
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
            className="text-white px-4 py-2 rounded"
          >
            {loading ? (
              <div className="h-full w-full">
                <img className="w-10 h-10" src={uploadingImage} alt="loading" />
              </div>
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
