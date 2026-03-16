"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "선택",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (v: string) => {
    let newValue;

    if (value.includes(v)) {
      newValue = value.filter((item) => item !== v);
    } else {
      newValue = [...value, v];
    }

    onChange?.(newValue);
  };

  const removeTag = (v: string) => {
    onChange?.(value.filter((item) => item !== v));
  };

  return (
    <div ref={wrapperRef} className={clsx("relative w-full", className)}>
      {/* 선택영역 */}
      <div
        className="flex flex-wrap gap-2 border rounded-md px-3 py-2 min-h-[40px] max-h-[80px] overflow-y-auto"
        onClick={() => setOpen(!open)}
      >
        {value.length === 0 && (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        )}

        {value.map((v) => {
          const option = options.find((o) => o.value === v);

          return (
            <span
              key={v}
              className="flex items-center gap-1 bg-gray-100 text-sm px-2 py-1 rounded"
            >
              {option?.label}

              <X
                size={14}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(v);
                }}
              />
            </span>
          );
        })}
      </div>

      {/* dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full border rounded-md bg-white shadow max-h-60 overflow-auto">
          {options.map((opt) => {
            const selected = value.includes(opt.value);

            return (
              <div
                key={opt.value}
                className={clsx(
                  "px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
                  selected && "bg-gray-50 font-medium",
                )}
                onClick={() => toggleOption(opt.value)}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
