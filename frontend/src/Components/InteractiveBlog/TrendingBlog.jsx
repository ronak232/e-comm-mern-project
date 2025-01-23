import { useFetchData } from "../../utils/blogpostControl";
import SkeletonCard from "../../Components/SkeletonCard";
import { Link } from "react-router-dom";
const baseURL = process.env.REACT_APP_BASE_URL;

function TrendingBlog() {
  const { data, isLoading, isError } = useFetchData(`${baseURL}/api/blog/fetch`);

  if (isError) {
    console.log("error");
  }

  return (
    <div className="w-full h-full">
      <h1 className="text-center text-2xl mb-2">Trending Blogs</h1>
      <div>
        <select className="text-black rounded-md p-1 mt-3 mb-3" name="" id="">
          <option value="">Popular Blogs</option>
          <option value="">Trending Blogs</option>
          <option value="">Most Liked</option>
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
                  type: "username",
                  style: { width: "50%", height: "15px", marginTop: "10px" },
                },
                {
                  type: "comment",
                  style: { width: "70%", height: "20px", marginTop: "5px" },
                },
              ]}
            />
          ))}
        </div>
      ) : (
        <div className="userblog flex flex-wrap gap-2 w-full">
          {data?.post?.map(({ content }) => {
            return content.userBlogs?.map((item) => {
              return (
                <div className="userblog-gallery min-h-[280px]" key={item._id}>
                  <div className="userblog-card pb-3">
                    <div className="userblog-content w-full">
                      <img className="" src={item.coverImage} alt="" />
                      <h3 className="text-lg text-black capitalize">
                        {item.postTitle}
                      </h3>
                      <Link
                        className="text-[#eb645d] text-sm font-mono"
                        to={`/blog/trending-blogs/${item.slug}`}
                      >
                        Read More..
                      </Link>
                    </div>
                  </div>
                </div>
              );
            });
          })}
        </div>
      )}
    </div>
  );
}

export default TrendingBlog;
