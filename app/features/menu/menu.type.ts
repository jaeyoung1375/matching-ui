export type Menu = {
  menuId: string;
  menuNm: string;
  menuUrl: string;
  menuLevel: number;
  menuOrd?: string;
  upMenuId?: string;
  topYn: string;
  useYn: string;
  regId?: string;
  regDt?: string;
  children: Menu[];
};
