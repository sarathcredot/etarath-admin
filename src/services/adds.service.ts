


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/cms/adds`;

// GET ALL adds
export const getAdds = async () => {
  return await axiosAuth.get(`${baseUrl}/`);
};

export const useGetAdds = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["adds"],
    queryFn: () => getAdds().then((res) => res?.data?.data),
    enabled: enabled,
  });
};



// CREATE NEW adds
export const createAdds = async (data: any) => {
  return await axiosAuth.post(`${baseUrl}/`, data);
};

export const usecreateAdds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adds"] });
    },
  });
};





// update status  adds
export const statusUpdateAdds = async ({ id, status }: { id: any, status: any }) => {
  console.log("api", status)
  return await axiosAuth.patch(`${baseUrl}/${id}`, { status });
};

export const usestatusUpdateAdds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: statusUpdateAdds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adds"] });
    },
  });
};


// update status  adds
export const statusDeleteAdds = async ( id:any) => {
  console.log("api", status)
  return await axiosAuth.delete(`${baseUrl}/${id}`);
};

export const usestatusDeleteAdds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: statusDeleteAdds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adds"] });
    },
  });
};