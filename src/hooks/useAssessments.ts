import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import type { Assessment, AssessmentDetail } from "../types/api";

export function useAssessments() {
  return useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const { data } = await api.get<Assessment[]>("/assessments");
      return data;
    },
  });
}

export function useAssessment(slug: string) {
  return useQuery({
    queryKey: ["assessment", slug],
    queryFn: async () => {
      const { data } = await api.get<AssessmentDetail>(`/assessments/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}
