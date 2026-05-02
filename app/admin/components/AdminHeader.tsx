"use client";

import { usePathname } from "next/navigation";

/** 경로(pathname)와 표시할 페이지 제목의 매핑 */
const pageTitleMap: Record<string, string> = {
  "/admin/dashboard": "대시보드",
  "/admin/code": "코드 관리",
};

/** 관리자 페이지 상단 헤더 — 현재 경로에 맞는 페이지 제목을 표시한다 */
export default function AdminHeader() {
  const pathname = usePathname();

  // 현재 경로와 일치하는 첫 번째 항목의 제목을 사용, 없으면 기본값 "관리자"
  const title =
    Object.entries(pageTitleMap).find(([key]) => pathname.startsWith(key))?.[1] ??
    "관리자";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-base font-semibold text-gray-800">{title}</h1>
      {/* 관리자 프로필 영역 */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm text-gray-500">관리자</span>
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
