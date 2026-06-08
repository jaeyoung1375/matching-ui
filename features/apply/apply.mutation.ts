import { useMutation } from "@tanstack/react-query";
import { applyPost } from "./apply.api";
import { ApplyRequest } from "./apply.type";

export const useApplyMutation = () =>
  useMutation({
    mutationFn: (body: ApplyRequest) => applyPost(body),
  });
