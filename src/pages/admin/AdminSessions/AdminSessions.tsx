import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminSessions } from "../../../hooks/useAdmin";
import SubscriptionBadge from "../../../components/SubscriptionBadge";
import PageWrapper from "../../../components/common/PageWrapper";

export default function AdminSessions() {
  const [page, setPage] = useState(0);
  const { data: sessions, isLoading } = useAdminSessions(page);
  const [search, setSearch] = useState("");

  const filtered = sessions?.filter((s) =>
    s.user_id?.toLowerCase().includes(search.toLowerCase()) ||
    s.assessment_id?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const hasPrev = page > 0;
  const hasNext = sessions?.length === 50;

  return (
    <PageWrapper>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">All Sessions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Every assessment session across the platform.</p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user or assessment ID…"
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-elk-rose w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-elk-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["User ID", "Assessment ID", "Tier", "Started", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                    No sessions found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono text-gray-400 text-xs">{s.user_id.slice(0, 8)}…</td>
                    <td className="px-5 py-4 font-mono text-gray-400 text-xs">
                      {s.assessment_id.slice(0, 8)}…
                    </td>
                    <td className="px-5 py-4">
                      {s.tier_at_time ? <SubscriptionBadge tier={s.tier_at_time} /> : "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(s.started_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        s.status === "completed"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          s.status === "completed" ? "bg-green-400" : "bg-amber-400"
                        }`} />
                        {s.status === "completed" ? "Completed" : "In progress"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Page {page + 1}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!hasPrev}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </PageWrapper>
  );
}
