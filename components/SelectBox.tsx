// components/ui/Select.tsx
"use client";
import { forwardRef, useState } from "react";
import clsx from "clsx";
import { cn } from "@/util/cn";

type SelectSize = "sm" | "md" | "lg";

const sizeMap: Record<SelectSize, string> = {
  sm: "h-8 text-xs",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
};

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  options: SelectOption[];
  error?: boolean;
  placeholder?: string;
  size?: SelectSize;
}

const SelectBox = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, size = "md", placeholder, className, ...props }, ref) => {
    const placeholderValue = "__placeholder__";
    const [isPlaceholder, setIsPlaceholder] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setIsPlaceholder(!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className={cn("relative w-full", className)}>
        <select
          ref={ref}
          defaultValue={placeholder ? placeholderValue : ""}
          onChange={handleChange}
          className={clsx(
            "border rounded-lg border-[rgb(204, 204, 204)] w-full",
            isPlaceholder ? "text-gray-400" : "text-black",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value={placeholderValue} disabled>
              {placeholder}
            </option>
          )}

          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-black">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

SelectBox.displayName = "SelectBox";
export default SelectBox;
