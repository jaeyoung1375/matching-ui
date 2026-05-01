import { get, post, put, deleteData } from "@/util/AxiosUtil";
import {
  codeList,
  CodeRequest,
  codeResponse,
  ComCodeResponse,
  ComCodeCreateRequest,
  ComCodeUpdateRequest,
  DtlCodeCreateRequest,
  DtlCodeUpdateRequest,
} from "./code.type";

// ── Public APIs ──────────────────────────────────────────

export const fetchCodeList = (comCdIds: string[], param?: CodeRequest) =>
  get<codeList>("/api/v1/public/codes", {
    params: { comCdIds, param },
  });

export const fetchCode = (param?: CodeRequest) =>
  get<codeResponse[]>("/api/v1/public/code", {
    params: param,
  });

// ── Admin APIs - 공통코드(상위코드) ──────────────────────

export const fetchAdminComCodeList = (params?: {
  comCdNm?: string;
  useYn?: string;
}) => get<ComCodeResponse[]>("/api/v1/admin/codes", { params });

export const createAdminComCode = (body: ComCodeCreateRequest) =>
  post<void>("/api/v1/admin/code", body);

export const updateAdminComCode = (comCdId: string, body: ComCodeUpdateRequest) =>
  put<void>(`/api/v1/admin/code/${comCdId}`, body);

export const deleteAdminComCode = (comCdId: string) =>
  deleteData<void>(`/api/v1/admin/code/${comCdId}`);

// ── Admin APIs - 상세코드(하위코드) ──────────────────────

export const fetchAdminDtlCodeList = (comCdId: string) =>
  get<codeResponse[]>(`/api/v1/admin/code/${comCdId}/dtl`);

export const createAdminDtlCode = (body: DtlCodeCreateRequest) =>
  post<void>("/api/v1/admin/code/dtl", body);

export const updateAdminDtlCode = (dtlCdId: string, body: DtlCodeUpdateRequest) =>
  put<void>(`/api/v1/admin/code/dtl/${dtlCdId}`, body);

export const deleteAdminDtlCode = (dtlCdId: string) =>
  deleteData<void>(`/api/v1/admin/code/dtl/${dtlCdId}`);
