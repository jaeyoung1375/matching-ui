/**
 * YYYYMMDD 형식의 문자열을 지정된 구분자로 포맷팅합니다.
 *
 * @example
 * formatDate("20260327")
 * // "2026.03.27"
 *
 * @example
 * formatDate("20260327", "-")
 * // "2026-03-27"
 *
 * @example
 * formatDate("20260327", "/")
 * // "2026/03/27"
 *
 * @param {string} [yyyymmdd] YYYYMMDD 형식의 날짜 문자열 (예: "20260327")
 * @param {string} [separator="."] 날짜 구분자 (기본값: ".")
 * @returns {string} 포맷된 날짜 문자열 (예: "2026.03.27"), 유효하지 않으면 빈 문자열 반환
 */
export const formatDate = (yyyymmdd?: string, separator: string = ".") => {
  if (!yyyymmdd || yyyymmdd.length !== 8) return "";

  const yyyy = yyyymmdd.substring(0, 4);
  const mm = yyyymmdd.substring(4, 6);
  const dd = yyyymmdd.substring(6, 8);

  return `${yyyy}${separator}${mm}${separator}${dd}`;
};
