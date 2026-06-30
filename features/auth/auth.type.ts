export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dtlCdIds: string[];
  recruitPositTypeCd?: string;
  careerYrs?: string;
};

export type SignupResponse = {
  userId?: number;
  email?: string;
  name?: string;
  accessToken: string;
  refreshToken: string;
};

export type Language = {
  dtlCdId: string;
  dtlCdNm: string;
};

export type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
  profileImageUrl?: string;
  provider: string;
  languages: Language[];
  recruitPositTypeCd?: string;
  careerYrs?: string;
};

export type MyPageFormValues = {
  name: string;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string;
  recruitPositTypeCd?: string;
  careerYrs?: string;
};

export type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  recruitPositTypeCd?: string;
  careerYrs?: string;
};
