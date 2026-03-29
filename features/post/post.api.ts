import { get } from "@/util/AxiosUtil";
import { PostResponseDto } from "./post.type";

export const fetchPostList = async () => {
  const res = await get<PostResponseDto[]>("/api/v1/posts");

  return res;
};
