import { useParams } from "react-router-dom";
import {
  updateData,
  useFetchData,
  useUpdateData,
} from "../../utils/blogpostControl";
import { useEffect, useState } from "react";
import SkeletonCard from "../SkeletonCard";
import { formatDateToLocal } from "../../utils/formatDate";
import { BlogComments } from "./BlogComments";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { useMutation, useQueryClient } from "react-query";
import { IoMdSave } from "react-icons/io";
const baseURL = process.env.REACT_APP_BASE_URL;

function Blogpost() {
  const { slug } = useParams();

  const [blogData, setBlogData] = useState(null);

  const { data, isLoading, isError } = useFetchData(`/api/blog/${slug}`, "postId");

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

  useEffect(() => {
    let timerId = 800;
    setTimeout(() => {
      setBlogData(data);
    }, timerId);
    return () => clearTimeout(timerId);
  }, [blogData, data]);

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
                    <span className="text-slate-400 text-[12px] pt-1">
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
                      <IoMdSave className="text-lg"/>
                      <span className="text-[12px] p-1">Save Post</span>
                    </button>
                  </div>
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
