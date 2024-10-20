import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useQuery } from "react-query";
import { UploadFilesPopup } from "../../Components/UploadFilesPopup";
import { generativeAIContent } from "../../utils/GeminiAPI/genAI";

function ImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ prog: 0 });
  const { id } = useParams();
  const baseURL = process.env.REACT_APP_BASE_URL;

  console.log(
    generativeAIContent()
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err.message);
      })
  );

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
    let uploadedFiles = []; // To store the base64 previews
    let actualFiles = []; // To store actual file objects

    if (selectedImages.length > 0) {
      for (let i = 0; i < selectedImages.length; i++) {
        const reader = new FileReader();
        // On file load, store the base64 preview
        reader.onload = () => {
          uploadedFiles.push(reader.result); // Store base64 for preview

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
  };

  // react-query fetch request
  const fetchUploadedImages = async () => {
    const resp = await axios.get(
      `${baseURL}/api/images/fetchimages/images=${user.productId}`
    );
    return resp.data.data;
  };

  // react-query
  const { data: resp, isLoading } = useQuery(
    "uploadedImages",
    fetchUploadedImages
  );

  const handleUpload = async (e) => {
    e.preventDefault();

    setLoading(true);

    const data = new FormData();
    data.append("productId", user.productId);
    data.append("userName", user.userName);
    data.append("userId", user.userId);
    data.append("postDate", currDate);
    // Loop through the stored files and append them to the FormData

    // Check if there are actual files to upload
    if (!imageFile.files || imageFile.files.length === 0) {
      setLoading(false);
      return;
    }

    // Append each file object from imageFile.files to FormData
    imageFile.files.forEach((file) => {
      data.append("product_images", file); // Append actual file object
    });

    await axios
      .post(`${baseURL}/api/images/upload`, data, {
        onUploadProgress: (progressEvent) => {
          setProgress((progressState) => {
            if (!loading) {
              return { ...progressState, prog: progressEvent.progress * 100 }; // keep track whenever component rerender upon file uploading
            }
          });
        },
      })
      .then((resp) => {
        setImageFile({
          img: resp.data.secure_url,
          img_id: resp.data.public_id,
        });
        setLoading(false);
        setImageFile({ previews: [], files: [] });
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <>
      {/* {resp?.length > 0 && ( */}
      <div className="block w-full max-w-[430px]">
        <div className="w-full flex gap-2 p-3 overflow-x-scroll">
          {/* flatMap helps combine all images into a single, continuous list so that they can be rendered in one container */}
          {!isLoading &&
            resp?.flatMap(({ product_images, userName }) => {
              return product_images?.map((item) => {
                return (
                  <div
                    className="flex relative cursor-pointer h-full user_images"
                    key={item._id}
                  >
                    <span className="overlay w-full h-full max-w-[140px] max-h-[130px] text-[12px]">
                      {userName}
                    </span>
                    <span
                      className="w-full images-by-user"
                      key={item.img_id}
                      style={{ backgroundImage: `url(${item.secure_url})` }}
                    ></span>
                  </div>
                );
              });
            })}

          {/* Popup on select images... */}
          <UploadFilesPopup
            handleSelectFile={handleSelectFile}
            handleUpload={handleUpload}
            loading={loading}
            progress={progress}
          />
        </div>
      </div>
      {/* )} */}
    </>
  );
}
export default ImageUpload;
