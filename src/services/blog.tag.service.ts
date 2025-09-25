import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/cms/blog`;

// GET ALL BLOG TAGS
export const getAllBlogTags = async () => {
  return await axiosAuth.get(`${baseUrl}/tag`);
};

export const useGetAllBlogTags = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["blog-tags"],
    queryFn: () => getAllBlogTags().then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// CREATE NEW CATAGORY
export const addBlogTag = async (data: any) => {
  return await axiosAuth.post(`${baseUrl}/create-tag`, data);
};

export const useAddBlogTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBlogTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
    },
  });
};

// DELETE A CATAGORY
export const deleteBlogTag = async (data: {
  tag: string;
}) => {
  return await axiosAuth.delete(`${baseUrl}/delete-tag`, { data });
};

export const useDeleteBlogTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
    },
  });
};
