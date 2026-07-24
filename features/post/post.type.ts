import { StudyCardData } from "@/components/Card";
import { User } from "../auth/auth.type";

export type PostDto = {
  /** 게시판아이디 */
  postId?: number;

  /** 사용자아이디 */
  userId?: number;

  /** 카테고리아이디 */
  categoryId?: number;

  /** 제목 */
  title?: string;

  /** 내용 */
  content?: string;

  /** 상태 */
  status?: string;

  /** 조회수 */
  viewCnt?: number;

  /** 모집구분코드 */
  recruitTypeCd?: string;

  /** 모집인원 */
  recruitCnt?: number;

  /** 진행방식구분코드 */
  progressTypeCd?: string;

  /** 진행기간 */
  progressPeriod?: string;

  /** 기술스택구분코드 */
  techStackTypeCd?: string[];

  /** 모집마감일 */
  recruitEndDate?: string;

  /** 모집포지션구분코드 */
  recruitPositTypeCd?: string;

  /** 연락방법구분코드 */
  contactMethodCd?: string;

  /** 임시파일키 */
  tempKey?: string;
};

export type PostResponse = StudyCardData & {
  /** 게시판아이디 */
  postId?: number;

  /** 사용자아이디 */
  userId?: number;

  /** 제목 */
  title?: string;

  /** 내용 */
  content?: string;

  /** 상태 */
  status?: string;

  /** 조회수 */
  viewCnt?: number;

  /** 모집구분코드 */
  recruitTypeCd?: string;

  /** 모집구분코드명 */
  recruitTypeNm?: string;

  /** 모집인원 */
  recruitCnt: number;

  /** 진행방식구분코드 */
  progressTypeCd?: string;

  /** 진행방식구분코드명 */
  progressTypeNm?: string;

  /** 진행기간 */
  progressPeriod?: string;

  /** 기술스택구분코드 */
  techStackTypeCd?: string;

  /** 기술스택구분코드명 */
  techStack?: string;

  /** 모집마감일 */
  recruitEndDate: string;

  /** 모집포지션구분코드 */
  recruitPositTypeCd?: string;

  /** 모집포지션구분코드명 */
  recruitPositTypeNm?: string;

  /** 연락방법구분코드 */
  contactMethodCd?: string;

  /** 연락방법구분코드명 */
  contactMethodNm?: string;

  /** 모집대상 */
  recruitTarget: string;

  positions: RecruitPosition[];

  applyUsers: PostApplyUser[];
};

export type PostApplyUser = {
  userId: string;
  name: string;
};

export type PostRequest = {
  keyword?: string; // 검색어,
  positCd?: string; // 포지션 검색어
  techStackTypeCd?: string[]; // 기술스택구분코드
  progressTypeCd?: string; // 진행방식구분코드
  recruitPositTypeCd?: string; // 포지션구분코드
  pageNum?: number;
  sortType?: "new" | "popular" | "deadline";
};

// 조회용 (상세 페이지)
export type RecruitPosition = {
  recruitPositTypeCd: string; // 포지션 코드
  recruitPositTypeNm: string; // 포지션명
  recruitCnt: number; // 모집인원
  currentCnt?: number; // 현재인원
};

// 등록용 (게시글 작성)
export type RecruitPositionInput = {
  recruitPositTypeCd: string; // 포지션 코드
  recruitCnt: number; // 모집인원
};

export type PostRegisterRequest = {
  title: string; // 제목
  progressTypeCd: string; // 진행방식
  progressPeriod: string; // 진행기간
  recruitEndDate: string; // 모집마감일
  techStackTypeCd: string[]; // 기술스택
  recruitPositions?: RecruitPositionInput[]; // 포지션별 모집인원
  content: string; // 스터디소개
  recruitTarget: string; // 모집대상
};

// 수정용(게시물 수정)
export type PostModifyRequest = {
  title: string; // 제목
  progressTypeCd: string; // 진행방식
  progressPeriod: string; // 진행기간
  recruitEndDate: string; // 모집마감일
  techStackTypeCd: string[]; // 기술스택
  recruitPositions?: RecruitPositionInput[]; // 포지션별 모집인원
  content: string; // 스터디소개
  recruitTarget: string; // 모집대상
};

export type PostModifyParam = {
  postId: number;
  body: PostModifyRequest;
};
