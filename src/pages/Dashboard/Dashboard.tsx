import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck, BarChart2, Award, Plus, Layers } from "lucide-react";
import PageWrapper from "../../components/common/PageWrapper";
import { useAssessments } from "../../hooks/useAssessments";
import { useSessions } from "../../hooks/useSession";
import { useAuth } from "../../context/AuthContext";
import SubscriptionBadge from "../../components/SubscriptionBadge";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: assessments, isLoading: loadingA } = useAssessments();
  const { data: sessions, isLoading: loadingS } = useSessions();

  const completed = sessions?.filter((s) => s.status === "completed") ?? [];

  // Cross-reference assessment names from the assessments list
  const assessmentMap = new Map(assessments?.map((a) => [a.id, a]) ?? []);

  const firstName = user?.email?.split("@")[0] ?? "there";

  return (
    <PageWrapper>
    <div className="space-y-8">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
            Welcome back, <span className="text-elk-red">{firstName}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s your AI maturity overview.</p>
        </div>
        {user?.tier && (
          <div className="hidden sm:block">
            <SubscriptionBadge tier={user.tier} size="lg" />
          </div>
        )}
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<ClipboardCheck size={22} className="text-elk-red" />}
          label="Sessions completed"
          value={completed.length}
          accent="red"
        />
        <StatCard
          icon={<BarChart2 size={22} className="text-indigo-500" />}
          label="Assessments available"
          value={assessments?.length ?? "—"}
          accent="indigo"
        />
        <StatCard
          icon={<Award size={22} className="text-amber-500" />}
          label="Current tier"
          value={user?.tier ? <SubscriptionBadge tier={user.tier} /> : "—"}
          accent="amber"
        />
      </div>

      {/* ── Assessments ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Available Assessments</h2>
        </div>

        {loadingA ? (
          <SkeletonGrid />
        ) : !assessments || assessments.length === 0 ? (
          <EmptyCard message="No assessments available yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col hover:shadow-md hover:border-gray-200 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                      <Layers size={15} className="text-elk-red" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      v{a.version}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">{a.name}</h3>
                {a.description && (
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{a.description}</p>
                )}
                <Link
                  to={`/assessments/${a.slug}`}
                  className="mt-5 flex items-center justify-center gap-2 py-2.5 bg-elk-red hover:bg-red-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-red-900/20 hover:shadow-md hover:shadow-red-900/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Plus size={15} />
                  Start Assessment
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Recent sessions ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Sessions</h2>
          <Link
            to="/sessions"
            className="text-sm font-semibold text-elk-red hover:text-red-800 flex items-center gap-1 transition-colors"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>

        {loadingS ? (
          <SkeletonRows rows={3} />
        ) : completed.length === 0 ? (
          <EmptyCard message="No completed sessions yet. Take an assessment to get started." />
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
                {completed.slice(0, 5).map((s) => {
                  const assessment = assessmentMap.get(s.assessment_id);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-4 font-semibold text-gray-800">
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
                        {s.tier_at_time ? <SubscriptionBadge tier={s.tier_at_time} /> : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          Completed
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/sessions/${s.id}/report`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-elk-red hover:text-red-800 transition-colors"
                        >
                          View Report <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </PageWrapper>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent: "red" | "indigo" | "amber";
}) {
  const bg = { red: "bg-red-50", indigo: "bg-indigo-50", amber: "bg-amber-50" }[accent];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-3xl font-extrabold text-gray-900 leading-none mb-1">{value}</div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

function SkeletonRows({ rows }: { rows: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBox key={i} className="h-14" />
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <SkeletonBox key={i} className="h-48 rounded-2xl" />
      ))}
    </div>
  );
}

function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />;
}
