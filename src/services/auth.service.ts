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





export const ForgetPassword = (obj: LoginObj) => {
  return axios.post(`${baseUrl}/forget-password`, obj);
};

export const useForgetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ForgetPassword,
    onSuccess: (res) => {
      // localStorage.setItem("token", res?.data?.data?.token);
      // localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};




export const otpVerify = (obj: LoginObj) => {
  return axios.post(`${baseUrl}/verify-reset-password-otp`, obj);
};

export const useOtpVerify = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: otpVerify,
    onSuccess: (res) => {
      // localStorage.setItem("token", res?.data?.data?.token);
      // localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};



export const resetPassword = (obj: LoginObj) => {
  return axios.post(`${baseUrl}/reset-password`, obj);
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (res) => {
      // localStorage.setItem("token", res?.data?.data?.token);
      // localStorage.setItem("user", JSON.stringify(res?.data?.data?.user));
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

