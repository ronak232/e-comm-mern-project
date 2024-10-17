import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useQuery } from "react-query";
import { UploadFilesPopup } from "../../Components/UploadFilesPopup";

function ImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
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

  // react-query fetch request
  const fetchUploadedImages = async () => {
    const resp = await axios.get(`/api/images/fetchimages/${user.productId}`);
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
    data.append("userNname", user.userName);
    data.append("userId", user.userId);
    data.append("postDate", currDate);
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
        onUploadProgress: (progressEvent) => {
          setLoading(progressEvent * 100);
        },
      })
      .then((resp) => {
        console.log(resp.data);
        setLoading(false);
        setImageFile({
          img: resp.data.secure_url,
          img_id: resp.data.public_id,
        });
        setImageFile({ previews: [], files: [] });
        console.log(imageFile);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <>
      <div className="w-full flex flex-col ">
        {resp?.map((item) => {
          return (
            <div
              className="flex flex-col h-[160px] max-h-[100%] min-h-[160px] img_silder"
              key={item._id}
            >
              {
                <div className="flex overflow-x-scroll w-full pt-2 pb-2 gap-3 border-2 border-cyan-600">
                  {item.product_images?.map((item) => {
                    return (
                      <img
                        className="w-full"
                        src={item.secure_url}
                        alt="uploaded_imgs"
                        key={item.img_id}
                      />
                    );
                  })}
                </div>
              }
            </div>
          );
        })}
        {/* Popup on select images... */}
        <UploadFilesPopup
          handleSelectFile={handleSelectFile}
          handleUpload={handleUpload}
        />
      </div>

      {/* <div className=" flex justify-center items-center w-full h-full upload_image z-[1000] p-3">
        <div className="flex content-center justify-center items-center w-full">
          <div className="relative flex flex-col items-center gap-2 rounded-md min-h-[100px] md:min-w-[450px] min-w-[100%] bg-white p-3">
            <button className="bg-transparent absolute right-0 text-xl">
              <FaWindowClose />
            </button>
            <img
              className="banner-img max-h-[220px] w-full"
              src={banner}
              alt=""
            />

            <div className="flex flex-col items-center justify-center gap-2 text-[16px] text-md bg-cyan-400 rounded-md p-2 w-full h-[140px]">
              <input
                type="file"
                id="file"
                className="hidden"
                onChange={handleSelectFile}
                name="product_images "
                multiple
                title="Upload Image"
              />

              <label
                htmlFor="file"
                className="text-[16px] text-sm text-black rounded-md p-1 w-full h-full cursor-pointer flex flex-col justify-center items-center gap-3"
                title="upload image"
              >
                <img
                  className="max-w-[40px] max-h-[40px]"
                  src={browseImages}
                  alt=""
                />
                Click here to upload image/video
                <button className="bg-white max-w-[80px]">Browse</button>
              </label>
            </div>

            <p className="text-[12px] text-gray-950">
              To upload images click upload image buttom
            </p>
            {!loading ? (
              <div className="h-full w-full">
                <img
                  className="max-w-12 max-h-12"
                  src={uploadingImage}
                  alt="loading"
                />
              </div>
            ) : null}
            <button
              onClick={handleUpload}
              className="text-white px-4 py-2 rounded text-[12px]"
            >
              Upload Image
            </button>
          </div>
        </div>
      </div> */}
    </>
  );
}
export default ImageUpload;
