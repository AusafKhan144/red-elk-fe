import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import api from "../lib/api";
import type { Report } from "../types/api";

const MAX_RETRIES = 30;
const POLL_INTERVAL = 3000;

export function useReport(sessionId: string) {
  const retries = useRef(0);
  const [timedOut, setTimedOut] = useState(false);

  const query = useQuery({
    queryKey: ["report", sessionId],
    queryFn: async () => {
      const { data } = await api.get<Report>(`/reports/${sessionId}`);
      return data;
    },
    enabled: !!sessionId && !timedOut,
    refetchInterval: (q) => {
      if (q.state.data?.pdf_url) return false;
      if (retries.current >= MAX_RETRIES) {
        setTimedOut(true);
        return false;
      }
      retries.current += 1;
      return POLL_INTERVAL;
    },
  });

  function resetPolling() {
    retries.current = 0;
    setTimedOut(false);
  }

  return { ...query, timedOut, resetPolling };
}
