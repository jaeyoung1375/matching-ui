"use client";
import { useEffect, useState } from "react";
import { get } from "./util/AxiosUtil";
import { Menu } from "./features/menu/menu.type";

export default function Home() {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await get<Menu[]>("/menuList");
        setMenu(res); // 데이터 세팅
      } catch (err) {
        console.error("메뉴 가져오기 실패:", err);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchMenu();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        menu.map((item) => (
          <pre key={item.menuId}>{JSON.stringify(item, null, 2)}</pre>
        ))
      )}
    </div>
  );
}
