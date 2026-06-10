"use client";

import { useEffect } from "react";
import { getErrorMessage, getErrorStack, logClientError } from "@/util/ClientLogUtil";

export default function GlobalClientErrorLogger() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logClientError({
        message: event.message || getErrorMessage(event.error),
        componentName: "window.error",
        stackTrace: getErrorStack(event.error),
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logClientError({
        message: getErrorMessage(event.reason),
        componentName: "window.unhandledrejection",
        stackTrace: getErrorStack(event.reason),
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
