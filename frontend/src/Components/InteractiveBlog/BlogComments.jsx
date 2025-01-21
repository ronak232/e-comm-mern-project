import { useState } from "react";
import {
  useDeleteData,
  useFetchData,
  usePostData,
} from "../../utils/blogpostControl";
import { formatDateToLocal } from "../../utils/formatDate";
import { useFirebaseAuth } from "../../hooks/firebase/firebase..config";
import { MdDelete } from "react-icons/md";

export const BlogComments = ({ postId }) => {
  const [blogComments, setBlogComments] = useState("");
  const { isUserLoggedIn } = useFirebaseAuth();

  const { data } = useFetchData(`/api/blog/comment/${postId}`, postId);

  const {
    mutate: addComment,
    isLoading,
    isError,
  } = usePostData(`/api/blog/comment/post/${postId}`, {
    userComment: blogComments,
    post: postId,
  });

  const { mutate: deleteComment } = useDeleteData();

  const handleDeleteComment = (id) => { 
    deleteComment({ url: `/api/blog/comment/delete/${id}`, id });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading && !isError) {
      addComment({
        userComment: blogComments,
        postId,
      });
    }
    setBlogComments("");
  };

  return (
    <div className="blog-comments">
      <p className="text-inherit">Comments</p>
      {isUserLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <textarea
            type="text"
            className="h-auto w-full border-2 text-black"
            onChange={(e) => setBlogComments(e.target.value)}
            value={blogComments}
          />
          <button type="submit">Post</button>
        </form>
      ) : (
        <div>
          <p>Please Sign to add comment</p>
          <button>
            <a href="/login">Sign in</a>
          </button>
        </div>
      )}
      {data?.userComments?.map((item) => {
        return (
          <div className="pt-4" key={item._id}>
            <div className="blog-comments-box">
              <div className="relative">
                <span>{item.user.userName}</span>

                <span className="p-2 text-[12px]">
                  {formatDateToLocal(item.createdAt)}
                </span>

                <button
                  className="absolute right-0 bg-transparent p-0 text-lg"
                  onClick={() => handleDeleteComment(item?._id)}
                >
                  <MdDelete />
                </button>
              </div>
              <p>{item.userComment}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
