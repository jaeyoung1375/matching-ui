// components/ui/Select.tsx
"use client";
import { forwardRef, useState } from "react";
import clsx from "clsx";

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
    const [value, setValue] = useState<string>();

    return (
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          ref={ref}
          className={clsx(
            `${className} border border-[rgb(204, 204, 204)]`,
            !value ? "text-gray-400" : "text-black ",
          )}
          {...props}
          defaultValue=""
        >
          {placeholder && (
            <option value="" disabled hidden>
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
