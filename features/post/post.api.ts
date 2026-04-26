import { get } from "@/util/AxiosUtil";
import { PostRequest, PostResponseDto } from "./post.type";

export const fetchPostList = (params?: PostRequest) => {
  const res = get<PostResponseDto[]>("/api/v1/public/posts", { params });

  return res;
};
