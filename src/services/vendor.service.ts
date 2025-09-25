import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/users`;

// GET ALL VENDORS
export const getAllVendors = async () => {
  return await axiosAuth.get(`${baseUrl}/?role=vendor`);
};

export const useGetAllVendors = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => getAllVendors().then((res) => res?.data?.data),
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
export const updateVendor = async ({ id, data }: { id: number; data: any }) => {
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

// // DELETE A ATTRIBUTE
// export const deleteAttribute = async (data: {
//   type: string;
//   attribute: string;
// }) => {
//   return await axiosAuth.delete(`${baseUrl}`, { data });
// };

// export const useDeleteAttribute = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: deleteAttribute,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["attributes"] });
//     },
//   });
// };
