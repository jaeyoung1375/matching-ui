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
  return post<LoginResponse>("/api/v1/auth/public/login", data);
};

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  return post<SignupResponse>("/api/v1/auth/public/signup", data);
}

export const checkEmail = (email: string) =>
  get<boolean>("/api/v1/auth/public/exists-email", {
    params: { email },
  });

export const getMe = () => get<User>("/api/v1/auth/me");

export const logoutApi = () => post<void>("/api/v1/auth/logout");

export const getLanguages = () =>
  get<Language[]>("/api/v1/auth/public/tech-stacks");

export const updateUser = (data: any) => put("/api/v1/auth/me", data);

export const withdrawUser = () => deleteData("/api/v1/auth/me");
