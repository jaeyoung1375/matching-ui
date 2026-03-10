"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export default function BaseModal({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnOverlayClick = true,
  showCloseButton = true,
  maxWidth = "md",
}: BaseModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      <div
        className={clsx(
          "relative z-10 w-full rounded-2xl bg-white shadow-xl",
          "mx-4",
          maxWidthMap[maxWidth],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-2">
            <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="모달 닫기"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className="px-5 pt-1 pb-6">{children}</div>

        {footer && (
          <div className="border-t border-neutral-200 px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
