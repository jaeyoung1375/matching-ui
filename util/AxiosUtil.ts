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
  (res: AxiosResponse<ApiResponse<unknown>>) => {
    const { code, data, message } = res.data;

    if (code !== "0000") {
      return Promise.reject({ code, data, message });
    }

    return res;
  },
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url;

    if (status === 401 && !url?.includes("/auth/login")) {
      const hadToken = !!localStorage.getItem("accessToken");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // 토큰이 있었던 경우(세션 만료)만 홈으로 리다이렉트
      // 비로그인 상태에서 인증 필요 API를 호출한 경우는 그냥 에러로 흘려보냄
      if (hadToken) {
        window.location.href = "/";
        return new Promise(() => {});
      }
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
export const get = async <T>(url: string, config?: AxiosRequestConfig) => {
  const res = await api.get<ApiResponse<T>>(url, config);

  return res.data.data;
};

// POST 요청
export const post = async <T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
) => {
  const res = await api.post<ApiResponse<T>>(url, body, config);

  const { code, message, data } = res.data;

  return { code, message, data };
};

// POST 요청
export const postForm = async <T>(
  url: string,
  body?: FormData,
  config?: AxiosRequestConfig,
) => {
  const res = await api.postForm<ApiResponse<T>>(url, body, config);

  const { code, message, data } = res.data;

  return { code, message, data };
};

// DELETE 요청
export const deleteData = async <T>(
  url: string,
  config?: AxiosRequestConfig,
) => {
  const res = await api.delete<ApiResponse<T>>(url, config);

  const { code, data } = res.data;

  return { code, data };
};

// PUT 요청
export const put = async <T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
) => {
  const res = await api.put<ApiResponse<T>>(url, body, config);

  const { code, message, data } = res.data;

  return { code, message, data };
};

export default api;
