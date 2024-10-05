import { useEffect, useRef, useState } from "react";
import { useFirebaseAuth } from "../../hooks/firebase/firebase..config";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { BiEdit } from "react-icons/bi";
import { GrDislike, GrLike } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import SkeletonCard from "../../Components/Skeleton";

function ReviewAndComment() {
  const [userComment, setUserComment] = useState("");
  const [getUserComments, setGetComments] = useState([]);
  const [isEditingComment, setIsEditComment] = useState(null);
  const [isError, setError] = useState(null); // handle for server error
  const [inputError, setInputError] = useState(null); // handle for input field
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPagination, setShowPagination] = useState(false);
  const [totalPages, setTotalPages] = useState(null);
  const [updateUI, setUpdateUI] = useState(false); // track ui changes
  const { isUserLoggedIn } = useFirebaseAuth();
  const { id } = useParams();
  const ref = useRef(null); 
  const baseURL = process.env.REACT_APP_BASE_URL;

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
    setUpdateUI((prev) => !prev);
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
    await axios
      .post(`/api/comment/post_comment`, user)
      .then((resp) => {
        setLoader(true);
        setGetComments([...getUserComments, resp?.data]);
        setUpdateUI((prev) => !prev); // update the ui changes
        setUserComment("");
        setLoader(false);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  // delete method
  const handleDelete = async (id) => {
    await axios
      .delete(`/api/comment/delete/${id}`)
      .then((resp) => {
        if (resp.data && !isError) {
          let newComment = getUserComments.filter(
            (item) => resp.data._id !== item.id
          );
          setUpdateUI((prev) => !prev);
          setUserComment(newComment);
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
        setUpdateUI((prev) => !prev);
        setUserComment("");
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
    const fetchData = async (currentPage = 1) => {
      await axios
        .get(`/api/comment/product_reviews/${id}?page=${currentPage}&limit=5`)
        .then((resp) => {
          const { comments, showPagination, totalPage, success } = resp?.data;
          if (success) {
            setLoader(false);
            setGetComments(comments);
            setTotalPages(totalPage);
            setShowPagination(showPagination);
          }
        })
        .catch((err) => {
          setLoader(false);
          console.error(err.message);
        });
    };
    fetchData(currentPage);
    window.addEventListener("resize", autoresize());
    return () => {
      window.removeEventListener("resize", autoresize);
    };
  }, [currentPage, id, updateUI]);
  // Call fetchComments when productId or page changes

  return (
    <div className="product__reviews">
      <p className="product__reviews_title">Comments and Reviews</p>
      <h3>Write your comment</h3>
      <form
        onSubmit={(e) => (isEditingComment ? handleSave(e) : handleAddComment)}
      >
        <input
          className="product__reviews_textfield"
          name="product_reviews"
          row={0}
          placeholder="Please leave a comment here..."
          onChange={(e) => setUserComment(e.target.value)}
          value={userComment}
          ref={ref}
        ></input>
        {inputError ? (
          <p className="empty-err">Please leave a comment 😔</p>
        ) : null}
        <div>
          {isUserLoggedIn ? (
            isEditingComment ? (
              <button className="save_comment" type="submit">
                Save Comment
              </button>
            ) : (
              <button
                className="add_comment bg-red-700"
                onClick={handleAddComment}
              >
                Add Comment
              </button>
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
                    <button onClick={() => handleDisLikeComment(value._id)}>
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
                        <button onClick={() => handleEdit(value._id)}>
                          <BiEdit className="text-gray-500" />
                        </button>
                      </span>
                      <span>
                        <button onClick={() => handleDelete(value._id)}>
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
  );
}

export default ReviewAndComment;
