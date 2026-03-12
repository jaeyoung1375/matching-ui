"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { logoutApi, getMe } from "../features/auth/auth.query";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const fetchUser = async () => {
      try {
        const result = await getMe(token);
        setUser(result.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        await logoutApi(token);
      } catch (e) {
        console.error("logout api error", e);
      }
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
