import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck, BarChart2, Award, Plus, Layers, Play, Activity } from "lucide-react";
import PageWrapper from "../../components/common/PageWrapper";
import { useAssessments } from "../../hooks/useAssessments";
import { useSessions } from "../../hooks/useSession";
import { useAuth } from "../../context/AuthContext";
import SubscriptionBadge from "../../components/SubscriptionBadge";
import TierUpgradeTeaser from "../../components/TierUpgradeTeaser";
import type { ReactNode } from "react";
import type { Assessment, Session } from "../../types/api";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: assessments, isLoading: loadingA } = useAssessments();
  const { data: sessions, isLoading: loadingS } = useSessions();

  const inProgress: Session[] = sessions?.filter((s: Session) => s.status === "in_progress") ?? [];
  const completed: Session[] = sessions?.filter((s: Session) => s.status === "completed") ?? [];

  const assessmentMap = new Map<string, Assessment>(
    assessments?.map((a: Assessment) => [a.id, a] as [string, Assessment]) ?? []
  );

  const firstName = user?.email?.split("@")[0] ?? "there";

  return (
    <PageWrapper>
      <div className="space-y-8">

        {/* ── Welcome ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-widest mb-1">
              {greeting()}
            </p>
            <h1
              className="text-2xl font-bold text-gray-900 dark:text-white leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {firstName}
            </h1>
            <p className="text-sm text-gray-400 dark:text-white/40 mt-1">Your AI maturity snapshot</p>
          </div>
          <div className="shrink-0 hidden sm:block mt-1">
            {user?.tier && <SubscriptionBadge tier={user.tier} size="lg" />}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<ClipboardCheck size={17} className="text-elk-red" />}
            label="Sessions done"
            value={loadingS ? "—" : completed.length}
            iconBg="bg-red-50 dark:bg-red-950/30"
          />
          <StatCard
            icon={<BarChart2 size={17} className="text-gray-500 dark:text-white/45" />}
            label="Assessments"
            value={loadingA ? "—" : (assessments?.length ?? 0)}
            iconBg="bg-gray-100 dark:bg-white/6"
          />
          <StatCard
            icon={<Activity size={17} className="text-elk-teal" />}
            label="In progress"
            value={loadingS ? "—" : inProgress.length}
            iconBg="bg-teal-50 dark:bg-teal-900/20"
          />
          <StatCard
            icon={<Award size={17} className="text-amber-500" />}
            label="Your tier"
            value={user?.tier ? <SubscriptionBadge tier={user.tier} /> : <span className="text-gray-300 dark:text-white/20">—</span>}
            iconBg="bg-amber-50 dark:bg-amber-900/20"
          />
        </div>

        {/* ── Tier upgrade teaser ── */}
        {user?.tier && user.tier !== "premium" && (
          <TierUpgradeTeaser tier={user.tier} context="dashboard" />
        )}

        {/* ── In Progress (resume ribbon) ── */}
        {inProgress.length > 0 && (
          <div>
            <h2
              className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Continue where you left off
            </h2>
            <div className="space-y-2.5">
              {inProgress.map((s) => {
                const assessment = assessmentMap.get(s.assessment_id);
                const daysAgo = Math.floor((Date.now() - new Date(s.started_at).getTime()) / 86_400_000);
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-amber-300/30 dark:border-amber-600/20 bg-amber-50/60 dark:bg-amber-950/20 px-5 py-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="relative flex shrink-0">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40 animate-ping" />
                        <span className="relative inline-flex w-3 h-3 rounded-full bg-amber-400" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white/90 truncate">
                          {assessment?.name ?? s.assessment_id.slice(0, 8) + "…"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-white/40">
                          {daysAgo === 0 ? "Started today" : daysAgo === 1 ? "Started yesterday" : `Started ${daysAgo} days ago`}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/sessions/${s.id}/quiz`}
                      onClick={() => {
                        if (s.assessment_slug) {
                          sessionStorage.setItem(`session-${s.id}-slug`, s.assessment_slug);
                        }
                      }}
                      className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-white text-xs font-semibold rounded-lg bg-elk-red hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm shadow-red-900/15"
                    >
                      <Play size={12} /> Continue
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Available Assessments ── */}
        <div>
          <h2
            className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Available Assessments
          </h2>

          {loadingA ? (
            <SkeletonGrid />
          ) : !assessments || assessments.length === 0 ? (
            <EmptyCard message="No assessments available yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((a: Assessment) => (
                <div
                  key={a.id}
                  className="bg-white dark:bg-elk-slate rounded-xl border border-gray-100 dark:border-gray-700/40 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
                        <Layers size={14} className="text-elk-red" />
                      </div>
                      <div className="min-w-0">
                        <h3
                          className="text-base font-bold text-gray-900 dark:text-white/90 leading-snug"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {a.name}
                        </h3>
                        <span className="text-xs text-gray-400 dark:text-white/35">v{a.version}</span>
                      </div>
                    </div>
                    {user?.tier && user.tier !== "premium" && (
                      <span className="shrink-0 text-xs text-gray-400 dark:text-white/30 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/8">
                        Core only
                      </span>
                    )}
                  </div>

                  {a.description && (
                    <p className="text-sm text-gray-500 dark:text-white/45 leading-relaxed">{a.description}</p>
                  )}

                  <Link
                    to={`/assessments/${a.slug}`}
                    className="mt-auto flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-lg bg-elk-red hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm shadow-red-900/15"
                  >
                    <Plus size={14} />
                    Start Assessment
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Recent Sessions ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Recent Sessions
            </h2>
            <Link
              to="/sessions"
              className="text-xs font-semibold text-elk-red hover:text-red-800 flex items-center gap-1 transition-colors"
            >
              See all <ArrowRight size={13} />
            </Link>
          </div>

          {loadingS ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <SkeletonBox key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : completed.length === 0 ? (
            <EmptyCard message="No completed sessions yet. Take an assessment to get started." />
          ) : (
            <div className="space-y-2">
              {completed.slice(0, 5).map((s) => {
                const assessment = assessmentMap.get(s.assessment_id);
                return (
                  <div
                    key={s.id}
                    className="bg-white dark:bg-elk-slate rounded-xl border border-gray-100 dark:border-gray-700/40 px-5 py-3.5 flex items-center gap-4 hover:shadow-sm transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white/90 truncate">
                        {assessment?.name ?? (
                          <span className="font-mono text-gray-400 text-xs">{s.assessment_id.slice(0, 8)}…</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">
                        {new Date(s.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}
                        {s.tier_at_time && <SubscriptionBadge tier={s.tier_at_time} size="sm" />}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-800/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        Completed
                      </span>
                      <Link
                        to={`/sessions/${s.id}/report`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-elk-red hover:text-red-800 transition-colors"
                      >
                        View Report <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
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
  iconBg,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  iconBg?: string;
}) {
  return (
    <div className="bg-white dark:bg-elk-slate rounded-xl border border-gray-100 dark:border-gray-700/40 p-5 flex flex-col gap-3 shadow-sm">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg ?? "bg-gray-100 dark:bg-white/6"}`}>
        {icon}
      </div>
      <div>
        <div
          className="text-2xl font-bold text-gray-900 dark:text-white/90 leading-none mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {value}
        </div>
        <p className="text-xs text-gray-400 dark:text-white/40">{label}</p>
      </div>
    </div>
  );
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="bg-white dark:bg-elk-slate rounded-xl border border-dashed border-gray-200 dark:border-gray-700/50 p-10 text-center">
      <p className="text-sm text-gray-400 dark:text-white/30">{message}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <SkeletonBox key={i} className="h-48 rounded-xl" />
      ))}
    </div>
  );
}

function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 dark:bg-gray-800/50 rounded-xl ${className}`} />;
}
