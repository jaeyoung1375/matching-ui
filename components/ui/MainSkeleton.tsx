import Image from "next/image";

function Block({ className }: { className: string }) {
  return <div className={`bg-ink-100 animate-pulse rounded-md ${className}`} />;
}

export default function MainSkeleton() {
  return (
    <main className="min-h-screen bg-ink-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FFF8F0] via-teamo-soft to-teamo-light border-b border-teamo-100 py-16 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col items-start gap-6">
          <Image
            src="/logo.svg"
            alt="Teamo"
            width={160}
            height={48}
            className="opacity-30 animate-pulse"
          />
          <div className="flex flex-col gap-3">
            <Block className="w-80 h-10" />
            <Block className="w-96 h-10" />
          </div>
          <div className="flex flex-col gap-2">
            <Block className="w-96 h-4" />
            <Block className="w-72 h-4" />
          </div>
          <div className="flex gap-3">
            <Block className="w-36 h-12 rounded-[12px]" />
            <Block className="w-36 h-12 rounded-[12px]" />
          </div>
          <div className="flex gap-8 mt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Block className="w-16 h-7" />
                <Block className="w-12 h-3.5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FilterBar */}
      <div className="sticky top-[60px] z-40 bg-white border-b border-ink-200/70">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-2 h-[52px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <Block key={i} className="w-16 h-8 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-[1500px] mx-auto px-6 py-8 grid grid-cols-[1fr_280px] gap-7">
        <div className="flex flex-col gap-5">
          {/* 검색창 */}
          <Block className="w-full h-11 rounded-[10px]" />

          {/* 카드 그리드 */}
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[16px] border border-ink-200/70 p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between">
                  <Block className="w-16 h-5 rounded-full" />
                  <Block className="w-6 h-6 rounded-full" />
                </div>
                <Block className="w-full h-5" />
                <Block className="w-3/4 h-5" />
                <div className="flex gap-1.5">
                  <Block className="w-12 h-5 rounded-full" />
                  <Block className="w-14 h-5 rounded-full" />
                  <Block className="w-10 h-5 rounded-full" />
                </div>
                <div className="flex gap-1.5 mt-1">
                  <Block className="w-16 h-5 rounded-full" />
                </div>
                <div className="flex justify-between mt-auto pt-2 border-t border-ink-100">
                  <Block className="w-20 h-4" />
                  <Block className="w-16 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 사이드바 */}
        <aside className="flex flex-col gap-4">
          <div className="bg-white rounded-[16px] border border-ink-200/70 p-5 flex flex-col gap-2">
            <Block className="w-full h-11 rounded-[12px]" />
            <Block className="w-full h-11 rounded-[12px]" />
          </div>

          <div className="bg-white rounded-[16px] border border-ink-200/70 p-5">
            <Block className="w-28 h-5 mb-3.5" />
            <div className="grid grid-cols-2 gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="bg-ink-50 rounded-[8px] p-3 flex flex-col items-center gap-1.5">
                  <Block className="w-12 h-6" />
                  <Block className="w-14 h-3" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-ink-200/70 p-5">
            <Block className="w-24 h-5 mb-3.5" />
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Block key={i} className="w-14 h-6 rounded-full" />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 py-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Block key={i} className="w-9 h-9 rounded-[8px]" />
        ))}
      </div>
    </main>
  );
}
