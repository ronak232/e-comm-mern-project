import { FaWindowClose } from "react-icons/fa";
import banner from "../Images/banner-upload.png";
import browseImages from "../Images/browse-icon.svg";
import { useModal } from "../hooks/context/useModal";

export const UploadFilesPopup = (props) => {
  const { isModalOpen, closeModal, modalRef, modalTop } = useModal(); // Access modal state and close function

  if (!isModalOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-full upload_image z-[1000]">
      <div className="flex content-center justify-center items-center w-full rounded-md">
        <div
          className="relative flex flex-col items-center min-h-[100px] md:min-w-[450px] min-w-[100%] bg-white p-2 rounded-md"
          ref={modalRef}
          style={{ top: modalTop }}
        >
          <button
            className="bg-transparent absolute right-0 text-xl"
            onClick={closeModal}
          >
            <FaWindowClose />
          </button>
          <img
            className="banner-img max-h-[220px] w-full rounded-md"
            src={banner}
            alt=""
          />

          <div className="flex flex-col items-center justify-center gap-2 text-[16px] text-md bg-white p-2 w-full h-[140px]">
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
              <input
                type="file"
                id="file"
                className="hidden"
                onChange={props.handleSelectFile}
                name="product_images "
                multiple
                title="Upload Image"
              />
              <div
                className="browse_btn max-w-[80px] p-2 rounded-md"
                type="submit"
              >
                Browse
              </div>
            </label>

            <p className="text-[12px] text-gray-950">
              To upload images click upload image buttom
            </p>
            {props.loading && (
              <div className="h-full w-full rounded-md">
                <p className="text-black text-center">Uploading...</p>
                <h1 className="text-black text-md">{props.progress?.prog}</h1>
                <progress
                  className="text-blue-500 w-full h-2 bg-gray-300"
                  max="100"
                  value={props.progress?.prog}
                ></progress>
              </div>
            )}
            <button
              onClick={props.handleUpload}
              className="upload_image_btn p-2 rounded-md text-white text-[14px]"
            >
              Upload Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
