"use client";

import { useEffect } from "react";

export default function TokenHandler() {
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
