// 댓글 / 대댓글 (같은 테이블, PARENT_ID로 구분)
export type Comment = {
  commentId: number;
  postId: number;
  userId: number;
  userName: string;
  profileImageUrl?: string;
  content: string;
  parentId: number | null; // null = 루트 댓글, 숫자 = 대댓글
  regDt: string; // 등록일시 (REG_DT)
  modDt?: string; // 수정일시 (MOD_DT)
  useYn: string; // 사용여부 (USE_YN: Y/N)
  children?: Comment[]; // 백엔드에서 중첩하여 반환 시
  isOwner?: boolean; // 본인 작성 여부
};

// 댓글/대댓글 작성 요청
export type CreateCommentRequest = {
  content: string;
  parentId?: number | null;
};
