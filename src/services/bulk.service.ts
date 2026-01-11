

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/bulk`;



export const exportUserDataCSV = async (role: string) => {
    return axiosAuth.get(`${baseUrl}/export/users`, {
        params: { role },
        responseType: "blob", // IMPORTANT
    });
};


export const downloadBlob = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
};

export const getFileNameFromHeader = (contentDisposition?: string) => {
    if (!contentDisposition) return "";
    const match = /filename="?([^"]+)"?/i.exec(contentDisposition);
    return match?.[1] || "";
};



export const useExportUserDataCSV = () => {
    return useMutation({
        mutationFn: (role: string) => exportUserDataCSV(role),
        onSuccess: (res, role) => {
            const blob = new Blob([res.data], { type: "text/csv" });

            const cd = res.headers?.["content-disposition"];
            const headerName = getFileNameFromHeader(cd);

            const fileName = headerName || `users_export_${role}.csv`;
            downloadBlob(blob, fileName);
        },
    });
};






export const uploadZipFile = (formData: any) => {
    return axiosAuth.post(`${baseUrl}/import/images`, formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
        },
    });
};

export const useUploadZipFile = () => {
    return useMutation({
        mutationFn: uploadZipFile,
        onSuccess: (res) => {
            // queryClient.invalidateQueries({ queryKey: [""] });
        },
        onError: (err) => {
            console.log("File upload error: ", err);
        }
    });
};




export const uploadCsvFileBrand = (formData: any) => {
    return axiosAuth.post(`${baseUrl}/import/brands`, formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
        },
    });
};

export const useUploadCsvFileBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadCsvFileBrand,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["brands"] });
        },
        onError: (err) => {
            console.log("File upload error: ", err);
        }
    });
};


export const uploadCsvFileProduct = (formData: any) => {
    return axiosAuth.post(`${baseUrl}/import/products`, formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
        },
    });
};

export const useUploadCsvFileProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadCsvFileProduct,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (err) => {
            console.log("File upload error: ", err);
        }
    });
};





export const uploadCsvFileAttribute = (formData: any) => {
    return axiosAuth.post(`${baseUrl}/import/attributes`, formData, {
        headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
        },
    });
};

export const useUploadCsvFileAttribute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadCsvFileAttribute,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["attributes"] });
        },
        onError: (err) => {
            console.log("File upload error: ", err);
        }
    });
};