"use client";

import { useEffect, useState } from "react";
import {
  Search,
  X,
  ShieldCheck,
  ShieldOff,
  LogOut,
  ChevronDown,
  Clock,
  User,
} from "lucide-react";
import { fetchAdminUsers } from "@/features/admin/admin.query";
import { AdminUser } from "@/features/admin/admin.type";

// ── 상태 / 권한 뱃지 ────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "활성",
  DEACTIVATE: "탈퇴",
};

const STATUS_STYLE: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  DEACTIVATE: "bg-red-100 text-red-600",
};

const ROLE_STYLE: Record<string, string> = {
  ADMIN: "bg-blue-100 text-blue-700",
  USER: "bg-gray-100 text-gray-600",
};

const PROVIDER_LABEL: Record<string, string> = {
  LOCAL: "이메일",
  GOOGLE: "Google",
  KAKAO: "Kakao",
  GITHUB: "Github",
};

// ── 프로필 이미지 경로 처리 ──────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function resolveImageUrl(filePath?: string) {
  if (!filePath) return null;
  return filePath.startsWith("http") ? filePath : `${BASE_URL}${filePath}`;
}

// ── 상세 모달 ───────────────────────────────────────────────

function UserDetailModal({
  user,
  onClose,
  onStatusChange,
  onRoleChange,
  onForceLogout,
}: {
  user: AdminUser;
  onClose: () => void;
  onStatusChange: (userId: string, status: string) => void;
  onRoleChange: (userId: string, role: string) => void;
  onForceLogout: (userId: string) => void;
}) {
  const imgSrc = resolveImageUrl(user.filePath);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">회원 상세 정보</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* 프로필 */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={28} className="text-gray-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {user.name}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_STYLE[user.role] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {user.role}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[user.status] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {STATUS_LABEL[user.status] ?? user.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                가입 경로: {PROVIDER_LABEL[user.provider] ?? user.provider} ·
                가입일: {user.regDt}
              </p>
            </div>
          </div>

          {/* 마지막 접속 시간 */}
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <Clock size={15} className="text-gray-400" />
            <span>
              마지막 접속:{" "}
              <span className="font-medium text-gray-800">
                {user.lastLoginDt ?? "-"}
              </span>
            </span>
          </div>

          {/* 상태 변경 */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              상태 변경
            </p>
            <div className="flex gap-2">
              {(["ACTIVE", "DEACTIVATE"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusChange(user.userId, s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    user.status === s
                      ? `${STATUS_STYLE[s]} border-transparent`
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          {/* 권한 변경 */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              권한 변경
            </p>
            <div className="flex gap-2">
              {(["USER", "ADMIN"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onRoleChange(user.userId, r)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    user.role === r
                      ? `${ROLE_STYLE[r]} border-transparent`
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {r === "ADMIN" ? (
                    <ShieldCheck size={13} />
                  ) : (
                    <ShieldOff size={13} />
                  )}
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* JWT 강제 만료 */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              JWT 강제 만료
            </p>
            <button
              type="button"
              onClick={() => onForceLogout(user.userId)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
            >
              <LogOut size={14} />
              강제 로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ─────────────────────────────────────────────

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadUsers = async (keyword?: string) => {
    setIsLoading(true);
    try {
      let params: { name?: string; email?: string } | undefined;
      if (keyword) {
        // @가 포함되면 이메일 검색, 아니면 이름 검색
        if (keyword.includes("@")) {
          params = { email: keyword };
        } else {
          params = { name: keyword };
        }
      }
      const data = await fetchAdminUsers(params);
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 상태 필터는 클라이언트 사이드 (API 파라미터 없음)
  const filtered = users.filter(
    (u) => statusFilter === "ALL" || u.status === statusFilter,
  );

  const handleStatusChange = (userId: string, status: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, status } : u)),
    );
    setSelectedUser((prev) =>
      prev?.userId === userId ? { ...prev, status } : prev,
    );
  };

  const handleRoleChange = (userId: string, role: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, role } : u)),
    );
    setSelectedUser((prev) =>
      prev?.userId === userId ? { ...prev, role } : prev,
    );
  };

  const handleForceLogout = (userId: string) => {
    alert(`ID ${userId} 사용자의 JWT를 강제 만료했습니다.`);
  };

  return (
    <div className="space-y-5">
      {/* 검색 + 필터 */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* 검색창 */}
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") loadUsers(search);
            }}
            placeholder="닉네임 검색 · 이메일 검색(@포함) 후 Enter"
            className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                loadUsers();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* 상태 필터 */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none h-10 pl-3 pr-8 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-blue-400 bg-white cursor-pointer"
          >
            <option value="ALL">전체 상태</option>
            <option value="ACTIVE">활성</option>
            <option value="DEACTIVATE">탈퇴</option>
          </select>
          <ChevronDown
            size={13}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        <span className="text-sm text-gray-400 ml-auto">
          총{" "}
          <span className="font-semibold text-gray-700">{filtered.length}</span>
          명
        </span>
      </div>

      {/* 회원 테이블 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                ID
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                프로필
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                닉네임
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                이메일
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                가입 경로
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                권한
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                상태
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                마지막 접속
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500">
                상세
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-10 text-center text-sm text-gray-400"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-10 text-center text-sm text-gray-400"
                >
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((u) => {
                const imgSrc = resolveImageUrl(u.filePath);
                return (
                  <tr
                    key={u.userId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">
                      {u.userId}
                    </td>
                    {/* 프로필 이미지 */}
                    <td className="px-5 py-3.5">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-500">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={u.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          u.name[0]
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-800">
                      {u.name}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {PROVIDER_LABEL[u.provider] ?? u.provider}
                    </td>
                    {/* 권한 */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_STYLE[u.role] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    {/* 상태 */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[u.status] ?? "bg-gray-100 text-gray-600"}`}
                      >
                        {STATUS_LABEL[u.status] ?? u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {u.lastLoginDt ?? "-"}
                    </td>
                    {/* 상세 버튼 */}
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 상세 모달 */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onStatusChange={handleStatusChange}
          onRoleChange={handleRoleChange}
          onForceLogout={handleForceLogout}
        />
      )}
    </div>
  );
}
