export type UserCountsResponse = {
  totalCount: number;
  activeCount: number;
  deactivatedCount: number;
};

export type NewUserCountResponse = {
  newUserCount: number;
};

export type PostCountResponse = {
  postCount: number;
};

export type AdminUser = {
  userId: string;
  name: string;
  email: string;
  provider: string;
  role: string;
  status: string;
  regDt: string;
  lastLoginDt: string;
  filePath: string;
};

export type AdminUserSearchParams = {
  name?: string;
  email?: string;
};
