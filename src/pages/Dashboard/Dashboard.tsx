import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck, BarChart2, Award, Plus, Layers, Play } from "lucide-react";
import PageWrapper from "../../components/common/PageWrapper";
import { useAssessments } from "../../hooks/useAssessments";
import { useSessions } from "../../hooks/useSession";
import { useAuth } from "../../context/AuthContext";
import SubscriptionBadge from "../../components/SubscriptionBadge";
import TierUpgradeTeaser from "../../components/TierUpgradeTeaser";
import type { ReactNode } from "react";
import type { Assessment, Session } from "../../types/api";

const TIER_BORDER: Record<string, string> = {
  free: "border-l-elk-red",
  basic: "border-l-blue-500",
  premium: "border-l-elk-gold",
};

const TIER_DESC: Record<string, string> = {
  free: "Core questions only",
  basic: "Core + intermediate",
  premium: "Full question suite",
};

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

        {/* ── Hero welcome strip ── */}
        <div className="grain relative rounded-2xl overflow-hidden bg-elk-ink px-7 py-6 flex items-center justify-between gap-4">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #5b1013 0%, transparent 55%)", opacity: 0.6 }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 90% 50%, #C0392B 0%, transparent 60%)", opacity: 0.18 }}
          />
          <div className="relative">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">{greeting()}</p>
            <h1
              className="text-2xl font-extrabold text-white leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {firstName}
            </h1>
            <p className="text-white/50 text-sm mt-1">Here&apos;s your AI maturity snapshot.</p>
          </div>
          <div className="relative hidden sm:flex flex-col items-end gap-2 shrink-0">
            {user?.tier && <SubscriptionBadge tier={user.tier} size="lg" />}
            {user?.tier && user.tier !== "premium" && (
              <p className="text-amber-400/80 text-xs font-medium">
                Unlock more →
              </p>
            )}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GradientStatCard
            icon={<ClipboardCheck size={20} className="text-white" />}
            label="Sessions done"
            value={loadingS ? "—" : completed.length}
            gradient="linear-gradient(135deg, #5b1013 0%, #C0392B 100%)"
          />
          <GradientStatCard
            icon={<BarChart2 size={20} className="text-white" />}
            label="Assessments"
            value={loadingA ? "—" : (assessments?.length ?? 0)}
            gradient="linear-gradient(135deg, #1A1D2E 0%, #0E0F1A 100%)"
          />
          <div className="bg-white dark:bg-elk-slate rounded-2xl border border-gray-100 dark:border-gray-700/40 shadow-sm p-5 flex flex-col">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-3">
              <BarChart2 size={18} className="text-elk-teal" />
            </div>
            <p className="text-xs text-gray-400 dark:text-white/40 mb-1.5">In progress</p>
            <div
              className="text-3xl font-extrabold text-gray-900 dark:text-white/90 leading-none mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {loadingS ? "—" : inProgress.length}
            </div>
            <p className="text-xs text-gray-400 dark:text-white/30">active session{inProgress.length !== 1 ? "s" : ""}</p>
          </div>
          <div className={`bg-white dark:bg-elk-slate rounded-2xl border border-gray-100 dark:border-gray-700/40 border-l-4 ${TIER_BORDER[user?.tier ?? "free"]} shadow-sm p-5 flex flex-col`}>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-3">
              <Award size={18} className="text-amber-500" />
            </div>
            <p className="text-xs text-gray-400 dark:text-white/40 mb-1.5">Your tier</p>
            {user?.tier ? (
              <>
                <SubscriptionBadge tier={user.tier} />
                <p className="text-xs text-gray-400 dark:text-white/30 mt-1.5">{TIER_DESC[user.tier]}</p>
              </>
            ) : (
              <span className="text-2xl font-extrabold text-gray-300 dark:text-white/20" style={{ fontFamily: "var(--font-display)" }}>—</span>
            )}
          </div>
        </div>

        {/* ── Tier upgrade teaser ── */}
        {user?.tier && user.tier !== "premium" && (
          <TierUpgradeTeaser tier={user.tier} context="dashboard" />
        )}

        {/* ── In Progress (resume ribbon) ── */}
        {inProgress.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white/90 mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Continue where you left off
            </h2>
            <div className="space-y-3">
              {inProgress.map((s) => {
                const assessment = assessmentMap.get(s.assessment_id);
                const daysAgo = Math.floor((Date.now() - new Date(s.started_at).getTime()) / 86_400_000);
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-amber-300/30 dark:border-amber-600/20 bg-amber-50/60 dark:bg-amber-950/20 px-5 py-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="relative flex shrink-0">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40 animate-ping" />
                        <span className="relative inline-flex w-3 h-3 rounded-full bg-amber-400" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white/90 truncate">
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
                      className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl shadow-sm shadow-red-900/20 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all"
                      style={{ background: "linear-gradient(135deg, #C0392B 0%, #5b1013 100%)" }}
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
          <h2 className="text-base font-bold text-gray-900 dark:text-white/90 mb-4" style={{ fontFamily: "var(--font-display)" }}>
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
                  className="bg-white dark:bg-elk-slate rounded-2xl border border-gray-100 dark:border-gray-700/40 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600/50 transition-all flex flex-col"
                >
                  {/* Header band */}
                  <div
                    className="px-5 pt-5 pb-4 border-b border-gray-50 dark:border-gray-700/30"
                    style={{ background: "linear-gradient(135deg, #5b1013 0%, #C0392B 100%)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                          <Layers size={15} className="text-white" />
                        </div>
                        <span className="text-white/70 text-xs font-bold uppercase tracking-wide">v{a.version}</span>
                      </div>
                      {user?.tier && user.tier !== "premium" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-200 bg-black/20 px-2 py-0.5 rounded-full border border-white/10">
                          🔒 {user.tier === "free" ? "Core only" : "Basic tier"}
                        </span>
                      )}
                    </div>
                    <h3
                      className="text-white font-bold text-base mt-3 leading-snug"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {a.name}
                    </h3>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {a.description && (
                      <p className="text-sm text-gray-500 dark:text-white/50 leading-relaxed flex-1 mb-4">{a.description}</p>
                    )}
                    <Link
                      to={`/assessments/${a.slug}`}
                      className="flex items-center justify-center gap-2 py-2.5 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-red-900/20 hover:shadow-md hover:shadow-red-900/30 hover:-translate-y-0.5 active:translate-y-0"
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

        {/* ── Recent Sessions (card list, no table) ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white/90" style={{ fontFamily: "var(--font-display)" }}>
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

function GradientStatCard({
  icon,
  label,
  value,
  gradient,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  gradient: string;
}) {
  return (
    <div className="grain rounded-2xl p-5 text-white flex flex-col" style={{ background: gradient }}>
      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-3">
        {icon}
      </div>
      <div
        className="text-3xl font-extrabold text-white leading-none mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <p className="text-xs text-white/60">{label}</p>
    </div>
  );
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="bg-white dark:bg-elk-slate rounded-2xl border border-dashed border-gray-200 dark:border-gray-700/50 p-10 text-center">
      <p className="text-sm text-gray-400 dark:text-white/30">{message}</p>
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
  return <div className={`animate-pulse bg-gray-100 dark:bg-gray-800/50 rounded-xl ${className}`} />;
}
