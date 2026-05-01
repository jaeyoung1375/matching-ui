// 요청 타입
export type CodeRequest = {
  comCdId?: string;
  comCdIds?: string[];
  dtlCdId?: string;
  dtlCdExpln?: string;
};

// 응답 타입
export type codeResponse = {
  comCdId: string;
  comCdNm: string;
  dtlCdId: string;
  dtlCdNm: string;
  dtlCdExpln?: string;
  lnkgDtlCdId1?: string;
  lnkgDtlCdNm1?: string;
  lnkgDtlCdId2?: string;
  lnkgDtlCdNm2?: string;
  useYn?: string;
  sortSeq?: number;
  regId?: string;
  regDt?: string;
  modId?: string;
  modDt?: string;
};

export type codeList = {
  RECRUIT_TYPE_CD?: codeResponse[];
  PROGRESS_TYPE_CD?: codeResponse[];
  TECH_STACK?: codeResponse[];
  RECRUIT_POSIT_TYPE_CD?: codeResponse[];
  CONTACT_METHOD_CD?: codeResponse[];
};

// ── Admin 타입 ──────────────────────────────────────────

export type ComCodeResponse = {
  comCdId: string;
  comCdNm: string;
  useYn: string;
  regId?: string;
  regDt?: string;
  modId?: string;
  modDt?: string;
};

export type ComCodeCreateRequest = {
  comCdId: string;
  comCdNm: string;
  useYn: string;
};

export type ComCodeUpdateRequest = {
  comCdNm: string;
  useYn: string;
};

export type DtlCodeCreateRequest = {
  comCdId: string;
  dtlCdId: string;
  dtlCdNm: string;
  dtlCdExpln?: string;
  sortSeq: number;
  useYn: string;
};

export type DtlCodeUpdateRequest = {
  comCdId: string;
  dtlCdNm: string;
  dtlCdExpln?: string;
  sortSeq: number;
  useYn: string;
};
