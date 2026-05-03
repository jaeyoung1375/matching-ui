"use client";
import * as RadixSelect from "@radix-ui/react-select";
import { forwardRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/util/cn";

type SelectSize = "sm" | "md" | "lg";

const triggerSizeMap: Record<SelectSize, string> = {
  sm: "h-8 text-xs",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
};

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  size?: SelectSize;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  name?: string;
}

const SelectBox = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      onBlur,
      placeholder,
      size = "md",
      disabled,
      error,
      className,
    },
    ref,
  ) => {
    return (
      <RadixSelect.Root
        value={value ?? ""}
        onValueChange={onChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          ref={ref}
          onBlur={onBlur}
          className={cn(
            "flex items-center justify-between w-full px-3 bg-white",
            "border rounded-[10px] transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-teamo/20 focus:border-teamo",
            "disabled:bg-ink-50 disabled:cursor-not-allowed disabled:text-ink-400",
            "data-[placeholder]:text-ink-400 text-ink-900",
            error ? "border-danger" : "border-ink-200",
            triggerSizeMap[size],
            className,
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon asChild>
            <ChevronDown className="w-4 h-4 text-ink-400 flex-shrink-0" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className={cn(
              "z-50 w-[var(--radix-select-trigger-width)]",
              "bg-white border border-ink-200 rounded-[10px]",
              "shadow-md overflow-hidden",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            )}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-[8px]",
                    "text-sm text-ink-900 cursor-pointer select-none",
                    "hover:bg-teamo-soft hover:text-teamo",
                    "focus:outline-none focus:bg-teamo-soft focus:text-teamo",
                    "data-[highlighted]:bg-teamo-soft data-[highlighted]:text-teamo",
                    "data-[state=checked]:font-semibold",
                  )}
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check className="w-3.5 h-3.5 text-teamo" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    );
  },
);

SelectBox.displayName = "SelectBox";
export default SelectBox;
