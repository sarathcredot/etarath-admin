import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/users`;

// UPDATE A PREFERENCE
export const updatePreference = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  if (!id) throw new Error("No id provided");
  return await axiosAuth.put(`${baseUrl}/${id}/priority`, data);
};

export const useUpdatePreference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePreference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
};
