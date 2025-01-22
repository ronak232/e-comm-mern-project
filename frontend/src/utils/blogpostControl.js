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

const updateData = async (url, data, config = {}) => {
  try {
    const tokenId = await getAuth().currentUser?.getIdToken(true);
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${tokenId}`,
      },
      ...config,
    });
    console.log("data ", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Unable to update like");
  }
};

// Create a custom hook that uses useQuery
export const useFetchData = (url, key) => {
  return useQuery({
    queryKey: [`${key}`],
    queryFn: () => fetchData(url),
    enabled: !!url, // Only run the query if the URL is provided
    cacheTime: 3000,
  });
};

export const usePostData = (url) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      return postData(url, data);
    },
    // Optimistically adds the comment
    onMutate: async (newComment) => {
      await queryClient.cancelQueries(["comments", newComment.postId]);

      const prevComments = queryClient.getQueryData([
        "comments",
        newComment.postId,
      ]);

      queryClient.setQueryData(
        ["comments", newComment.postId],
        (oldComments) => {
          return oldComments ? [...oldComments, newComment] : [newComment];
        }
      );
      return { prevComments };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", url]);
    },
    onError: (err) => {
      throw new Error("Failed to post data", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
};

export const useDeleteData = (key) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ url, id }) => {
      return deleteData(url, id);
    },
    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries([key]);

      const previousComments = queryClient.getQueryData([key]) || [];

      queryClient.setQueryData([key], (oldComment) =>
        Array.isArray(oldComment)
          ? oldComment?.filter((comment) => comment._id !== commentId)
          : []
      );
      console.log(previousComments);

      return { previousComments };
    },
    onSuccess: () => {
      queryClient.invalidateQueries([key]);
    },
  });
};

// updating
export const useUpdateData = (key) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ url, data }) => {
      console.log("data", data);
      return await updateData(url, data);
    },
    onMutate: ({ data }) => {
      queryClient.cancelQueries([key]);

      const previousData = queryClient.getQueryData([key]) || [];

      queryClient.setQueryData([key], (oldData) => {
        if (!Array.isArray(oldData)) return previousData;

        return oldData?.map((post) =>
          post._id === data.postId
            ? {
                ...post,
                likes:
                  data.reaction === "like" ? post.likes + 1 : post.likes - 1,
              }
            : post
        );
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries([key]);
    },
  });
};
