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

const updateData = async (url ,data, config={}) => {
  try {
      const tokenId = getAuth().currentUser?.getIdToken(true);
      const response = axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${tokenId}`
        }
      })
      return (await response).data;
  } catch (error) {
    throw new Error("Unable to update like")
  }
}

// Create a custom hook that uses useQuery
export const useFetchData = (url, key) => {
  return useQuery({
    queryKey: [key],
    queryFn: () => fetchData(url),
    enabled: !!url, // Only run the query if the URL is provided
    cacheTime: 3000,
  });
};

export const usePostData = (url) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      return await postData(url, data);
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries(["comments"]);

      const prevComments = queryClient.getQueryData(["comments"]);

      queryClient.setQueryData(["comments"], (oldComments) => {
        return oldComments ? [...oldComments, newComment] : [newComment];
      });
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

export const useDeleteData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ url, id }) => {
      return await deleteData(url, id);
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries(["comments"]);

      const previousComments = queryClient.getQueryData(["comments"]);

      queryClient.setQueryData(["comments"], (oldComment) =>
        oldComment ? oldComment.filter((comment) => comment._id !== commentId) : []
      );

      return { previousComments };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
};

// updating
export const useUpdateData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ url, id }) => {
      return await updateData(url, id);
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries(["comments"]);

      const previousComments = queryClient.getQueryData(["comments"]);

      queryClient.setQueryData(["comments"]);

      return { previousComments };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
};

