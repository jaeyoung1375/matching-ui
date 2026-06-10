export type ClientLogLevel = "ERROR";

export type ClientLogRequest = {
  level: ClientLogLevel;
  message: string;
  pageUrl?: string;
  componentName?: string;
  stackTrace?: string;
  userAgent?: string;
};
