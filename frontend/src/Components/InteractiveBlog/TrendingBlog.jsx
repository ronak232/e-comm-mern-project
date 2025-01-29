import { useFetchData } from "../../utils/blogpostControl";
import SkeletonCard from "../../Components/SkeletonCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const baseURL = process.env.REACT_APP_BASE_URL;

function TrendingBlog() {
  const { data, isLoading, isError } = useFetchData(`/api/blog/fetch`);
  const [sortData, setSortData] = useState([]);
  const [defaultOption, setDefaultOption] = useState("all");

  const sortBasedOnLiked = (e) => {
    const sortType = e.target.value;
    setDefaultOption(sortType);

    const copyData = JSON.parse(JSON.stringify(data));

    const sortFunctions = {
      all: (posts) => posts,
      like: (posts) =>
        posts.sort((a, b) => {
          const likesA = a.content.userBlogs[0].likes;
          const likesB = b.content.userBlogs[0].likes;
          return likesB - likesA;
        }),
      popular: (posts) =>
        posts.sort((a, b) => {
          const visitsA = a.content.userBlogs[0].visits;
          const visitsB = b.content.userBlogs[0].visits;
          return visitsB - visitsA; // Sort by visits in descending order
        }),
      trending: (posts) =>
        posts.sort((a, b) => {
          const timestampA = new Date(a.content.userBlogs[0].timestamp);
          const timestampB = new Date(b.content.userBlogs[0].timestamp);
          return timestampB - timestampA; // Sort by timestamp in descending order
        }),
    };

    const sortedPosts = sortFunctions[sortType](copyData.post);
    setSortData({ post: sortedPosts });
  };

  useEffect(() => {
    if (data) {
      setSortData(data);
    }
  }, [data]);

  return (
    <div className="w-full h-full">
      <h1 className="text-center text-2xl mb-2">Trending Blogs</h1>
      <div>
        <select
          className="text-black rounded-md p-1 mt-3 mb-3"
          onChange={(e) => sortBasedOnLiked(e)}
          value={defaultOption}
        >
          <option value="all">All</option>
          <option value="popular">Popular Blogs</option>
          <option value="trending">Trending Blogs</option>
          <option value="like">Most Liked</option>
        </select>
      </div>
      {isLoading ? (
        <div className="userblog flex flex-wrap gap-2 w-full">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard
              key={index}
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
                  type: "body",
                  style: { width: "50%", height: "15px", marginTop: "10px" },
                },
                {
                  type: "read more",
                  style: { width: "70%", height: "20px", marginTop: "5px" },
                },
              ]}
            />
          ))}
        </div>
      ) : (
        <div className="userblog flex flex-wrap gap-2 w-full">
          {sortData?.post?.length > 0 ? (
            sortData.post.map((post) => {
              const userBlog = post.content.userBlogs[0];
              return (
                <div
                  className="userblog-gallery min-h-[280px]"
                  key={userBlog._id}
                >
                  <div className="userblog-card pb-3">
                    <div className="userblog-content w-full">
                      <img className="" src={userBlog.coverImage} alt="" />
                      <h3 className="text-lg text-black capitalize">
                        {userBlog.postTitle}
                      </h3>
                      <Link
                        className="text-[#eb645d] text-sm font-mono"
                        to={`/blog/trending-blogs/${userBlog.slug}`}
                      >
                        Read More..
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No Blogs 😔...</p>
          )}
        </div>
      )}
      {isError && <p>Something wrong...</p>}
    </div>
  );
}

export default TrendingBlog;
