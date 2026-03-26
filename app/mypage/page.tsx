"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/app/features/auth/auth.query";
import MyPageForm from "./MyPageForm";

export default function MyPagePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const me = await getMe();
      setUser(me);
    };

    init();
  }, []);

  if (!user) return <div>loading...</div>;

  const userLanguages =
    user.languages?.map((l: any) => String(l.dtlCdId)) || [];

  return (
    <div className="max-w-xl mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      <MyPageForm defaultName={user.name} defaultLanguages={userLanguages} />
    </div>
  );
}
