import { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";
import { usePostData } from "../../utils/blogpostControl";
import { TipTapEditor } from "../InteractiveBlog/TipTapEditor";
import { getAuth } from "firebase/auth";
const baseURL = process.env.REACT_APP_BASE_URL;

function UserBlogWriting() {
  const [userBlogContent, setUserBlogContent] = useState(
    localStorage.getItem("blogcontent") || ""
  );

  const [coverImage, setCoverImage] = useState("");

  const user = {
    userName: getAuth().currentUser?.displayName,
    userId: getAuth().currentUser?.uid,
  };

  const { mutate, isLoading, isError } = usePostData(`${baseURL}/api/blog/post`);

  const handleCoverImageChange = (url) => {
    setCoverImage(url);
  };

  const handlePost = (e) => {
    e.preventDefault();
    const sanitizeHTML = sanitizeHtml(e.target.innerHTML, {
      allowedTags: ["a", "h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "ul"],
      allowedAttributes: {
        a: ["href", "name", "target"],
        img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
      },
      selfClosing: ["img"],
      allowedSchemes: ["http", "https"],
      allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
    });

    setUserBlogContent(sanitizeHTML);
    const blogData = new FormData(e.target);
    blogData.append("userName", user.userName);
    blogData.append("userId", user.userId);

    const blogContent = {
      postTitle: blogData.get("title"),
      content: userBlogContent,
      userName: blogData.get("userName"),
      userId: blogData.get("userId"),
      coverImage: coverImage
    };

    console.log(blogContent)

    if (!isLoading && !isError) {
      mutate(blogContent);
    }
    setUserBlogContent("")
  };

  useEffect(() => {
    if(user.userId)  {
      localStorage.setItem("blogcontent", userBlogContent);
    }
  }, [userBlogContent, user.userId]);

  return (
    <>
      <div className="blog-editor w-full flex gap-3 flex-col">
        <form className="blog-editor flex flex-col gap-4" onSubmit={handlePost}>
          <TipTapEditor
            onContentChange={(content) => setUserBlogContent(content)}
            userBlogContent={userBlogContent}
            onCoverImageChange = {handleCoverImageChange}
            coverImage={coverImage}
          />
          <button type="submit" className="blog-editor-post-btn">
            Post
          </button>
        </form>
      </div>
    </>
  );
}

export default UserBlogWriting;
