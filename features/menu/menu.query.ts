import { get } from "@/util/AxiosUtil";
import { Menu } from "./menu.type";
import { useQuery } from "@tanstack/react-query";

/** 메뉴 목록 조회 */
export const fetchMenuList = async () => {
  const res = await get<Menu[]>("/public/menus");

  return res;
};

export const useMenuQuery = () =>
  useQuery({
    queryKey: ["menus"],
    queryFn: fetchMenuList,
  });
