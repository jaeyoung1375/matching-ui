"use client";

import { usePathname } from "next/navigation";

const pageTitleMap: Record<string, string> = {
  "/admin/dashboard": "대시보드",
  "/admin/code": "코드 관리",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title =
    Object.entries(pageTitleMap).find(([key]) => pathname.startsWith(key))?.[1] ??
    "관리자";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-base font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-2.5">
        <span className="text-sm text-gray-500">관리자</span>
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
