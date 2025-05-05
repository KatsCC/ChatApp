import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (
      config.url &&
      (config.url.startsWith("/login") ||
        config.url.startsWith("/registration"))
    ) {
      console.log("로그인");
      return config;
    }

    const token = SecureStore.getItem("jwtToken");

    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const url = error.config?.url;

    if (
      error.response?.status === 401 &&
      url &&
      !url.startsWith("/login") &&
      !url.startsWith("/registration")
    ) {
      await SecureStore.deleteItemAsync("jwtToken");
      router.replace("/");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
