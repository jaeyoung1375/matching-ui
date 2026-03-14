import { useQuery } from "@tanstack/react-query";
import { CodeRequest, codeResponse } from "./code.type";
import { codeToSelectOption } from "@/app/util/CommonUtil";
import { SelectOption } from "@/app/components/SelectBox";
import { ApiError } from "../common/types/common.type";
import { fetchCodeList } from "./code.api";

/**
 * 공통 코드 목록을 API에서 조회합니다.
 *
 * @param params - 조회할 공통 코드 조건 (comCdId 등)
 * @returns SelectOption[] - { label, value } 형태로 변환된 옵션 배열, React Query 데이터로 사용
 */
export const useCodeQuery = (comCdIds: string[]) =>
  useQuery<Record<string, codeResponse[]>, ApiError, SelectOption[]>({
    queryKey: ["codes", comCdIds], // queryKey 가 바뀔 때마다 query 재호출
    queryFn: () => fetchCodeList(comCdIds),
    enabled: !!comCdIds, // params가 있을 때만 query 호출
    // select: (data) => codeToSelectOption(data),
  });
