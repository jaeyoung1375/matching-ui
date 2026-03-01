// components/ui/Input.tsx
import { forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import clsx from "clsx";

type InputSize = "sm" | "md" | "lg";

const sizeMap: Record<InputSize, string> = {
  sm: "h-8 text-xs",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
};

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  size?: InputSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      size = "md",
      error,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="relative w-full">
        {LeftIcon && (
          <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}

        <input
          ref={ref}
          className={clsx(
            "w-full rounded-md border px-3",
            sizeMap[size],
            LeftIcon && "pl-9",
            RightIcon && "pr-9",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500",
            "focus:outline-none focus:ring-2",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />

        {RightIcon && (
          <RightIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
