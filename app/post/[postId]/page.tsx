"use client";

import { useRouter, useParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TechTag } from "@/components/ui/FilterChip";
import { ChevronLeft, Clock, Users, Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";
import CommentSection from "./components/CommentSection";
import ApplyModal from "./components/ApplyModal";
import ApplyManageModal from "./components/ApplyManageModal";
import { usePostQuery } from "@/features/post/post.query";
import { calcDday, formatDateToKorean } from "@/util/DateUtil";
import { useAuth } from "@/app/context/AuthContext";

const MOCK = {
  title: "React + TypeScript 실전 프로젝트 스터디",
  status: "open" as const,
  progressTypeNm: "온라인",
  progressTypeCd: "ONLINE",
  period: "주 2회 (화, 목 오후 9시)",
  currentCnt: 2,
  recruitCnt: 4,
  deadline: "D-7",
  deadlineDate: "5월 8일",
  content:
    "안녕하세요! React와 TypeScript를 활용한 실전 프로젝트를 함께 완성해가는 스터디입니다.\n\n단순히 공부하는 것에 그치지 않고, 실제로 배포 가능한 사이드 프로젝트를 만들어 포트폴리오에 추가하는 것을 목표로 합니다. 현업에서 사용하는 패턴과 코드 리뷰 문화도 함께 익혀봐요.",
  techStacks: [
    "React 18",
    "TypeScript",
    "Next.js 14",
    "Tailwind CSS",
    "Zustand",
    "Vercel",
  ],
  recruitTargets: [
    "React 기초를 알고 있는 분 (useState, useEffect 경험자)",
    "포트폴리오를 준비 중인 취준생 또는 현업 주니어 개발자",
    "주 2회 미팅에 꾸준히 참석 가능한 분",
    "코드 리뷰와 피드백을 즐기는 분",
  ],
  positions: [
    { name: "프론트엔드", current: 2, max: 4 },
    { name: "백엔드", current: 0, max: 2 },
  ],
  members: [
    {
      name: "김민준",
      isLeader: true,
      description: "프론트엔드 개발자 · 3년차",
      bgClass: "from-orange-400 to-orange-300",
    },
    {
      name: "이지은",
      isLeader: false,
      description: "프론트엔드 취준생",
      bgClass: "from-blue-400 to-blue-300",
    },
  ],
  viewCnt: 128,
  bookmarkCnt: 34,
  applyCnt: 8,
};

export default function StudyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.postId);
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicantModalOpen, setApplicantModalOpen] = useState(false);

  const { data: post } = usePostQuery(postId);
  const isOwner = !!user && !!post && user.id === post.userId;

  const memoData = useMemo(() => {
    if (!post) return;

    // 마감기한
    const deadLine = calcDday(post.recruitEndDate);

    return {
      ...post,
      recruitEndDate: formatDateToKorean(post.recruitEndDate),
      deadLine,
      isDeadlineOver: deadLine === "expired",
      member: post.applyUsers.map((user, idx) => ({
        ...user,
        bgClass: "from-blue-400 to-blue-300",
        isLeader: user.userId === String(post.userId),
      })),
    };
  }, [post]);

  return (
    <main className="min-h-screen bg-ink-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-[14px] font-semibold text-ink-500 hover:text-ink-800 transition-colors mb-5"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
          목록으로 돌아가기
        </button>

        {memoData && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-7 items-start">
            {/* ── 좌측 본문 ── */}
            <div className="flex flex-col gap-5">
              {/* 헤더 카드 */}
              <div className="bg-white rounded-[16px] border border-ink-200/70 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={memoData.isDeadlineOver ? "closed" : "open"}>
                    {memoData.isDeadlineOver ? "마감" : "모집중"}
                  </Badge>
                  <Badge variant="online">{MOCK.progressTypeNm}</Badge>
                </div>
                <h1 className="text-[22px] font-extrabold text-ink-900 tracking-[-0.02em] leading-[1.35] mb-4">
                  {memoData.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-[13px] text-ink-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />
                    {MOCK.period}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={13} />
                    {1}/{memoData.recruitCnt}명 모집중
                  </span>
                  <span className="flex items-center gap-1.5 text-teamo font-bold">
                    <Calendar size={13} />
                    {memoData.isDeadlineOver
                      ? "마감"
                      : `마감 ${memoData.deadLine} (${memoData.recruitEndDate})`}
                  </span>
                </div>
              </div>

              {/* 스터디 소개 */}
              <div className="bg-white rounded-[16px] border border-ink-200/70 p-6">
                <h2 className="text-[16px] font-bold text-ink-900 mb-3">
                  스터디 소개
                </h2>
                <p className="text-[14px] text-ink-600 leading-relaxed whitespace-pre-wrap">
                  {memoData.content}
                </p>
              </div>

              {/* 기술 스택 */}
              <div className="bg-white rounded-[16px] border border-ink-200/70 p-6">
                <h2 className="text-[16px] font-bold text-ink-900 mb-3">
                  기술 스택
                </h2>
                <div className="flex flex-wrap gap-2">
                  {memoData.techStackCd.map((t) => (
                    <TechTag key={t} className="text-[13px] px-3 py-1">
                      {t}
                    </TechTag>
                  ))}
                </div>
              </div>

              {/* 모집 대상 */}
              <div className="bg-white rounded-[16px] border border-ink-200/70 p-6">
                <h2 className="text-[16px] font-bold text-ink-900 mb-3">
                  모집 대상
                </h2>
                <ul className="flex flex-col gap-2">
                  {/* {memoData.recruitTarget.map((target, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[14px] text-ink-600"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teamo shrink-0" />
                      {target}
                    </li>
                  ))} */}
                  <li
                    // key={i}
                    className="flex items-start gap-2 text-[14px] text-ink-600"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teamo shrink-0" />
                    {memoData.recruitTarget}
                  </li>
                </ul>
              </div>

              {/* 현재 멤버 */}
              <div className="bg-white rounded-[16px] border border-ink-200/70 p-6">
                <h2 className="text-[16px] font-bold text-ink-900 mb-4">
                  현재 멤버
                </h2>
                <div className="flex flex-col gap-3">
                  {memoData.member.map((user) => (
                    <div key={user.name} className="flex items-center gap-3">
                      <div
                        className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          "text-[15px] font-bold text-white bg-linear-to-br",
                          user.bgClass,
                        )}
                      >
                        {user.name[0]}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-ink-900">
                            {user.name}
                          </span>
                          {user.isLeader && (
                            <span className="text-[11px] font-bold text-teamo bg-teamo-soft px-2 py-0.5 rounded-[5px]">
                              리더
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-ink-400">
                          {/* {user.description} */}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 댓글 */}
              <CommentSection postId={postId} />
            </div>

            {/* ── 우측 지원 카드 ── */}
            <div className="lg:sticky lg:top-[76px]">
              <div className="bg-white rounded-[16px] border border-ink-200/70 p-5">
                <h3 className="text-[16px] font-bold text-ink-900">지원하기</h3>
                <p className="text-[13px] text-teamo mt-0.5 mb-4">
                  {memoData.isDeadlineOver ? (
                    "마감되었습니다"
                  ) : (
                    <>마감까지 {memoData.deadLine} 남았습니다</>
                  )}
                </p>

                {/* 포지션별 모집 현황 */}
                <div className="flex flex-col gap-3 mb-4">
                  {memoData.positions.map((pos) => (
                    <div key={pos.recruitPositTypeCd}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-semibold text-ink-700">
                          {pos.recruitPositTypeNm}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {Array.from({ length: pos.recruitCnt }).map((_, i) => (
                          <div
                            key={i}
                            className={clsx(
                              "w-2.5 h-2.5 rounded-full",
                              i < pos.currentCnt! ? "bg-teamo" : "bg-ink-200",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 버튼 */}
                {isOwner ? (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mb-2"
                    onClick={() => setApplicantModalOpen(true)}
                  >
                    지원자 관리
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full mb-2"
                      onClick={() => setApplyModalOpen(true)}
                      disabled={memoData.isDeadlineOver}
                    >
                      {memoData.isDeadlineOver ? "마감" : "지원하기"}
                    </Button>
                    <button
                      onClick={() => setBookmarked((v) => !v)}
                      className={clsx(
                        "w-full h-10.5 rounded-[10px] text-[15px] font-bold border transition-colors duration-150 flex items-center justify-center gap-2",
                        bookmarked
                          ? "bg-teamo-soft text-teamo border-teamo"
                          : "bg-transparent text-ink-700 border-ink-200 hover:border-teamo hover:text-teamo hover:bg-teamo-soft",
                      )}
                    >
                      {bookmarked ? "관심 등록됨" : "관심 등록"}
                    </button>
                  </>
                )}

                {/* 통계 */}
                <div className="mt-4 pt-4 border-t border-ink-100 text-center">
                  <p className="text-[12px] text-ink-400">
                    조회 {MOCK.viewCnt} · 관심 {MOCK.bookmarkCnt} · 지원{" "}
                    {MOCK.applyCnt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 지원하기 모달 */}
      {applyModalOpen && memoData && (
        <ApplyModal
          postId={postId}
          positions={(memoData.positions ?? []).map((idx) => ({
            code: idx.recruitPositTypeCd,
            name: idx.recruitPositTypeNm,
          }))}
          onClose={() => setApplyModalOpen(false)}
        />
      )}

      {/* 지원자 관리 모달 (스터디장 전용) */}
      {applicantModalOpen && (
        <ApplyManageModal
          postId={postId}
          onClose={() => setApplicantModalOpen(false)}
        />
      )}
    </main>
  );
}
