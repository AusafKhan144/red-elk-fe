import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Send, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ProgressBar from "../../components/common/ProgressBar";
import { useAssessment } from "../../hooks/useAssessments";
import { useAnswerQuestion, useSubmitSession, useSessionAnswers } from "../../hooks/useSession";
import QuestionRenderer from "../../components/assessment/QuestionRenderer";
import TierUpgradeTeaser from "../../components/TierUpgradeTeaser";
import { useAuth } from "../../context/AuthContext";

import type { Question } from "../../types/api";

interface FlatQuestion extends Question {
  dimension_id: string;
  dimension_name: string;
}

const DIMENSION_COLORS = [
  { accent: "#C0392B", bg: "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/40", text: "text-elk-red dark:text-red-400" },
  { accent: "#4F46E5", bg: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/40", text: "text-indigo-600 dark:text-indigo-400" },
  { accent: "#0D9488", bg: "bg-teal-50 dark:bg-teal-950/30 border-teal-100 dark:border-teal-900/40", text: "text-elk-teal dark:text-teal-400" },
  { accent: "#7C3AED", bg: "bg-violet-50 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900/40", text: "text-violet-600 dark:text-violet-400" },
  { accent: "#D97706", bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40", text: "text-amber-600 dark:text-amber-400" },
  { accent: "#0284C7", bg: "bg-sky-50 dark:bg-sky-950/30 border-sky-100 dark:border-sky-900/40", text: "text-sky-600 dark:text-sky-400" },
];

export default function Quiz() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [slug] = useState(() => sessionStorage.getItem(`session-${sessionId}-slug`) ?? "");
  const { data: assessment, isLoading } = useAssessment(slug);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const { mutateAsync: answerQ } = useAnswerQuestion(sessionId!);
  const { mutateAsync: submitSession, isPending: submitting } = useSubmitSession(sessionId!);
  const { data: savedAnswers } = useSessionAnswers(sessionId!);

  const prevDimRef = useRef<string | null>(null);

  useEffect(() => {
    if (savedAnswers) {
      const restoredAnswers: Record<string, number> = {};
      savedAnswers.forEach((answer) => {
        restoredAnswers[answer.question_id] = answer.answer_value;
      });
      setAnswers(restoredAnswers);
    }
  }, [savedAnswers]);

  const questions = useMemo<FlatQuestion[]>(() => {
    if (!assessment) return [];
    return assessment.dimensions.flatMap((dim) =>
      dim.questions.map((q) => ({
        ...q,
        dimension_id: dim.id,
        dimension_name: dim.name,
      }))
    );
  }, [assessment]);

  const dimensionIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    assessment?.dimensions.forEach((dim, i) => map.set(dim.id, i));
    return map;
  }, [assessment]);

  // Group questions by dimension for dot gap rendering
  const dimensionBoundaries = useMemo(() => {
    const boundaries = new Set<number>();
    let dimId = "";
    questions.forEach((q, i) => {
      if (q.dimension_id !== dimId) {
        if (i > 0) boundaries.add(i);
        dimId = q.dimension_id;
      }
    });
    return boundaries;
  }, [questions]);

  const question = questions[current];
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;
  const isLast = current === questions.length - 1;
  const useDots = questions.length > 0 && questions.length <= 12;

  const dimIdx = question ? (dimensionIndexMap.get(question.dimension_id) ?? 0) : 0;
  const dimColor = DIMENSION_COLORS[dimIdx % DIMENSION_COLORS.length];
  const prefersReduced = useReducedMotion();

  async function handleAnswer(value: number) {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    await answerQ({
      question_id: question.id,
      dimension_id: question.dimension_id,
      answer_value: value,
    });
  }

  function goTo(next: number) {
    const nextQ = questions[next];
    if (nextQ && nextQ.dimension_id !== question?.dimension_id) {
      toast.info(`Moving to: ${nextQ.dimension_name}`, { duration: 2000 });
    }
    prevDimRef.current = question?.dimension_id ?? null;
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  }

  async function handleSubmit() {
    try {
      await submitSession();
      navigate(`/sessions/${sessionId}/report`);
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  }

  if (isLoading || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 border-4 border-elk-red border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 dark:text-white/40 text-sm">Loading assessment…</p>
      </div>
    );
  }

  if (!slug) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400 dark:text-white/40 text-sm">Session not found. Please start a new assessment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* ── Sticky top band ── */}
      <div className="grain rounded-2xl bg-elk-ink px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <BookOpen size={15} className="text-white/70" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-bold truncate" style={{ fontFamily: "var(--font-display)" }}>
              {assessment.name}
            </p>
            <p className="text-white/40 text-xs truncate">{question?.dimension_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-white/50 text-xs">
            <span className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>{current + 1}</span>
            /{questions.length}
          </span>
          <span className="text-xs font-semibold text-elk-red bg-red-950/60 px-2.5 py-1 rounded-full border border-elk-red/20">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* ── Progress dots / bar ── */}
      <div className="bg-white dark:bg-elk-slate rounded-2xl border border-gray-100 dark:border-gray-700/40 shadow-sm px-5 py-4">
        {useDots ? (
          <div className="flex items-center flex-wrap gap-y-2">
            {/* Dots are display-only (non-interactive). If tap-to-jump is ever added,
                each dot must grow to a 44px (w-11 h-11) touch target per WCAG 2.5.5. */}
            {questions.map((_, i) => (
              <div key={i} className="flex items-center">
                {dimensionBoundaries.has(i) && (
                  <div className="w-3 shrink-0" />
                )}
                <div
                  className={`flex items-center justify-center rounded-full text-xs font-bold transition-all select-none ${
                    i < current
                      ? "w-8 h-8 bg-elk-red text-white shadow-sm shadow-red-900/20"
                      : i === current
                      ? "w-9 h-9 ring-2 ring-elk-red ring-offset-1 bg-red-50 dark:bg-red-950/40 text-elk-red"
                      : "w-8 h-8 bg-gray-100 dark:bg-gray-700/60 text-gray-400 dark:text-white/40"
                  }`}
                  style={i === current ? { fontFamily: "var(--font-display)" } : undefined}
                >
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProgressBar value={progress} />
        )}
      </div>

      {/* ── Question card with slide animation ── */}
      <AnimatePresence mode="wait" initial={false}>
        {question && (
          <motion.div
            key={current}
            initial={{ opacity: 0, x: prefersReduced ? 0 : direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: prefersReduced ? 0 : direction * -30 }}
            transition={{ duration: prefersReduced ? 0 : 0.2, ease: "easeInOut" }}
            className="bg-white dark:bg-elk-slate rounded-2xl border border-gray-100 dark:border-gray-700/40 shadow-sm overflow-hidden"
          >
            <div className="p-7 space-y-6">
              <div className="flex items-start gap-3">
                <span
                  className="w-2 h-2 rounded-full shrink-0 mt-2.5"
                  style={{ background: dimColor.accent }}
                  aria-hidden="true"
                />
                <p className="text-2xl font-bold text-gray-900 dark:text-white/90 leading-snug">{question.text}</p>
              </div>

              <QuestionRenderer
                question={question}
                value={answers[question.id] ?? null}
                onChange={handleAnswer}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tier teaser on last question ── */}
      {isLast && user?.tier && user.tier !== "premium" && (
        <TierUpgradeTeaser tier={user.tier} context="quiz" />
      )}

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-500 dark:text-white/50 hover:text-gray-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed bg-white dark:bg-elk-slate border border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl transition-all"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {!isLast ? (
          <button
            onClick={() => goTo(current + 1)}
            disabled={answers[question?.id ?? ""] === undefined}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md shadow-red-900/20 hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: "var(--gradient-brand)" }}
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || answers[question?.id ?? ""] === undefined}
            className="flex items-center gap-2 px-7 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md shadow-red-900/20 hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: "var(--gradient-brand)" }}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Submit Assessment <Send size={15} />
              </>
            )}
          </button>
        )}
      </div>

      {/* ── Full-screen submit overlay ── */}
      {submitting && (
        <div className="fixed inset-0 bg-elk-ink/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="grain bg-elk-slate rounded-2xl p-10 text-center shadow-2xl max-w-xs w-full mx-4 border border-white/10">
            <div className="w-16 h-16 border-4 border-elk-red border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <p className="text-white font-bold text-lg mb-1" style={{ fontFamily: "var(--font-display)" }}>
              Scoring your assessment
            </p>
            <p className="text-white/50 text-sm">This takes just a moment…</p>
          </div>
        </div>
      )}
    </div>
  );
}
