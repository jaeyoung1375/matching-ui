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
  techStackTypeCd?: string;

  /** 모집마감일 */
  recruitEndDate?: string | Date;

  /** 모집포지션구분코드 */
  recruitPositTypeCd?: string;

  /** 연락방법구분코드 */
  contactMethodCd?: string;
};
