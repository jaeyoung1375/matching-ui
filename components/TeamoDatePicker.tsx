import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale/ko"; // 한국어 locale
import { isSameDay } from "date-fns";

registerLocale("ko", ko); // locale 등록

type TeamoDatePickerProps = {
  className?: string;
};

export default function TeamoDatePicker({ className }: TeamoDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date: Date | null) => setSelectedDate(date)}
      placeholderText="시작일 선택"
      dateFormat="yyyy.MM.dd"
      locale={ko}
      className={`border rounded-lg p-2 w-64 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 ${className}`}
      calendarClassName="rounded-lg shadow-md border border-gray-200"
      dayClassName={(date) =>
        isSameDay(date, selectedDate ?? new Date())
          ? "bg-green-300 text-white rounded-full"
          : "text-gray-700 hover:bg-gray-100 rounded-full"
      }
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="flex justify-between items-center px-2 py-1 text-sm font-semibold">
          <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="text-gray-400 hover:text-gray-600"
          >
            ◀
          </button>
          <span>
            {date.getFullYear()}.{String(date.getMonth() + 1).padStart(2, "0")}
          </span>
          <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="text-gray-400 hover:text-gray-600"
          >
            ▶
          </button>
        </div>
      )}
    />
  );
}
