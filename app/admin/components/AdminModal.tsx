"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

/** 관리자 화면 전용 공통 모달 props */
interface AdminModalProps {
  /** 모달 열림/닫힘 상태 */
  open: boolean;
  /** 닫기 콜백 — X 버튼, ESC 키, 배경 클릭 시 호출됨 */
  onClose: () => void;
  /** 모달 상단에 표시할 제목 */
  title: string;
  /** 모달 본문 영역 (폼 등) */
  children: ReactNode;
  /** 모달 하단 버튼 영역 (선택) */
  footer?: ReactNode;
}

/**
 * 관리자 화면에서 공통으로 사용하는 모달 컴포넌트.
 * ESC 키 닫기, 배경 클릭 닫기, 배경 스크롤 방지 기능을 포함한다.
 */
export default function AdminModal({
  open,
  onClose,
  title,
  children,
  footer,
}: AdminModalProps) {
  // 모달이 열릴 때 ESC 키 이벤트를 등록하고 배경 스크롤을 잠근다
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 — 클릭 시 모달 닫기 */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* 모달 본체 — 오버레이 클릭 이벤트가 전파되지 않도록 차단 */}
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더: 제목 + X 버튼 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="모달 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="px-6 py-5">{children}</div>

        {/* 푸터 버튼 영역 — 전달된 경우에만 렌더링 */}
        {footer && <div className="px-6 pb-5">{footer}</div>}
      </div>
    </div>
  );
}
