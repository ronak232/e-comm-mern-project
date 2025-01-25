import { llm } from "../langmodel/langModel.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { GenAiBlogContent } from "../../model/chatBlog.js";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

export const generatelangChainBlog = async (
  socket,
  userPrompt,
  userName,
  userid
) => {
  try {
    let userPromptSchema = z
      .object({
        title: z.string().describe("The title of the blog post"),
        introduction: z
          .string()
          .describe("An engaging introduction to the topic"),
        body: z
          .string()
          .describe(
            "The main content of the blog post, divided into sections with clear headings."
          ),
        conclusion: z.string().describe("A summary and concluding remarks."),
      })
      .describe("Structured output for a blog post");
    let structuredllm = llm.withStructuredOutput(userPromptSchema, {
      name: "BlogPostSchema",
    });

    const systemMessage = new SystemMessage(`
      You are an expert blog writer. keep one thing in mind if user is authenticated greet user with name ${userName} don't just start with the content... 
      Only Write a blog post based on the user's input like write blog on topic or something when user asked to.
      Write in a clear, concise style and generate SEO-friendly blog content. Target audience: general public.
    `);

    const humanMessage = new HumanMessage(userPrompt);

    let llmBlog = await structuredllm.invoke([systemMessage, humanMessage]);
    
    if (llmBlog) {
      let chunkText = "";
      let chunkStream = llm.stream(userPrompt);

      for await (const chunk of await chunkStream) {
        const chunkData = chunk.content;
        chunkText += chunkData;
        socket.emit("blog-progress", {
          content: {
            title: llmBlog.title,
            body: chunkText,
            conclusion: llmBlog.conclusion,
          },
          isAiGenerated: true,
          data: llmBlog,
        });
      }
      socket.emit("blog-progress", {
        content: {
          title: llmBlog.title,
          body: chunkText,
          conclusion: llmBlog.conclusion,
        },
        isAiGenerated: true,
      });
      // Check if the document exists
      const userDoc = await GenAiBlogContent.findOne({ userId: userid });

      if (!userDoc) {
        // Create a new document if it doesn't exist
        const blogModel = new GenAiBlogContent({
          userName: userName,
          userId: userid,
          history: [
            {
              role: "user",
              chats: [
                {
                  userPrompt: userPrompt || null,
                  aiGeneratedBlog: JSON.stringify(llmBlog) || null,
                },
              ],
            },
          ],
        });
        await blogModel.save();
      } else {
        // If the document exists, check if the history field is valid
        if (!userDoc.history) {
          // Initialize the history array if it's missing or invalid
          userDoc.history = [];
          await userDoc.save();
        }
        await GenAiBlogContent.updateOne(
          { userId: userid },
          {
            $push: {
              history: {
                role: "user",
                chats: [
                  {
                    userPrompt: userPrompt || null,
                    aiGeneratedBlog: JSON.stringify(llmBlog) || null,
                  },
                ],
              },
            },
          }
        );
      }
    }
  } catch (err) {
    socket.emit("error", { message: "Error generating blog", error: err });
  }
};
