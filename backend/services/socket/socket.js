import { Server } from "socket.io";
import dotenv from "dotenv";
import { generatelangChainBlog } from "../langchain/langChainContentGenerate.js";
import { handlelangTranslation } from "../langchain/textTranslation.js";
dotenv.config();

// const socketServer = http.createServer();
export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin:  "*",
      credentials: true,
      methods: ["GET", "POST", "DELETE"],
    },
  });
  io.on("connection", (socket) => {
    socket.on("prompt-message", async (data) => {
      const { prompt, userName, userId } = data;
      if (prompt || userName || userId) {
        await generatelangChainBlog(socket, prompt, userName, userId);
      } else {
        console.error("Missing required parameters:", data);
      }
    });

    socket.on("text_translation", async (data) => {
      try {
        const { translate_lang, content, postTitle } = data;

        if (translate_lang === undefined && translate_lang === "") {
          throw new Error("Select language...");
        }
        else {
          await handlelangTranslation(socket, translate_lang, content, postTitle)
        }
      } catch (error) {
        throw new Error("Something went wrong...", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
