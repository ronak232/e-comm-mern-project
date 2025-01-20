import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as dotenv from "dotenv";
dotenv.config();

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  maxOutputTokens: 900,
  temperature: 0.4,
  maxRetries: 2,
  safetyRatings: [
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      probability: "NEGLIGIBLE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      probability: "NEGLIGIBLE",
    },
    {
      category: "HARM_CATEGORY_HARASSMENT",
      probability: "NEGLIGIBLE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      probability: "NEGLIGIBLE",
    },
  ],
})