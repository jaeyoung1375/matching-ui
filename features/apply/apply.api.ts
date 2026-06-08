import { post } from "@/util/AxiosUtil";
import { ApplyRequest, ApplyResponse } from "./apply.type";

export const applyPost = (body: ApplyRequest) =>
  post<ApplyResponse>("/api/v1/applies", body);
