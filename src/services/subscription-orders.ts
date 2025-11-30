import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/subcription-orders`;

// GET ALL SUBSCRIPTION ORDERS BY PLAN ID
export const getAllPlanOrdersById = async (id: string) => {
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetAllPlanOrdersById = (
  id: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["subscription-orders", id],
    queryFn: () => getAllPlanOrdersById(id).then((res) => res?.data?.data),
    enabled: enabled,
  });
};


// PURCHASE A SUBSCRIPTION PLAN
export const purchasePlan = async (data: any) => {
  return await axiosAuth.put(`${baseUrl}/purchase-plan`,data);
};

export const usePurchasePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchasePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
};
