"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface PaginationProps {
  /** 현재 페이지 (1-based) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 콜백 */
  onPageChange: (page: number) => void;
  /** 현재 페이지 양쪽에 표시할 페이지 수 (기본: 1) */
  siblingCount?: number;
}

/**
 * 현재 페이지를 기준으로 표시할 페이지 번호 배열을 생성한다.
 * 범위를 벗어나는 구간은 "..."으로 대체한다.
 */
function getPageRange(
  current: number,
  total: number,
  sibling: number,
): (number | "...")[] {
  // 전체 페이지가 충분히 적으면 모두 표시
  if (total <= sibling * 2 + 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftBound = Math.max(current - sibling, 2);
  const rightBound = Math.min(current + sibling, total - 1);

  const pages: (number | "...")[] = [1];

  if (leftBound > 2) pages.push("...");
  for (let i = leftBound; i <= rightBound; i++) pages.push(i);
  if (rightBound < total - 1) pages.push("...");

  pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  // 페이지가 1개 이하이면 렌더링하지 않음
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages, siblingCount);

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        className={clsx(
          "flex items-center justify-center w-9 h-9 rounded-[8px] transition-colors duration-150",
          currentPage === 1
            ? "text-ink-300 cursor-not-allowed"
            : "text-ink-500 hover:bg-teamo-soft hover:text-teamo",
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* 페이지 번호 목록 */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`dots-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-[13px] font-semibold text-ink-300 select-none"
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`${page}페이지`}
            aria-current={currentPage === page ? "page" : undefined}
            className={clsx(
              "w-9 h-9 rounded-[8px] text-[13px] font-semibold transition-colors duration-150",
              currentPage === page
                ? "bg-teamo text-white"
                : "text-ink-600 hover:bg-teamo-soft hover:text-teamo",
            )}
          >
            {page}
          </button>
        ),
      )}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        className={clsx(
          "flex items-center justify-center w-9 h-9 rounded-[8px] transition-colors duration-150",
          currentPage === totalPages
            ? "text-ink-300 cursor-not-allowed"
            : "text-ink-500 hover:bg-teamo-soft hover:text-teamo",
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
