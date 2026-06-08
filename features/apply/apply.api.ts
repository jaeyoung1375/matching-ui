import { post } from "@/util/AxiosUtil";
import { ApplyRequest, ApplyResponse } from "./apply.type";

export const applyPost = (body: ApplyRequest) => {
  const { postId, ...rest } = body;
  return post<ApplyResponse>(`/api/v1/applies/${postId}`, rest);
};
