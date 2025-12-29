import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/users`;

// GET ALL VENDORS
export const getAllVendors = async (queryParams?: any) => {
  return await axiosAuth.get(`${baseUrl}`,{
    params: {
      role: 'vendor',
      ...queryParams
    }
  });
};

export const useGetAllVendors = (enabled: boolean = true, queryParams?: any) => {
  return useQuery({
    queryKey: ["vendors", queryParams],
    queryFn: () => getAllVendors(queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// GET VENDOR BY ID
export const getVendorById = async (id: string | undefined) => {
  if (!id) throw new Error("No id provided");
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetVendorById = (id: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ["vendor", id],
    queryFn: () => getVendorById(id).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// CREATE NEW VENDOR
export const addVendor = async (data: any) => {
  return await axiosAuth.post(`${baseUrl}/`, data);
};

export const useAddVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
};

// UPDATE A VENDOR
export const updateVendor = async ({ id, data }: { id: number|string; data: any }) => {
  if (!id) throw new Error("No id provided");
  return await axiosAuth.put(`${baseUrl}/${id}`, data);
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
};

// SUSPEND/UNSUSPEND A VENDOR

export const updateVendorStatus = async ({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) => {
  if (!id) throw new Error("Vendor id required");
  return await axiosAuth.put(`${baseUrl}/issuspend/${id}`, {
    isSuspend: isActive,
  });
};

export const useUpdateVendorStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVendorStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
};

// GET ALL VENDOR STOCKS

export const getStocksByVendorId = async (vendorId: string) => {
  if (!vendorId) throw new Error("No vendor id provided");
  return await axiosAuth.get(`${baseUrl}/vendor/${vendorId}/all-stocks`);
};

export const useGetStocksByVendorId = (vendorId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["stocks", vendorId],
    queryFn: () => getStocksByVendorId(vendorId).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// GET ALL VENDOR ORDERS

export const getOrdersByVendorId = async (vendorId: string) => {
  if (!vendorId) throw new Error("No vendor id provided");
  return await axiosAuth.get(`${baseUrl}/vendor/${vendorId}/all-orders`);
};

export const useGetOrdersByVendorId = (vendorId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["vendor-orders", vendorId],
    queryFn: () => getOrdersByVendorId(vendorId).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// GET ALL VENDOR SALES AGENTS

export const getAgentsByVendorId = async (vendorId: string) => {
  if (!vendorId) throw new Error("No vendor id provided");
  return await axiosAuth.get(`${baseUrl}/vendor/${vendorId}/sales-agents`);
};

export const useGetAgentsByVendorId = (vendorId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["sales-agents", vendorId],
    queryFn: () => getAgentsByVendorId(vendorId).then((res) => res?.data?.data),
    enabled: enabled,
  });
};