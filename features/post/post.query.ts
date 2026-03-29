import { useQuery } from "@tanstack/react-query";
import { PostDto, PostResponseDto } from "./post.type";
import { fetchPostList } from "./post.api";

export const usePostListQuery = (params?: PostDto) =>
  useQuery<PostResponseDto[]>({
    queryKey: ["postList", params], // queryKey 가 바뀔 때마다 query 재호출
    queryFn: () => fetchPostList(),
  });
