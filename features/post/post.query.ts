import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PostRequest, PostResponse } from "./post.type";
import { fetchPost, fetchPostList } from "./post.api";
import { PageResponse } from "../common/types/common.type";

export const usePostListQuery = (params?: PostRequest) =>
  useQuery<PageResponse<PostResponse>>({
    queryKey: ["postList", params],
    queryFn: () => fetchPostList(params),
    placeholderData: keepPreviousData,
  });

export const usePostQuery = (postId: number) =>
  useQuery<PostResponse>({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId,
  });
