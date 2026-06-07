import { get, post } from "@/util/AxiosUtil";
import { PostRequest, PostRegisterRequest, PostResponse } from "./post.type";
import { PageResponse } from "../common/types/common.type";

export const fetchPostList = (params?: PostRequest) => {
  const res = get<PageResponse<PostResponse>>("/api/v1/public/posts", {
    params,
  });

  return res;
};

export const fetchPost = (postId: number) =>
  get<PostResponse>(`/api/v1/public/posts/${postId}`);

export const registerPost = (body: PostRegisterRequest) =>
  post<PostResponse>("/api/v1/posts", body);
