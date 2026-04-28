import { post, get, put, deleteData } from "@/util/AxiosUtil";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  Language,
  User,
} from "./auth.type";

export const login = (data: LoginRequest) => {
  return post<LoginResponse>("/api/v1/public/auth/login", data);
};

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const res = await post<SignupResponse>("/api/v1/public/auth/signup", data);
  return res.data;
}

export const checkEmail = (email: string) =>
  get<boolean>("/api/v1/public/auth/exists-email", {
    params: { email },
  });

export const getMe = () => get<User>("/api/v1/auth/me");

export const logoutApi = () => post<void>("/api/v1/auth/logout");

export const getLanguages = () =>
  get<Language[]>("/api/v1/public/auth/tech-stacks");

export const updateUser = (data: any) => put("/api/v1/auth/me", data);

export const withdrawUser = (data?: { currentPassword?: string }) => {
  return deleteData("/api/v1/auth/me", {
    data,
  });
};

export const uploadProfileImage = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return post("/api/v1/auth/profile-image", formData);
};
