export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId?: number;
  name?: string;
  email?: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dtlCdIds: string[];
}

export interface SignupResponse {
  userId?: number;
  email?: string;
  name?: string;
  message?: string;
}

export interface Language {
  id: number;
  name: string;
}
