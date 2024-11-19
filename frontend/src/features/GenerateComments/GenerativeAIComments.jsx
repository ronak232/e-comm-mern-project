import { useModal } from "../../hooks/context/useModal";

const GenerativeComment = () => {
  const { openModal } = useModal();

  return (
    <div>
      <div className="animation">
        <span className="star" id="star1"></span>
        <span className="star" id="star2"></span>
        <span className="star" id="star3"></span>
        <span className="star" id="star4"></span>
        <span className="star" id="star5"></span>
        <button
          className="bg-transparent p-0 flex items-center gap-1"
          title="Ask AI"
          onClick={() => openModal("genAIComment")}
          type="button"
        >
          <span className="ask-ai"></span>
          <span className="text-[12px]">Ask AI</span>
        </button>
      </div>
    </div>
  );
};

export default GenerativeComment;
