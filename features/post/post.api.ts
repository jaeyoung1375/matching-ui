import { get } from "@/util/AxiosUtil";
import { PostRequest, PostResponseDto } from "./post.type";

export const fetchPostList = async (params?: PostRequest) => {
  const res = await get<PostResponseDto[]>("/api/v1/public/posts", { params });

  return res;
};
