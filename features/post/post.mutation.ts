import { useMutation } from "@tanstack/react-query";
import { PostRegisterRequest, PostResponse } from "./post.type";
import { registerPost } from "./post.api";

export const useRegisterPostMutation = () =>
  useMutation<
    { code: string; message: string; data: PostResponse },
    Error,
    PostRegisterRequest
  >({
    mutationFn: (body: PostRegisterRequest) => registerPost(body),
  });
