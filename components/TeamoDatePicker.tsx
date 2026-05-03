"use client";
import * as Popover from "@radix-ui/react-popover";
import { forwardRef, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  getDay,
  getDaysInMonth,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";
import { ko } from "date-fns/locale/ko";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/util/cn";

type DatePickerSize = "sm" | "md" | "lg";

const triggerSizeMap: Record<DatePickerSize, string> = {
  sm: "h-8 text-xs",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
};

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

interface TeamoDatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: DatePickerSize;
  minDate?: Date;
  className?: string;
}

const TeamoDatePicker = forwardRef<HTMLButtonElement, TeamoDatePickerProps>(
  (
    {
      value,
      onChange,
      onBlur,
      placeholder = "날짜 선택",
      disabled,
      size = "md",
      minDate,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(value ?? new Date());

    const handleSelect = (day: Date) => {
      onChange?.(day);
      setOpen(false);
    };

    const handlePrevMonth = () => setViewDate((d) => subMonths(d, 1));
    const handleNextMonth = () => setViewDate((d) => addMonths(d, 1));

    // 달력 그리드 구성
    const firstDay = getDay(startOfMonth(viewDate));  // 첫날 요일 (0=일)
    const daysInMonth = getDaysInMonth(viewDate);
    const cells: (Date | null)[] = [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1);
        return d;
      }),
    ];

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          ref={ref}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            "flex items-center justify-between w-full px-3 bg-white",
            "border border-ink-200 rounded-[10px] transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-teamo/20 focus:border-teamo",
            "disabled:bg-ink-50 disabled:cursor-not-allowed disabled:text-ink-400",
            triggerSizeMap[size],
            value ? "text-ink-900" : "text-ink-400",
            className,
          )}
        >
          <span>{value ? format(value, "yyyy.MM.dd", { locale: ko }) : placeholder}</span>
          <CalendarIcon className="w-4 h-4 text-ink-400 flex-shrink-0" />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            sideOffset={4}
            align="start"
            className={cn(
              "z-50 w-72 bg-white border border-ink-200 rounded-[14px]",
              "shadow-md p-4",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            )}
          >
            {/* 월 헤더 */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={handlePrevMonth}
                className="w-7 h-7 flex items-center justify-center rounded-[8px] text-ink-400 hover:bg-ink-100 hover:text-ink-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-ink-900">
                {format(viewDate, "yyyy년 MM월", { locale: ko })}
              </span>
              <button
                onClick={handleNextMonth}
                className="w-7 h-7 flex items-center justify-center rounded-[8px] text-ink-400 hover:bg-ink-100 hover:text-ink-900 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 mb-1">
              {DAY_LABELS.map((d, i) => (
                <div
                  key={d}
                  className={cn(
                    "text-center text-[11px] font-semibold py-1",
                    i === 0 ? "text-danger" : i === 6 ? "text-info" : "text-ink-400",
                  )}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {cells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;

                const isPast = minDate
                  ? isBefore(startOfDay(day), startOfDay(minDate))
                  : false;
                const isSelected = value ? isSameDay(day, value) : false;
                const isTodayDate = isToday(day);
                const dayOfWeek = getDay(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => !isPast && handleSelect(day)}
                    disabled={isPast}
                    className={cn(
                      "relative w-full aspect-square flex items-center justify-center",
                      "text-[13px] rounded-full transition-colors duration-100",
                      isPast && "text-ink-300 cursor-not-allowed",
                      !isPast && !isSelected && dayOfWeek === 0 && "text-danger",
                      !isPast && !isSelected && dayOfWeek === 6 && "text-info",
                      !isPast && !isSelected && dayOfWeek !== 0 && dayOfWeek !== 6 && "text-ink-900",
                      !isPast && !isSelected && "hover:bg-teamo-soft hover:text-teamo",
                      isSelected && "bg-teamo text-white font-bold",
                    )}
                  >
                    {day.getDate()}
                    {isTodayDate && !isSelected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teamo" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 오늘 버튼 */}
            <div className="mt-3 pt-3 border-t border-ink-100">
              <button
                onClick={() => {
                  const today = new Date();
                  setViewDate(today);
                  handleSelect(today);
                }}
                className="w-full text-[13px] font-semibold text-teamo hover:bg-teamo-soft rounded-[8px] py-1.5 transition-colors"
              >
                오늘
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

TeamoDatePicker.displayName = "TeamoDatePicker";
export default TeamoDatePicker;
