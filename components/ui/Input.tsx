// components/ui/Input.tsx
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type InputState = "default" | "error" | "success";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  state?: InputState;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

const stateClasses: Record<InputState, string> = {
  default: "border-neutral-200 focus:border-orange",
  error: "border-red bg-red-soft/20 focus:border-red",
  success: "border-green focus:border-green",
};

const hintClasses: Record<InputState, string> = {
  default: "text-neutral-400",
  error: "text-red",
  success: "text-green",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      state = "default",
      leftIcon,
      rightElement,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-label1 font-semibold text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center ">
          {leftIcon && (
            <span className="absolute left-3 text-neutral-300 pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={clsx(
              "w-full font-sans text-body2 font-medium",
              "border rounded-md px-4 py-3",
              "text-neutral-900 bg-teamo-50 outline-none",
              "transition-colors duration-150",
              "placeholder:text-neutral-300",
              stateClasses[state],
              leftIcon && "pl-10",
              rightElement && "pr-10",
              className,
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 flex items-center">
              {rightElement}
            </span>
          )}
        </div>
        {hint && (
          <p className={clsx("text-caption1", hintClasses[state])}>{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// ── Textarea variant ────────────────────────────────────────────────
import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  state?: InputState;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, state = "default", className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-label1 font-semibold text-neutral-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            "w-full font-sans text-body2 font-medium resize-y",
            "border rounded-md px-4 py-3 min-h-[120px]",
            "text-neutral-900 bg-white outline-none leading-relaxed",
            "transition-colors duration-150",
            "placeholder:text-neutral-300",
            stateClasses[state],
            className,
          )}
          {...props}
        />
        {hint && (
          <p className={clsx("text-caption1", hintClasses[state])}>{hint}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
