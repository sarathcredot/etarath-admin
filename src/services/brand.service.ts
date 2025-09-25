import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/brand`;

// GET ALL BRANDS
export const getAllBrands = async () => {
  return await axiosAuth.get(`${baseUrl}/`);
};

export const useGetAllBrands = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => getAllBrands().then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// GET SINGLE BRAND BY ID
export const getBrandById = async (id: string | undefined) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetBrandById = (id: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ["brand", id],
    queryFn: () => getBrandById(id).then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// CREATE NEW BRAND
export const createBrand = async (data: any) => {
  return await axiosAuth.post(`${baseUrl}/`, data);
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

// UPDATE EXISTING BRAND
export const updateBrand = async ({ id, data }: { id: string; data: any }) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.put(`${baseUrl}/${id}`, data);
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brand"] });
    },
  });
};

// DELETE A BRAND
export const deleteBrand = async (id: string) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.delete(`${baseUrl}/${id}`);
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brand"] });
    },
  });
};

// ACTIVE CONTROLLER FOR BRAND
export const updateBrandStatus = async ({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) => {
  if (!id) throw new Error("Id is required");
  return await axiosAuth.put(`${baseUrl}/${id}/active-controll`, { isActive });
};

export const useUpdateBrandStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBrandStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brand"] });
    },
  });
};

// GET ALL PRODUCTS BY BRAND ID
export const getAllProductsByBrandId = async (brand_id: string | undefined) => {
  if (!brand_id) throw new Error("Brand Id is required");
  return await axiosAuth.get(`${baseUrl}/${brand_id}/all-products`);
};

export const useGetAllProductsByBrandId = (
  brand_id: string | undefined,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ["products-by-brand-id", brand_id],
    queryFn: () =>
      getAllProductsByBrandId(brand_id).then((res) => res?.data?.data || []),
    enabled: enabled,
  });
};
