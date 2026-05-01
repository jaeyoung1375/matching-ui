// components/ui/Badge.tsx
import { ReactNode } from "react";
import { clsx } from "clsx";

type BadgeVariant =
  | "open"
  | "online"
  | "offline"
  | "closed"
  | "urgent"
  | "new"
  | "popular"
  | "custom";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  open: "bg-teamo-soft  text-teamo",
  online: "bg-info-100    text-info",
  offline: "bg-accent-soft text-accent-600",
  closed: "bg-ink-100     text-ink-400",
  urgent: "bg-danger-soft text-danger",
  new: "bg-info-100    text-info",
  popular: "bg-teamo       text-white",
  custom: "",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2 py-0.5",
  md: "text-[11px] px-2.5 py-1",
};

export function Badge({
  variant = "open",
  size = "md",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-bold rounded-[6px] whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
