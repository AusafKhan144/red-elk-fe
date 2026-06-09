import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { toast } from "sonner";
import ProgressBar from "../../components/common/ProgressBar";
import { useAssessment } from "../../hooks/useAssessments";
import { useAnswerQuestion, useSubmitSession, useSessionAnswers } from "../../hooks/useSession";
import QuestionRenderer from "../../components/assessment/QuestionRenderer";

import type { Question } from "../../types/api";

interface FlatQuestion extends Question {
  dimension_id: string;
  dimension_name: string;
}

const DIMENSION_COLORS = [
  { bg: "bg-red-50 border-red-100",    text: "text-elk-red" },
  { bg: "bg-indigo-50 border-indigo-100", text: "text-indigo-600" },
  { bg: "bg-teal-50 border-teal-100",  text: "text-elk-teal" },
  { bg: "bg-violet-50 border-violet-100", text: "text-violet-600" },
  { bg: "bg-amber-50 border-amber-100", text: "text-amber-600" },
  { bg: "bg-sky-50 border-sky-100",    text: "text-sky-600" },
];

export default function Quiz() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [slug] = useState(() => sessionStorage.getItem(`session-${sessionId}-slug`) ?? "");
  const { data: assessment, isLoading } = useAssessment(slug);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const { mutateAsync: answerQ } = useAnswerQuestion(sessionId!);
  const { mutateAsync: submitSession, isPending: submitting } = useSubmitSession(sessionId!);
  const { data: savedAnswers } = useSessionAnswers(sessionId!);

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

  // Map dimension_id → stable index for color rotation
  const dimensionIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    assessment?.dimensions.forEach((dim, i) => map.set(dim.id, i));
    return map;
  }, [assessment]);

  const question = questions[current];
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;
  const isLast = current === questions.length - 1;
  const useDots = questions.length > 0 && questions.length <= 12;

  const dimIdx = question ? (dimensionIndexMap.get(question.dimension_id) ?? 0) : 0;
  const dimColor = DIMENSION_COLORS[dimIdx % DIMENSION_COLORS.length];

  async function handleAnswer(value: number) {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    await answerQ({
      question_id: question.id,
      dimension_id: question.dimension_id,
      answer_value: value,
    });
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
        <p className="text-gray-400 text-sm">Loading assessment…</p>
      </div>
    );
  }

  if (!slug) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-400 text-sm">Session not found. Please start a new assessment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between text-sm mb-3">
          <div>
            <span className="font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
              {current + 1}
            </span>
            <span className="text-gray-400 text-sm"> / {questions.length}</span>
          </div>
          <span className="text-xs font-semibold text-elk-red bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
            {Math.round(progress)}% complete
          </span>
        </div>

        {useDots ? (
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`flex items-center justify-center rounded-full text-xs font-bold transition-all select-none ${
                  i < current
                    ? "w-6 h-6 bg-elk-red text-white shadow-sm shadow-red-900/20"
                    : i === current
                    ? "w-7 h-7 ring-2 ring-elk-red ring-offset-1 bg-red-50 text-elk-red"
                    : "w-6 h-6 bg-gray-100 text-gray-400"
                }`}
                style={i === current ? { fontFamily: "var(--font-display)" } : undefined}
              >
                {i + 1}
              </div>
            ))}
          </div>
        ) : (
          <ProgressBar value={progress} />
        )}
      </div>

      {/* Question card */}
      {question && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-elk-red/60 to-elk-rose/60" />
          <div className="p-8 space-y-6">
            <div>
              <span
                className={`inline-block text-xs font-bold uppercase tracking-widest border rounded-full px-3 py-1 mb-5 ${dimColor.bg} ${dimColor.text}`}
              >
                {question.dimension_name}
              </span>
              <p className="text-xl font-bold text-gray-900 leading-snug">{question.text}</p>
            </div>

            <QuestionRenderer
              question={question}
              value={answers[question.id] ?? null}
              onChange={handleAnswer}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrent((n) => n - 1)}
          disabled={current === 0}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {!isLast ? (
          <button
            onClick={() => setCurrent((n) => n + 1)}
            disabled={!answers[question?.id ?? ""]}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md shadow-red-900/20 hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: "linear-gradient(135deg, #C0392B 0%, #5b1013 100%)" }}
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !answers[question?.id ?? ""]}
            className="flex items-center gap-2 px-7 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md shadow-red-900/20 hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: "linear-gradient(135deg, #C0392B 0%, #5b1013 100%)" }}
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

      {/* Full-screen submit overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-10 text-center shadow-2xl max-w-xs w-full mx-4">
            <div className="w-14 h-14 border-4 border-elk-red border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <p className="text-gray-900 font-bold text-lg mb-1">Scoring your assessment</p>
            <p className="text-gray-400 text-sm">This takes just a moment…</p>
          </div>
        </div>
      )}
    </div>
  );
}
