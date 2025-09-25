import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { url } from "./url.service";

const baseUrl = `${url}/auth`;

type LoginObj = {
  email: string;
  password: string;
};

export const login = (obj: LoginObj) => {
  return axios.post(`${baseUrl}/login`, obj);
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      localStorage.setItem("token", res?.data?.data?.token);
      localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
