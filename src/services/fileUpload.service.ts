import { useMutation } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/upload`;

export const uploadFile = (formData: any) => {
  return axiosAuth.post(`${baseUrl}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Set the correct content type
    },
  });
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: uploadFile,
    onSuccess: (res) => {
      // queryClient.invalidateQueries({ queryKey: [""] });
    },
  });
};

export const uploadMultiFile = (formData: any) => {
  return axiosAuth.post(`${baseUrl}/multiple`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Set the correct content type
    },
  });
};

export const useUploadMultiFile = () => {
  return useMutation({
    mutationFn: uploadMultiFile,
    onSuccess: (res) => {
      // queryClient.invalidateQueries({ queryKey: [""] });
    },
  });
};