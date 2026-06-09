import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, Plus, Search } from "lucide-react";
import { useSessions } from "../../hooks/useSession";
import { useAssessments } from "../../hooks/useAssessments";
import SubscriptionBadge from "../../components/SubscriptionBadge";
import PageWrapper from "../../components/common/PageWrapper";

type StatusFilter = "all" | "completed" | "in_progress";

export default function Sessions() {
  const { data: sessions, isLoading } = useSessions();
  const { data: assessments } = useAssessments();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const assessmentMap = new Map(assessments?.map((a) => [a.id, a]) ?? []);

  const filtered = (sessions ?? []).filter((s) => {
    const assessment = assessmentMap.get(s.assessment_id);
    const matchesSearch =
      !search ||
      assessment?.name.toLowerCase().includes(search.toLowerCase()) ||
      s.assessment_id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageWrapper>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Your Sessions</h1>
          <p className="text-sm text-gray-500 mt-1">All your completed and in-progress assessments.</p>
        </div>
        <Link
          to="/dashboard"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-elk-red hover:bg-red-800 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-900/20 hover:-translate-y-0.5"
        >
          <Plus size={15} /> New Assessment
        </Link>
      </div>

      {/* Search + filter bar */}
      {sessions && sessions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by assessment name…"
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-elk-rose"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-elk-rose bg-white"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In progress</option>
          </select>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-elk-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-gray-200" />
          </div>
          <p className="text-gray-500 font-semibold mb-1">No sessions yet</p>
          <p className="text-gray-400 text-sm mb-5">Take an assessment to get started.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-elk-red hover:bg-red-800 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-900/20"
          >
            Browse Assessments <ArrowRight size={15} />
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-400">No sessions match your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Assessment", "Started", "Tier", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => {
                const assessment = assessmentMap.get(s.assessment_id);
                return (
                  <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-800 max-w-[200px]">
                      {assessment?.name ?? (
                        <span className="font-mono text-gray-400 text-xs">
                          {s.assessment_id.slice(0, 8)}…
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(s.started_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      {s.tier_at_time ? (
                        <SubscriptionBadge tier={s.tier_at_time} />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          s.status === "completed"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            s.status === "completed" ? "bg-green-400" : "bg-amber-400"
                          }`}
                        />
                        {s.status === "completed" ? "Completed" : "In progress"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {s.status === "completed" && (
                        <Link
                          to={`/sessions/${s.id}/report`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-elk-red hover:text-red-800 transition-colors"
                        >
                          View Report <ArrowRight size={12} />
                        </Link>
                      )}
                      {s.status === "in_progress" && (
                        <Link
                          to={`/sessions/${s.id}/quiz`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-elk-red hover:text-red-800 transition-colors"
                        >
                          Resume <ArrowRight size={12} />
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </PageWrapper>
  );
}
