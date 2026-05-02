"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

/**
 * 관리자 페이지 접근 권한 보호 컴포넌트.
 * 로그인 상태가 확인되지 않으면 홈(/)으로 리다이렉트한다.
 * 인증 로딩 중에는 아무것도 렌더링하지 않아 권한 없는 화면이 순간적으로 노출되는 것을 방지한다.
 */
export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 로딩이 완료된 후 비로그인 상태이면 홈으로 이동
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  // 인증 확인 중에는 빈 화면 유지
  if (loading) return null;
  // 비로그인 상태이면 리다이렉트 처리 중이므로 빈 화면 유지
  if (!user) return null;

  return <>{children}</>;
}
