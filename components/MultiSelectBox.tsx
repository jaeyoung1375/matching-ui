"use client";
import * as Popover from "@radix-ui/react-popover";
import { forwardRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/util/cn";
import { SelectOption } from "@/components/SelectBox";

type SelectSize = "sm" | "md" | "lg";

const triggerSizeMap: Record<SelectSize, string> = {
  sm: "min-h-8 text-xs",
  md: "min-h-10 text-sm",
  lg: "min-h-12 text-base",
};

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectBoxProps {
  options: SelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  size?: SelectSize;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const MultiSelectBox = forwardRef<HTMLButtonElement, MultiSelectBoxProps>(
  (
    {
      options,
      value = [],
      onChange,
      onBlur,
      placeholder = "선택",
      size = "md",
      disabled,
      error,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);

    const toggle = (optValue: string) => {
      const next = value.includes(optValue)
        ? value.filter((v) => v !== optValue)
        : [...value, optValue];
      onChange?.(next);
    };

    const remove = (optValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(value.filter((v) => v !== optValue));
    };

    const selectedLabels = options.filter((o) => value.includes(o.value));

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          ref={ref}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            "flex items-center justify-between w-full px-3 py-2 gap-2 bg-white",
            "border rounded-[10px] transition-colors duration-150 text-left",
            "focus:outline-none focus:ring-2 focus:ring-teamo/20 focus:border-teamo",
            "disabled:bg-ink-50 disabled:cursor-not-allowed disabled:text-ink-400",
            error ? "border-danger" : "border-ink-200",
            triggerSizeMap[size],
            className,
          )}
        >
          <div className="flex flex-wrap gap-1.5 flex-1">
            {selectedLabels.length === 0 ? (
              <span className="text-ink-400">{placeholder}</span>
            ) : (
              selectedLabels.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-teamo-soft text-teamo text-[12px] font-semibold"
                >
                  {opt.label}
                  <button
                    type="button"
                    onClick={(e) => remove(opt.value, e)}
                    className="hover:text-teamo/60 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-ink-400 flex-shrink-0 transition-transform duration-150",
              open && "rotate-180",
            )}
          />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            sideOffset={4}
            align="start"
            className={cn(
              "z-50 w-[var(--radix-popover-trigger-width)] max-h-60 overflow-y-auto",
              "bg-white border border-ink-200 rounded-[10px]",
              "shadow-md p-1",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            )}
          >
            {options.map((opt) => {
              const selected = value.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 rounded-[8px]",
                    "text-sm cursor-pointer select-none transition-colors duration-100",
                    selected
                      ? "bg-teamo-soft text-teamo font-semibold"
                      : "text-ink-900 hover:bg-teamo-soft hover:text-teamo",
                  )}
                >
                  <span>{opt.label}</span>
                  {selected && <Check className="w-3.5 h-3.5 text-teamo" />}
                </button>
              );
            })}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

MultiSelectBox.displayName = "MultiSelectBox";
export default MultiSelectBox;
