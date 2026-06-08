import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import type { AdminAnalytics, AdminSession, AdminUser } from "../types/api";

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const { data } = await api.get<AdminAnalytics>("/admin/analytics");
      return data;
    },
  });
}

const PAGE_SIZE = 50;

export function useAdminSessions(page = 0) {
  return useQuery({
    queryKey: ["admin", "sessions", page],
    queryFn: async () => {
      const { data } = await api.get<AdminSession[]>("/admin/sessions", {
        params: { limit: PAGE_SIZE, offset: page * PAGE_SIZE },
      });
      return data;
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data } = await api.get<AdminUser[]>("/admin/users");
      return data;
    },
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: "user" | "admin" }) => {
      const { data } = await api.patch(`/admin/users/${id}/role`, { role });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useAdminUserSessions(userId: string) {
  return useQuery({
    queryKey: ["admin", "users", userId, "sessions"],
    queryFn: async () => {
      const { data } = await api.get<AdminSession[]>(`/admin/users/${userId}/sessions`);
      return data;
    },
    enabled: !!userId,
  });
}

export function useImportAssessment() {
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/admin/assessments/from-xlsx", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
  });
}
