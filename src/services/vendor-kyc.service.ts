import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/kyc`;

// GET KYC DETAILS BY VENDOR ID
export const getKycDetailsByVendorId = async (vendorId: string | undefined) => {
  if (!vendorId) throw new Error("User Id is required");
  return await axiosAuth.get(`${baseUrl}/${vendorId}/kyc-details`);
};

export const useGetKycDetailsByVendorId = (
  vendorId: string | undefined,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["vendor-kyc", vendorId],
    queryFn: () =>
      getKycDetailsByVendorId(vendorId).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// CREATE NEW VENDOR KYC
export const createVendorKyc = async ({
  userId,
  data,
}: {
  userId: string;
  data: any;
}) => {
  if (!userId) throw new Error("User Id is required");
  return await axiosAuth.post(`${baseUrl}/${userId}/create-kyc`, data);
};

export const useCreateVendorKyc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVendorKyc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kycs"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-kyc"] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
      queryClient.invalidateQueries({ queryKey: ["retailer"] });
    },
  });
};

// UPDATE VENDOR KYC
export const updateVendorKyc = async ({
  userId,
  data,
}: {
  userId: string;
  data: any;
}) => {
  if (!userId) throw new Error("User Id is required");
  return await axiosAuth.put(`${baseUrl}/${userId}/update-kyc`, data);
};

export const useUpdateVendorKyc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVendorKyc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kycs"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-kyc"] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
      queryClient.invalidateQueries({ queryKey: ["retailer"] });
    },
  });
};

// DELETE A VENDOR KYC
export const deleteVendorKyc = async (id: string) => {
  if (!id) throw new Error("User Id is required");
  return await axiosAuth.delete(`${baseUrl}/${id}/kyc-delete`);
};

export const useDeleteVendorKyc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVendorKyc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-kyc"] });
      queryClient.invalidateQueries({ queryKey: ["kycs"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-kyc"] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
      queryClient.invalidateQueries({ queryKey: ["retailer"] });
    },
  });
};

// VERIFY OR REJECT VENDOR KYC
export const updateVendorKycVerification = async ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}) => {
  if (!id) throw new Error("User Id is required");
  return await axiosAuth.put(`${baseUrl}/${id}/verify-kyc`, { status });
};

export const useUpdateVendorKycVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVendorKycVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kycs"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-kyc"] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      queryClient.invalidateQueries({ queryKey: ["retailers"] });
      queryClient.invalidateQueries({ queryKey: ["retailer"] });
    },
  });
};
