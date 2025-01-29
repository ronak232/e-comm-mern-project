import { getAuth } from "firebase/auth";
import { useFetchData } from "../../utils/blogpostControl";


function YourBlogs() {

  const getTokenId = getAuth().currentUser?.getIdToken();

  console.log("token ", getTokenId);

  const { data: getSavedPosts, isLoading } = useFetchData(
    `/api/blog/user/fetch`,
    "savedPost"
  );
  console.log("saved post", getSavedPosts)
  return <div>YourBlogs</div>;
}

export default YourBlogs;
