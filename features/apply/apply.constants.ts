export const APPLY_STATUS_CD = {
  WAIT: "10",
  ACCEPT: "20",
  REJECT: "30",
} as const;

export type ApplyStatusCd = (typeof APPLY_STATUS_CD)[keyof typeof APPLY_STATUS_CD];
