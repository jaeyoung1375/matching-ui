import { post, get, put, deleteData } from "@/util/AxiosUtil";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  Language,
  User,
} from "./auth.type";

export interface ApiResult<T> {
  code: string;
  message: string;
  data: T;
}

export const login = (data: LoginRequest) => {
  return post<ApiResult<LoginResponse>>("/api/v1/auth/public/login", data);
};

export async function signup(
  data: SignupRequest,
): Promise<ApiResult<SignupResponse>> {
  return post<ApiResult<SignupResponse>>("/api/v1/auth/public/signup", data);
}

export const checkEmail = (email: string) =>
  get<boolean>("/api/v1/auth/public/exists-email", {
    params: { email },
  });

export const getMe = (token: string) =>
  get<User>("/api/v1/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const logoutApi = (token: string) =>
  post<void>("/api/v1/auth/logout", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getLanguages = () =>
  get<Language[]>("/api/v1/auth/public/tech-stacks");

export const updateUser = (token: string, data: any) =>
  put("/api/v1/auth/me", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const withdrawUser = (token: string) =>
  deleteData("/api/v1/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
