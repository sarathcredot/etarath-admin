




import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { url } from "./url.service";
import axiosAuth from "./axios.service";

const baseUrl = `${url}/admin/users`;

// GET agent BY ID
export const getSalesAgentById = async (id: any | undefined) => {
    if (!id) throw new Error("No id provided");
    return await axiosAuth.get(`${baseUrl}/${id}`);
};

export const useGetSalesAgentById = (id: any | undefined, enabled: boolean) => {
    return useQuery({
        queryKey: ["agent", id],
        queryFn: () => getSalesAgentById(id).then((res) => res?.data?.data),
        enabled: enabled,
    });
};


// create agent 





export const getSalesAgentAllOrdersById = async (id: string | undefined, queryParams?: any) => {
    if (!id) throw new Error("No id provided");
    return await axiosAuth.get(`${baseUrl}/sales-agent/${id}/all-orders`, {
        params: {
            ...queryParams
        }
    });
};

export const useGetSalesAgentallOrdersById = (id: any | undefined, enabled: boolean, queryParams?: any) => {
    return useQuery({
        queryKey: ["agent-orders", id, queryParams],
        queryFn: () => getSalesAgentAllOrdersById(id, queryParams).then((res) => res?.data?.data),
        enabled: enabled,
    });
};


export const getSalesAgentAllClaimsById = async (id: any | undefined, queryParams?: any) => {
    if (!id) throw new Error("No id provided");
    return await axiosAuth.get(`${baseUrl}/sales-agent/${id}/all-claims`, {
        params: {
            ...queryParams
        }
    });
};

export const useGetSalesAgentallClaimsById = (id: any | undefined, enabled: boolean, queryParams?: any) => {
    return useQuery({
        queryKey: ["agent-claims", id, queryParams],
        queryFn: () => getSalesAgentAllClaimsById(id, queryParams).then((res) => res?.data?.data),
        enabled: enabled,
    });
};




export const getSalesAgentAllTargetById = async (id: any | undefined, queryParams?: any) => {
    if (!id) throw new Error("No id provided");
    return await axiosAuth.get(`${baseUrl}/sales-agent/${id}/all-targets`, {
        params: {
            ...queryParams
        }
    });
};

export const useGetSalesAgentallTargetById = (id: any | undefined, enabled: boolean, queryParams?: any) => {
    return useQuery({
        queryKey: ["agent-target", id, queryParams],
        queryFn: () => getSalesAgentAllTargetById(id, queryParams).then((res) => res?.data?.data),
        enabled: enabled,
    });
};







// SUSPEND/UNSUSPEND A AGENT

export const updateaAgentStatus = async ({
    id,
    isActive,
}: {
    id: any;
    isActive: boolean;
}) => {
    if (!id) throw new Error("Retailer id required");
    return await axiosAuth.put(`${baseUrl}/issuspend/${id}`, {
        isSuspend: isActive,
    });
};

export const useUpdateagentStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateaAgentStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agent"] });
            queryClient.invalidateQueries({ queryKey: ["agent"] });
        },
    });
};



export const updateAgent = async ({
    id,
    data,
}: {
    id: number;
    data: any;
}) => {
    if (!id) throw new Error("No id provided");
    return await axiosAuth.put(`${baseUrl}/${id}`, data);
};

export const useUpdateAgent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agent"] });
            queryClient.invalidateQueries({ queryKey: ["agent"] });
            queryClient.invalidateQueries({ queryKey: ["sales-agents"] });
        },
    });
};





export const createAgent = async ({

    data,
}: {

    data: any;
}) => {

    return await axiosAuth.post(`${baseUrl}`, data);
};

export const useCreateAgent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sales-agents"] });
            queryClient.invalidateQueries({ queryKey: ["sales-agents"] });
        },
    });
};



export const deleteeAgent = async ({
    id,
   
}: {
    id:any;
   
}) => {

    return await axiosAuth.delete(`${baseUrl}/${id}/delete-agent`);
};

export const useDeleteAgent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteeAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sales-agents"] });
            queryClient.invalidateQueries({ queryKey: ["sales-agents"] });
        },
    });
};

