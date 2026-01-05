import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/product`;

// GET ALL STOCKS BY PRODUCT ID
export const getStocksByProductId = async ({
  productId,
  queryParams
}: {
  productId: string;
  queryParams?: any
}) => {
  if (!productId) throw new Error("Product Id is required");
  return await axiosAuth.get(`${baseUrl}/${productId}/product-stocks`, {
    params: {
      ...queryParams
    }
  });
};

export const useGetStocksByProductId = (
  productId: string,
  enabled: boolean,
  queryParams?: any
) => {
  return useQuery({
    queryKey: ["stocks", productId, queryParams],
    queryFn: () =>
      getStocksByProductId({ productId, queryParams }).then((res) => res.data.data),
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



// GET  STOCK waerhouse BY ID
export const getStockwaerehouseById = async ({
  productId,
  stockId,
}: {
  productId?: string | undefined;
  stockId: string | undefined;
}, queryParams?: any) => {
  // if (!productId) throw new Error("Product Id is required");
  if (!stockId) throw new Error("Stock Id is required");
  return await axiosAuth.get(
    `${baseUrl}/${productId}/product-stock/${stockId}/all-waerehouses`, {
    params: {
      ...queryParams
    }
  }
  );
};

export const usegetStockwaerehouseById = (
  IDs: {
    productId?: string | undefined;
    stockId: string | undefined;
  },
  enabled: boolean,
  queryParams?: any
) => {
  return useQuery({
    queryKey: ["stock-waerehouses", IDs, queryParams],
    queryFn: () => getStockwaerehouseById(IDs, queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};


// update stock status in waerhouse
export const UpdateWaerehouseStockStatus = async ({
  productId,
  waerehousesId,
  status,
}: {
  productId: string;
  waerehousesId: any
  status: any;
}) => {
  if (!productId) throw new Error("Product Id is required");
  return await axiosAuth.put(
    `${baseUrl}/${productId}/product-stock/${productId}/waerehouse/${waerehousesId}/update-status`, { status })
};

export const useUpdateWaerehouseStockStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateWaerehouseStockStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-waerehouses"] });
      queryClient.invalidateQueries({ queryKey: ["stock-waerehouses"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-products"] });

    },
  });
};



// update stock qt in waerhouse
export const UpdateWaerehouseStockQt = async ({
  productId,
  waerehousesId,
  stock,
}: {
  productId: string;
  waerehousesId: any
  stock: any;
}) => {
  if (!productId) throw new Error("Product Id is required");
  return await axiosAuth.put(
    `${baseUrl}/${productId}/product-stock/${productId}/waerehouse/${waerehousesId}/update-quantity`, { stock })
};

export const useUpdateWaerehouseStockQt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateWaerehouseStockQt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-waerehouses"] });
      queryClient.invalidateQueries({ queryKey: ["stock-waerehouses"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-products"] });

    },
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
  return await axiosAuth.delete(`${baseUrl}/product-stock/${id}`);
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
