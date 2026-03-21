"use client";

import { useConfirmStore } from "../store/confirmStore";
import { useEffect, useState } from "react";

const ConfirmModal = () => {
  const { message, show, onConfirm, onCancel, hideConfirm } = useConfirmStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (show) {
        setVisible(true);
        document.body.style.overflow = "hidden";
      } else {
        setVisible(false);
        document.body.style.overflow = "";
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [show]);
  // ESC 키 닫기
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onCancel) onCancel();
        hideConfirm();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hideConfirm, onCancel]);

  if (!show && !visible) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    hideConfirm();
    document.body.style.overflow = "";
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    hideConfirm();
    document.body.style.overflow = "";
  };

  return (
    <div
      onClick={handleCancel} // 배경 클릭 시 취소
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(1px)",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫기 방지
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "360px",
          padding: "1.8rem 1.5rem",
          textAlign: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          transform: visible ? "translateY(0)" : "translateY(-10px)",
          transition: "transform 0.2s ease-in-out",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p
          style={{
            marginBottom: "1.8rem",
            fontSize: "1rem",
            color: "#111",
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>
        <div
          style={{ display: "flex", justifyContent: "center", gap: "0.8rem" }}
        >
          <button
            onClick={handleCancel}
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: "#E5E7EB", // 연한 회색
              color: "#111",
              border: "none",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer",
              minWidth: "80px",
            }}
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: "0.5rem 1.5rem",
              backgroundColor: "#FFA94D", // 은은한 블루
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 500,
              cursor: "pointer",
              minWidth: "80px",
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
