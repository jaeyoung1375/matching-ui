import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyPost, updateApplyStatus } from "./apply.api";
import { ApplyRequest, ApplyStatusUpdateRequest } from "./apply.type";

export const useApplyMutation = () =>
  useMutation({
    mutationFn: (body: ApplyRequest) => applyPost(body),
  });

export const useUpdateApplyStatusMutation = (postId: number) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: ApplyStatusUpdateRequest) => updateApplyStatus(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["applicants", postId] });
      qc.invalidateQueries({ queryKey: ["post", postId] });
    },
  });
};
