import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useQuery } from "react-query";
import { BiDislike, BiLike } from "react-icons/bi";
import { UploadFilesPopup } from "../../Components/UploadFilesPopup";

function ImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ prog: 0 });
  const [likes, setLikes] = useState(0);
  const [disLikes, setDisLikes] = useState(null);
  const { id } = useParams();
  const baseURL = process.env.REACT_APP_BASE_URL;

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

  const handleLikeImage = async (id) => {
    setLikes((prevLikes) => prevLikes + likes);
    await axios
      .post(`${baseURL}/api/images/upload/${id}/likes/post`, { imageId: id })
      .then((resp) => {
        if (resp.data && resp.data.success) {
          // Backend confirmed the like, update with the accurate count
          setLikes(resp.data.data);
        } else {
          throw new Error("Failed to confirm like with backend");
        }
      })
      .catch((err) => {
        console.error(err.message);
        setLikes((prevLikes) => prevLikes - 1);
      });
  };

  const handleDisLikeImage = async (id) => {
    setDisLikes(disLikes - 1);
    await axios
      .post(`${baseURL}/api/images/upload/${id}/dislikes/post`, { imageId: id })
      .then((res) => {
        return res.data.data;
      })
      .catch((err) => {
        console.error(err);
        setDisLikes(disLikes + 1);
      });
  };

  return (
    <>
      <div className="block w-full max-w-[430px]">
        <div className="w-full flex gap-2 overflow-x-scroll overflow-y-hidden">
          {/* flatMap helps combine all images into a single, continuous list so that they can be rendered in one container */}
          {!isLoading &&
            resp?.flatMap(({ product_images, userName }) => {
              return product_images?.map((item) => {
                return (
                  <div
                    className="flex flex-col relative cursor-pointer h-full user_uploaded gap-2"
                    key={item._id}
                  >
                    <span className="overlay w-full h-full max-w-[140px] max-h-[130px] text-[12px]">
                      {userName}
                    </span>
                    <img
                      className="w-full images-by-user"
                      key={item.img_id}
                      src={item.secure_url}
                      alt="images-by-user"
                    />
                    <div className="border-t-[1px] border-neutral-400">
                      <div className="flex justify-start gap-2 pt-1 ">
                        <button
                          className="bg-transparent p-0 text-neutral-400 text-[10px]"
                          onClick={() => handleLikeImage(item._id)}
                        >
                          <BiLike className="pb-1 text-neutral-400 text-lg" />
                          {item.likes}
                        </button>
                        <button
                          className="bg-transparent p-0 text-neutral-400 text-[10px]"
                          onClick={() => handleDisLikeImage(item._id)}
                        >
                          <BiDislike className="pb-1 text-neutral-400 text-lg" />
                          {item.dislikes}
                        </button>
                      </div>
                    </div>
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
    </>
  );
}
export default ImageUpload;
