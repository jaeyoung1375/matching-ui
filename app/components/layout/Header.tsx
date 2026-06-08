"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { PenSquare } from "lucide-react";
import LoginModal from "@/app/login/LoginModal";
import Image from "next/image";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import NotificationDropdown from "./NotificationDropdown";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isLoginOpen, setIsLoginOpen] = useState(false); // 로그인 모달 열림 여부

  if (loading) return null;

  const handleWrite = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    router.push("/post/register");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* 로고 */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Teamo Logo"
                width={240}
                height={100}
                className="h-16 w-32"
                priority
              />
            </Link>

            <div className="flex items-center gap-3">
              {/* 로그인 안했을 때 */}
              {!user && (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  로그인
                </button>
              )}

              {/* 로그인 했을 때 */}
              {user && (
                <>
                  {/* 알림 */}
                  <NotificationDropdown />

                  <Dropdown
                    trigger={
                      <button className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-neutral-100">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-neutral-300 flex items-center justify-center text-sm font-semibold">
                          {user?.profileImageUrl ? (
                            <img
                              src={`${baseUrl}${user.profileImageUrl}`}
                              alt="profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            (user?.name?.[0] ?? "?")
                          )}
                        </div>

                        <span className="text-sm font-medium">
                          {user?.name ?? ""}
                        </span>
                      </button>
                    }
                  >
                    {/* ADMIN 역할일 때만 어드민 버튼 표시 */}
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-sm hover:bg-neutral-100"
                      >
                        어드민 페이지
                      </Link>
                    )}

                    <Link
                      href="/mypage"
                      className="block px-4 py-2 text-sm hover:bg-neutral-100"
                    >
                      마이페이지
                    </Link>

                    <Button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 flex items-center justify-start"
                    >
                      로그아웃
                    </Button>
                  </Dropdown>
                </>
              )}

              {/* 글쓰기 */}
              <Button
                onClick={handleWrite}
                leftIcon={PenSquare}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                글쓰기
              </Button>
            </div>
          </div>
        </div>
      </header>

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
