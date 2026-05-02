"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Code2 } from "lucide-react";
import { cn } from "@/util/cn";

/** 사이드바 네비게이션 항목 목록 */
const navItems = [
  { href: "/admin/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/code", label: "코드 관리", icon: Code2 },
];

/** 관리자 페이지 좌측 사이드바 — 네비게이션 메뉴를 제공한다 */
export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col shrink-0">
      {/* 로고 영역 */}
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <span className="text-lg font-bold tracking-tight">Teamo Admin</span>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              // 현재 경로와 일치하는 메뉴 항목에 활성 스타일 적용
              pathname.startsWith(href)
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white",
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
