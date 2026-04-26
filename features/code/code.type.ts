// 요청 타입
export type CodeRequest = {
  comCdId?: string; // 공통코드아이디
  comCdIds?: string[]; // 공통코드아이디
  dtlCdId?: string; // 상세코드아이디
  dtlCdExpln?: string;
};

// 응답 타입
export type codeResponse = {
  comCdId: string; // 공통코드아이디

  comCdNm: string; // 공동코드명

  dtlCdId: string; // 상세코드아이디

  dtlCdNm: string; // 상세코드명

  dtlCdExpln?: string; // 상세코드설명

  lnkgDtlCdId1?: string; // 연결상세코드아이디1

  lnkgDtlCdNm1?: string; // 연결상세코드명1

  lnkgDtlCdId2?: string; // 연결상세코드아이디2

  lnkgDtlCdNm2?: string; // 연결상세코드명2

  useYn?: string; // 사용여부

  sortSeq?: number; // 정렬순서

  regId?: string; // 동록아이디

  regDt?: string; // 등록일시

  modId?: string; // 변경아이디

  modDt?: string; // 변경일시
};

export type codeList = {
  RECRUIT_TYPE_CD?: codeResponse[];
  PROGRESS_TYPE_CD?: codeResponse[];
  TECH_STACK?: codeResponse[];
  RECRUIT_POSIT_TYPE_CD?: codeResponse[];
  CONTACT_METHOD_CD?: codeResponse[];
};
