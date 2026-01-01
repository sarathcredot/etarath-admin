import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/product`;

// GET ALL PRODUCTS
export const getAllProducts = async (query: {
  search?: string;
  status?: string;
  isSuspend?: string;
  limit?: number;
  page?: number;
}) => {
  return await axiosAuth.get(`${baseUrl}/`, { params: query });
};

export const useGetAllProducts = ({
  query,
  enabled = true,
}: {
  enabled?: boolean;
  query?: {
    search?: string;
    status?: string;
    isSuspend?: string;
    limit?: number;
    page?: number;
  };
}) => {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () =>
      getAllProducts(query ? query : {}).then((res) => res?.data?.data),
    enabled: enabled,
  });
};



// GET ALL requested PRODUCTS
export const getAllRequestedProducts = async (query: {
  search?: string;
  status?: string;
  isSuspend?: string;
  limit?: number;
  page?: number;
}) => {
  return await axiosAuth.get(`${baseUrl}/vendor-requested`, { params: query });
};

export const useGetAllRequestediProducts = ({
  query,
  enabled = true,
}: {
  enabled?: boolean;
  query?: {
    search?: string;
    status?: string;
    isSuspend?: string;
    limit?: number;
    page?: number;
  };
}) => {
  return useQuery({
    queryKey: ["requested-products", query],
    queryFn: () =>
      getAllRequestedProducts(query ? query : {}).then((res) => res?.data?.data),
    enabled: enabled,
  });
};





// GET SINGLE PRODUCT BY ID
export const getProductById = async (id: string | undefined) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetProductById = (id: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// CREATE NEW PRODUCT
export const createProduct = async (data: any) => {
  return await axiosAuth.post(`${baseUrl}/`, data);
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// UPDATE EXISTING PRODUCT
export const updateProduct = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.put(`${baseUrl}/${id}`, data);
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};





// UPDATE PRODUCT add to list
export const updateProductAndAddToList = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.put(`${baseUrl}/${id}/add-to-list`, data);
};

export const useUpdateProductAndAddToList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProductAndAddToList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};







// DELETE A PRODUCT
export const deleteProduct = async (id: string) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.delete(`${baseUrl}/${id}`);
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products-by-brand-id"] });
    },
  });
};

// ACTIVE CONTROLLER FOR PRODUCT
export const updateProductStatus = async ({
  id,
  status,
}: {
  id: string;
  status: boolean;
}) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.put(`${baseUrl}/${id}/issuspend-product`, { status });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProductStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products-by-brand-id"] });
    },
  });
};

// VERIFY REQUESTED PRODUCT
export const verifyProduct = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  if (!id) throw new Error("Product Id is required");
  return await axiosAuth.put(`${baseUrl}/${id}/verify-product`, { status });
};

export const useVerifyProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["products-by-brand-id"] });
    },
  });
};

// GET ALL PRODUCT ORDERS

export const getOrdersByProductId = async (productId: string) => {
  if (!productId) throw new Error("No product id provided");
  return await axiosAuth.get(`${baseUrl}/${productId}/all-orders`);
};

export const useGetOrdersByProductId = (
  productId: string,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["product-orders", productId],
    queryFn: () =>
      getOrdersByProductId(productId).then((res) => res?.data?.data),
    enabled: enabled,
  });
};
