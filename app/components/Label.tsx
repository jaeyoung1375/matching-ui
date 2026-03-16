"use client";

import { ReactNode } from "react";

interface LabelProps {
  title?: string;
  children: ReactNode;
  required?: boolean;
  icon?: ReactNode;
}

export default function Label({ title, children, required, icon }: LabelProps) {
  return (
    <label
      title={title}
      className="flex items-center gap-1 text-sm font-medium text-gray-800"
    >
      {icon}
      <span>{children}</span>

      {required && <span className="text-red-500">*</span>}
    </label>
  );
}
