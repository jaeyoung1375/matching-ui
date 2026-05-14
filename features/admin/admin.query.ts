import { get } from "@/util/AxiosUtil";
import { UserCountsResponse } from "./admin.type";
export const fetchUserCounts = () =>
  get<UserCountsResponse>("/api/v1/admin/users/counts");
