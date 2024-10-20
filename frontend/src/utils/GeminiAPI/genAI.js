import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = process.env.API_KEY;

export const generativeAIContent = async () => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Write a story about a magic backpack.";

  const result = await model.generateContent(prompt);
  console.log(result.response.text());

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
};
