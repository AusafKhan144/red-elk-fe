import { useParams, Link } from "react-router-dom";
import { Download, Loader2, TrendingUp, RotateCcw, LayoutDashboard, RefreshCw, AlertTriangle, Calendar } from "lucide-react";
import { useReport } from "../../hooks/useReport";
import { useAuth } from "../../context/AuthContext";
import TierBadge from "../../components/TierBadge";
import ScoreRing from "../../components/ScoreRing";
import RadarChart from "../../components/RadarChart";
import DimensionCard from "../../components/DimensionCard";
import TierUpgradeTeaser from "../../components/TierUpgradeTeaser";
import PageWrapper from "../../components/common/PageWrapper";
import type { MaturityLevel } from "../../types/api";

const MATURITY_TIERS: { key: MaturityLevel; label: string; range: string }[] = [
  { key: "nascent", label: "Nascent", range: "0–30" },
  { key: "developing", label: "Developing", range: "30–55" },
  { key: "maturing", label: "Maturing", range: "55–75" },
  { key: "leading", label: "Leading", range: "75–100" },
];

const TIER_GLOW: Record<MaturityLevel, string> = {
  nascent: "shadow-red-500/40",
  developing: "shadow-amber-500/40",
  maturing: "shadow-teal-500/40",
  leading: "shadow-yellow-500/40",
};

const TIER_RING_BG: Record<MaturityLevel, string> = {
  nascent: "bg-red-500/20 border-red-500/40",
  developing: "bg-amber-500/20 border-amber-500/40",
  maturing: "bg-teal-500/20 border-teal-500/40",
  leading: "bg-yellow-500/20 border-yellow-500/40",
};

export default function Report() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: report, isLoading, timedOut, resetPolling } = useReport(sessionId!);
  const { user } = useAuth();

  const assessmentSlug = sessionStorage.getItem(`session-${sessionId}-slug`);

  if (isLoading || (!report && !timedOut)) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-elk-red/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-elk-red border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-gray-800 dark:text-white/80 font-bold text-lg mb-1">Calculating your results</p>
          <p className="text-gray-400 dark:text-white/40 text-sm">This takes just a moment…</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
          <AlertTriangle size={28} className="text-elk-red" />
        </div>
        <div className="text-center">
          <p className="text-gray-800 dark:text-white/80 font-bold mb-1">Report not available</p>
          <p className="text-gray-400 dark:text-white/40 text-sm mb-5">Your results could not be loaded. Please try again.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-elk-red hover:bg-red-800 text-white text-sm font-bold rounded-xl transition-all">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const tierIdx = MATURITY_TIERS.findIndex((t) => t.key === report.tier_result);

  return (
    <PageWrapper>
      <div className="space-y-6">

        {/* ── Score hero ── */}
        <div className="grain relative bg-elk-ink rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #5b1013 0%, transparent 55%)", opacity: 0.7 }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 85% 40%, #C0392B 0%, transparent 55%)", opacity: 0.25 }}
          />

          <div className="relative px-8 pt-8 pb-6 flex flex-col sm:flex-row items-center gap-8">
            {/* Score ring */}
            <div className={`shrink-0 p-3 rounded-full border ${TIER_RING_BG[report.tier_result]} shadow-xl ${TIER_GLOW[report.tier_result]}`}>
              <ScoreRing score={report.overall_score} size={160} dark tier={report.tier_result} />
            </div>

            <div className="text-center sm:text-left">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">AI Maturity Report</p>
              <h1 className="text-2xl font-extrabold text-white mb-3 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Your Assessment Results
              </h1>
              <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap mb-3">
                <TierBadge tier={report.tier_result} size="lg" />
              </div>
              {report.generated_at && (
                <p className="text-white/30 text-xs flex items-center gap-1.5 justify-center sm:justify-start">
                  <Calendar size={11} />
                  {new Date(report.generated_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          </div>

          {/* Maturity journey bar */}
          <div className="relative px-8 pb-6">
            <div className="flex items-stretch gap-1 rounded-xl overflow-hidden border border-white/8">
              {MATURITY_TIERS.map((tier, i) => {
                const isActive = i === tierIdx;
                const isPast = i < tierIdx;
                return (
                  <div
                    key={tier.key}
                    className={`flex-1 px-3 py-2.5 text-center transition-all ${
                      isActive
                        ? "bg-white/15 border-t-2 border-white/40"
                        : isPast
                        ? "bg-white/6"
                        : "bg-white/3"
                    }`}
                  >
                    <p className={`text-xs font-bold ${isActive ? "text-white" : isPast ? "text-white/50" : "text-white/25"}`}
                       style={isActive ? { fontFamily: "var(--font-display)" } : undefined}>
                      {tier.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${isActive ? "text-white/60" : "text-white/20"}`}>{tier.range}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Tier upgrade teaser ── */}
        {user?.tier && user.tier !== "premium" && (
          <TierUpgradeTeaser tier={user.tier} context="report" />
        )}

        {/* ── Radar chart ── */}
        <div className="bg-white dark:bg-elk-slate rounded-2xl border border-gray-100 dark:border-gray-700/40 shadow-sm p-6">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-elk-red" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white/90">Dimension Breakdown</h2>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-white/40 mb-5 ml-6.5">
            Each axis represents a capability area scored 0–100.
          </p>
          <RadarChart data={report.radar_data} />
        </div>

        {/* ── Dimension cards ── */}
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white/90 mb-4">Scores by Dimension</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.radar_data.map((point) => (
              <DimensionCard
                key={point.dimension}
                dimension={{
                  name: point.label,
                  score: point.score,
                  description: report.recommendations[point.dimension] ?? "",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Next steps panel (PDF + CTAs merged) ── */}
        <div className="bg-white dark:bg-elk-slate rounded-2xl border border-gray-100 dark:border-gray-700/40 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700/30">
            <h3 className="font-bold text-gray-900 dark:text-white/90 text-sm">Next Steps</h3>
          </div>
          <div className="p-6 grid sm:grid-cols-2 gap-4">
            {/* PDF */}
            <div className="flex flex-col gap-3">
              <p className="text-sm text-gray-500 dark:text-white/50">
                {report.pdf_url
                  ? "Your full report is ready to download."
                  : timedOut
                  ? "PDF generation is taking longer than expected."
                  : "Generating your PDF report…"}
              </p>
              {report.pdf_url ? (
                <a
                  href={report.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-elk-red hover:bg-red-800 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-900/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 self-start"
                >
                  <Download size={15} /> Download PDF
                </a>
              ) : timedOut ? (
                <button
                  onClick={resetPolling}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-elk-red border border-elk-rose dark:border-elk-red/30 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all self-start"
                >
                  <RefreshCw size={15} /> Retry
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-white/30">
                  <Loader2 size={15} className="animate-spin text-elk-rose" />
                  <span>Generating…</span>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              {assessmentSlug && (
                <Link
                  to={`/assessments/${assessmentSlug}`}
                  className="flex items-center justify-center gap-2 py-2.5 border-2 border-elk-red text-elk-red hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-bold rounded-xl transition-all"
                >
                  <RotateCcw size={14} /> Retake Assessment
                </Link>
              )}
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-white/70 text-sm font-bold rounded-xl transition-all"
              >
                <LayoutDashboard size={14} /> Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
