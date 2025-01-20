import { llm } from "../langmodel/langModel";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const languageTranslation = async(socket, userLanguage) => {
    try {
        if(userLanguage) {
            llm.invoke([
                new SystemMessage(`Translate the whole site into user preferred language`),
                new HumanMessage(userLanguage)
            ])
            
        }
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Error occurred while translating the site"
        });
    }
}