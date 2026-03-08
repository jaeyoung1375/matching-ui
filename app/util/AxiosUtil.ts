// src/utils/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiResponse<T> {
  code: string;
  data: T;
  message: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // ✅ API 기본 URL
  timeout: 5000, // 5초 타임아웃
});

api.interceptors.response.use(
  <T>(res: AxiosResponse<ApiResponse<T>>) => {
    const { code, data, message } = res.data;

    if (code !== "0000") {
      // 서버 예외 발생 → error로 전달
      return Promise.reject({ code, message, data });
    }

    // 정상
    return data;
  },
  (err) => Promise.reject(err),
);

// GET 요청
export const get = <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  return api.get<ApiResponse<T>>(url, config) as Promise<T>;
};

// POST 요청
export const post = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) => api.post<ApiResponse<T>>(url, data, config);

// POST 요청
export const postForm = <T>(
  url: string,
  data?: FormData,
  config?: AxiosRequestConfig,
): Promise<T> => api.postForm(url, data, config);

// DELETE 요청
export const deleteData = <T>(url: string, config?: AxiosRequestConfig) =>
  api.delete<T>(url, config);

export default api;
