import { Suspense, useEffect, useState } from "react";
import AiBlogGenerator from "./AiBlogDashboard";
import { useNavigate, useParams } from "react-router-dom";
import UserBlogWriting from "../Components/InteractiveBlog/BlogEditor";
import TrendingBlog from "../Components/InteractiveBlog/TrendingBlog";
import YourBlogs from "../Components/InteractiveBlog/YourBlogs";
import { TiThMenu } from "react-icons/ti";
import { IoIosCloseCircle } from "react-icons/io";

function Blog() {
  const { page } = useParams();
  const [isActiveTab, setActiveTab] = useState(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const blogTab = [
    "Create Blog",
    "Trending Blogs",
    "Your Blogs",
    "Generate With Ai",
  ];

  const handleActiveTab = (index) => {
    setActiveTab(index);
    const tabPath = blogTab[index].toLowerCase().replace(/ /g, "-");
    navigate(`/blog/${tabPath}`);
    setSidebarOpen(false);
  };

  const routingContent = () => {
    switch (page) {
      case "create-blog":
        return (
          <Suspense>
            <UserBlogWriting />
          </Suspense>
        );
      case "your-blogs":
        return (
          <Suspense>
            <YourBlogs />
          </Suspense>
        );
      case "generate-with-ai":
        return (
          <Suspense>
            <AiBlogGenerator />
          </Suspense>
        );
      default:
        return <TrendingBlog />;
    }
  };

  //dynamically updates a tab's active state based on the current page parameter and the blogTab array
  useEffect(() => {
    const tabIndex = blogTab.findIndex(
      (item) => item.toLowerCase().replace(/ /g, "-") === page
    );
    if (tabIndex >= 0) {
      setActiveTab(tabIndex);
    }
  }, [blogTab, page]);

  return (
    <div className="blogs">
      <div className="blogs__container">
        <button
          className="md:hidden fixed top-16 left-[-6px] z-50 bg-blue-500 text-white px-2 py-1 rounded-md"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <IoIosCloseCircle /> : <TiThMenu />}
        </button>
        <aside
          className={`blog-menu fixed top-0 left-[-6px] bg-transparent text-white z-40 transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative sm:flex`}
        >
          <ul className="flex flex-col gap-2">
            {blogTab.map((item, index) => {
              return (
                <li
                  className={isActiveTab === index ? "active" : ""}
                  key={index}
                >
                  <button
                    className={
                      isActiveTab === index ? "active:text-blue-50" : ""
                    }
                    onClick={() => handleActiveTab(index)}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        <div className="flex flex-1">{page && routingContent()}</div>
      </div>
    </div>
  );
}

export default Blog;
