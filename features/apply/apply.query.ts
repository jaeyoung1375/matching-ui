import { useQuery } from "@tanstack/react-query";
import { fetchApplicants } from "./apply.api";
import { ApplicantResponse } from "./apply.type";

export const useApplicantsQuery = (postId: number) =>
  useQuery<ApplicantResponse[]>({
    queryKey: ["applicants", postId],
    queryFn: () => fetchApplicants(postId),
    enabled: !!postId,
  });
