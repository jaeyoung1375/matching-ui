import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  Language,
} from "./auth.type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/public/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "로그인에 실패했습니다.");
  }

  const result = await response.json();

  // 백엔드 ApiResponse code 체크
  if (!response.ok || result.code !== "0000") {
    throw new Error(result.message || "로그인에 실패했습니다.");
  }
  return result.data;
}

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/public/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      dtlCdIds: data.dtlCdIds,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "회원가입에 실패했습니다.");
  }

  return response.json();
}

export async function checkEmail(email: string): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/public/exists-email?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "이메일이 중복 되었습니다.");
  }

  return response.json();
}

export async function getMe(token: string) {
  console.log(token);
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function logoutApi(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("로그아웃 실패");
  }

  return res.json();
}

export async function getLanguages(): Promise<Language[]> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/public/tech-stacks`, {
    method: "GET",
  });

  const json = await res.json();

  return json.data;
}
