import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/support`;

// GET ALL SUPPORT REQUESTS
export const getAllSupportRequests = (role: string | undefined) => {
  return axiosAuth.get(`${baseUrl}/?role=${role}`);
};
export const useGetAllSupportRequests = (
  role: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["customer-support-requests", role],
    queryFn: () => getAllSupportRequests(role).then((res) => res?.data?.data),
    enabled: enabled,
  });
};
