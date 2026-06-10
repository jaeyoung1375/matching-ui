"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { logClientError } from "@/util/ClientLogUtil";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundaryInner extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logClientError({
      message: error.message,
      componentName: "React ErrorBoundary",
      stackTrace: [error.stack, errorInfo.componentStack].filter(Boolean).join("\n"),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-lg border border-gray-100 bg-white p-6 text-center shadow-sm">
            <h1 className="text-lg font-bold text-gray-900">
              화면을 불러오지 못했습니다.
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              오류가 자동으로 기록되었습니다. 잠시 후 다시 시도해주세요.
            </p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default function ClientErrorBoundary({ children }: ErrorBoundaryProps) {
  const pathname = usePathname();

  return <ErrorBoundaryInner key={pathname}>{children}</ErrorBoundaryInner>;
}
