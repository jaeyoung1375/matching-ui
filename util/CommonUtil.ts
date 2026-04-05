import { SelectOption } from "../components/SelectBox";
import { codeResponse } from "../features/code/code.type";

/**
 * 공통 코드 배열을 Select 컴포넌트에서 사용할 옵션 배열로 변환합니다.
 * @param codes - API에서 가져온 공통 코드 목록
 * @returns SelectOption[] - { label, value } 형태로 변환된 옵션 배열
 */
export const codeToSelectOption = (
  codes: codeResponse[],
  includeAll?: boolean,
): SelectOption[] => {
  const option = codes.map((code) => ({
    label: code.dtlCdNm,
    value: code.dtlCdId,
  }));

  if (includeAll) {
    return [{ label: "전체", value: "" }, ...option];
  }

  return option;
};
