import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/order`;

// GET VENDOR BY ID
export const getOrderById = async (id: string | undefined) => {
  if (!id) throw new Error("No id provided");
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetOrderById = (id: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id).then((res) => res?.data?.data),
    enabled: enabled,
  });
};
