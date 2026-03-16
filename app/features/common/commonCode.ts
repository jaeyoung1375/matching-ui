/**
 * 공통 코드 그룹 ID 목록
 *
 * 공통코드 조회 API(`/api/v1/codes`) 호출 시 사용하는 코드 그룹 식별자입니다.
 * 각 enum 값은 DB의 공통코드 그룹(COM_CD_ID)에 해당합니다.
 *
 * @example
 * // 공통코드 조회
 * const codeList = await fetchCodeList([
 *   CommonCode.RECRUIT_TYPE,
 *   CommonCode.PROGRESS_TYPE
 * ]);
 *
 * // 코드 사용
 * codeList[CommonCode.RECRUIT_TYPE]
 */
export enum CommonCode {
  /** 모집 구분 (스터디 / 프로젝트 등) */
  RECRUIT_TYPE = "RECRUIT_TYPE_CD",

  /** 모집 진행 상태 (모집중 / 모집완료 등) */
  PROGRESS_TYPE = "PROGRESS_TYPE_CD",

  /** 기술 스택 (Java, Spring, React 등) */
  TECH_STACK = "TECH_STACK",

  /** 모집 포지션 (백엔드, 프론트엔드 등) */
  RECRUIT_POSIT_TYPE = "RECRUIT_POSIT_TYPE_CD",

  /** 연락 방법 (이메일, 오픈채팅 등) */
  CONTACT_METHOD = "CONTACT_METHOD_CD",
}
