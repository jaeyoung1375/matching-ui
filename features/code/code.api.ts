import { get } from "@/util/AxiosUtil";
import { codeList } from "./code.type";

/**
 * 공통 코드 목록 조회
 *
 * @param comCdIds - 조회할 공통 코드 ID 목록
 * @returns codeList  - 공통 코드 ID를 key로 하는 코드 목록 Map
 *
 * @example
 * const codes = await fetchCodeList([
 *   "RECRUIT_TYPE_CD",
 *   "PROGRESS_TYPE_CD"
 * ]);
 *
 * codes.RECRUIT_TYPE_CD
 * codes.PROGRESS_TYPE_CD
 */
export const fetchCodeList = async (comCdIds: string[]) => {
  const res = await get<codeList>("/api/v1/public/codes", {
    params: { comCdIds },
  });

  return res;
};
