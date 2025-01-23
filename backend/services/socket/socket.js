import { Server } from "socket.io";
import dotenv from "dotenv";
import { generatelangChainBlog } from "../langchain/langChainContentGenerate.js";
dotenv.config();

// const socketServer = http.createServer();
export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      credentials: true,
      methods: ["GET", "POST", "DELETE"],
    },
  });
  io.on("connection", (socket) => {
    console.log("connecteed...");
    socket.on("prompt-message", async (data) => {
      const { prompt, userName, userId } = data;
      if (prompt || userName || userId) {
        await generatelangChainBlog(socket, prompt, userName, userId);
      } else {
        console.error("Missing required parameters:", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
