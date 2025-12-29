

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
