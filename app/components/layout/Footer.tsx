"use client";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* 왼쪽 */}
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Teamo</h2>

            <p className="mt-2 text-sm text-neutral-600">
              같은 목표를 가진 사람들이 만나 팀을 만들고
              <br />
              새로운 프로젝트를 시작하는 협업 플랫폼입니다.
            </p>
          </div>

          {/* 오른쪽 copyright */}
          <div className="text-sm text-neutral-500 md:text-right">
            <p className="mt-2 text-sm text-neutral-600">
              Contact : teamo.dev@gmail.com
            </p>
            © {new Date().getFullYear()} Teamo. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
