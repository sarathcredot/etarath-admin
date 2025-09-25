import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/cms/offers`;

// GET ALL OFFERS
export const getOffers = async () => {
  return await axiosAuth.get(`${baseUrl}/`);
};

export const useGetOffers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["offers"],
    queryFn: () => getOffers().then((res) => res?.data?.data),
    enabled: enabled,
  });
};

// GET SINGLE OFFER
export const getSingleOffer = async ({ id }: { id: string }) => {
  return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetSingleOffer = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["offer", id],
    queryFn: () => getSingleOffer({ id }).then((res) => res?.data?.data || {}),
    enabled: enabled,
  });
};

// CREATE NEW OFFER
export const addOffer = async (data: any) => {
  return await axiosAuth.post(`${baseUrl}/`, data);
};

export const useAddOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
  });
};

// UPDATE AN OFFER
export const updateOffer = async ({
  id,
  data,
}: {
  id: string | undefined;
  data: any;
}) => {
  return await axiosAuth.patch(`${baseUrl}/${id}`, data);
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offer"] });
    },
  });
};

// UPDATE OFFER STATUS
export const updateOfferStatus = async ({
  id,
  status,
}: {
  id: string | undefined;
  status: boolean;
}) => {
  return await axiosAuth.patch(`${baseUrl}/${id}/update-status`, { status });
};

export const useUpdateOfferStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOfferStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offer"] });
    },
  });
};

// DELETE A OFFER
export const deleteOffer = async (id: string) => {
  return await axiosAuth.delete(`${baseUrl}/${id}`);
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offer"] });
    },
  });
};
