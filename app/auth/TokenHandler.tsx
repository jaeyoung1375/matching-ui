"use client";

import { useEffect } from "react";

export default function TokenHandler() {
  // 앱 시작 시 토큰 체크
  // URL에 있는 token을 꺼내서 , localStorage에 저장하고 URL을 깨끗하게 바꿈
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  return null;
}
