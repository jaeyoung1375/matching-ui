export type ApplyRequest = {
  /** 게시글 ID */
  postId: number;

  /** 지원 포지션 코드 */
  recruitPositTypeCd: string;

  /** 기술스택 코드 목록 */
  techStackTypeCd: string[];

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
