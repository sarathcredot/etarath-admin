import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/users`;



// GET A PREFERENCE BY USER ID

export const getPreferenceByUserId = async (id: string | undefined) => {
  if (!id) throw new Error("No id provided");
  return await axiosAuth.get(`${baseUrl}/${id}/priority`);
};

export const useGetPreferenceByUserId = (id: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ["preference", id],
    queryFn: () => getPreferenceByUserId(id).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

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
