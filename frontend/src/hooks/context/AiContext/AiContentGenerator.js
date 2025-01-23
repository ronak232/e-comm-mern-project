import { createContext, useContext } from "react";
import { useQuery } from "react-query";
const baseURL = process.env.REACT_APP_BASE_URL;
export const AiContext = createContext();

export const useFetchBlogAPI = (userId) => {
  const { fetchGenAiBlog } = useContext(AiContext);

  const { data: chats = null || {}, isLoading, isFetching } = useQuery(
    ["getBlog", userId],
    async () => {
      return await fetchGenAiBlog(`${baseURL}/api/fetch/blogs/${userId}`);
    },
    {
      cacheTime: 10000,
      onError: (err) => {
        console.error("Error fetching blog:", err.message);
      },
      refetchOnWindowFocus: true,
      enabled: true, // Ensures the query only runs if userId is defined and Set this to false to disable this query from automatically running.
    }
  );
  // console.log(isFetching);
  return { chats, isLoading, isFetching };
};
