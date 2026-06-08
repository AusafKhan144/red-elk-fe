import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Clock, ArrowRight, ChevronRight, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAssessment } from "../../hooks/useAssessments";
import { useStartSession } from "../../hooks/useSession";

export default function AssessmentIntro() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: assessment, isLoading } = useAssessment(slug!);
  const { mutateAsync: startSession, isPending } = useStartSession();

  async function handleStart() {
    try {
      const session = await startSession(slug!);
      sessionStorage.setItem(`session-${session.id}-slug`, slug!);
      navigate(`/sessions/${session.id}/quiz`);
    } catch {
      toast.error("Failed to start session. Please try again.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-elk-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!assessment) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Link to="/dashboard" className="text-gray-400 hover:text-elk-red transition-colors font-medium">
          Dashboard
        </Link>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-gray-700 font-semibold">{assessment.name}</span>
      </nav>

      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-elk-red via-elk-rose to-elk-red" />
        <div className="p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
              <FileText size={22} className="text-elk-red" />
            </div>
            <span className="inline-flex items-center px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold text-gray-500 uppercase tracking-wide">
              v{assessment.version}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-3 leading-tight">
            {assessment.name}
          </h1>
          <p className="text-gray-500 leading-relaxed mb-6">{assessment.description}</p>

          {(() => {
            const totalQ = assessment.dimensions.reduce((sum, d) => sum + d.questions.length, 0);
            return (
              <div className="flex items-center gap-5 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-elk-rose" />
                  <span>{totalQ} questions across {assessment.dimensions.length} dimensions</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-200" />
                <span>~{Math.ceil(totalQ * 0.5)} min</span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* What to expect */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-base font-bold text-gray-900 mb-5">What to expect</h2>
        <ul className="space-y-3.5">
          {[
            "Rate each statement on a scale of 1–5",
            "Your answers are saved automatically as you go",
            "You can pause and resume at any time",
            "Get your full scored report once you submit",
            "Download a PDF with your results and roadmap",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
              <CheckCircle size={16} className="text-elk-red mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleStart}
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2.5 py-4 bg-elk-red hover:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all text-base shadow-lg shadow-red-900/25 hover:shadow-xl hover:shadow-red-900/35 hover:-translate-y-0.5 active:translate-y-0"
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Starting…
          </>
        ) : (
          <>
            Start Assessment <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  );
}
