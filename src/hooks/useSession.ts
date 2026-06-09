import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import type { Session, AnswerOut } from "../types/api";

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data } = await api.get<Session[]>("/sessions");
      return data;
    },
  });
}

export function useStartSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (assessment_slug: string) => {
      const { data } = await api.post<Session>("/sessions/start", {
        assessment_slug,
      });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useAnswerQuestion(sessionId: string) {
  return useMutation({
    mutationFn: async (payload: {
      question_id: string;
      dimension_id: string;
      answer_value: number;
    }) => {
      const { data } = await api.post(`/sessions/${sessionId}/answer`, payload);
      return data;
    },
  });
}

export function useSubmitSession(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/sessions/${sessionId}/submit`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useSessionAnswers(sessionId: string) {
  return useQuery({
    queryKey: ["sessions", sessionId, "answers"],
    queryFn: async () => {
      const { data } = await api.get<AnswerOut[]>(`/sessions/${sessionId}/answers`);
      return data;
    },
    enabled: !!sessionId,
  });
}

export function useAbandonSession(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(`/sessions/${sessionId}/abandon`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}
