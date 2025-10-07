import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/support`;

// GET ALL SUPPORT REQUESTS
export const getAllSupportRequests = () => {
  return axiosAuth.get(`${baseUrl}/`);
};
export const useGetAllSupportRequests = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["customer-support-requests"],
    queryFn: () => getAllSupportRequests().then((res) => res?.data?.data),
    enabled: enabled,
  });
};