/**
 * Date 객체 또는 날짜 문자열을 `yyyyMMdd` 형식의 문자열로 변환합니다.
 *
 * @param date - 변환할 Date 객체 또는 날짜 문자열
 * @returns `yyyyMMdd` 형식의 문자열 (예: "20260606")
 *
 * @example
 * formatDateToYYYYMMDD(new Date('2026-06-06'))  // "20260606"
 * formatDateToYYYYMMDD('2026-01-05')            // "20260105"
 */
export function formatDateToYYYYMMDD(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const yyyy = d.getFullYear().toString();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${MM}${dd}`;
}

/**
 * `yyyyMMdd` 형식의 문자열을 Date 객체로 변환합니다.
 *
 * @param yyyyMMdd - `yyyyMMdd` 형식의 날짜 문자열 (예: "20260606")
 * @returns 변환된 Date 객체
 *
 * @example
 * parseYYYYMMDD('20260606')  // Date { 2026-06-06 }
 */
export function parseYYYYMMDD(yyyyMMdd: string): Date {
  const yyyy = yyyyMMdd.slice(0, 4);
  const MM = yyyyMMdd.slice(4, 6);
  const dd = yyyyMMdd.slice(6, 8);
  return new Date(`${yyyy}-${MM}-${dd}`);
}
