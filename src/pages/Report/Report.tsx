import { useParams, Link } from "react-router-dom";
import { Download, Loader2, TrendingUp, RotateCcw, LayoutDashboard, RefreshCw, AlertTriangle } from "lucide-react";
import { useReport } from "../../hooks/useReport";
import TierBadge from "../../components/TierBadge";
import ScoreRing from "../../components/ScoreRing";
import RadarChart from "../../components/RadarChart";
import DimensionCard from "../../components/DimensionCard";
import PageWrapper from "../../components/common/PageWrapper";

export default function Report() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: report, isLoading, timedOut, resetPolling } = useReport(sessionId!);

  const assessmentSlug = sessionStorage.getItem(`session-${sessionId}-slug`);

  if (isLoading || (!report && !timedOut)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 border-4 border-elk-red border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-gray-700 font-semibold mb-1">Calculating your results</p>
          <p className="text-gray-400 text-sm">This takes just a moment…</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-elk-red" />
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-bold mb-1">Report not available</p>
          <p className="text-gray-400 text-sm mb-5">Your results could not be loaded. Please try again.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-elk-red hover:bg-red-800 text-white text-sm font-bold rounded-xl transition-all">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
    <div className="space-y-6">
      {/* ── Score hero ── */}
      <div className="relative bg-elk-maroon rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(circle at 80% 50%, #C0392B 0%, transparent 60%)" }}
        />
        <div className="relative p-8 flex flex-col sm:flex-row items-center gap-8">
          <div className="shrink-0">
            <ScoreRing score={report.overall_score} size={150} dark />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">
              Assessment Report
            </p>
            <h1 className="text-2xl font-extrabold text-white mb-3 leading-tight">
              Your AI Maturity Report
            </h1>
            <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
              <TierBadge tier={report.tier_result} size="lg" />
              <span className="text-white/40 text-sm">
                Session <span className="font-mono text-white/25 text-xs">{report.session_id.slice(0, 8)}…</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Radar chart ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={18} className="text-elk-red" />
          <h2 className="text-base font-bold text-gray-900">Dimension Breakdown</h2>
        </div>
        <RadarChart data={report.radar_data} />
      </div>

      {/* ── Dimension cards ── */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">Scores by Dimension</h2>
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

      {/* ── PDF download ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">PDF Report</h3>
            <p className="text-sm text-gray-400">
              {report.pdf_url
                ? "Your full report is ready to download."
                : timedOut
                ? "PDF generation is taking longer than expected."
                : "Generating your PDF report — this takes a few seconds…"}
            </p>
          </div>
          {report.pdf_url ? (
            <a
              href={report.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-elk-red hover:bg-red-800 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-900/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Download size={16} /> Download PDF
            </a>
          ) : timedOut ? (
            <button
              onClick={resetPolling}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-elk-red border border-elk-rose hover:bg-red-50 rounded-xl transition-all"
            >
              <RefreshCw size={15} /> Retry
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 size={16} className="animate-spin text-elk-rose" />
              <span>Generating…</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation CTAs ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {assessmentSlug && (
          <Link
            to={`/assessments/${assessmentSlug}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-elk-red text-elk-red hover:bg-red-50 text-sm font-bold rounded-xl transition-all"
          >
            <RotateCcw size={15} /> Retake Assessment
          </Link>
        )}
        <Link
          to="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-all"
        >
          <LayoutDashboard size={15} /> Back to Dashboard
        </Link>
      </div>
    </div>
    </PageWrapper>
  );
}
