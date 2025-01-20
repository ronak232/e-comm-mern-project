import { GenAiBlogContent } from "../../model/chatBlog.js";

export const handleGetUserBlogHistory = async (req, res) => {
  const { userid } = req.params;
  try {
    const userChats = await GenAiBlogContent.findOne({ userId: userid });
    res.status(200).json({
      data: userChats,
    });
  } catch (error) {
    console.error("Error fetching user blog history:", error.message);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};
