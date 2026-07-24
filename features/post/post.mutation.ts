import { useMutation } from "@tanstack/react-query";
import {
  PostModifyParam,
  PostModifyRequest,
  PostRegisterRequest,
  PostResponse,
} from "./post.type";
import { modifyPost, registerPost } from "./post.api";

export const useRegisterPostMutation = () =>
  useMutation<
    { code: string; message: string; data: PostResponse },
    Error,
    PostRegisterRequest
  >({
    mutationFn: (body: PostRegisterRequest) => registerPost(body),
  });

export const useModifyPostMutation = () =>
  useMutation<
    { code: string; message: string; data: PostResponse },
    Error,
    PostModifyParam
  >({
    mutationFn: ({ postId, body }) => modifyPost(postId, body),
  });
