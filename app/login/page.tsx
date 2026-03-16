"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/app/signup/AuthLayout";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      router.replace("/");
    }
  }, []);

  return (
    <AuthLayout
      title="로그인"
      description="이메일로 로그인해서 서비스를 이용해보세요."
    >
      <LoginForm />
    </AuthLayout>
  );
}
