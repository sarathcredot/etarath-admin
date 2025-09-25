import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/attributes`;

// GET ALL ATTRIBUTES
export const getAllAttributes = async () => {
  return await axiosAuth.get(`${baseUrl}/`);
};

export const useGetAllAttributes = (enabled: boolean) => {
  return useQuery({
    queryKey: ["attributes"],
    queryFn: () => getAllAttributes().then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// CREATE NEW ATTRIBUTE
export const addAttribute = async (data: any) => {
  return await axiosAuth.post(`${baseUrl}/`, data);
};

export const useAddAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
};

// DELETE A ATTRIBUTE
export const deleteAttribute = async (data: {
  type: string;
  attribute: string;
}) => {
  return await axiosAuth.delete(`${baseUrl}`, { data });
};

export const useDeleteAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });
};
