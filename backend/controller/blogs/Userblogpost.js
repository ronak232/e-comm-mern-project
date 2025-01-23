import { PostBlog } from "../../model/postBlog.js";
import { User } from "../../model/user.js";

// fetch all post
export const handleUserBlogPost = async (req, res) => {
  const post = await PostBlog.find();
  res.status(200).json({
    post,
  });
};

// using slug to fetch a post
// query won't work because MongoDB doesn't directly support nested field queries inside arrays without using operators like $elemMatch.
export const handleFetchBySlug = async (req, res) => {
  const { slug } = req.params;

  const post = await PostBlog.findOne({
    "content.userBlogs": {
      $elemMatch: {
        slug,
      },
    },
  });
  if (post) {
    const matchedBlog = post.content.userBlogs.find(
      (blog) => blog.slug === slug
    );
    return res.status(200).json({
      post: [matchedBlog],
    });
  } else {
    return res.status(404).json({
      message: "Nothing here sorry...😔",
    });
  }
};

// create a post
export const handleCreatePost = async (req, res) => {
  const { user_id } = req.user; // Ensure `req.user` is populated by middleware
  const { userName, content, postTitle, id, coverImage } = req.body;

  console.log(req.body);

  let blogSlug = req.body.postTitle.replace(/ /g, "-").toLowerCase();
  let uniqueSlug = blogSlug;
  let uniqueCount = 1;

  while (await PostBlog.findOne({ "content.userBlogs.slug": uniqueSlug })) {
    uniqueSlug = `${blogSlug}-${uniqueCount}`;
    uniqueCount++;
  }

  try {
    let existingUser = await PostBlog.findOne({ userId: user_id });
    if (existingUser) {
      let existingPost = await PostBlog.findOneAndUpdate(
        { userId: user_id },
        {
          $push: {
            "content.userBlogs": {
              userName,
              blogContent: content,
              postTitle,
              slug: uniqueSlug,
              coverImage: coverImage,
            },
          },
        },
        {
          new: true,
          upsert: true,
        }
      );
      return res.status(200).json({
        post: existingPost,
      });
    } else {
      // Create new post
      const newUserPost = new PostBlog({
        id,
        userId: user_id,
        content: {
          userBlogs: [
            {
              userName: userName,
              slug: uniqueSlug,
              blogContent: content,
              postTitle: postTitle,
              coverImage: coverImage,
            },
          ],
        },
      });
      const post = await newUserPost.save();
      return res.status(201).json({
        mssg: "Post created successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      mssg: "An error occurred while creating the post",
      error: error.message,
    });
  }
};

export const handleDeletePost = async (req, res) => {};

export const handleBlogPostLikes = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { postId } = req.params;
    const { reaction } = req.body;
  
    const user = await User.findOne({ user_id });
    if (!user) return res.status(404).json({ message: "User not found" });
  
    const alreadyLiked = user.likedPosts.includes(postId);
    const alreadyDisliked = user.dislikedPosts.includes(postId);
  
    let updateQuery;
  
    if (reaction === "like") {
      if (alreadyLiked) {
        user.likedPosts.pull(postId);
        updateQuery = { $inc: { "content.userBlogs.$.likes": -1 } };
      } else {
        user.likedPosts.push(postId);
        updateQuery = { $inc: { "content.userBlogs.$.likes": 1, "content.userBlogs.$.dislikes": alreadyDisliked ? -1 : 0 } };
        if (alreadyDisliked) user.dislikedPosts.pull(postId);
      }
    } else if (reaction === "dislike") {
      if (alreadyDisliked) {
        user.dislikedPosts.pull(postId);
        updateQuery = { $inc: { "content.userBlogs.$.dislikes": -1 } };
      } else {
        user.dislikedPosts.push(postId);
        updateQuery = { $inc: { "content.userBlogs.$.dislikes": 1, "content.userBlogs.$.likes": alreadyLiked ? -1 : 0 } };
        if (alreadyLiked) user.likedPosts.pull(postId);
      }
    } else {
      return res.status(400).json({ message: "Invalid reaction type" });
    }
  
    await PostBlog.findOneAndUpdate(
      { "content.userBlogs._id": postId },
      updateQuery
    );
    
    await user.save();
  
    return res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    console.error("Error processing like/dislike:", error);
    return res.status(500).json({
      message: "Something went wrong...",
    });
  }
  
};
