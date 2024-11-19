import axios from "axios";
import { useModal } from "../../hooks/context/useModal";
import { useRef, useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { MdClearAll } from "react-icons/md";

function CommentGeneration() {
  const [aiComment, setAIComment] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const { isModalOpen, closeModal } = useModal();
  const [loading, setLoading] = useState(null);
  const { id } = useParams();
  const copyRef = useRef(null);
  const baseURL = process.env.REACT_APP_BASE_URL;

  const handleCopyToClipBoard = () => {
    if (copyRef) {
      navigator.clipboard
        .writeText(copyRef.current.value)
        .then((resp) => {
          return resp;
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  };

  const handleGenerativeMessage = async () => {
    setLoading(true);
    await axios
      .patch(`${baseURL}/api/comment/product_review/post/genAI`, {
        id,
        genText: userPrompt,
        isAIGenerated: true,
      })
      .then((response) => {
        setAIComment(response.data?.genComment);
        setLoading(false);
        setUserPrompt("");
      })
      .catch((err) => {
        console.error("Some error ", err.message);
      });
  };

  const handleGenComment = (e) => {
    setUserPrompt(e.target.value);
  };

  const handleResponseClear = () => {
    setAIComment("");
  };

  if (!isModalOpen) return null;

  return (
    <div className="comments-container">
      {/* Popup for AI suggestions */}
      {isModalOpen && (
        <div className="popup relative">
          <button
            className="bg-transparent absolute p-0 text-black text-sm right-0 close-modal"
            onClick={closeModal}
          >
            X
          </button>
          {loading && (
            <div className="loader-container">
              <span className="ai-content-loader"></span>
            </div>
          )}
          <textarea
            className="w-full text-black "
            name="generated-comment"
            cols={7}
            value={aiComment}
            ref={copyRef}
            onChange={(e) => setAIComment(e.target.value)}
          ></textarea>
        </div>
      )}
      {isModalOpen && (
        <div className="flex flex-col gap-1">
          <textarea
            className="text-black w-full rounded-md border-[1px] border-gray-300 border-solid"
            value={userPrompt}
            onChange={handleGenComment}
            placeholder="Tell me 😊..."
          />
          <div className="flex gap-3">
            <button
              className="bg-slate-200 w-full text-[0.7rem]"
              onClick={handleGenerativeMessage}
              type="button"
            >
              Generate Comment
            </button>

            <button
              type="button"
              className="w-[10%] bg-transparent border-[1px] border-gray-300 border-solid"
              onClick={handleCopyToClipBoard}
            >
              <FaRegCopy />
            </button>
            <button
              className="w-[10%] bg-transparent border-[1px] border-gray-300 border-solid"
              type="button"
              onClick={handleResponseClear}
            >
              <MdClearAll />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentGeneration;
