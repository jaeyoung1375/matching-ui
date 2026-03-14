"use client";

import { create } from "zustand";

interface ConfirmState {
  message: string;
  show: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  setConfirm: (
    msg: string,
    onConfirm?: () => void,
    onCancel?: () => void,
  ) => void;
  hideConfirm: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  message: "",
  show: false,
  onConfirm: undefined,
  onCancel: undefined,
  setConfirm: (msg, onConfirm, onCancel) =>
    set({ message: msg, show: true, onConfirm, onCancel }),
  hideConfirm: () =>
    set({ show: false, onConfirm: undefined, onCancel: undefined }),
}));
