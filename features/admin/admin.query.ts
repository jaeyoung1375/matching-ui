import { get, patch, post } from "@/util/AxiosUtil";
import {
  UserCountsResponse,
  NewUserCountResponse,
  PostCountResponse,
  AdminUserSearchParams,
  AdminUser,
} from "./admin.type";

export const fetchUserCounts = () =>
  get<UserCountsResponse>("/api/v1/admin/dashboard/users/counts");

export const fetchNewUserCount = () =>
  get<NewUserCountResponse>("/api/v1/admin/dashboard/users/new-counts");

export const fetchPostCount = () =>
  get<PostCountResponse>("/api/v1/admin/dashboard/posts/counts");

export const fetchAdminUsers = (params?: AdminUserSearchParams) =>
  get<AdminUser[]>("/api/v1/admin/users/search", { params });

export const updateUserRole = (userId: string, role: string) =>
  patch<void>(`/api/v1/admin/users/${userId}/role`, { role });

export const forceLogout = (userId: string) =>
  post<void>(`/api/v1/admin/users/${userId}/force-logout`);
