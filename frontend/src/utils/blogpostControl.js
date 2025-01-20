import axios from "axios";
import { getAuth } from "firebase/auth";
import { useQuery, useMutation, useQueryClient } from "react-query";

// Define the fetch function
const fetchData = async (url, params) => {
  const response = await axios.get(url, { params });
  return response.data;
};

const postData = async (url, data, config = {}) => {
  try {
    const tokenId = await getAuth().currentUser?.getIdToken(true);
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${tokenId}`,
      },
      ...config,
    });
    return response.data;
  } catch (err) {
    throw new Error("Post request failed...");
  }
};

const deleteData = async (url, config = {}) => {
  try {
    const tokenId = await getAuth().currentUser?.getIdToken(true);
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${tokenId}`,
      },
      ...config,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete...");
  }
};

// Create a custom hook that uses useQuery
export const useFetchData = (url, key) => {
  return useQuery({
    queryKey: [key],
    queryFn: () => fetchData(url),
    enabled: !!url, // Only run the query if the URL is provided
  });
};

export const usePostData = (url) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      return await postData(url, data);
    },
    onMutate: async (resp) => {
      await queryClient.cancelQueries(["comment"]);
      const prevComments = queryClient.getQueryData(["comments"]);
      queryClient.setQueryData(["comments"], (data) => [...data, resp]);
      return { prevComments };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
    onError: (err) => {
      throw new Error("Failed to post data", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
};

export const useDeleteData = (url) => {
  return useMutation({
    mutationFn: (id) => deleteData(url, id),
    onSuccess: (data, id) => {
      console.log(data, id);
    },
  });
};
