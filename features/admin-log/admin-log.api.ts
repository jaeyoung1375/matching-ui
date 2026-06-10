import { get } from "@/util/AxiosUtil";
import type { AdminLogListResponse, AdminLogSearchParams } from "./admin-log.type";

export const fetchAdminLogs = (params: AdminLogSearchParams) =>
  get<AdminLogListResponse>("/api/v1/admin/logs", {
    params: { ...params, logTypeCd: params.logType },
  });
