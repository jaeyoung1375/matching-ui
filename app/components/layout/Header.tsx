"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { PenSquare, Bell } from "lucide-react";
import LoginModal from "@/app/login/LoginModal";
import Image from "next/image";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleWrite = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    router.push("/write");
  };

  const handleLogout = () => {
    logout();
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Teamo Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
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
                  <button className="rounded-full p-2 hover:bg-neutral-100">
                    <Bell className="h-5 w-5" />
                  </button>

                  {/* 프로필 */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-neutral-100"
                    >
                      <div className="h-8 w-8 rounded-full bg-neutral-300 flex items-center justify-center text-sm font-semibold">
                        {user.name[0]}
                      </div>

                      <span className="text-sm font-medium">{user.name}</span>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg">
                        <Link
                          href="/mypage"
                          className="block px-4 py-2 text-sm hover:bg-neutral-100"
                        >
                          마이페이지
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100"
                        >
                          로그아웃
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 글쓰기 */}
              <button
                onClick={handleWrite}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <PenSquare className="h-4 w-4" />
                글쓰기
              </button>
            </div>
          </div>
        </div>
      </header>

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
