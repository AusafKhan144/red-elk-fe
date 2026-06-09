import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import type { User, UpdateProfilePayload } from "../types/api";

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await api.patch<User>("/auth/me", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}
