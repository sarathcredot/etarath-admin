import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/users/vendor`;
const baseUrl2 = `${url}/admin/waerehouse`;
// GET ALL WAREHOUSES BY VENDOR ID
export const getAllVendorWarehouses = async ({
  vendorId,
  queryParams
}: {
  vendorId: any;
  queryParams?: any
}) => {
  if (!vendorId) throw new Error("Product Id is required");
  return await axiosAuth.get(`${baseUrl}/${vendorId}/warehouse`, {
    params: {
      ...queryParams
    }
  });
};

export const useGetAllVendorWarehouses = (
  vendorId: any,
  enabled: boolean,
  queryParams?: any
) => {
  return useQuery({
    queryKey: ["warehouses", vendorId, queryParams],
    queryFn: () =>
      getAllVendorWarehouses({ vendorId, queryParams }).then((res) => res.data.data),
    enabled: enabled,
  });
};


// GET  WAREHOUSES BY  ID
export const getWarehousesId = async ({
  vendorId,
  warehouseId
}: {
  vendorId: any;
  warehouseId: any;

}) => {
  if (!vendorId) throw new Error("Product Id is required");
  return await axiosAuth.get(`${baseUrl}/${vendorId}/warehouse/${warehouseId}`);
};

export const useGetWarehousesId = (
  vendorId: any,
  enabled: boolean,
  warehouseId: any
) => {
  return useQuery({
    queryKey: ["warehouse", warehouseId],
    queryFn: () =>
      getWarehousesId({ vendorId, warehouseId }).then((res) => res.data.data),
    enabled: enabled,
  });
};


// isSuspend

export const updateWarehouseStatus = async ({
  vendorId,
  warehouseId,
  isActive,
}: {
  vendorId: any;
  warehouseId: any;
  isActive: boolean;
}) => {
  if (!warehouseId) throw new Error("waerhouse id required");
  return await axiosAuth.put(`${baseUrl}/${vendorId}/warehouse/${warehouseId}/issuspend`, {
    issuspend: isActive,
  });
};

export const useUpdateWarehouseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWarehouseStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
    },
  });
};




// isSuspend

export const updateWarehouse = async ({
  vendorId,
  warehouseId,
  data,
}: {
  vendorId: any
  warehouseId: any;
  data: any;
}) => {
  if (!warehouseId) throw new Error("waerhouse id required");
  return await axiosAuth.put(`${baseUrl}/${vendorId}/warehouse/${warehouseId}`, data);
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
};


export const getWarehouseAllOrdersById = async (warehouseId: any | undefined, queryParams?: any) => {
  if (!warehouseId) throw new Error("No id provided");
  return await axiosAuth.get(`${baseUrl2}/${warehouseId}/orders`, {
    params: {
      ...queryParams
    }
  });
};

export const useGetWarehouseallOrdersById = (warehouseId: any | undefined, enabled: boolean, queryParams?: any) => {
  return useQuery({
    queryKey: ["warehouse-orders", warehouseId, queryParams],
    queryFn: () => getWarehouseAllOrdersById(warehouseId, queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};



export const getWarehouseAllClaimsById = async (warehouseId: any | undefined, queryParams?: any) => {
  if (!warehouseId) throw new Error("No id provided");
  return await axiosAuth.get(`${baseUrl2}/${warehouseId}/claims`, {
    params: {
      ...queryParams
    }
  });
};

export const useGetWarehouseallClaimsById = (warehouseId: any | undefined, enabled: boolean, queryParams?: any) => {
  return useQuery({
    queryKey: ["warehouse-claims", warehouseId, queryParams],
    queryFn: () => getWarehouseAllClaimsById(warehouseId, queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};




export const getWarehouseAllproductsById = async (warehouseId: any | undefined, queryParams?: any) => {
  if (!warehouseId) throw new Error("No id provided");
  return await axiosAuth.get(`${baseUrl2}/${warehouseId}/products`, {
    params: {
      ...queryParams
    }
  });
};

export const useGetWarehouseallProductsById = (warehouseId: any | undefined, enabled: boolean, queryParams?: any) => {
  return useQuery({
    queryKey: ["warehouse-products", warehouseId, queryParams],
    queryFn: () => getWarehouseAllproductsById(warehouseId, queryParams).then((res) => res?.data?.data),
    enabled: enabled,
  });
};




export const getAllVendorCustomers = async ({
  vendorId,
  queryParams
}: {
  vendorId: any;
  queryParams?: any
}) => {
  if (!vendorId) throw new Error("Product Id is required");
  return await axiosAuth.get(`${baseUrl}/${vendorId}/all-customers`, {
    params: {
      ...queryParams
    }
  });
};

export const useGetAllVendorCustomers = (
  vendorId: any,
  enabled: boolean,
  queryParams?: any
) => {
  return useQuery({
    queryKey: ["v-customers", vendorId, queryParams],
    queryFn: () =>
      getAllVendorCustomers({ vendorId, queryParams }).then((res) => res.data.data),
    enabled: enabled,
  });
};






// CREATE NEW waerhouse
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



// CREATE NEW PRODUCT
export const deletWarehouse = async ({
  vendorId,
  warehouseId,
}: {
  vendorId: string;
  warehouseId: any;
}) => {
  return await axiosAuth.delete(`${baseUrl}/${vendorId}/warehouse/${warehouseId}`,);
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
};



