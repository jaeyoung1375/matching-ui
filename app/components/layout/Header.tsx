"use client";

import Link from "next/link";
import { PenSquare } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 min-w-max items-center justify-between gap-4 overflow-x-auto">
          <div className="flex shrink-0 items-center">
            <Link
              href="/"
              className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900"
            >
              Teamo
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 sm:px-4"
            >
              로그인
            </Link>

            <Link
              href="/signup"
              className="whitespace-nowrap rounded-full border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 sm:px-4"
            >
              회원가입
            </Link>

            <Link
              href="/write"
              className="inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-neutral-900 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 sm:px-4"
            >
              <PenSquare className="h-4 w-4" />
              글쓰기
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
