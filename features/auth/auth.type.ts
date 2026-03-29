export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
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
}

export interface Language {
  dtlCdId: string;
  dtlCdNm: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
  profileImageUrl?: string;
  provider: string;
  languages: Language[];
}
