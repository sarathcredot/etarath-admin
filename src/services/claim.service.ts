

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/claim`;

// GET ORDER BY ID
export const getClaimById = async (id: string | undefined) => {
  if (!id) throw new Error("No id provided");
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetClaimById = (id: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ["claim", id],
    queryFn: () => getClaimById(id).then((res) => res?.data?.data),
    enabled: enabled,
  });
};


export const updateClaimStatus = async ({
  id,
  status,
}: {
  id: any;
  status: any;
}) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.put(`${baseUrl}/${id}/update-status`, { status });
};

export const useUpdateClaimStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClaimStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claim"] });
      queryClient.invalidateQueries({ queryKey: ["claims"] });


    },
  });
};
