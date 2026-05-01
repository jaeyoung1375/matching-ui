// components/ui/Button.tsx
import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "dark" | "outlined" | "neutral" | "ghost";
type Size = "xl" | "lg" | "md" | "sm" | "xs";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  pill?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-teamo text-white hover:bg-teamo-hover active:bg-teamo-pressed",
  dark: "bg-ink-900 text-white hover:bg-ink-800",
  outlined: "bg-transparent text-teamo border border-teamo hover:bg-teamo-soft",
  neutral:
    "bg-transparent text-ink-700 border border-ink-200 hover:border-teamo hover:text-teamo hover:bg-teamo-soft",
  ghost: "bg-transparent text-teamo hover:bg-teamo-soft",
};

const sizeClasses: Record<Size, string> = {
  xl: "text-[16px] leading-6 tracking-[0.006em] font-bold px-7 h-12 rounded-[12px]",
  lg: "text-[15px] leading-[22px] tracking-[0.010em] font-bold px-[22px] h-[42px] rounded-[10px]",
  md: "text-[14px] leading-5 tracking-[0.015em] font-bold px-[18px] h-9 rounded-[8px]",
  sm: "text-[13px] leading-[18px] tracking-[0.019em] font-bold px-3.5 h-[30px] rounded-[8px]",
  xs: "text-[12px] leading-4 tracking-[0.025em] font-bold px-2.5 h-[26px] rounded-[6px]",
};

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "lg",
      pill = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center justify-center gap-1.5",
          "transition-colors duration-150 whitespace-nowrap cursor-pointer select-none",
          variantClasses[variant],
          sizeClasses[size],
          pill && "!rounded-full",
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        {...props}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
