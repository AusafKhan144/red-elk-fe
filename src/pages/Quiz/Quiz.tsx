import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAssessment } from "../../hooks/useAssessments";
import { useAnswerQuestion, useSubmitSession, useSessionAnswers } from "../../hooks/useSession";
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
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const { mutateAsync: answerQ } = useAnswerQuestion(sessionId!);
  const { mutateAsync: submitSession, isPending: submitting } = useSubmitSession(sessionId!);
  const { data: savedAnswers } = useSessionAnswers(sessionId!);

  const prevDimRef = useRef<string | null>(null);

  useEffect(() => {
    if (savedAnswers) {
      const restored: Record<string, number> = {};
      savedAnswers.forEach((a) => { restored[a.question_id] = a.answer_value; });
      setAnswers(restored);
    }
  }, [savedAnswers]);

  const questions = useMemo<FlatQuestion[]>(() => {
    if (!assessment) return [];
    return assessment.dimensions.flatMap((dim) =>
      dim.questions.map((q) => ({ ...q, dimension_id: dim.id, dimension_name: dim.name }))
    );
  }, [assessment]);

  const question = questions[current];
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;
  const isLast = current === questions.length - 1;
  const prefersReduced = useReducedMotion();

  async function handleAnswer(value: number) {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    await answerQ({ question_id: question.id, dimension_id: question.dimension_id, answer_value: value });
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

  if (!slug) {
    return (
      <div style={{ textAlign: "center", padding: "96px 24px" }}>
        <p style={{ color: "var(--faint)", fontSize: 14 }}>Session not found. Please start a new assessment.</p>
      </div>
    );
  }

  if (isLoading || !assessment) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 24px", gap: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "4px solid var(--accent)", borderTopColor: "transparent",
          animation: "spin 1s linear infinite",
        }} />
        <p style={{ color: "var(--faint)", fontSize: 14 }}>Loading assessment…</p>
      </div>
    );
  }

  /* derive dimension checklist */
  const dimChecklist = assessment.dimensions.map((dim) => {
    const dimQs = questions.filter((q) => q.dimension_id === dim.id);
    const allAnswered = dimQs.every((q) => answers[q.id] !== undefined);
    const isActive = question?.dimension_id === dim.id;
    return { id: dim.id, label: dim.name, done: allAnswered && !isActive, active: isActive };
  });

  const pct = Math.round(progress);

  return (
    <div
      className="re-fade-in"
      style={{ display: "grid", gridTemplateColumns: "232px 1fr", gap: 24, alignItems: "start", maxWidth: 1000, margin: "0 auto" }}
    >
      {/* ── Left rail ── */}
      <div className="re-card" style={{ padding: 18, position: "sticky", top: 24 }}>
        <span className="re-eyebrow">Your progress</span>
        <div style={{ fontSize: 32, fontWeight: 700, margin: "8px 0 2px", color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{pct}%</div>
        <div style={{ fontSize: 12, color: "var(--faint)", marginBottom: 16 }}>Question {current + 1} of {questions.length}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {dimChecklist.map((d) => (
            <div
              key={d.id}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 9px", borderRadius: 9,
                background: d.active ? "var(--accent-soft)" : "transparent",
              }}
            >
              <span style={{
                width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: d.done ? "var(--t-leading)" : d.active ? "var(--accent)" : "var(--surface-inset)",
                color: (d.done || d.active) ? "#fff" : "var(--faint)",
                boxShadow: d.active ? "none" : "var(--inner-line)",
                fontSize: 10, fontWeight: 700,
              }}>
                {d.done ? "✓" : <span style={{ width: 5, height: 5, borderRadius: 999, background: "currentColor", display: "block" }} />}
              </span>
              <span style={{
                fontSize: 12.5,
                fontWeight: d.active ? 600 : 500,
                color: d.active ? "var(--accent)" : d.done ? "var(--ink)" : "var(--faint)",
              }}>
                {d.label}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            width: "100%", marginTop: 16, padding: "9px 0",
            border: "1px solid var(--border)", borderRadius: "var(--radius)",
            background: "var(--surface-inset)", color: "var(--ink)",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            transition: "background .15s var(--ease)",
          }}
        >
          Save & exit
        </button>
      </div>

      {/* ── Question panel ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="re-card" style={{ padding: 0, overflow: "hidden" }}>
          {/* progress bar */}
          <div style={{ height: 4, background: "var(--surface-inset)" }}>
            <div style={{
              width: pct + "%", height: "100%",
              background: "var(--accent)",
              transition: "width .5s var(--ease)",
            }} />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {question && (
              <motion.div
                key={current}
                initial={{ opacity: 0, x: prefersReduced ? 0 : direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: prefersReduced ? 0 : direction * -24 }}
                transition={{ duration: prefersReduced ? 0 : 0.18, ease: "easeInOut" }}
              >
                <div style={{ padding: 28 }}>
                  {/* dimension chip */}
                  <div style={{ marginBottom: 18 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "3px 10px 3px 8px", borderRadius: 999,
                      fontSize: 12, fontWeight: 600,
                      color: "var(--t-maturing)",
                      background: "color-mix(in srgb, var(--t-maturing) 10%, var(--surface))",
                      border: "1px solid color-mix(in srgb, var(--t-maturing) 22%, transparent)",
                    }}>
                      {question.dimension_name}
                    </span>
                  </div>

                  <h1 style={{ fontSize: 21, fontWeight: 600, lineHeight: 1.35, letterSpacing: "-.01em", color: "var(--ink)", maxWidth: 620 }}>
                    {question.text}
                  </h1>

                  <div style={{ marginTop: 24 }}>
                    <QuestionRenderer
                      question={question}
                      value={answers[question.id] ?? null}
                      onChange={handleAnswer}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 16px", borderRadius: "var(--radius)",
              border: "1px solid var(--border-strong)", background: "var(--surface)",
              color: "var(--ink)", fontWeight: 600, fontSize: 13.5,
              cursor: current === 0 ? "not-allowed" : "pointer",
              opacity: current === 0 ? 0.4 : 1,
              transition: "all .15s var(--ease)",
            }}
          >
            ← Previous
          </button>

          <span style={{ fontSize: 12.5, color: "var(--faint)" }}>
            {answers[question?.id ?? ""] === undefined ? "Select an answer to continue" : "Answer saved automatically"}
          </span>

          {!isLast ? (
            <button
              onClick={() => goTo(current + 1)}
              disabled={answers[question?.id ?? ""] === undefined}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 16px", borderRadius: "var(--radius)",
                background: "var(--accent)", color: "var(--accent-ink)",
                fontWeight: 600, fontSize: 13.5,
                cursor: answers[question?.id ?? ""] === undefined ? "not-allowed" : "pointer",
                opacity: answers[question?.id ?? ""] === undefined ? 0.5 : 1,
                border: "none",
                transition: "all .15s var(--ease)",
              }}
            >
              Next question →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || answers[question?.id ?? ""] === undefined}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 18px", borderRadius: "var(--radius)",
                background: "var(--accent)", color: "var(--accent-ink)",
                fontWeight: 600, fontSize: 13.5,
                cursor: (submitting || answers[question?.id ?? ""] === undefined) ? "not-allowed" : "pointer",
                opacity: (submitting || answers[question?.id ?? ""] === undefined) ? 0.5 : 1,
                border: "none",
                transition: "all .15s var(--ease)",
              }}
            >
              {submitting ? (
                <>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", animation: "spin 1s linear infinite", display: "inline-block" }} />
                  Submitting…
                </>
              ) : (
                "Finish & see results →"
              )}
            </button>
          )}
        </div>
      </div>

      {/* submit overlay */}
      {submitting && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(33,28,22,.7)",
          backdropFilter: "blur(4px)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 50,
        }}>
          <div className="re-card" style={{ padding: 40, textAlign: "center", maxWidth: 300 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              border: "4px solid var(--accent)", borderTopColor: "transparent",
              animation: "spin 1s linear infinite", margin: "0 auto 20px",
            }} />
            <p style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)", marginBottom: 6 }}>
              Scoring your assessment
            </p>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>This takes just a moment…</p>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
