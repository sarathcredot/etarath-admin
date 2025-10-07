import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/users`;

// GET ALL RETAILERS
export const getAllRetailers = async () => {
  return await axiosAuth.get(`${baseUrl}/?role=retailer`);
};

export const useGetAllRetailers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["retailers"],
    queryFn: () => getAllRetailers().then((res) => res?.data?.data),
    enabled: enabled,
  });
};
// GET RETAILER BY ID
export const getRetailerById = async (id: string | undefined) => {
  if (!id) throw new Error("No id provided");
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetRetailerById = (
  id: string | undefined,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["retailer", id],
    queryFn: () => getRetailerById(id).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// CREATE NEW RETAILER
export const addRetailer = async (data: any) => {
  return await axiosAuth.post(`${baseUrl}/`, data);
};

export const useAddRetailer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRetailer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
    },
  });
};

// UPDATE A RETAILER
export const updateRetailer = async ({
  id,
  data,
}: {
  id: number;
  data: any;
}) => {
  if (!id) throw new Error("No id provided");
  return await axiosAuth.put(`${baseUrl}/${id}`, data);
};

export const useUpdateRetailer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRetailer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
      queryClient.invalidateQueries({ queryKey: ["retailer"] });
    },
  });
};

// SUSPEND/UNSUSPEND A RETAILER

export const updateRetailerStatus = async ({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) => {
  if (!id) throw new Error("Retailer id required");
  return await axiosAuth.put(`${baseUrl}/issuspend/${id}`, {
    isSuspend: isActive,
  });
};

export const useUpdateRetailerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRetailerStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
      queryClient.invalidateQueries({ queryKey: ["retailer"] });
    },
  });
};
