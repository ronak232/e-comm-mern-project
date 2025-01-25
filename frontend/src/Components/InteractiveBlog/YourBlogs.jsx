import { useFetchData } from "../../utils/blogpostControl";

function YourBlogs() {

  const { data: getSavedPosts, isLoading } = useFetchData(
    `/api/blog/post/saved`,
    "savedPost"
  );
  console.log("saved post", getSavedPosts)
  return <div>YourBlogs</div>;
}

export default YourBlogs;
