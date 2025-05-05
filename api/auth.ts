import axiosInstance from "./axiosInstance";
import { AxiosResponse } from "axios";

export interface LoginResponse {
  token: string;
}

// 로그인
export const login = (
  email: string,
  password: string
): Promise<AxiosResponse<LoginResponse>> => {
  return axiosInstance.post("/login", { email, password });
};

export interface RegistrationRequest {
  username: string;
  email: string;
  password: string;
}

// 회원가입
export const registration = (data: RegistrationRequest) => {
  return axiosInstance.post("/registration", data);
};
