// src/utils/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: string;
  data: T;
  message: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // API 기본 URL
  timeout: 5000, // 5초 타임아웃
});

api.interceptors.response.use(
  (res: AxiosResponse<ApiResponse<any>>) => {
    const { code, data, message } = res.data;

    if (code !== "0000") {
      return Promise.reject({ code, message, data });
    }

    return data;
  },
  (err) => {
    // 401 자동 로그아웃
    if (err.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }

    return Promise.reject(err);
  },
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// GET 요청
export const get = <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return api.get(url, config);
};

export const post = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return api.post(url, data, config);
};

export const put = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return api.put(url, data, config);
};

export const deleteData = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return api.delete(url, config);
};

export default api;
