import { get } from "@/util/AxiosUtil";
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
