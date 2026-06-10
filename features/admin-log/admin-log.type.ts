export type AdminLogType = "BE" | "FE";

export type AdminLogSearchParams = {
  logType: AdminLogType;
  logTypeCd?: AdminLogType;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
};

export type AdminLog = {
  logId?: string | number;
  id?: string | number;
  logType?: AdminLogType;
  logTypeCd?: string;
  actorId?: string | number;
  userId?: string | number;
  adminId?: string | number;
  actorName?: string;
  userName?: string;
  adminName?: string;
  actorEmail?: string;
  email?: string;
  action?: string;
  actionCd?: string;
  eventType?: string;
  target?: string;
  targetId?: string | number;
  method?: string;
  uri?: string;
  requestUri?: string;
  ip?: string;
  ipAddress?: string;
  userAgent?: string;
  message?: string;
  detail?: string;
  detailContent?: string;
  createdAt?: string;
  createdDt?: string;
  regDt?: string;
  useYn?: string;
};

export type AdminLogPageResponse = {
  content: AdminLog[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

export type AdminLogListResponse = AdminLog[] | AdminLogPageResponse;
