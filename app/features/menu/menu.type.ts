export type Menu = {
  menuId: string; // 메뉴아이디
  menuNm: string; // 메뉴명
  menuUrl: string; // 메뉴URL
  menuLevel: number; // 메뉴레벨
  menuOrd?: string; // 메뉴정렬순서
  upMenuId?: string; // 상위메뉴아이디
  topYn: string; // 상위여부
  useYn: string; // 사용여부
  regId?: string; // 등록자
  regDt?: string; // 등록일자
  children: Menu[];
};
