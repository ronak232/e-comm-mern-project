import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import * as dotenv from "dotenv";
import { UserComment } from "../../model/comment.js";

dotenv.config();

export const handleGenerativePrompt = async (req, res) => {
  const { genText, productId, isAIGenerated } = req.body;
  try {
    if (!isAIGenerated) {
      return false;
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
        candidateCount: 1,
        temperature: 0.8,
      },
    });
    console.log(genText);
    const result = await model.generateContent(genText);
    const genComment = result?.response?.text().replace(/[^\w ]/, "");
    console.log(genComment);
    await UserComment.findOneAndUpdate(
      {
        productId,
        genText,
      },
      {
        $set: {
          genText,
        },
      }
    )
      .then(() => {
        res.status(200).json({
          genComment,
          productId,
          isAIGenerated: isAIGenerated ? true : false,
        });
      })
      .catch((err) => {
        res.status(404).json({
          msg: err.message,
        });
      });
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Error processing request" });
  }
};
