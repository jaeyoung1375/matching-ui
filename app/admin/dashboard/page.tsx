"use client";

import { useEffect, useState } from "react";
import { Users, FileText, BookOpen, TrendingUp } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { fetchUserCounts } from "@/features/admin/admin.query";
import { UserCountsResponse } from "@/features/admin/admin.type";

/** 관리자 대시보드 페이지 — Teamo 운영 현황을 통계 카드로 표시한다 */
export default function DashboardPage() {
  const { user } = useAuth();
  const [counts, setCounts] = useState<UserCountsResponse | null>(null);

  useEffect(() => {
    fetchUserCounts()
      .then(setCounts)
      .catch(() => {});
  }, []);

  const stats = [
    {
      label: "총 회원수",
      value: counts ? counts.totalCount.toLocaleString() : "-",
      desc: counts
        ? `활성 ${counts.activeCount.toLocaleString()}명 · 탈퇴 ${counts.deactivatedCount.toLocaleString()}명`
        : "전체 가입 회원",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "게시글 수",
      value: "3,412",
      desc: "등록된 게시글",
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "스터디 그룹",
      value: "142",
      desc: "활성 스터디 그룹",
      icon: BookOpen,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "이번달 신규 회원",
      value: "98",
      desc: "이번달 가입자",
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          안녕하세요, {user?.name ?? "관리자"} (관리자)님
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Teamo 스터디 커뮤니티 운영 현황입니다.
        </p>
      </div>

      {/* 통계 카드 그리드 — 화면 크기에 따라 1~4열로 반응형 배치 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, desc, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{desc}</p>
              </div>
              {/* 카테고리별 색상이 적용된 아이콘 */}
              <div
                className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
