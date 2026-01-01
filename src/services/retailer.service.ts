import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/users`;

// GET ALL RETAILERS
export const getAllRetailers = async (queryParams: any) => {
  return await axiosAuth.get(`${baseUrl}`, {
    params: {
      role: 'retailer',
      ...queryParams
    }
  });
};

export const useGetAllRetailers = (enabled: boolean = true, queryParams: any) => {
  return useQuery({
    queryKey: ["retailers", queryParams],
    queryFn: () => getAllRetailers(queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};
// GET RETAILER BY ID
export const getRetailerById = async (id: any | undefined) => {
  if (!id) throw new Error("No id provided");
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetRetailerById = (
  id: any | undefined,
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

// GET ALL RETAILER ORDERS

export const getOrdersByRetailerId = async (retailerId: string, queryParams?: any) => {
  if (!retailerId) throw new Error("No retailer id provided");
  return await axiosAuth.get(`${baseUrl}/retailer/${retailerId}/all-orders`, {
    params: {
      ...queryParams
    }
  });
};

export const useGetOrdersByRetailerId = (
  retailerId: string,
  enabled: boolean,
  queryParams?: any
) => {
  return useQuery({
    queryKey: ["retailer-orders", retailerId, queryParams],
    queryFn: () =>
      getOrdersByRetailerId(retailerId, queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};


// GET ALL VENDOR Claims

export const getClaimByRetailerId = async (retailerId: string, queryParams?: any) => {
  if (!retailerId) throw new Error("No vendor id provided");
  return await axiosAuth.get(`${baseUrl}/retailer/${retailerId}/all-claims`, {
    params: {
      ...queryParams
    }
  });
};

export const useGetClaimByRetailerId = (retailerId: string, enabled: boolean, queryParams?: any) => {
  return useQuery({
    queryKey: ["retailer-claims", retailerId, queryParams],
    queryFn: () => getClaimByRetailerId(retailerId, queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};



// GET RETAILER BY ID priority
export const getRetailerPriorityById = async (id: any | undefined) => {
  if (!id) throw new Error("No id provided");
  return await axiosAuth.get(`${baseUrl}/${id}/priority`);
};

export const useGetRetailerPriorityByIdById = (
  id: any | undefined,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["retailer-priority", id],
    queryFn: () => getRetailerPriorityById(id).then((res) => res?.data?.data),
    enabled: enabled,
  });
};
