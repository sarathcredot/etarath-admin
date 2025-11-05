import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/dashboard`;

// GET ALL TOTAL OVERVIEW
export const getAllTotalOverview = async () => {
  return await axiosAuth.get(`${baseUrl}/count-data`);
};

export const useGetAllTotalOverview = (enabled: boolean) => {
  return useQuery({
    queryKey: ["count-data"],
    queryFn: () => getAllTotalOverview().then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// GET ALL TOP USERS AND ORDERS
export const getAllTopUsersAndOrders = async (filter: string) => {
  return await axiosAuth.get(`${baseUrl}/top-data?filter=${filter}`);
};

export const useGetAllTopUsersAndOrders = (
  filter: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["top-users-and-orders", filter],
    queryFn: () =>
      getAllTopUsersAndOrders(filter).then((res) => res?.data?.data),
    enabled: enabled,
  });
};
