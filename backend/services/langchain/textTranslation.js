import { llm } from "../langmodel/langModel.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const handlelangTranslation = async (
  socket,
  userLanguage,
  content,
  postTitle
) => {
  try {
    if (!userLanguage) {
      socket.emit("resp", { mssg: "Choose language to translate.." });
    }
    let getResponse = await llm.invoke([
      new SystemMessage(
        `Translate the postTitle ${postTitle} and the whole blog content ${content} in user preferred language ${userLanguage} Keep in mind below points: 
        1. Don't show warning and any error or 
        missing fields data in frontend when translating content...
        2. Keep the styling and everything as it is...
        `
      ),
      new HumanMessage(userLanguage),
    ]);

    socket.emit("translate_text_response", {
      translatedText: getResponse.content,
    });
  } catch (err) {
    socket.emit("error", (err) => {
      throw new Error("Opps...", err.message);
    });
  }
};
