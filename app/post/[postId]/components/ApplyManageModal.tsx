"use client";

import { useMemo, useState } from "react";
import { X, Users, Link as LinkIcon, Check, Ban, Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FilterChip, TechTag } from "@/components/ui/FilterChip";
import { useApplicantsQuery } from "@/features/apply/apply.query";
import { useUpdateApplyStatusMutation } from "@/features/apply/apply.mutation";
import { ApplicantResponse } from "@/features/apply/apply.type";
import {
  APPLY_STATUS_CD,
  ApplyStatusCd,
} from "@/features/apply/apply.constants";
import { useAlertStore } from "@/store/alertStore";

interface ApplicantManageModalProps {
  postId: number;
  onClose: () => void;
}

type StatusFilter = "ALL" | ApplyStatusCd;

const STATUS_FILTERS: StatusFilter[] = [
  "ALL",
  APPLY_STATUS_CD.WAIT,
  APPLY_STATUS_CD.ACCEPT,
  APPLY_STATUS_CD.REJECT,
];

const FILTER_LABEL: Record<StatusFilter, string> = {
  ALL: "전체",
  [APPLY_STATUS_CD.WAIT]: "대기중",
  [APPLY_STATUS_CD.ACCEPT]: "수락",
  [APPLY_STATUS_CD.REJECT]: "거절",
};

