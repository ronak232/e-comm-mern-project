import { useParams } from "react-router-dom";
import {
  updateData,
  useFetchData,
  useUpdateData,
} from "../../utils/blogpostControl";
import SkeletonCard from "../SkeletonCard";
import { formatDateToLocal } from "../../utils/formatDate";
import { BlogComments } from "./BlogComments";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { useMutation, useQueryClient } from "react-query";
import { IoMdSave } from "react-icons/io";
import { io } from "socket.io-client";
import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdTranslate } from "react-icons/md";
const baseURL = process.env.REACT_APP_BASE_URL;
const socketInstance = io(`${baseURL}` || "http://localhost:8000");

function Blogpost() {
  const { slug } = useParams();

  const [translated, setTranslatedText] = useState({});

  const [showHide, setShowHide] = useState(false);

  const {
    data: blogData,
    isLoading,
    isError,
  } = useFetchData(`${baseURL}/api/blog/${slug}`, "postId");

  const { mutate: likeComment } = useUpdateData("postId");

  const queryClient = useQueryClient();

  const { mutate: savedPost } = useMutation({
    mutationFn: (postId) => {
      return updateData(`${baseURL}/api/blog/post/save`, { postId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postId"] });
    },
  });
  const handleSavePost = (postId) => {
    savedPost({ postId });
  };

  const handleLike = (postId) => {
    likeComment({
      url: `${baseURL}/api/blog/post/like/${postId}`,
      data: { reaction: "like" },
    });
  };
  const handleDislike = (postId) => {
    likeComment({
      url: `${baseURL}/api/blog/post/like/${postId}`,
      data: { reaction: "dislike" },
    });
  };

  const handleShowTranslation = () => {
    setShowHide(!showHide);
  };

  const showLanguageDropdow = () => {
    setShowHide(!showHide);
  };

  const { postTitle, blogContent } = blogData?.post?.[0] || {};

  const handleTextTranslation = (e) => {
    const selectedLang = e.target.value;

    socketInstance.emit("text_translation", {
      translate_lang: selectedLang,
      content: blogContent,
      postTitle: postTitle,
    });
    socketInstance.on("translate_text_response", ({ translatedText }) => {
      setTranslatedText(translatedText);
    });
  };

  return (
    <div className="userblog_singlepost">
      {!isLoading ? (
        <>
          <section className="userblog_singlepost-blogcontent md:container bg-inherit">
            {blogData?.post?.map((item) => {
              return (
                <>
                  <h1>{item.postTitle}</h1>
                  <div
                    className="flex flex-col gap-6"
                    dangerouslySetInnerHTML={{
                      __html: item?.blogContent?.replace(/\\(["\\])/g, "$1"),
                    }}
                  ></div>
                  <div className="flex gap-2 items-center">
                    <span className="text-slate-400 text-[12px]">
                      by {item.userName}
                    </span>
                    <span className="p-1 text-slate-400 text-[12px]">
                      {formatDateToLocal(item.timestamp)}
                    </span>
                    <button
                      className="bg-transparent text-base p-0"
                      onClick={() => handleLike(item._id)}
                    >
                      <BiSolidLike />
                    </button>
                    <span>{item.likes}</span>
                    <button
                      className="bg-transparent text-base p-0"
                      onClick={() => handleDislike(item._id)}
                    >
                      <BiSolidDislike />
                    </button>
                    <span className="">{item.dislikes}</span>
                    <button
                      className="bg-transparent p-0 flex items-center"
                      type="button"
                      onClick={() => handleSavePost(item._id)}
                    >
                      <IoMdSave className="text-lg" />
                      <span className="text-[12px] p-1">Save Post</span>
                    </button>
                    <div className="text-black flex items-center gap-2">
                      <button
                        className="bg-transparent p-0 text-[18px]"
                        onClick={showLanguageDropdow}
                        title="Translate"
                      >
                        <MdTranslate />
                      </button>
                      <select
                        className="focus:none outline-none rounded-md text-[12px]"
                        onChange={handleTextTranslation}
                      >
                        <option className="font-semibold font-mono" value="eng">
                          English
                        </option>
                        <option className="font-semibold font-mono" value="fr">
                          French
                        </option>
                        <option className="font-semibold font-mono" value="de">
                          German
                        </option>
                        <option className="font-semibold font-mono" value="es">
                          Spanish
                        </option>
                        <option className="font-semibold font-mono" value="hi">
                          Hindi
                        </option>
                      </select>
                    </div>
                  </div>
                  {translated.length > 0 && (
                    <>
                      <div
                        className={`border-[1px] rounded-md mt-2 relative blog_translation ${
                          !showHide ? "show" : ""
                        }`}
                      >
                        <button onClick={handleShowTranslation}>
                          <IoIosCloseCircleOutline />
                        </button>
                        <h2 className="text-inherit text-[28px] p-2">
                          Translation
                        </h2>
                        <div
                          className="flex flex-col gap-6 p-2"
                          dangerouslySetInnerHTML={{
                            __html: translated,
                          }}
                        ></div>
                      </div>
                    </>
                  )}
                  <div className="pt-4">
                    <BlogComments postId={item?._id} />
                  </div>
                </>
              );
            })}
          </section>
        </>
      ) : (
        <SkeletonCard
          layout={[
            {
              type: "card",
              style: {
                height: "280px",
                borderRadius: "10px",
                width: "100%",
              },
            },
            {
              type: "username",
              style: { width: "50%", height: "15px", marginTop: "10px" },
            },
            {
              type: "comment",
              style: { width: "70%", height: "20px", marginTop: "5px" },
            },
          ]}
        />
      )}
      {isError && <p>Something wrong..</p>}
    </div>
  );
}

export default Blogpost;
