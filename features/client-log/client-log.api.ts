import { post } from "@/util/AxiosUtil";
import type { ClientLogRequest } from "./client-log.type";

export const createClientLog = (body: ClientLogRequest) =>
  post<void>("/api/v1/public/client-logs", body);