const STATUS_BADGE_CLASS: Record<ApplyStatusCd, string> = {
  [APPLY_STATUS_CD.WAIT]: "bg-teamo-soft text-teamo",
  [APPLY_STATUS_CD.ACCEPT]: "bg-success-soft text-success",
  [APPLY_STATUS_CD.REJECT]: "bg-danger-soft text-danger",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ApplicantCard({
  applicant,
  onAccept,
  onReject,
  isUpdating,
}: {
  applicant: ApplicantResponse;
  onAccept: () => void;
  onReject: () => void;
  isUpdating: boolean;
}) {
  const [confirmingReject, setConfirmingReject] = useState<boolean>(false);

  return (
    <div className="border border-ink-200/70 rounded-[14px] p-5 flex flex-col gap-4">
      {/* 상단 정보 */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-teamo-soft text-teamo font-bold text-[15px] flex items-center justify-center shrink-0">
          {applicant.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-bold text-ink-900">
              {applicant.name}
            </span>
            <Badge variant="custom" className="bg-ink-100 text-ink-600">
              {applicant.recruitPositTypeNm}
            </Badge>
            <Badge
              variant="custom"
              className={STATUS_BADGE_CLASS[applicant.statusCd]}
            >
              {applicant.statusNm}
            </Badge>
          </div>
          <p className="text-[12px] text-ink-400 mt-1">
            {formatDate(applicant.regDt)} 지원
          </p>
        </div>
      </div>

      {/* 기술 스택 */}
      {applicant.techStackCd.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {applicant.techStackCd.map((tech) => (
            <TechTag key={tech}>{tech}</TechTag>
          ))}
        </div>
      )}

      {/* 지원 동기 */}
      <p className="text-[13px] text-ink-600 leading-relaxed whitespace-pre-wrap bg-ink-50 rounded-[10px] px-4 py-3">
        {applicant.applyReason}
      </p>

      {/* 포트폴리오 */}
      {applicant.portfolioUrl && (
        <a
          href={applicant.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teamo hover:underline w-fit"
        >
          <LinkIcon size={13} />
          포트폴리오 보기
        </a>
      )}

      {/* 액션 */}
      {applicant.statusCd === APPLY_STATUS_CD.WAIT && (
        <div className="flex gap-2 pt-1">
          {confirmingReject ? (
            <>
              <span className="flex-1 flex items-center text-[13px] font-semibold text-ink-500">
                정말 거절하시겠어요?
              </span>
              <Button
                variant="neutral"
                size="sm"
                onClick={() => setConfirmingReject(false)}
                disabled={isUpdating}
              >
                취소
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="!bg-danger hover:!bg-danger-700 !border-danger"
                onClick={onReject}
                loading={isUpdating}
              >
                거절 확정
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="neutral"
                size="sm"
                className="flex-1 !border-danger !text-danger hover:!bg-danger-soft"
                leftIcon={<Ban size={14} />}
                onClick={() => setConfirmingReject(true)}
                disabled={isUpdating}
              >
                거절
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                leftIcon={<Check size={14} />}
                onClick={onAccept}
                loading={isUpdating}
              >
                수락
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApplicantManageModal({
  postId,
  onClose,
}: ApplicantManageModalProps) {
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [updatingApplyId, setUpdatingApplyId] = useState<number | null>(null);

  const setAlert = useAlertStore((state) => state.setAlert);

  const { data: applicants, isLoading } = useApplicantsQuery(postId);
  const { mutate: updateStatus, isPending } =
    useUpdateApplyStatusMutation(postId);

  const list = applicants ?? [];

  const filteredList = useMemo(() => {
    if (filter === "ALL") return list;
    return list.filter((a) => a.statusCd === filter);
  }, [list, filter]);

  const counts = useMemo(
    () => ({
      ALL: list.length,
      [APPLY_STATUS_CD.WAIT]: list.filter(
        (a) => a.statusCd === APPLY_STATUS_CD.WAIT,
      ).length,
      [APPLY_STATUS_CD.ACCEPT]: list.filter(
        (a) => a.statusCd === APPLY_STATUS_CD.ACCEPT,
      ).length,
      [APPLY_STATUS_CD.REJECT]: list.filter(
        (a) => a.statusCd === APPLY_STATUS_CD.REJECT,
      ).length,
    }),
    [list],
  );

  const handleUpdate = (applyId: number, statusCd: ApplyStatusCd) => {
    setUpdatingApplyId(applyId);
    updateStatus(
      { applyId, statusCd },
      {
        onSuccess: () => {
          setAlert("완료되었습니다.");
        },
        onSettled: () => setUpdatingApplyId(null),
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[600px] bg-white rounded-[20px] shadow-2xl flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-ink-100">
          <div>
            <h2 className="text-[18px] font-extrabold text-ink-900 tracking-[-0.02em]">
              지원자 관리
            </h2>
            <p className="text-[13px] text-ink-400 mt-0.5">
              지원자 목록을 확인하고 수락 또는 거절할 수 있습니다.
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

        {/* 필터 탭 */}
        <div className="flex gap-2 px-6 py-3 border-b border-ink-100">
          {STATUS_FILTERS.map((key) => (
            <FilterChip
              key={key}
              active={filter === key}
              onClick={() => setFilter(key)}
            >
              {FILTER_LABEL[key]} {counts[key]}
            </FilterChip>
          ))}
        </div>

        {/* 목록 */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-3">
          {isLoading && (
            <p className="text-center text-[13px] text-ink-400 py-10">
              불러오는 중...
            </p>
          )}

          {!isLoading && filteredList.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-ink-300">
              <Inbox size={32} />
              <p className="text-[13px] font-medium text-ink-400">
                {filter === "ALL"
                  ? "아직 지원자가 없습니다."
                  : `${FILTER_LABEL[filter]} 상태의 지원자가 없습니다.`}
              </p>
            </div>
          )}

          {!isLoading &&
            filteredList.map((applicant) => (
              <ApplicantCard
                key={applicant.applyId}
                applicant={applicant}
                isUpdating={isPending && updatingApplyId === applicant.applyId}
                onAccept={() =>
                  handleUpdate(applicant.applyId, APPLY_STATUS_CD.ACCEPT)
                }
                onReject={() =>
                  handleUpdate(applicant.applyId, APPLY_STATUS_CD.REJECT)
                }
              />
            ))}
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-ink-100 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[12px] text-ink-400">
            <Users size={13} />총 {counts.ALL}명 지원 · 대기{" "}
            {counts[APPLY_STATUS_CD.WAIT]}명
          </span>
          <Button variant="neutral" size="md" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
