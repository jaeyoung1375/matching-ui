"use client";
import Link from "next/link";
import { BookmarkIcon } from "lucide-react";
import clsx from "clsx";
import { Badge } from "@/components/ui/Badge";
import { TechTag, RoleTag } from "@/components/ui/FilterChip";
import { useMemo } from "react";
import { calcDday } from "@/util/DateUtil";

export type StudyMode = "online" | "offline" | "hybrid";
export type StudyStatus = "open" | "closed" | "full";

export interface StudyCardData {
  postId: string;
  title: string;
  techStackCd: string[];
  recruitPositTypeNm: string[];
  name: string;
  progressTypeCd: string;
  status: StudyStatus;
  deadline: string; // 'D-7' | 'D-3' | '마감'
  deadlineUrgent?: boolean;
  viewCnt: number;
  comments: number;
  recruitCnt: string; // '2/4명'
  bookmarked?: boolean;
  isDeadlineOver?: string; // 마감여부
  recruitEndDate: string;
}

interface StudyCardProps {
  data: StudyCardData;
  onBookmark?: (id: string) => void;
  className?: string;
}

export function Card({ data, onBookmark, className }: StudyCardProps) {
  const {
    postId,
    title,
    techStackCd,
    recruitPositTypeNm,
    name,
    progressTypeCd,
    deadlineUrgent,
    isDeadlineOver,
    viewCnt,
    recruitCnt,
    bookmarked,
    recruitEndDate,
  } = data;

  const memoData = useMemo(() => {
    if (!data) return;

    // 마감기한
    const deadLine = calcDday(data.recruitEndDate);

    return {
      ...data,
      deadLine,
      isDeadlineOver: deadLine === "expired",
    };
  }, [data]);

  return (
    <>
      {memoData && (
        <Link
          href={`/post/${postId}`}
          className={clsx(
            "group flex flex-col bg-white rounded-[16px]",
            "border border-ink-200/70 overflow-hidden",
            "transition-all duration-150 hover:-translate-y-0.5 hover:shadow-card-hover",
            className,
          )}
        >
          {/* 상단: 배지 + 북마크 */}
          <div className="flex items-center justify-between px-4 pt-3.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {memoData.isDeadlineOver ? (
                <Badge variant="closed">마감</Badge>
              ) : (
                <Badge variant="open">모집중</Badge>
              )}
              <Badge
                variant={
                  memoData.progressTypeCd === "온라인"
                    ? "online"
                    : memoData.progressTypeCd === "오프라인"
                      ? "offline"
                      : "new"
                }
              >
                {memoData.progressTypeCd}
              </Badge>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onBookmark?.(memoData.postId);
              }}
              aria-label="북마크"
              className={clsx(
                "w-7 h-7 flex items-center justify-center rounded-[8px] transition-all duration-150",
                memoData.bookmarked
                  ? "text-teamo bg-teamo-soft"
                  : "text-ink-300 hover:text-teamo hover:bg-teamo-soft",
              )}
            >
              <BookmarkIcon
                size={15}
                fill={memoData.bookmarked ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>
          </div>

          {/* 본문 */}
          <div className="flex flex-col gap-2 px-4 py-2.5 flex-1">
            <h3 className="text-[15px] font-bold text-ink-900 leading-[1.45] tracking-[-0.01em] line-clamp-2">
              {memoData.title}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {memoData.techStackCd.map((t) => (
                <TechTag key={t}>{t}</TechTag>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {memoData.recruitPositTypeNm.map((r) => (
                <RoleTag key={r} color={"blue"}>
                  {r}
                </RoleTag>
              ))}
            </div>
            {/* 작성자 */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <div
                className={clsx(
                  "w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0",
                  "text-[10px] font-bold text-white bg-linear-to-br",
                  "from-teamo-400 to-teamo-300",
                )}
              >
                {memoData.name[0]}
              </div>
              <span className="text-[12px] font-semibold text-ink-600">
                {memoData.name}
              </span>
              <span className="text-[10px] text-ink-200">·</span>
              <span className="text-[11px] text-ink-400">{"프론트엔드"}</span>
            </div>
          </div>

          {/* 하단: 조회수·댓글·인원 + 마감일 */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-ink-100">
            <div className="flex items-center gap-2.5">
              {/* 조회수 */}
              <span className="flex items-center gap-1 text-[12px] text-ink-400 font-medium">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {memoData.viewCnt}
              </span>
              {/* 댓글 */}
              <span className="flex items-center gap-1 text-[12px] text-ink-400 font-medium">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {"14"}
              </span>
              {/* 인원 */}
              <span className="flex items-center gap-1 text-[12px] text-ink-400 font-medium">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                {memoData.recruitCnt}
              </span>
            </div>
            {/* 마감일 */}
            <span
              className={clsx(
                "text-[12px] font-bold px-2 py-0.5 rounded-[5px]",
                deadlineUrgent
                  ? "text-danger bg-danger-soft"
                  : "text-teamo bg-teamo-soft",
              )}
            >
              {memoData.isDeadlineOver ? "마감" : memoData.deadLine}
            </span>
          </div>
        </Link>
      )}
    </>
  );
}
