import { getAuth } from "firebase/auth";
import { useFetchData } from "../../utils/blogpostControl";


function YourBlogs() {

  const getTokenId = getAuth().currentUser?.getIdToken();

  const { data: getSavedPosts, isLoading } = useFetchData(
    `/api/blog/user/fetch`,
    "savedPost"
  );
  return <div>YourBlogs</div>;
}

export default YourBlogs;
