import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/kyc`;

// GET ALL KYC REQUESTS

export const getAllKycRequests = async () => {
  return await axiosAuth.get(`${baseUrl}/`);
};

export const useGetAllKycRequests = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["kycs"],
    queryFn: () => getAllKycRequests().then((res) => res.data.data),
    enabled: enabled,
  });
};

// VERIFY KYC

export const kycVerification = async ({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) => {
  return await axiosAuth.put(`${baseUrl}/${userId}/verify-kyc`, { status });
};

export const useKycVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: kycVerification,
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

// DELETE KYC

export const deleteKyc = async (userId: string) => {
  if (!userId) throw new Error("User Id is required");
  return await axiosAuth.delete(`${baseUrl}/${userId}/kyc-delete`);
};
export const useDeleteKyc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteKyc,
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
