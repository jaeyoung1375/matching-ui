import type { ClientLogRequest } from "@/features/client-log/client-log.type";

const CLIENT_LOG_ENDPOINT = "/api/v1/public/client-logs";
const RECENT_LOG_TTL = 2000;
const recentLogMap = new Map<string, number>();

type LogClientErrorInput = {
  message: string;
  componentName?: string;
  stackTrace?: string;
};

function truncate(value: string | undefined, maxLength: number) {
  if (!value) return undefined;
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

function getClientLogUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return `${baseUrl}${CLIENT_LOG_ENDPOINT}`;
}

function shouldSkipDuplicate(payload: ClientLogRequest) {
  const key = [
    payload.message,
    payload.pageUrl,
    payload.componentName,
    payload.stackTrace?.slice(0, 200),
  ].join("|");
  const now = Date.now();
  const lastSentAt = recentLogMap.get(key);

  if (lastSentAt && now - lastSentAt < RECENT_LOG_TTL) return true;

  recentLogMap.set(key, now);
  return false;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return "Unknown client error";
}

export function getErrorStack(error: unknown) {
  if (error instanceof Error) return error.stack;
  if (error && typeof error === "object" && "stack" in error) {
    const stack = (error as { stack?: unknown }).stack;
    if (typeof stack === "string") return stack;
  }
  return undefined;
}

export function logClientError({
  message,
  componentName,
  stackTrace,
}: LogClientErrorInput) {
  if (typeof window === "undefined") return;
  if (!message.trim()) return;

  const payload: ClientLogRequest = {
    level: "ERROR",
    message: truncate(message, 1000) ?? "Unknown client error",
    pageUrl: window.location.pathname,
    componentName: truncate(componentName, 100),
    stackTrace: truncate(stackTrace, 5000),
    userAgent: truncate(window.navigator.userAgent, 500),
  };

  if (shouldSkipDuplicate(payload)) return;

  try {
    const body = JSON.stringify(payload);

    void fetch(getClientLogUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Logging must never break the user's current flow.
  }
}

export function flushClientError({
  message,
  componentName,
  stackTrace,
}: LogClientErrorInput) {
  if (typeof window === "undefined") return;
  if (!message.trim()) return;

  const payload: ClientLogRequest = {
    level: "ERROR",
    message: truncate(message, 1000) ?? "Unknown client error",
    pageUrl: window.location.pathname,
    componentName: truncate(componentName, 100),
    stackTrace: truncate(stackTrace, 5000),
    userAgent: truncate(window.navigator.userAgent, 500),
  };

  if (shouldSkipDuplicate(payload)) return;

  try {
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    navigator.sendBeacon?.(getClientLogUrl(), blob);
  } catch {
    // Logging must never break the user's current flow.
  }
}

export function logUnknownClientError(error: unknown, componentName?: string) {
  logClientError({
    message: getErrorMessage(error),
    componentName,
    stackTrace: getErrorStack(error),
  });
}
