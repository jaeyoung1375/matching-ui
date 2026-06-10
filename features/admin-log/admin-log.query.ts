import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/features/common/types/common.type";
import { fetchAdminLogs } from "./admin-log.api";
import type { AdminLogListResponse, AdminLogSearchParams } from "./admin-log.type";

export const useAdminLogListQuery = (params: AdminLogSearchParams) =>
  useQuery<AdminLogListResponse, ApiError>({
    queryKey: ["admin", "logs", params],
    queryFn: () => fetchAdminLogs(params),
  });
