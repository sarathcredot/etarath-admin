import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/cms/blog`;

// GET ALL BLOGS
export const getBlogs = async () => {
  return await axiosAuth.get(`${baseUrl}/`);
};

export const useGetBlogs = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: () => getBlogs().then((res) => res?.data?.data || []),
    enabled: enabled,
  });
};

// GET SINGLE BLOG
export const getSingleBlog = async ({ id }: { id: string }) => {
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetSingleBlog = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => getSingleBlog({ id }).then((res) => res?.data?.data || {}),
    enabled: enabled,
  });
};

// CREATE NEW BLOG
export const addBlog = async (data: any) => {
  return await axiosAuth.post(`${baseUrl}/`, data);
};

export const useAddBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
};

// UPDATE AN BLOG
export const updateBlog = async ({
  id,
  data,
}: {
  id: string | undefined;
  data: any;
}) => {
  return await axiosAuth.patch(`${baseUrl}/${id}`, data);
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
};

// UPDATE BLOG STATUS
export const updateBlogStatus = async ({
  id,
  status,
}: {
  id: string | undefined;
  status: boolean;
}) => {
  return await axiosAuth.patch(`${baseUrl}/${id}/update-status`, { status });
};

export const useUpdateBlogStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBlogStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
};

// DELETE A BLOG
export const deleteBlog = async (id: string) => {
  return await axiosAuth.delete(`${baseUrl}/${id}`);
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
};
