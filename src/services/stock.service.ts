import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/product`;

// GET ALL STOCKS BY PRODUCT ID
export const getStocksByProductId = async ({
  productId,
}: {
  productId: string;
}) => {
  if (!productId) throw new Error("Product Id is required");
  return await axiosAuth.get(`${baseUrl}/${productId}/product-stocks`);
};

export const useGetStocksByProductId = (
  productId: string,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["stocks", productId],
    queryFn: () =>
      getStocksByProductId({ productId }).then((res) => res.data.data),
    enabled: enabled,
  });
};

// GET SINGLE STOCK BY ID
export const getStockById = async ({
  productId,
  stockId,
}: {
  productId?: string | undefined;
  stockId: string | undefined;
}) => {
  // if (!productId) throw new Error("Product Id is required");
  if (!stockId) throw new Error("Stock Id is required");
  return await axiosAuth.get(
    `${baseUrl}/${productId}/product-stock/${stockId}`
  );
};

export const useGetStockById = (
  IDs: {
    productId?: string | undefined;
    stockId: string | undefined;
  },
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["stock", IDs],
    queryFn: () => getStockById(IDs).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// CREATE NEW STOCK
export const createStock = async ({
  productId,
  data,
}: {
  productId: string;
  data: any;
}) => {
  if (!productId) throw new Error("Product Id is required");
  return await axiosAuth.post(`${baseUrl}/${productId}/product-stock`, data);
};

export const useCreateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
};

// UPDATE EXISTING STOCK
export const updateStock = async ({
  productId,
  stockId,
  data,
}: {
  productId?: string;
  stockId: string;
  data: any;
}) => {
  if (!stockId) throw new Error("stock id is required");
  return await axiosAuth.put(`${baseUrl}/${productId}/product-stock/${stockId}`, data);
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
};

// DELETE A PRODUCT
export const deleteStock = async (id: string) => {
  if (!id) throw new Error("Stock Id is required");
  return await axiosAuth.delete(`${baseUrl}/${id}`);
};

export const useDeleteStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
};

// ACTIVE CONTROLLER FOR PRODUCT
export const updateStockStatus = async ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.put(`${baseUrl}/${id}/issuspend-product`, { status });
};

export const useUpdateStockStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStockStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
};
