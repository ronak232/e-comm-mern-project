import axios from "axios";
import { AiContext } from "./AiContentGenerator";

export const AiContextProvider = ({ children }) => {
  const fetchGenAiBlog = async (url) => {
    try {
      const resp = await axios.get(url);
      if (resp.status === 200) {
        return resp.data.data;
      }
    } catch (error) {
      console.error("Error while fetching blogs:", error.message);
      throw error;
    }
  };

  return (
    <AiContext.Provider value={{ fetchGenAiBlog }}>
      {children}
    </AiContext.Provider>
  );
};
