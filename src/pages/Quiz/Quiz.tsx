import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { toast } from "sonner";
import ProgressBar from "../../components/common/ProgressBar";
import { useAssessment } from "../../hooks/useAssessments";
import { useAnswerQuestion, useSubmitSession } from "../../hooks/useSession";
import QuestionRenderer from "../../components/assessment/QuestionRenderer";

import type { Question } from "../../types/api";

interface FlatQuestion extends Question {
  dimension_id: string;
  dimension_name: string;
}

export default function Quiz() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [slug] = useState(() => sessionStorage.getItem(`session-${sessionId}-slug`) ?? "");
  const { data: assessment, isLoading } = useAssessment(slug);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const { mutateAsync: answerQ } = useAnswerQuestion(sessionId!);
  const { mutateAsync: submitSession, isPending: submitting } = useSubmitSession(sessionId!);

  // Flatten questions from all dimensions, carrying dimension_id
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

  const question = questions[current];
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;
  const isLast = current === questions.length - 1;

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
            <span className="font-bold text-gray-900">Question {current + 1}</span>
            <span className="text-gray-400"> of {questions.length}</span>
          </div>
          <span className="text-xs font-semibold text-elk-red bg-red-50 px-2.5 py-1 rounded-full">
            {Math.round(progress)}% done
          </span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {/* Question card */}
      {question && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-elk-red/60 to-elk-rose/60" />
          <div className="p-8 space-y-6">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-elk-red bg-red-50 border border-red-100 rounded-full px-3 py-1 mb-5">
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
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-elk-red hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md shadow-red-900/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !answers[question?.id ?? ""]}
            className="flex items-center gap-2 px-7 py-2.5 text-sm font-bold bg-elk-red hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md shadow-red-900/20 hover:-translate-y-0.5 active:translate-y-0"
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
