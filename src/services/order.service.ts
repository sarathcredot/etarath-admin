import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/order`;

// GET ORDER BY ID
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



export const updateOrderStatus = async ({
  id,
  status,
}: {
  id: any;
  status: any;
}) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.put(`${baseUrl}/${id}/update-status`, { status });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
       queryClient.invalidateQueries({ queryKey: ["orders"] });


    },
  });
};
