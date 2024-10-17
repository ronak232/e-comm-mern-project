import { FaWindowClose } from "react-icons/fa";
import uploadingImage from "../Images/uploadLoading.svg";
import banner from "../Images/banner-upload.svg";
import browseImages from "../Images/browse-icon.svg";
import { useState } from "react";
import { useModal } from "../hooks/context/useModal";

export const UploadFilesPopup = (props) => {
  const [loading, setLoading] = useState(true);

  const { isModalOpen, closeModal } = useModal(); // Access modal state and close function

  if (!isModalOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-full upload_image z-[1000] p-3">
      <div className="flex content-center justify-center items-center w-full">
        <div className="relative flex flex-col items-center gap-2 rounded-md min-h-[100px] md:min-w-[450px] min-w-[100%] bg-white p-3">
          <button
            className="bg-transparent absolute right-0 text-xl"
            onClick={closeModal}
          >
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
              onChange={props.handleSelectFile}
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
              <span className="bg-white max-w-[80px] p-2 rounded-md font-semibold text-blue-800">
                Browse
              </span>
            </label>
          </div>

          <p className="text-[12px] text-gray-950">
            To upload images click upload image buttom
          </p>
          {/* {loading ? (
            <div className="h-full w-full">
              <img
                className="max-w-12 max-h-12"
                src={uploadingImage}
                alt="loading"
              />
            </div>
          ) : null} */}
          <button
            onClick={props.handleUpload}
            className="bg-black p-2 rounded-md font-medium text-white text-[14px]"
          >
            Upload Image
          </button>
        </div>
      </div>
    </div>
  );
};
