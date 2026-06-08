"use client";

import { useState } from "react";
import { X, Briefcase, FileText, Link, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useApplyMutation } from "@/features/apply/apply.mutation";

// 기술스택 목록 (추후 API로 대체)
const TECH_STACK_LIST = [
  "React",
  "Vue",
  "Angular",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Spring",
  "Django",
  "FastAPI",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "Kubernetes",
  "AWS",
  "Figma",
  "Tailwind CSS",
];

interface ApplyModalProps {
  postId: number;
  positions: RecruitProps[]; // 해당 게시글의 모집 포지션 목록
  onClose: () => void;
  onSuccess?: () => void;
}

type RecruitProps = {
  code: string;
  name: string;
};

export default function ApplyModal({
  postId,
  positions,
  onClose,
  onSuccess,
}: ApplyModalProps) {
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [applyReason, setApplyReason] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [errors, setErrors] = useState<{ position?: string; reason?: string }>(
    {},
  );

  const { mutate: apply, isPending } = useApplyMutation();

  const toggleTechStack = (tech: string) => {
    setSelectedTechStacks((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech],
    );
  };

  const validate = () => {
    const newErrors: { position?: string; reason?: string } = {};
    if (!selectedPosition) newErrors.position = "지원 포지션을 선택해주세요.";
    if (!applyReason.trim()) newErrors.reason = "지원 동기를 입력해주세요.";
    else if (applyReason.trim().length < 20)
      newErrors.reason = "지원 동기를 20자 이상 입력해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    apply(
      {
        postId,
        recruitPositTypeCd: selectedPosition,
        techStackCd: selectedTechStacks,
        applyReason: applyReason.trim(),
        portfolioUrl: portfolioUrl.trim() || undefined,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      },
    );
  };

  return (
    /* 딤 배경 */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* 모달 */}
      <div className="relative w-full max-w-[540px] bg-white rounded-[20px] shadow-2xl flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-ink-100">
          <div>
            <h2 className="text-[18px] font-extrabold text-ink-900 tracking-[-0.02em]">
              스터디 지원하기
            </h2>
            <p className="text-[13px] text-ink-400 mt-0.5">
              아래 정보를 입력하고 지원서를 제출해주세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 스크롤 영역 */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">
          {/* 지원 포지션 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={15} className="text-teamo" />
              <span className="text-[14px] font-bold text-ink-800">
                지원 포지션
                <span className="text-teamo ml-0.5">*</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {positions.map((pos) => (
                <button
                  key={pos.code}
                  type="button"
                  onClick={() => {
                    setSelectedPosition(pos.code);
                    setErrors((prev) => ({ ...prev, position: undefined }));
                  }}
                  className={clsx(
                    "px-4 py-2 rounded-[10px] text-[13px] font-semibold border transition-all duration-150",
                    selectedPosition === pos.code
                      ? "bg-teamo text-white border-teamo shadow-sm"
                      : "bg-white text-ink-600 border-ink-200 hover:border-teamo hover:text-teamo",
                  )}
                >
                  {pos.name}
                </button>
              ))}
            </div>
            {errors.position && (
              <p className="text-[12px] text-red-500 mt-1.5">
                {errors.position}
              </p>
            )}
          </section>

          {/* 기술 스택 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[14px] font-bold text-ink-800">
                기술 스택
                <span className="text-[12px] text-ink-400 font-normal ml-1.5">
                  (선택 · 해당 포지션 기준)
                </span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK_LIST.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTechStack(tech)}
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all duration-150",
                    selectedTechStacks.includes(tech)
                      ? "bg-teamo-soft text-teamo border-teamo"
                      : "bg-ink-50 text-ink-500 border-ink-200 hover:border-teamo hover:text-teamo",
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
          </section>

          {/* 지원 동기 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={15} className="text-teamo" />
              <span className="text-[14px] font-bold text-ink-800">
                지원 동기
                <span className="text-teamo ml-0.5">*</span>
              </span>
            </div>
            <Textarea
              placeholder={`이 스터디에 지원하는 이유와 본인의 강점을 자유롭게 작성해주세요.\n(최소 20자)`}
              value={applyReason}
              onChange={(e) => {
                setApplyReason(e.target.value);
                if (e.target.value.trim().length >= 20)
                  setErrors((prev) => ({ ...prev, reason: undefined }));
              }}
              state={errors.reason ? "error" : "default"}
              hint={errors.reason}
              className="min-h-[140px]"
            />
            <p className="text-right text-[12px] text-ink-400 mt-1">
              {applyReason.length}자
            </p>
          </section>

          {/* 포트폴리오 URL */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Link size={15} className="text-teamo" />
              <span className="text-[14px] font-bold text-ink-800">
                포트폴리오 URL
                <span className="text-[12px] text-ink-400 font-normal ml-1.5">
                  (선택 · GitHub, Notion 등)
                </span>
              </span>
            </div>
            <div className="relative">
              <input
                type="url"
                placeholder="https://github.com/yourname"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className={clsx(
                  "w-full text-[14px] font-medium",
                  "border border-ink-200 rounded-[10px] px-4 py-3",
                  "text-ink-900 bg-white outline-none",
                  "transition-colors duration-150 placeholder:text-ink-300",
                  "focus:border-teamo",
                )}
              />
            </div>
          </section>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-ink-100 flex gap-3">
          <Button
            variant="neutral"
            size="lg"
            className="flex-1"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            loading={isPending}
            onClick={handleSubmit}
            rightIcon={<ChevronRight size={16} />}
          >
            지원하기
          </Button>
        </div>
      </div>
    </div>
  );
}
