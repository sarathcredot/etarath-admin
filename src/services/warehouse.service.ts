import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/users/vendor`;

// GET ALL WAREHOUSES BY VENDOR ID
export const getAllVendorWarehouses = async ({
  vendorId,
}: {
  vendorId: string;
}) => {
  if (!vendorId) throw new Error("Product Id is required");
  return await axiosAuth.get(`${baseUrl}/${vendorId}/warehouse`);
};

export const useGetAllVendorWarehouses = (
  vendorId: string,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["warehouses", vendorId],
    queryFn: () =>
      getAllVendorWarehouses({ vendorId }).then((res) => res.data.data),
    enabled: enabled,
  });
};

// CREATE NEW PRODUCT
export const createWarehouse = async ({
  vendorId,
  data,
}: {
  vendorId: string;
  data: any;
}) => {
  return await axiosAuth.post(`${baseUrl}/${vendorId}/warehouse`, data);
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
};
