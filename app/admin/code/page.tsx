"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Search } from "lucide-react";
import { useAlertStore } from "@/store/alertStore";
import { useConfirmStore } from "@/store/confirmStore";
import {
  useAdminComCodeListQuery,
  useAdminDtlCodeListQuery,
  useCreateAdminComCodeMutation,
  useUpdateAdminComCodeMutation,
  useDeleteAdminComCodeMutation,
  useCreateAdminDtlCodeMutation,
  useUpdateAdminDtlCodeMutation,
  useDeleteAdminDtlCodeMutation,
} from "@/features/code/code.query";
import type {
  ComCodeResponse,
  codeResponse,
  ComCodeCreateRequest,
  ComCodeUpdateRequest,
  DtlCodeCreateRequest,
  DtlCodeUpdateRequest,
} from "@/features/code/code.type";
import AdminModal from "@/app/admin/components/AdminModal";
import GlobalLoading from "@/app/components/ui/loading/GlobalLoading";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// ── 공통코드 모달 ─────────────────────────────────────────

/** 공통코드 등록/수정 폼 필드 타입 */
type ComCodeFormValues = {
  comCdId: string;
  comCdNm: string;
  useYn: string;
};

/** 공통코드 등록 또는 수정 모달 */
function ComCodeModal({
  mode,
  defaultValues,
  onClose,
  onSubmit,
  isLoading,
}: {
  mode: "create" | "edit";
  defaultValues?: Partial<ComCodeFormValues>;
  onClose: () => void;
  onSubmit: (values: ComCodeFormValues) => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ComCodeFormValues>({
    defaultValues: { useYn: "Y", ...defaultValues },
  });

  return (
    <AdminModal
      open
      onClose={onClose}
      title={`공통코드 ${mode === "create" ? "등록" : "수정"}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 수정 모드에서는 ID 변경 불가 */}
        <Input
          label="공통코드 ID"
          hint={errors.comCdId?.message}
          state={errors.comCdId ? "error" : "default"}
          {...register("comCdId", { required: "공통코드 ID를 입력하세요." })}
          disabled={mode === "edit"}
          placeholder="예) TECH_STACK"
          className="!bg-white !h-10 !py-0 focus:!border-admin-primary disabled:!bg-gray-100 disabled:!cursor-not-allowed"
        />

        <Input
          label="공통코드명"
          hint={errors.comCdNm?.message}
          state={errors.comCdNm ? "error" : "default"}
          {...register("comCdNm", { required: "공통코드명을 입력하세요." })}
          placeholder="예) 기술스택"
          className="!bg-white !h-10 !py-0 focus:!border-admin-primary"
        />

        {/* select 공통 컴포넌트 없어 유지 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            사용여부
          </label>
          <select
            {...register("useYn")}
            className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary"
          >
            <option value="Y">사용</option>
            <option value="N">미사용</option>
          </select>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            className="flex-1 !h-10 !bg-gray-100 !text-gray-700 hover:!bg-gray-200"
          >
            취소
          </Button>
          <Button
            type="submit"
            size="md"
            disabled={isLoading}
            className="flex-1 !h-10 !bg-admin-primary hover:!bg-admin-primary-hover"
          >
            {isLoading ? "처리중..." : mode === "create" ? "등록" : "수정"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

// ── 상세코드 모달 ─────────────────────────────────────────

/** 상세코드 등록/수정 폼 필드 타입 */
type DtlCodeFormValues = {
  dtlCdId: string;
  dtlCdNm: string;
  dtlCdExpln: string;
  sortSeq: number;
  useYn: string;
};

/** 상세코드 등록 또는 수정 모달 */
function DtlCodeModal({
  mode,
  comCdId,
  defaultValues,
  onClose,
  onSubmit,
  isLoading,
}: {
  mode: "create" | "edit";
  comCdId: string;
  defaultValues?: Partial<DtlCodeFormValues>;
  onClose: () => void;
  onSubmit: (values: DtlCodeFormValues) => void;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DtlCodeFormValues>({
    defaultValues: { useYn: "Y", sortSeq: 1, ...defaultValues },
  });

  return (
    <AdminModal
      open
      onClose={onClose}
      title={`상세코드 ${mode === "create" ? "등록" : "수정"}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 선택된 공통코드에 종속되므로 수정 불가 */}
        <Input
          label="공통코드 ID"
          value={comCdId}
          disabled
          className="!bg-gray-100 !h-10 !py-0 !cursor-not-allowed"
        />

        {/* 수정 모드에서는 ID 변경 불가 */}
        <Input
          label="상세코드 ID"
          hint={errors.dtlCdId?.message}
          state={errors.dtlCdId ? "error" : "default"}
          {...register("dtlCdId", { required: "상세코드 ID를 입력하세요." })}
          disabled={mode === "edit"}
          placeholder="예) REACT"
          className="!bg-white !h-10 !py-0 focus:!border-admin-primary disabled:!bg-gray-100 disabled:!cursor-not-allowed"
        />

        <Input
          label="상세코드명"
          hint={errors.dtlCdNm?.message}
          state={errors.dtlCdNm ? "error" : "default"}
          {...register("dtlCdNm", { required: "상세코드명을 입력하세요." })}
          placeholder="예) React"
          className="!bg-white !h-10 !py-0 focus:!border-admin-primary"
        />

        <Input
          label="설명"
          {...register("dtlCdExpln")}
          placeholder="설명 (선택)"
          className="!bg-white !h-10 !py-0 focus:!border-admin-primary"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="정렬순서"
            type="number"
            hint={errors.sortSeq?.message}
            state={errors.sortSeq ? "error" : "default"}
            {...register("sortSeq", {
              required: "정렬순서를 입력하세요.",
              valueAsNumber: true,
              min: { value: 1, message: "1 이상 입력하세요." },
            })}
            className="!bg-white !h-10 !py-0 focus:!border-admin-primary"
          />

          {/* select 공통 컴포넌트 없어 유지 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사용여부
            </label>
            <select
              {...register("useYn")}
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary"
            >
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            className="flex-1 !h-10 !bg-gray-100 !text-gray-700 hover:!bg-gray-200"
          >
            취소
          </Button>
          <Button
            type="submit"
            size="md"
            disabled={isLoading}
            className="flex-1 !h-10 !bg-admin-primary hover:!bg-admin-primary-hover"
          >
            {isLoading ? "처리중..." : mode === "create" ? "등록" : "수정"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────

/** 공통코드 및 상세코드를 관리하는 관리자 페이지 */
export default function CodePage() {
  const { setAlert } = useAlertStore();
  const { setConfirm } = useConfirmStore();

  // 검색 입력값 — 엔터 또는 검색 버튼을 누르기 전까지 쿼리에 반영되지 않음
  const [searchInput, setSearchInput] = useState("");
  // 실제 API 쿼리에 사용하는 확정된 검색 파라미터
  const [searchParams, setSearchParams] = useState<{
    comCdNm?: string;
    useYn?: string;
  }>({});

  // 우측 상세코드 목록의 기준이 되는 선택된 공통코드
  const [selectedComCode, setSelectedComCode] = useState<ComCodeResponse | null>(null);

  // 공통코드 등록/수정 모달 상태
  const [comModal, setComModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data?: ComCodeResponse;
  }>({ open: false, mode: "create" });

  // 상세코드 등록/수정 모달 상태
  const [dtlModal, setDtlModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data?: codeResponse;
  }>({ open: false, mode: "create" });

  // ── 쿼리 ────────────────────────────────────────────────

  // 공통코드 목록 조회 — 검색 파라미터가 변경될 때마다 재요청
  const { data: comCodes = [], isLoading: comLoading } =
    useAdminComCodeListQuery(searchParams);

  // 선택된 공통코드의 상세코드 목록 조회 — comCdId가 없으면 요청하지 않음
  const { data: dtlCodes = [], isLoading: dtlLoading } =
    useAdminDtlCodeListQuery(selectedComCode?.comCdId);

  // ── 공통코드 뮤테이션 ───────────────────────────────────
  const createComCode = useCreateAdminComCodeMutation();
  const updateComCode = useUpdateAdminComCodeMutation();
  const deleteComCode = useDeleteAdminComCodeMutation();

  // ── 상세코드 뮤테이션 ───────────────────────────────────
  // 선택된 공통코드 ID를 전달하여 성공 시 해당 상세코드 캐시를 무효화
  const createDtlCode = useCreateAdminDtlCodeMutation(
    selectedComCode?.comCdId ?? "",
  );
  const updateDtlCode = useUpdateAdminDtlCodeMutation(
    selectedComCode?.comCdId ?? "",
  );
  const deleteDtlCode = useDeleteAdminDtlCodeMutation(
    selectedComCode?.comCdId ?? "",
  );

  // ── 검색 ─────────────────────────────────────────────────

  /** 검색 실행 — 입력값을 쿼리 파라미터로 확정하고 선택된 공통코드를 초기화 */
  const handleSearch = () => {
    setSearchParams(searchInput.trim() ? { comCdNm: searchInput.trim() } : {});
    setSelectedComCode(null);
  };

  /** 검색 초기화 — 입력값, 파라미터, 선택 상태 모두 초기화 */
  const handleSearchReset = () => {
    setSearchInput("");
    setSearchParams({});
    setSelectedComCode(null);
  };

  // ── 공통코드 핸들러 ──────────────────────────────────────

  /** 공통코드 등록 또는 수정 요청 후 모달 닫기 */
  const handleComCodeSubmit = async (values: {
    comCdId: string;
    comCdNm: string;
    useYn: string;
  }) => {
    try {
      if (comModal.mode === "create") {
        await createComCode.mutateAsync(values as ComCodeCreateRequest);
        setAlert("공통코드가 등록되었습니다.");
      } else {
        await updateComCode.mutateAsync({
          comCdId: values.comCdId,
          body: { comCdNm: values.comCdNm, useYn: values.useYn } as ComCodeUpdateRequest,
        });
        setAlert("공통코드가 수정되었습니다.");
      }
      setComModal({ open: false, mode: "create" });
    } catch {
      setAlert("처리 중 오류가 발생했습니다.");
    }
  };

  /** 공통코드 삭제 — 삭제된 항목이 선택 중이었다면 선택도 초기화 */
  const handleComCodeDelete = (item: ComCodeResponse) => {
    setConfirm(`'${item.comCdNm}' 공통코드를 삭제하시겠습니까?`, async () => {
      try {
        await deleteComCode.mutateAsync(item.comCdId);
        if (selectedComCode?.comCdId === item.comCdId) setSelectedComCode(null);
        setAlert("삭제되었습니다.");
      } catch {
        setAlert("삭제 중 오류가 발생했습니다.");
      }
    });
  };

  /** 사용여부 배지 클릭 시 Y ↔ N 즉시 토글 */
  const handleComCodeUseYnToggle = async (item: ComCodeResponse) => {
    try {
      await updateComCode.mutateAsync({
        comCdId: item.comCdId,
        body: {
          comCdNm: item.comCdNm,
          useYn: item.useYn === "Y" ? "N" : "Y",
        },
      });
    } catch {
      setAlert("처리 중 오류가 발생했습니다.");
    }
  };

  // ── 상세코드 핸들러 ──────────────────────────────────────

  /** 상세코드 등록 또는 수정 요청 후 모달 닫기 */
  const handleDtlCodeSubmit = async (values: {
    dtlCdId: string;
    dtlCdNm: string;
    dtlCdExpln: string;
    sortSeq: number;
    useYn: string;
  }) => {
    if (!selectedComCode) return;
    try {
      if (dtlModal.mode === "create") {
        await createDtlCode.mutateAsync({
          comCdId: selectedComCode.comCdId,
          ...values,
        } as DtlCodeCreateRequest);
        setAlert("상세코드가 등록되었습니다.");
      } else {
        await updateDtlCode.mutateAsync({
          dtlCdId: values.dtlCdId,
          body: {
            comCdId: selectedComCode.comCdId,
            dtlCdNm: values.dtlCdNm,
            dtlCdExpln: values.dtlCdExpln,
            sortSeq: values.sortSeq,
            useYn: values.useYn,
          } as DtlCodeUpdateRequest,
        });
        setAlert("상세코드가 수정되었습니다.");
      }
      setDtlModal({ open: false, mode: "create" });
    } catch {
      setAlert("처리 중 오류가 발생했습니다.");
    }
  };

  /** 상세코드 삭제 */
  const handleDtlCodeDelete = (item: codeResponse) => {
    setConfirm(`'${item.dtlCdNm}' 상세코드를 삭제하시겠습니까?`, async () => {
      try {
        await deleteDtlCode.mutateAsync(item.dtlCdId);
        setAlert("삭제되었습니다.");
      } catch {
        setAlert("삭제 중 오류가 발생했습니다.");
      }
    });
  };

  /** 사용여부 배지 클릭 시 Y ↔ N 즉시 토글 */
  const handleDtlCodeUseYnToggle = async (item: codeResponse) => {
    if (!selectedComCode) return;
    try {
      await updateDtlCode.mutateAsync({
        dtlCdId: item.dtlCdId,
        body: {
          comCdId: selectedComCode.comCdId,
          dtlCdNm: item.dtlCdNm,
          dtlCdExpln: item.dtlCdExpln ?? "",
          sortSeq: item.sortSeq ?? 1,
          useYn: item.useYn === "Y" ? "N" : "Y",
        },
      });
    } catch {
      setAlert("처리 중 오류가 발생했습니다.");
    }
  };

  /**
   * 상세코드 정렬 순서 변경 — 인접한 두 항목의 sortSeq를 스왑한다.
   * 두 건의 수정 API를 동시에 호출하여 처리한다.
   */
  const handleSortChange = async (item: codeResponse, direction: "up" | "down") => {
    if (!selectedComCode) return;
    const sorted = [...dtlCodes].sort(
      (a, b) => (a.sortSeq ?? 0) - (b.sortSeq ?? 0),
    );
    const idx = sorted.findIndex((i) => i.dtlCdId === item.dtlCdId);
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const target = sorted[targetIdx];
    try {
      await Promise.all([
        updateDtlCode.mutateAsync({
          dtlCdId: item.dtlCdId,
          body: {
            comCdId: selectedComCode.comCdId,
            dtlCdNm: item.dtlCdNm,
            dtlCdExpln: item.dtlCdExpln ?? "",
            sortSeq: target.sortSeq ?? targetIdx + 1,
            useYn: item.useYn ?? "Y",
          },
        }),
        updateDtlCode.mutateAsync({
          dtlCdId: target.dtlCdId,
          body: {
            comCdId: selectedComCode.comCdId,
            dtlCdNm: target.dtlCdNm,
            dtlCdExpln: target.dtlCdExpln ?? "",
            sortSeq: item.sortSeq ?? idx + 1,
            useYn: target.useYn ?? "Y",
          },
        }),
      ]);
    } catch {
      setAlert("정렬 변경 중 오류가 발생했습니다.");
    }
  };

  // 상세코드를 sortSeq 오름차순으로 정렬하여 표시
  const sortedDtlCodes = [...dtlCodes].sort(
    (a, b) => (a.sortSeq ?? 0) - (b.sortSeq ?? 0),
  );

  // 공통코드 최초 로딩 시 전체 화면 로딩 표시
  if (comLoading) return <GlobalLoading />;

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* 검색 바 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="공통코드명 검색"
            leftIcon={<Search className="w-4 h-4" />}
            className="!bg-white !h-10 !py-0 !rounded-lg focus:!border-admin-primary"
          />
        </div>
        <Button
          size="md"
          onClick={handleSearch}
          className="!h-10 !bg-admin-primary hover:!bg-admin-primary-hover"
        >
          검색
        </Button>
        {/* 검색어가 있을 때만 초기화 버튼 노출 */}
        {(searchInput || Object.keys(searchParams).length > 0) && (
          <Button
            variant="ghost"
            size="md"
            onClick={handleSearchReset}
            className="!h-10 !bg-gray-100 !text-gray-700 hover:!bg-gray-200"
          >
            초기화
          </Button>
        )}
      </div>

      {/* 테이블 영역 */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* 공통코드 목록 (왼쪽) */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">
              공통코드 목록
              {comCodes.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {comCodes.length}건
                </span>
              )}
            </h3>
            <Button
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setComModal({ open: true, mode: "create" })}
              className="!h-8 !bg-admin-primary hover:!bg-admin-primary-hover"
            >
              등록
            </Button>
          </div>

          <div className="overflow-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">
                    코드 ID
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">
                    코드명
                  </th>
                  <th className="text-center text-xs font-medium text-gray-500 px-4 py-2.5">
                    사용여부
                  </th>
                  <th className="text-center text-xs font-medium text-gray-500 px-4 py-2.5">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {comCodes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-400 text-sm">
                      등록된 공통코드가 없습니다.
                    </td>
                  </tr>
                ) : (
                  comCodes.map((item) => (
                    <tr
                      key={item.comCdId}
                      onClick={() => setSelectedComCode(item)}
                      className={`cursor-pointer transition-colors ${
                        selectedComCode?.comCdId === item.comCdId
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">
                        {item.comCdId}
                      </td>
                      <td className="px-4 py-3 text-gray-800">{item.comCdNm}</td>
                      <td className="px-4 py-3 text-center">
                        {/* 배지 클릭 시 사용여부 즉시 토글 — 행 선택 이벤트와 분리 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComCodeUseYnToggle(item);
                          }}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            item.useYn === "Y"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {item.useYn === "Y" ? "사용" : "미사용"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {/* 수정·삭제 버튼 클릭이 행 선택으로 전파되지 않도록 차단 */}
                        <div
                          className="flex items-center justify-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              setComModal({ open: true, mode: "edit", data: item })
                            }
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-admin-soft rounded transition-colors"
                            title="수정"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleComCodeDelete(item)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 상세코드 목록 (오른쪽) — 공통코드 선택 후에만 테이블 표시 */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">
              상세코드 목록
              {selectedComCode && (
                <span className="ml-2 text-xs font-normal text-blue-500">
                  {selectedComCode.comCdId}
                </span>
              )}
              {selectedComCode && dtlCodes.length > 0 && (
                <span className="ml-1 text-xs font-normal text-gray-400">
                  {dtlCodes.length}건
                </span>
              )}
            </h3>
            {/* 공통코드 미선택 시 등록 버튼 비활성화 */}
            <Button
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              disabled={!selectedComCode}
              onClick={() => setDtlModal({ open: true, mode: "create" })}
              className="!h-8 !bg-admin-primary hover:!bg-admin-primary-hover"
            >
              등록
            </Button>
          </div>

          <div className="overflow-auto flex-1">
            {!selectedComCode ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                왼쪽에서 공통코드를 선택하세요.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">
                      코드 ID
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5">
                      코드명
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-2.5 hidden lg:table-cell">
                      설명
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 px-4 py-2.5">
                      순서
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 px-4 py-2.5">
                      사용여부
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 px-4 py-2.5">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dtlLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                        로딩 중...
                      </td>
                    </tr>
                  ) : sortedDtlCodes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                        등록된 상세코드가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    sortedDtlCodes.map((item, idx) => (
                      <tr key={item.dtlCdId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {item.dtlCdId}
                        </td>
                        <td className="px-4 py-3 text-gray-800">{item.dtlCdNm}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                          {item.dtlCdExpln ?? "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-0.5">
                            <button
                              onClick={() => handleSortChange(item, "up")}
                              disabled={idx === 0}
                              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs text-gray-500 w-5 text-center">
                              {item.sortSeq}
                            </span>
                            <button
                              onClick={() => handleSortChange(item, "down")}
                              disabled={idx === sortedDtlCodes.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {/* 배지 클릭 시 사용여부 즉시 토글 */}
                          <button
                            onClick={() => handleDtlCodeUseYnToggle(item)}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              item.useYn === "Y"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {item.useYn === "Y" ? "사용" : "미사용"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() =>
                                setDtlModal({ open: true, mode: "edit", data: item })
                              }
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-admin-soft rounded transition-colors"
                              title="수정"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDtlCodeDelete(item)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* 공통코드 등록/수정 모달 */}
      {comModal.open && (
        <ComCodeModal
          mode={comModal.mode}
          defaultValues={
            comModal.data
              ? {
                  comCdId: comModal.data.comCdId,
                  comCdNm: comModal.data.comCdNm,
                  useYn: comModal.data.useYn,
                }
              : undefined
          }
          onClose={() => setComModal({ open: false, mode: "create" })}
          onSubmit={handleComCodeSubmit}
          isLoading={createComCode.isPending || updateComCode.isPending}
        />
      )}

      {/* 상세코드 등록/수정 모달 — 공통코드가 선택된 경우에만 열림 */}
      {dtlModal.open && selectedComCode && (
        <DtlCodeModal
          mode={dtlModal.mode}
          comCdId={selectedComCode.comCdId}
          defaultValues={
            dtlModal.data
              ? {
                  dtlCdId: dtlModal.data.dtlCdId,
                  dtlCdNm: dtlModal.data.dtlCdNm,
                  dtlCdExpln: dtlModal.data.dtlCdExpln ?? "",
                  sortSeq: dtlModal.data.sortSeq ?? 1,
                  useYn: dtlModal.data.useYn ?? "Y",
                }
              : undefined
          }
          onClose={() => setDtlModal({ open: false, mode: "create" })}
          onSubmit={handleDtlCodeSubmit}
          isLoading={createDtlCode.isPending || updateDtlCode.isPending}
        />
      )}
    </div>
  );
}
