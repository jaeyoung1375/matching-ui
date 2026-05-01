import { ReactNode } from "react";
import { clsx } from "clsx";

interface FilterChipProps {
  active?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

export function FilterChip({
  active = false,
  onClick,
  className,
  children,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex-shrink-0 text-[13px] font-semibold px-3.5 py-1.5",
        "rounded-full border transition-all duration-150 whitespace-nowrap cursor-pointer",
        active
          ? "bg-teamo text-white border-teamo"
          : "bg-white text-ink-600 border-ink-200 hover:border-teamo hover:text-teamo",
        className,
      )}
    >
      {children}
    </button>
  );
}

// ── RoleTag ───────────────────────────────────────────────────────
type RoleColor = "blue" | "violet" | "green" | "orange";

interface RoleTagProps {
  color?: RoleColor;
  children: ReactNode;
  className?: string;
}

const roleColors: Record<RoleColor, string> = {
  blue: "bg-info-300    text-info-soft",
  violet: "bg-accent-soft text-accent-600",
  green: "bg-success-soft text-success",
  orange: "bg-teamo-soft  text-teamo",
};

export function RoleTag({ color = "blue", children, className }: RoleTagProps) {
  return (
    <span
      className={clsx(
        "text-[11px] font-semibold px-1.5 py-0.5 rounded-[4px]",
        roleColors[color],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ── TechTag ───────────────────────────────────────────────────────
interface TechTagProps {
  children: ReactNode;
  className?: string;
}

export function TechTag({ children, className }: TechTagProps) {
  return (
    <span
      className={clsx(
        "text-[11px] font-semibold px-2 py-0.5 rounded-[5px] bg-ink-50 text-ink-600",
        className,
      )}
    >
      {children}
    </span>
  );
}
