import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/subcription-plans`;

// GET ALL PLANS BY ROLE
export const getAllPlansByRole = async (role: "vendor" | "retailer") => {
  return await axiosAuth.get(`${baseUrl}/role/${role}`);
};

export const useGetAllPlansByRole = (
  role: "vendor" | "retailer",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["subscriptions", role],
    queryFn: () => getAllPlansByRole(role).then((res) => res?.data?.data),
    enabled: enabled,
  });
};
// GET PLAN DETAILS BY ID
export const getPlanById = async (id: string) => {
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetPlanById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["subscription", id],
    queryFn: () => getPlanById(id).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// UPDATE PLAN
export const updatePlan = async ({ id, data }: { id: string; data: any }) => {
  if (!id) throw new Error("Plan Id is required");
  return await axiosAuth.patch(`${baseUrl}/${id}`, data);
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
};

// UPDATE STATUS BY PLAN ID
export const updatePlanStatus = async ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.patch(`${baseUrl}/${id}/status-update`, { status });
};

export const useUpdatePlanStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlanStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
};
