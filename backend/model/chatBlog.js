import mongoose from "mongoose";

const GenAiBlogContentSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      default: "",
      ref: "User",
    },
    userId: {
      type: String,
      required: true,
    },
    history: [
      {
        role: {
          type: String,
          enum: ["user", "AI"],
          required: true,
        },
        chats: [
          {
            userPrompt: {
              type: String,
              required: true,
            },
            aiGeneratedBlog: {
              type: String,
            },
          },
        ],
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { typeKey: "type" }
);

export const GenAiBlogContent = mongoose.model(
  "ai_blog_content",
  GenAiBlogContentSchema
);
