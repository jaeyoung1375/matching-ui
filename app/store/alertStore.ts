"use client";

import { create } from "zustand";

interface AlertState {
  message: string;
  show: boolean;
  onConfirm?: () => void; // 확인 콜백
  setAlert: (msg: string, onConfirm?: () => void) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  message: "",
  show: false,
  onConfirm: undefined,
  setAlert: (msg, onConfirm) => set({ message: msg, show: true, onConfirm }),
  hideAlert: () => set({ show: false, onConfirm: undefined }),
}));
