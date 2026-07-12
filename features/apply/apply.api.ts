import { get, patch, post } from "@/util/AxiosUtil";
import {
  ApplicantResponse,
  ApplyRequest,
  ApplyResponse,
  ApplyStatusUpdateRequest,
} from "./apply.type";

export const applyPost = (body: ApplyRequest) => {
  const { postId, ...rest } = body;
  return post<ApplyResponse>(`/api/v1/applies/${postId}`, rest);
};

/** 게시글 지원자 목록 조회 (스터디장 전용) */
export const fetchApplicants = (postId: number) =>
  get<ApplicantResponse[]>(`/api/v1/applies/${postId}`);

/** 지원 상태 변경 (수락/거절) */
export const updateApplyStatus = (body: ApplyStatusUpdateRequest) => {
  const { applyId, ...rest } = body;
  return patch<ApplyResponse>(`/api/v1/applies/${applyId}/status`, rest);
};
