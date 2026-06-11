import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import type { Report } from "../types/api";

export function useReportStatic(sessionId?: string) {
  return useQuery({
    queryKey: ["report-static", sessionId],
    queryFn: () => api.get<Report>(`/reports/${sessionId}`).then((r) => r.data),
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000,
  });
}
