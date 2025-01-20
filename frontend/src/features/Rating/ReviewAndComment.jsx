import { useEffect, useRef, useState } from "react";
import { useFirebaseAuth } from "../../hooks/firebase/firebase..config";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { BiEdit } from "react-icons/bi";
import { GrDislike, GrLike } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import SkeletonCard from "../../Components/SkeletonCard";
import ImageUpload from "./ImageUpload";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useModal } from "../../hooks/context/useModal";
import InteractiveRating from "./InteractiveRating";
import ShowStarRating from "./ShowStarRating";
import GenerativeComment from "../GenerateComments/GenerativeAIComments";
import CommentGeneration from "../GenerateComments/CommentGenerationModal";
const baseURL = process.env.REACT_APP_BASE_URL;

export default function ReviewAndComment() {
  const [userComment, setUserComment] = useState("");
  const [getUserComments, setGetComments] = useState([]);
  const [isEditingComment, setIsEditComment] = useState(null);
  const [isError, setError] = useState(null); // handle for server error
  const [inputError, setInputError] = useState(null); // handle for input field
  const [loader, setLoader] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPagination, setShowPagination] = useState(false);
  const [totalPages, setTotalPages] = useState(null);
  const [updateUI, setUpdateUI] = useState(false); // track ui changes
  const { isUserLoggedIn } = useFirebaseAuth();
  const { id } = useParams();
  const ref = useRef(null);
  const { openModal, modalForType } = useModal();

  const [isTabSwitched, setIsTabSwitched] = useState("tab1");
  const handleRatingTab = (index) => {
    setIsTabSwitched(index);
  };

  let options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    hour12: true,
  };

  let prnDt = new Date().toLocaleDateString("en-us", options);
  let currDate = prnDt.split(",").join("") || undefined;

  //Commnet value and User info from firebase auth
  const user = {
    commentText: userComment,
    productId: id,
    userId: getAuth().currentUser?.uid || null,
    userName: getAuth().currentUser?.displayName,
    createdAt: currDate,
  };

  const autoresize = () => {
    if (!ref.current) {
      return;
    }
    ref.current.style.height = "auto";
    ref.current.style.height = `${Math.max(ref.current.scrollHeight)}px`;
  };

  // check the authentication prior to add comment
  // post
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (userComment === "") {
      setInputError(true);
      setTimeout(() => {
        setInputError(false);
      }, 2500);
      return;
    }
    setLoader(true);
    await axios
      .post(`${baseURL}/api/comment/post_comment`, user)
      .then((resp) => {
        setGetComments([resp?.data, ...getUserComments]);
        setLoader(false);
        setUserComment("");
        setUpdateUI((prev) => !prev); // update the ui changes
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  // delete method
  const handleDelete = async (id) => {
    await axios
      .delete(`${baseURL}/api/comment/delete/${id}`)
      .then((resp) => {
        if (resp.data.success && isError === false) {
          let newComment = getUserComments.filter(
            (item) => resp.data._id !== item.id
          );
          setUserComment(newComment);
          setUpdateUI((prev) => !prev);
        } else {
          setError("Cannot delete the comment...");
        }
      })
      .catch((err) => {
        console.error(err.message);
        setError(true);
      });
  };

  // edit
  const handleEdit = (commentId) => {
    setIsEditComment(commentId);
    if (user.userId) {
      const existingComment = getUserComments.find(
        (comment) => comment._id === commentId
      );
      setUserComment(existingComment.commentText);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const commentId = isEditingComment;
    axios
      .patch(`${baseURL}/api/comment/update/edit_comment/${commentId}`, {
        commentText: userComment,
      })
      .then((resp) => {
        setIsEditComment(false);
        setUserComment(resp.data.commentText);
        setGetComments([
          ...getUserComments.map((comment) => comment._id === commentId),
        ]); // It iterates through the existing comments, replacing the comment with the ID commentId (the one being edited) with the response data (resp.data), which might contain the updated comment details. This updates the comment list
        setUserComment("");
        setUpdateUI((prev) => !prev);
      })

      .catch((err) => {
        console.error(err.message);
      });
  };

  const handleLikeComment = async (id) => {
    await axios
      .patch(`${baseURL}/api/comment/update/user_react/like/${id}`)
      .then((res) => {
        setUpdateUI((prev) => !prev); // update the ui changes
        return res.data;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDisLikeComment = async (id) => {
    await axios
      .patch(`${baseURL}/api/comment/update/user_react/dislike/${id}`)
      .then((res) => {
        setUpdateUI((prev) => !prev); // update the ui changes
        return res.data;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleNext = () => {
    setLoader(true);
    if (
      currentPage > totalPages &&
      currentPage >= getUserComments?.length - 1
    ) {
      setLoader(false);
      setCurrentPage(1);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    setLoader(true);
    if (currentPage <= 0 && currentPage !== getUserComments.length) {
      setLoader(false);
      setCurrentPage(getUserComments.length);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (index) => {
    setCurrentPage(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(
          `${baseURL}/api/comment/product_reviews/${id}?page=${currentPage}&limit=5`
        )
        .then((resp) => {
          const { comments, showPagination, totalPage, success } = resp?.data;
          if (success) {
            setGetComments(comments);
            setTotalPages(totalPage);
            setShowPagination(showPagination);
            setLoader(false);
          }
        })
        .catch(() => {
          setLoader(false);
          setError(true);
        });
    };
    fetchData();

    window.addEventListener("resize", autoresize);
    return () => {
      window.removeEventListener("resize", autoresize);
    };
  }, [currentPage, id, updateUI]);

  return (
    <div className="product__reviews">
      <p className="product__reviews_title">Comments and Reviews</p>
      <h3>Write your comment</h3>
      <form
        className="relative flex flex-col gap-2"
        onSubmit={(e) => (isEditingComment ? handleSave(e) : handleAddComment)}
      >
        {modalForType === "genAIComment" && <CommentGeneration />}
        <div className="flex items-center h-[80px] w-[150px] overflow-hidden justify-end p-2 gap-2 absolute top-[1rem] right-0">
          <GenerativeComment modalForType={modalForType} />
          {isUserLoggedIn && (
            <button
              className="bg-transparent p-0"
              title="upload image"
              onClick={() => openModal("imageUpload")}
              type="button"
            >
              <FaCloudUploadAlt className="text-xl text-green-400" />
            </button>
          )}
        </div>
        <input
          className="product__reviews_textfield"
          name="product_reviews"
          row={0}
          placeholder="Please leave a comment here..."
          onChange={(e) => setUserComment(e.target.value)}
          value={userComment}
          ref={ref}
        />
        {inputError ? (
          <p className="empty-err">Please leave a comment 😔</p>
        ) : null}
        <InteractiveRating user={user} />
        <div className="">
          {isUserLoggedIn ? (
            isEditingComment ? (
              <button
                className="save_comment"
                type="submit"
                name="Save"
                title="Save"
              >
                Save Comment
              </button>
            ) : (
              <div>
                <button
                  className="add_comment"
                  onClick={handleAddComment}
                  title="Add Comment"
                  name="Add Comment"
                >
                  Add Comment
                </button>
              </div>
            )
          ) : (
            <Link to={"/login"}>
              <p style={{ padding: "12px 0", fontSize: "14px" }}>
                Please sign in to add a comment
              </p>
              <button className="add_comment">Sign in</button>
            </Link>
          )}
        </div>
      </form>
      <div className="flex flex-col gap-2 p-1 rounded-md mt-4">
        <ImageUpload />
        <div className="flex justify-between">
          <button
            className={`w-full bg-transparent ${
              isTabSwitched === "tab1" ? "border-solid border-2" : ""
            }`}
            onClick={() => handleRatingTab("tab1")}
          >
            Comments{" "}
          </button>
          <button
            className={`w-full bg-transparent ${
              isTabSwitched === "tab2" ? "border-solid border-2" : ""
            }`}
            onClick={() => handleRatingTab("tab2")}
          >
            Ratings
          </button>
        </div>
        <div>
          {isTabSwitched === "tab1" && (
            <ul className="product__reviews_list">
              {loader ? (
                // Show skeleton loader when loading is true
                [...Array(getUserComments.length).keys()].map((_, index) => {
                  return <SkeletonCard key={index} />;
                })
              ) : getUserComments?.length > 0 ? (
                // Show comments if available and not loading
                getUserComments.map((value) => {
                  return (
                    <li className="product__reviews_items" key={value._id}>
                      <h1 className="product__reviews_custname text-gray-500">
                        {value.userName}
                      </h1>
                      <p>{value.commentText}</p>
                      <span className="product__reviews_comment">
                        <span className="product__reviews_expression">
                          <button onClick={() => handleLikeComment(value._id)}>
                            <GrLike className="text-gray-500 size-3" />
                            <span>{value.likes}</span>
                          </button>
                          <button
                            onClick={() => handleDisLikeComment(value._id)}
                          >
                            <GrDislike className="text-gray-500 size-3" />
                            <span>{value.dislikes}</span>
                          </button>
                          <span className="product__reviews_postdate text-gray-500">
                            {value.createdAt}
                          </span>
                        </span>
                        {user.userId === value.userId && (
                          <span className="product__reviews_useraction">
                            <span>
                              <button
                                onClick={() => handleEdit(value._id)}
                                name="Edit"
                                title="Edit"
                              >
                                <BiEdit className="text-gray-500" />
                              </button>
                            </span>
                            <span>
                              <button
                                onClick={() => handleDelete(value._id)}
                                name="Delete"
                                title="Delete"
                              >
                                <AiOutlineDelete className="text-gray-500" />
                              </button>
                            </span>
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })
              ) : (
                // Show this if no comments and not loading
                <div>
                  <h2>Be the first person to review...</h2>
                </div>
              )}
            </ul>
          )}
          {isTabSwitched === "tab2" && <ShowStarRating />}
        </div>
      </div>
      <div>
        <div className="comment">
          {getUserComments.length > 0 && totalPages >= 1 && showPagination && (
            <div className="comment_pagination">
              {currentPage > 1 && (
                <button className="comment_prev " onClick={handlePrev}>
                  Prev
                </button>
              )}
              {[...Array(totalPages)?.keys()].map((pageNo) => {
                return (
                  <button
                    className={
                      currentPage === pageNo + 1 ? "active" : "comment_pageno"
                    }
                    key={pageNo}
                    onClick={() => handlePageChange(pageNo + 1)}
                  >
                    {pageNo + 1}
                  </button>
                );
              })}
              {currentPage < totalPages && (
                <button className="comment_next" onClick={handleNext}>
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
