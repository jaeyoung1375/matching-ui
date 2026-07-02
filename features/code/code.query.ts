import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { codeResponse, ComCodeResponse } from "./code.type";
import { SelectOption } from "@/components/SelectBox";
import { ApiError } from "../common/types/common.type";
import {
  fetchCodeList,
  fetchAdminComCodeList,
  fetchAdminDtlCodeList,
  createAdminComCode,
  updateAdminComCode,
  deleteAdminComCode,
  createAdminDtlCode,
  updateAdminDtlCode,
  deleteAdminDtlCode,
  fetchCode,
} from "./code.api";
import type {
  CodeRequest,
  ComCodeCreateRequest,
  ComCodeUpdateRequest,
  DtlCodeCreateRequest,
  DtlCodeUpdateRequest,
} from "./code.type";

// ── Public 쿼리 ──────────────────────────────────────────

export const useCodeQuery = (params: CodeRequest) =>
  useQuery<codeResponse[], ApiError>({
    queryKey: ["codes", params],
    queryFn: () => fetchCode(params),
    enabled: !!params.comCdId,
    staleTime: Infinity,
  });

// ── Admin - 공통코드 쿼리 & 뮤테이션 ──────────────────────

export const useAdminComCodeListQuery = (params?: {
  comCdNm?: string;
  useYn?: string;
}) =>
  useQuery<ComCodeResponse[], ApiError>({
    queryKey: ["admin", "com-codes", params],
    queryFn: () => fetchAdminComCodeList(params),
  });

export const useCreateAdminComCodeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ComCodeCreateRequest) => createAdminComCode(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "com-codes"] }),
  });
};

export const useUpdateAdminComCodeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      comCdId,
      body,
    }: {
      comCdId: string;
      body: ComCodeUpdateRequest;
    }) => updateAdminComCode(comCdId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "com-codes"] }),
  });
};

export const useDeleteAdminComCodeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (comCdId: string) => deleteAdminComCode(comCdId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "com-codes"] }),
  });
};

// ── Admin - 상세코드 쿼리 & 뮤테이션 ──────────────────────

export const useAdminDtlCodeListQuery = (comCdId?: string) =>
  useQuery<codeResponse[], ApiError>({
    queryKey: ["admin", "dtl-codes", comCdId],
    queryFn: () => fetchAdminDtlCodeList(comCdId!),
    enabled: !!comCdId,
  });

export const useCreateAdminDtlCodeMutation = (comCdId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: DtlCodeCreateRequest) => createAdminDtlCode(comCdId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "dtl-codes", comCdId] }),
  });
};

export const useUpdateAdminDtlCodeMutation = (comCdId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      dtlCdId,
      body,
    }: {
      dtlCdId: string;
      body: DtlCodeUpdateRequest;
    }) => updateAdminDtlCode(comCdId, dtlCdId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "dtl-codes", comCdId] }),
  });
};

export const useDeleteAdminDtlCodeMutation = (comCdId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dtlCdId: string) => deleteAdminDtlCode(comCdId, dtlCdId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "dtl-codes", comCdId] }),
  });
};
