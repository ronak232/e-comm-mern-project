import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getAuth } from "firebase/auth";
import { useFetchBlogAPI } from "../hooks/context/AiContext/AiContentGenerator";
import { useFirebaseAuth } from "../hooks/firebase/firebase..config";
import loader from "../Images/ai-loader.gif";
import { handleCopyToClipBoard } from "../utils/clipToCopy";

const socketInstance = io(`${ process.env.REACT_APP_BASE_URL}`);

function AiBlogGenerator() {
  const [userInput, setUserInput] = useState("");
  const [userPrompts, setUserPrompts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(null);
  const { isUserLoggedIn } = useFirebaseAuth();
  const scrollRef = useRef(null);
  const copyRef = useRef(null);

  const user = {
    userId: getAuth().currentUser?.uid,
    userName: getAuth().currentUser?.displayName,
  };

  const { chats, isLoading, isFetching } = useFetchBlogAPI(user.userId);

  const handleSubmitUserPrompt = (e) => {
    setIsGenerating(true);
    e.preventDefault();
    if (!userInput) return;
    const userPayload = {
      prompt: userInput,
      userName: user.userName,
      userId: user.userId,
    };

    setUserPrompts((prompts) => [
      ...prompts,
      { message: userInput, isAiGenerated: false },
    ]);
    socketInstance.emit("prompt-message", userPayload);
    setUserInput("");
  };

  useEffect(() => {
    function getAIContent() {
      setIsGenerating(true);
      socketInstance.on("blog-progress", ({ content, isAiGenerated }) => {
        setUserPrompts((prev) => {
          const lastPrompt = prev[prev.length - 1]; // Get the last item

          // If the last item is AI-generated, update its content
          if (lastPrompt && lastPrompt.isAiGenerated) {
            lastPrompt.message = content;
            return [...prev];
          }

          // Otherwise, add a new AI-generated message
          return [...prev, { message: content, isAiGenerated }];
        });
      });

      socketInstance.on("error", () => {
        setIsGenerating(false);
        console.error("Error in generating blog content.");
      });

      setIsGenerating(false);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    getAIContent();
    return () => {
      socketInstance.off("blog-progress");
      socketInstance.off("error");
      socketInstance.off("blog-complete");
    };
  }, [chats, userPrompts, userInput]);

  return (
    <div className="ai-dashboard-container justify-between relative">
      {isUserLoggedIn && !isLoading && !isFetching ? (
        <div className="ai-dashboard">
          {chats && chats.history.length > 0 ? (
            chats?.history?.map(({ chats }) => {
              return chats?.map((item) => {
                const { title, introduction, body, conclusion } = JSON.parse(
                  item?.aiGeneratedBlog
                );
                return (
                  <div
                    className="flex flex-col gap-2 relative rounded"
                    key={item._id}
                  >
                    <div className="prompt user text-right">
                      {item.userPrompt}
                    </div>
                    <div
                      className="relative flex flex-col gap-1 p-2 copy-text-container"
                      ref={copyRef}
                    >
                      <div className="copy-clipboard">
                        <button
                          className="copy-btn"
                          onClick={() => handleCopyToClipBoard(copyRef)}
                        >
                          Copy
                        </button>
                      </div>
                      <div className="generated-content prompt ai text-left">
                        <h2 className="pb-2">{title}</h2>
                        <p>{body}</p>
                        <p>{introduction}</p>
                        <h2>Conclusion</h2>
                        <p>{conclusion}</p>
                      </div>
                    </div>
                  </div>
                );
              });
            })
          ) : (
            <p>Ask anything to write...</p>
          )}
          {/* <div className="ai-dashboard-chats" ref={scrollRef}>
            {userPrompts?.length > 0 &&
              userPrompts.map((mssg, index) => {
                const { title, body, conclusion } = mssg.message || {};
                return (
                  <div
                    key={index}
                    className={mssg.isAiGenerated ? "ai" : "user"}
                  >
                    {mssg.isAiGenerated && typeof mssg.message === "object" ? (
                      <div
                        className="generated-content prompt ai text-left"
                        ref={copyRef}
                      >
                        <div className="copy-clipboard">
                          <button
                            className="copy-btn"
                            onClick={() => handleCopyToClipBoard(copyRef)}
                          >
                            Copy
                          </button>
                        </div>
                        <h2 className="pb-2">{title}</h2>
                        <ReactMarkdown>
                          {body.replace(/[^a-zA-Z0-9 ]/g, "")}
                        </ReactMarkdown>
                        <h2>Conclusion</h2>
                        <p>{conclusion}</p>
                      </div>
                    ) : (
                      <p className="prompt user text-right">
                        <ReactMarkdown>{mssg.message}</ReactMarkdown>
                      </p>
                    )}
                  </div>
                );
              })}
          </div> */}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px] w-full loader">
          <img src={loader} alt="" />
        </div>
      )}
      <form
        className="w-full flex gap-1 items-center "
        onSubmit={handleSubmitUserPrompt}
      >
        <input
          className="text-black"
          placeholder="Enter your prompt here..."
          value={userInput}
          type="text"
          onChange={(e) => setUserInput(e.target.value)}
        />

        {!isGenerating ? (
          <button
            className="generating-btn rounded-[50%] bg-transparent"
            type="submit"
            disabled={!userInput}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="icon-2xl"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
        ) : (
          <button className="rounded-lg">Stop generating</button>
        )}
      </form>
    </div>
  );
}

export default AiBlogGenerator;
