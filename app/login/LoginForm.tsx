"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/auth.query";
import { useAuth } from "../context/AuthContext";
import Button from "@/components/Button";
import { LoginRequest } from "@/features/auth/auth.type";
import { useForm } from "react-hook-form";
import { getMe } from "@/features/auth/auth.query";
import { useAlertStore } from "@/store/alertStore";
import { useEffect } from "react";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { login: setAuth } = useAuth();
  const setAlert = useAlertStore((state) => state.setAlert);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인된 경우 홈으로 이동
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/");
    }
  }, []);

  const onSubmit = async (data: LoginRequest) => {
    if (isLoading) return;

    setErrorMessage("");

    try {
      setIsLoading(true);

      const result = await login(data);

      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);

      const me = await getMe();
      setAuth(me, result.accessToken);

      router.push("/");
    } catch (error: any) {
      const code = error.response?.data?.code;

      let message =
        error.response?.data?.message || "로그인 중 오류가 발생했습니다.";

      if (code?.startsWith("U000")) {
        message = "이메일 또는 비밀번호를 확인해주세요.";
      }

      setAlert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            이메일
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            {...register("email", {
              required: "이메일을 입력해주세요.",
            })}
            className="h-12 w-full rounded-xl border px-4"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            비밀번호
          </label>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            {...register("password", {
              required: "비밀번호를 입력해주세요.",
            })}
            className="h-12 w-full rounded-xl border px-4"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <Button
          type="submit"
          loading={isLoading}
          className="inline-flex items-center justify-center h-10 px-5 text-xs rounded-md bg-orange-400 text-white hover:bg-orange-500"
        >
          로그인
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-500">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="font-semibold text-neutral-900">
          회원가입
        </Link>
      </div>
    </div>
  );
}
