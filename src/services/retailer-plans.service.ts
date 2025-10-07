import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/subcription-plans`;

// GET ALL RETAILER PLANS

export const getAllRetailerPlans = async () => {
  return await axiosAuth.get(`${baseUrl}/?role=retailer`);
};

export const useGetAllRetailerPlans = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["retailer-plans"],
    queryFn: () => getAllRetailerPlans().then((res) => res?.data?.data || []),
    enabled: enabled,
  });
};

// GET RETAILER PLAN BY ID
export const getRetailerPlanById = async (id: string | undefined) => {
  if (!id) throw new Error("No id provided");
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetRetailerPlanById = (
  id: string | undefined,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["retailer-plan", id],
    queryFn: () => getRetailerPlanById(id).then((res) => res?.data?.data || {}),
    enabled: enabled,
  });
};
