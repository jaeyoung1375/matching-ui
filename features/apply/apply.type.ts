import { ApplyStatusCd } from "./apply.constants";

export type ApplyRequest = {
  /** 게시글 ID */
  postId: number;

  /** 지원 포지션 코드 */
  recruitPositTypeCd: string;

  /** 기술스택 코드 목록 */
  techStackCd: string[];

  /** 지원 동기 */
  applyReason: string;

  /** 포트폴리오 URL (선택) */
  portfolioUrl?: string;
};

export type ApplyResponse = {
  applyId: number;
  postId: number;
  userId: number;
  statusCd: string;
  regDt: string;
};

/** 지원자 관리용 지원 내역 (스터디장 조회) */
export type ApplicantResponse = {
  applyId: number;
  postId: number;
  userId: number;
  name: string;
  profileImageUrl?: string;
  recruitPositTypeCd: string;
  recruitPositTypeNm: string;
  techStackCd: string[];
  techStackNm: string[];
  applyReason: string;
  portfolioUrl?: string;
  statusCd: ApplyStatusCd;
  statusNm: string;
  regDt: string;
};

export type ApplyStatusUpdateRequest = {
  applyId: number;
  statusCd: ApplyStatusCd;
};
