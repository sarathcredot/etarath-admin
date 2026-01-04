import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/cms/blog`;

// GET ALL BLOG TAGS
export const getAllBlogTags = async (queryParams?: any) => {
  return await axiosAuth.get(`${baseUrl}/tag`, {
    params: {
      ...queryParams
    }
  });
};

export const useGetAllBlogTags = (enabled: boolean = true, queryParams?: any) => {
  return useQuery({
    queryKey: ["blog-tags", queryParams],
    queryFn: () => getAllBlogTags(queryParams).then((res) => res?.data?.data),
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
