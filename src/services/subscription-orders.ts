import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/subcription-orders`;

// GET ALL SUBSCRIPTION ORDERS BY PLAN ID
export const getAllPlanOrdersById = async (id: string, queryParams?: any) => {
  return await axiosAuth.get(`${baseUrl}/${id}`, {
    params: {
      ...queryParams
    }
  });
};

export const useGetAllPlanOrdersById = (
  id: string,
  enabled: boolean = true,
  queryParams?: any
) => {
  return useQuery({
    queryKey: ["subscription-orders", id, queryParams],
    queryFn: () => getAllPlanOrdersById(id, queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};
// GET SUBSCRIPTION ORDER BY ORDER ID
export const getSubscriptionOrderById = async (id: string) => {
  return await axiosAuth.get(`${baseUrl}/${id}/order/${id}`);
};

export const useGetSubscriptionOrderById = (id?: string, enabled?: any) => {
  return useQuery({
    queryKey: ["subscription-order", id],
    queryFn: () => getSubscriptionOrderById(id!).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// PURCHASE A SUBSCRIPTION PLAN
export const purchasePlan = async (data: any) => {
  return await axiosAuth.put(`${baseUrl}/purchase-plan`, data);
};

export const usePurchasePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchasePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["retailer"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-orders"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-order"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-payment-history"] });
    },
  });
};




export const updateExpireData = async ({ id, data }: { id: string; data: any }) => {
  return await axiosAuth.patch(`${baseUrl}/${id}/order/${id}`, data);
};

export const useUpdateExpireData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateExpireData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-order"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-order"] });

    },
  });
};





// GET SUBSCRIPTION ORDER transation userId
export const getAllPaymentHistoryByUserid = async (id: string , queryParams?:any) => {
  return await axiosAuth.get(`${baseUrl}/${id}`,{
    params:{
      ...queryParams
    }
  });
};

export const useGetAllPaymentHistoryByUserid = (id?: string, enabled?: any,queryParams?:any) => {
  return useQuery({
    queryKey: ["subscription-payment-history", id , queryParams],
    queryFn: () => getAllPaymentHistoryByUserid(id!,queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};