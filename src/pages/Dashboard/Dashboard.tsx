import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck, BarChart2, Award, Plus, Layers } from "lucide-react";
import PageWrapper from "../../components/common/PageWrapper";
import { useAssessments } from "../../hooks/useAssessments";
import { useSessions } from "../../hooks/useSession";
import { useAuth } from "../../context/AuthContext";
import SubscriptionBadge from "../../components/SubscriptionBadge";
import type { ReactNode } from "react";
import type { Assessment, Session } from "../../types/api";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: assessments, isLoading: loadingA } = useAssessments();
  const { data: sessions, isLoading: loadingS } = useSessions();

  const completed: Session[] = sessions?.filter((s: Session) => s.status === "completed") ?? [];

  const assessmentMap = new Map<string, Assessment>(
    assessments?.map((a: Assessment) => [a.id, a] as [string, Assessment]) ?? []
  );

  const firstName = user?.email?.split("@")[0] ?? "there";

  return (
    <PageWrapper>
    <div className="space-y-8">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-extrabold text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome back,{" "}
            <span className="text-elk-red">{firstName}</span>
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
        <GradientStatCard
          icon={<ClipboardCheck size={22} className="text-white" />}
          label="Sessions completed"
          value={completed.length}
          gradient="linear-gradient(135deg, #5b1013 0%, #C0392B 100%)"
          iconBg="bg-white/15"
        />
        <GradientStatCard
          icon={<BarChart2 size={22} className="text-white" />}
          label="Assessments available"
          value={assessments?.length ?? "—"}
          gradient="linear-gradient(135deg, #1A1D2E 0%, #0E0F1A 100%)"
          iconBg="bg-white/15"
        />
        <TierStatCard
          icon={<Award size={22} className="text-amber-500" />}
          label="Current tier"
          value={user?.tier ? <SubscriptionBadge tier={user.tier} /> : "—"}
        />
      </div>

      {/* ── Assessments ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Available Assessments
          </h2>
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
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all flex flex-col"
              >
                {/* Top accent bar */}
                <div
                  className="h-1"
                  style={{ background: "linear-gradient(90deg, #C0392B, #da8f93)" }}
                />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                      <Layers size={15} className="text-elk-red" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      v{a.version}
                    </span>
                  </div>
                  <h3
                    className="text-base font-bold text-gray-900 mb-2 leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {a.name}
                  </h3>
                  {a.description && (
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">{a.description}</p>
                  )}
                  <Link
                    to={`/assessments/${a.slug}`}
                    className="mt-5 flex items-center justify-center gap-2 py-2.5 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-red-900/20 hover:shadow-md hover:shadow-red-900/30 hover:-translate-y-0.5 active:translate-y-0"
                    style={{ background: "linear-gradient(135deg, #C0392B 0%, #5b1013 100%)" }}
                  >
                    <Plus size={15} />
                    Start Assessment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Recent sessions ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Recent Sessions
          </h2>
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
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
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

function GradientStatCard({
  icon,
  label,
  value,
  gradient,
  iconBg,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  gradient: string;
  iconBg: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 text-white"
      style={{ background: gradient }}
    >
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div
        className="text-3xl font-extrabold text-white leading-none mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <p className="text-sm text-white/60">{label}</p>
    </div>
  );
}

function TierStatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 border-l-4 border-l-elk-gold">
      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <div
        className="text-3xl font-extrabold text-gray-900 leading-none mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
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
