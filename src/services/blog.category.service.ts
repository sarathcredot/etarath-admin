import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/cms/blog`;

// GET ALL BLOG CATAGORIES
export const getAllBlogCategories = async () => {
  return await axiosAuth.get(`${baseUrl}/category`);
};

export const useGetAllBlogCategories = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: () =>
      getAllBlogCategories().then((res) => {
        console.log('RES = ',res.data);
        return res?.data?.data;
      }),
    enabled: enabled,
  });
};

// CREATE NEW CATAGORY
export const addBlogCategory = async (data: any) => {
  return await axiosAuth.post(`${baseUrl}/create-category`, data);
};

export const useAddBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });
};

// DELETE A CATAGORY
export const deleteBlogCategory = async (data: {
  category: string;
}) => {
  return await axiosAuth.delete(`${baseUrl}/delete-category`, { data });
};

export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });
};
