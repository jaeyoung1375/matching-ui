// components/ui/Select.tsx
import { forwardRef } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

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
  ({ options, size = "md", error, placeholder, className, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={clsx(
            "w-full appearance-none rounded-md border bg-white px-3 pr-10",
            sizeMap[size],
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500",
            "focus:outline-none focus:ring-2",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* dropdown icon */}
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    );
  },
);

SelectBox.displayName = "SelectBox";
export default SelectBox;
