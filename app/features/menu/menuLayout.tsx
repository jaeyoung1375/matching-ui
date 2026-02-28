"use client";
import { useMenuQuery } from "./menu.query";

export default function MenuLayout() {
  /** 메뉴목록 조회 */
  const { data: menu, isLoading } = useMenuQuery();

  const menuList = menu ?? [];

  return (
    <ul>
      {menuList.map((item) => (
        <li key={item.menuId}>{item.menuNm}</li>
      ))}
    </ul>
  );
}
