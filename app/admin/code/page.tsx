"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
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

// ── 공통코드 모달 ─────────────────────────────────────────

type ComCodeFormValues = {
  comCdId: string;
  comCdNm: string;
  useYn: string;
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">
            공통코드 {mode === "create" ? "등록" : "수정"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              공통코드 ID
            </label>
            <input
              {...register("comCdId", { required: "공통코드 ID를 입력하세요." })}
              disabled={mode === "edit"}
              placeholder="예) TECH_STACK"
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {errors.comCdId && (
              <p className="text-xs text-red-500 mt-1">{errors.comCdId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              공통코드명
            </label>
            <input
              {...register("comCdNm", { required: "공통코드명을 입력하세요." })}
              placeholder="예) 기술스택"
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.comCdNm && (
              <p className="text-xs text-red-500 mt-1">{errors.comCdNm.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사용여부
            </label>
            <select
              {...register("useYn")}
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Y">사용</option>
              <option value="N">미사용</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-10 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isLoading ? "처리중..." : mode === "create" ? "등록" : "수정"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── 상세코드 모달 ─────────────────────────────────────────

type DtlCodeFormValues = {
  dtlCdId: string;
  dtlCdNm: string;
  dtlCdExpln: string;
  sortSeq: number;
  useYn: string;
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">
            상세코드 {mode === "create" ? "등록" : "수정"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              공통코드 ID
            </label>
            <input
              value={comCdId}
              disabled
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상세코드 ID
            </label>
            <input
              {...register("dtlCdId", { required: "상세코드 ID를 입력하세요." })}
              disabled={mode === "edit"}
              placeholder="예) REACT"
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {errors.dtlCdId && (
              <p className="text-xs text-red-500 mt-1">{errors.dtlCdId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상세코드명
            </label>
            <input
              {...register("dtlCdNm", { required: "상세코드명을 입력하세요." })}
              placeholder="예) React"
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dtlCdNm && (
              <p className="text-xs text-red-500 mt-1">{errors.dtlCdNm.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <input
              {...register("dtlCdExpln")}
              placeholder="설명 (선택)"
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                정렬순서
              </label>
              <input
                type="number"
                {...register("sortSeq", {
                  required: "정렬순서를 입력하세요.",
                  valueAsNumber: true,
                  min: { value: 1, message: "1 이상 입력하세요." },
                })}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.sortSeq && (
                <p className="text-xs text-red-500 mt-1">{errors.sortSeq.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                사용여부
              </label>
              <select
                {...register("useYn")}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Y">사용</option>
                <option value="N">미사용</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-10 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isLoading ? "처리중..." : mode === "create" ? "등록" : "수정"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────

export default function CodePage() {
  const { setAlert } = useAlertStore();
  const { setConfirm } = useConfirmStore();

  // 검색 상태
  const [searchInput, setSearchInput] = useState("");
  const [searchParams, setSearchParams] = useState<{
    comCdNm?: string;
    useYn?: string;
  }>({});

  // 선택된 공통코드
  const [selectedComCode, setSelectedComCode] = useState<ComCodeResponse | null>(null);

  // 모달 상태
  const [comModal, setComModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data?: ComCodeResponse;
  }>({ open: false, mode: "create" });

  const [dtlModal, setDtlModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    data?: codeResponse;
  }>({ open: false, mode: "create" });

  // ── 쿼리 ────────────────────────────────────────────────
  const { data: comCodes = [], isLoading: comLoading } =
    useAdminComCodeListQuery(searchParams);

  const { data: dtlCodes = [], isLoading: dtlLoading } =
    useAdminDtlCodeListQuery(selectedComCode?.comCdId);

  // ── 공통코드 뮤테이션 ───────────────────────────────────
  const createComCode = useCreateAdminComCodeMutation();
  const updateComCode = useUpdateAdminComCodeMutation();
  const deleteComCode = useDeleteAdminComCodeMutation();

  // ── 상세코드 뮤테이션 ───────────────────────────────────
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
  const handleSearch = () => {
    setSearchParams(searchInput.trim() ? { comCdNm: searchInput.trim() } : {});
    setSelectedComCode(null);
  };

  const handleSearchReset = () => {
    setSearchInput("");
    setSearchParams({});
    setSelectedComCode(null);
  };

  // ── 공통코드 핸들러 ──────────────────────────────────────
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

  const sortedDtlCodes = [...dtlCodes].sort(
    (a, b) => (a.sortSeq ?? 0) - (b.sortSeq ?? 0),
  );

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* 검색 바 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="공통코드명 검색"
            className="w-full h-10 pl-9 pr-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="h-10 px-4 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          검색
        </button>
        {(searchInput || Object.keys(searchParams).length > 0) && (
          <button
            onClick={handleSearchReset}
            className="h-10 px-4 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            초기화
          </button>
        )}
      </div>

      {/* 테이블 영역 */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* 공통코드 (왼쪽) */}
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
            <button
              onClick={() => setComModal({ open: true, mode: "create" })}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              등록
            </button>
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
                {comLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-400 text-sm">
                      로딩 중...
                    </td>
                  </tr>
                ) : comCodes.length === 0 ? (
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
                        <div
                          className="flex items-center justify-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              setComModal({ open: true, mode: "edit", data: item })
                            }
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
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

        {/* 상세코드 (오른쪽) */}
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
            <button
              onClick={() => setDtlModal({ open: true, mode: "create" })}
              disabled={!selectedComCode}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              등록
            </button>
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
                      <td
                        colSpan={6}
                        className="text-center py-10 text-gray-400 text-sm"
                      >
                        로딩 중...
                      </td>
                    </tr>
                  ) : sortedDtlCodes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-10 text-gray-400 text-sm"
                      >
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
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
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

      {/* 공통코드 모달 */}
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

      {/* 상세코드 모달 */}
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
