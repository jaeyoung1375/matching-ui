import { get } from "@/util/AxiosUtil";
import { useQuery } from "@tanstack/react-query";
import { CodeRequest, codeResponse } from "./code.type";
import { codeToSelectOption } from "@/app/util/CommonUtil";
import { SelectOption } from "@/app/components/SelectBox";

/**
 * 공통 코드 API 호출 함수
 *
 * @param params - 조회 조건
 *   - comCdId: 공통 코드 ID (필수 조회 기준)
 *   - dtlCdId: 상세 코드 ID (선택)
 * @returns codeResponse[] - API에서 가져온 공통 코드 목록
 */
export const fetchCodeList = async (params: CodeRequest) => {
  const res = await get<codeResponse[]>("/api/v1/codes", { params });

  return res;
};

/**
 * 공통 코드 목록을 API에서 조회합니다.
 *
 * @param params - 조회할 공통 코드 조건 (comCdId 등)
 * @returns SelectOption[] - { label, value } 형태로 변환된 옵션 배열, React Query 데이터로 사용
 */
export const useCodeQuery = (params: CodeRequest) =>
  useQuery<codeResponse[], Error, SelectOption[]>({
    queryKey: ["codes", params.comCdId], // queryKey 가 바뀔 때마다 query 재호출
    queryFn: () => fetchCodeList(params),
    enabled: !!params.comCdId, // params가 있을 때만 query 호출
    select: (data) => codeToSelectOption(data),
  });
