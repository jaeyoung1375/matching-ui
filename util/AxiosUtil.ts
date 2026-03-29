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
      return Promise.reject({ code, data, message });
    }

    return data;
  },
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url;
    // 401 자동 로그아웃 (로그인 요청은 제외)
    if (status === 401 && !url.includes("/auth/login")) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }

    return Promise.reject(err);
  },
);

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

// POST 요청
export const post = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return api.post(url, data, config);
};

// POST 요청
export const postForm = <T>(
  url: string,
  data?: FormData,
  config?: AxiosRequestConfig,
): Promise<T> => api.postForm(url, data, config);

// PUT 요청
export const put = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return api.put(url, data, config);
};

// DELETE 요청
export const deleteData = <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return api.delete(url, config);
};

export default api;
