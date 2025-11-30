import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/procategory`;

// GET ALL CATEGORIES
export const getAllCategories = async () => {
  return await axiosAuth.get(`${baseUrl}/`);
};

export const useGetAllCategories = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: () => getAllCategories().then((res) => res?.data?.data || []),
    enabled: enabled,
  });
};
