"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutApi, getMe } from "@/features/auth/auth.query";
import { User } from "@/features/auth/auth.type";
import GlobalLoading from "../components/ui/loading/GlobalLoading";

interface AuthContextType {
  // 타입 정의
  user: User | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// 전역 상태 저장소(로그인 상태 전역 관리)
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 전역 상태 저장소에(Context)에 실제 값을 넣는 곳
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 유저 정보를 아직 확인 중인지 여부

  useEffect(() => {
    // 렌더링 이후에 실행되는 코드
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const result = await getMe();
        setUser(result);
      } catch (err) {
        console.error(err);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("accessToken", token);
    setUser(user);
  };

  const logout = async () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        await logoutApi();
      } catch (e) {
        console.error("logout api error", e);
      }
    }

    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {loading ? <GlobalLoading /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  // Context 꺼내는 커스텀 훅, 전역 로그인 상태를 가져오는 도구
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
