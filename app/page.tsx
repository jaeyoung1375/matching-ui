"use client";
import PostList from "./post/PostList";
import { Button } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/Pagination";
import { PostRequest } from "@/features/post/post.type";
import { usePostListQuery } from "@/features/post/post.query";
import MainSkeleton from "@/components/ui/MainSkeleton";
import { useCodeQuery } from "@/features/code/code.query";
import { calcDday } from "@/util/DateUtil";

type StatusFilter = "open" | "all";

export default function Home() {
  const router = useRouter();

  // ── 필터 옵션 ─────────────────────────────────────────────────────

  const SORT_OPTIONS = ["최신순", "인기순", "마감임박"];

  const [activeSort, setActiveSort] = useState<string>("최신순");

  const [req, setReq] = useState<PostRequest>({
    pageNum: 1,
    keyword: "",
    recruitPositTypeCd: "",
  });

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open");

  const { data: post, isLoading } = usePostListQuery(req);

  const filteredPostData = useMemo(() => {
    if (!post) return undefined;
    if (statusFilter === "all") return post.data;
    return post.data.filter(
      (item) => calcDday(item.recruitEndDate) !== "expired",
    );
  }, [post, statusFilter]);

  const { data: RECRUIT_POSIT_LIST } = useCodeQuery({
    comCdId: "RECRUIT_POSIT_TYPE_CD",
    includeAll: true,
  });

  if (isLoading) return <MainSkeleton />;

  return (
    <>
      <main className="min-h-screen bg-ink-50">
        <section className="bg-linear-to-br from-[#FFF8F0] via-teamo-soft to-teamo-light border-b border-teamo-100 py-10 px-4 sm:py-16 sm:px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="inline-flex items-center gap-1.5 bg-white border border-teamo-100 rounded-full px-3.5 py-1.5 text-[13px] font-bold text-teamo mb-5">
              <span className="w-[7px] h-[7px] rounded-full bg-teamo" />
              IT 직군 스터디 커뮤니티
            </div>
            <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold text-ink-900 tracking-[-0.03em] leading-[1.15] mb-4">
              함께 성장하는
              <br />
              <em className="not-italic text-teamo">스터디 팀</em>을 찾아보세요
            </h1>
            <p className="text-[15px] sm:text-[17px] text-ink-700 leading-relaxed mb-8 max-w-[500px]">
              개발자, 기획자, 디자이너 — IT 직종 취준생과 현업자를 위한
              <br />
              스터디 모집 플랫폼
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="xl">
                스터디 둘러보기
              </Button>
              <Button variant="neutral" size="xl">
                스터디 만들기 →
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 sm:gap-8 mt-10">
              {[
                ["2,840+", "활성 스터디"],
                ["18,500+", "가입 회원"],
                ["94%", "매칭 성공률"],
              ].map(([num, label]) => (
                <div key={label}>
                  <div className="text-[22px] sm:text-[26px] font-extrabold text-ink-900 tracking-[-0.02em]">
                    {num}
                  </div>
                  <div className="text-[13px] text-ink-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 필터바 ── */}
        <div className="sticky top-15 z-40 bg-white border-b border-ink-200/70">
          <div className="max-w-350 mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 h-13 overflow-x-auto scrollbar-hide">
              {RECRUIT_POSIT_LIST?.map((f) => (
                <FilterChip
                  key={f.dtlCdId}
                  active={req.recruitPositTypeCd === f.dtlCdId}
                  onClick={() => {
                    setReq((prev) => ({
                      ...prev,
                      recruitPositTypeCd: f.dtlCdId,
                    }));
                  }}
                >
                  {f.dtlCdNm}
                </FilterChip>
              ))}
              <div className="w-px h-5 bg-ink-200 shrink-0 mx-1" />
              <FilterChip
                active={statusFilter === "open"}
                onClick={() => setStatusFilter("open")}
              >
                모집중
              </FilterChip>
              <FilterChip
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
              >
                전체
              </FilterChip>
              <div className="w-px h-5 bg-ink-200 shrink-0 mx-1" />
              <div className="flex items-center gap-1 ml-auto shrink-0">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSort(s)}
                    className={[
                      "text-[13px] font-semibold px-2.5 py-1.5 rounded-sm transition-colors duration-150",
                      activeSort === s
                        ? "text-teamo bg-teamo-soft"
                        : "text-ink-400 hover:text-ink-700",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-7">
          <div className="mb-5">
            <Input
              placeholder="스터디, 기술스택, 역할로 검색해보세요"
              value={req.keyword}
              onChange={(e) => {
                setReq((prev) => ({
                  ...prev,
                  keyword: e.target.value,
                  pageNum: 1,
                }));
              }}
              leftIcon={<SearchIcon size={18} />}
            />
            {filteredPostData && (
              <PostList
                data={filteredPostData}
                onResetFilter={() => {
                  setActiveSort("최신순");
                  setStatusFilter("open");
                  setReq({
                    pageNum: 1,
                    keyword: "",
                    recruitPositTypeCd: "",
                  });
                }}
              />
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <div className="bg-white rounded-[16px] border border-ink-200/70 p-5">
              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    router.push("/post/register");
                  }}
                >
                  <span className="text-lg leading-none">+</span> 새 스터디
                  만들기
                </Button>
                <Button
                  variant="neutral"
                  size="lg"
                  className="w-full justify-start gap-2"
                >
                  🔖 관심 스터디 보기
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-[16px] border border-ink-200/70 p-5">
              <h3 className="text-[15px] font-bold text-ink-900 mb-3.5">
                📊 이번 주 현황
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  ["128", "신규 모집"],
                  ["342", "지원 완료"],
                  ["56", "팀 결성"],
                  ["18", "마감 임박"],
                ].map(([num, label]) => (
                  <div
                    key={label}
                    className="bg-ink-50 rounded-sm p-3 text-center"
                  >
                    <div className="text-[22px] font-extrabold text-teamo tracking-[-0.02em]">
                      {num}
                    </div>
                    <div className="text-[11px] text-ink-400 mt-0.5">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[16px] border border-ink-200/70 p-5">
              <h3 className="text-[15px] font-bold text-ink-900 mb-3.5">
                🔥 인기 기술 스택
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "React",
                  "TypeScript",
                  "Spring",
                  "Python",
                  "Flutter",
                  "Next.js",
                  "Vue.js",
                  "Node.js",
                  "Docker",
                  "Kotlin",
                ].map((tag) => (
                  <button
                    key={tag}
                    className="text-[12px] font-semibold px-2.5 py-1 rounded-full bg-ink-100 text-ink-600 hover:bg-teamo-soft hover:text-teamo transition-colors duration-150"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
        {post && (
          <Pagination
            currentPage={post?.pageNum}
            totalPages={post?.pages}
            onPageChange={(e) => {
              setReq((prev) => ({
                ...prev,
                pageNum: Number(e),
              }));
            }}
          />
        )}
      </main>
    </>
  );
}
