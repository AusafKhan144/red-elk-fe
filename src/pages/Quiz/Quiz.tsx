import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Shield, Pencil, AlertCircle, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { useAssessment } from "../../hooks/useAssessments";
import { useAnswerQuestion, useSubmitSession, useSessionAnswers } from "../../hooks/useSession";
import QuestionRenderer from "../../components/assessment/QuestionRenderer";
import type { Question } from "../../types/api";

interface FlatQuestion extends Question {
  dimension_id: string;
  dimension_name: string;
}

/** Human-readable summary of an answer for the final review list. */
function formatAnswer(q: Question, value: number | undefined): { text: string; answered: boolean } {
  if (value === undefined) return { text: "Not answered", answered: false };
  switch (q.type) {
    case "boolean":
      return { text: value === 1 ? "Yes" : "No", answered: true };
    case "multiple_choice": {
      const choices = (q.options as { choices?: string[] } | null)?.choices ?? [];
      return { text: choices[value] ?? `Option ${value + 1}`, answered: true };
    }
    case "text":
      return value === 1 ? { text: "Response provided", answered: true } : { text: "No response", answered: false };
    case "scale":
    default:
      return { text: `${value} / ${q.max_score || 5}`, answered: true };
  }
}

export default function Quiz() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [slug] = useState(() => sessionStorage.getItem(`session-${sessionId}-slug`) ?? "");
  const { data: assessment, isLoading } = useAssessment(slug);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reviewing, setReviewing] = useState(false);
  const { mutateAsync: answerQ } = useAnswerQuestion(sessionId!);
  const { mutateAsync: submitSession, isPending: submitting } = useSubmitSession(sessionId!);
  const { data: savedAnswers } = useSessionAnswers(sessionId!);

  const prevDimRef = useRef<string | null>(null);
  const resumedRef = useRef(false);

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

  // On resume: once questions + saved answers are both loaded, jump to the first
  // unanswered question and surface a short "answers restored" notice. Runs once.
  useEffect(() => {
    if (resumedRef.current) return;
    if (questions.length === 0 || !savedAnswers || savedAnswers.length === 0) return;
    resumedRef.current = true;

    const answeredIds = new Set(savedAnswers.map((a) => a.question_id));
    const firstUnanswered = questions.findIndex((q) => !answeredIds.has(q.id));
    setCurrent(firstUnanswered === -1 ? questions.length - 1 : firstUnanswered);

    const n = savedAnswers.length;
    toast.info(`Welcome back. ${n} previous answer${n === 1 ? "" : "s"} restored.`, { duration: 3000 });
  }, [questions, savedAnswers]);

  const question = questions[current];
  // Progress reflects how many questions are actually answered, not which one is on screen.
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const unansweredCount = questions.length - answeredCount;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
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
  const allComplete = unansweredCount === 0;
  const indexById = new Map(questions.map((q, i) => [q.id, i] as const));

  return (
    <div
      className="re-fade-in"
      style={{ display: "grid", gridTemplateColumns: "232px 1fr", gap: 24, alignItems: "start", maxWidth: 1000, margin: "0 auto" }}
    >
      {/* ── Left rail ── */}
      <div className="re-card" style={{ padding: 18, position: "sticky", top: 88 }}>
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

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Once everything is answered, jump straight to review from any question. */}
          {allComplete && (
            <button
              onClick={() => setReviewing(true)}
              style={{
                width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "9px 0", borderRadius: "var(--radius)",
                background: "var(--accent)", color: "var(--accent-ink)",
                border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer",
                transition: "background .15s var(--ease)",
              }}
            >
              <CheckCircle2 size={15} /> Review &amp; finish
            </button>
          )}
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              width: "100%", padding: "9px 0",
              border: "1px solid var(--border)", borderRadius: "var(--radius)",
              background: "var(--surface-inset)", color: "var(--ink)",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              transition: "background .15s var(--ease)",
            }}
          >
            Save &amp; exit
          </button>
        </div>
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
                      <Shield size={12} />
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
              onClick={() => setReviewing(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "9px 18px", borderRadius: "var(--radius)",
                background: "var(--accent)", color: "var(--accent-ink)",
                fontWeight: 600, fontSize: 13.5,
                cursor: "pointer",
                border: "none",
                transition: "all .15s var(--ease)",
              }}
            >
              Review &amp; finish <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* final review overlay */}
      <AnimatePresence>
        {reviewing && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setReviewing(false)}
            style={{
              position: "fixed", inset: 0, background: "rgba(28,26,22,.55)",
              backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 40,
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Review your answers"
              onClick={(e) => e.stopPropagation()}
              initial={prefersReduced ? false : { opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="re-card"
              style={{
                width: "100%", maxWidth: 660, maxHeight: "86vh",
                display: "flex", flexDirection: "column", padding: 0, overflow: "hidden",
                boxShadow: "var(--card-shadow-hover)",
              }}
            >
              {/* header */}
              <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ minWidth: 0 }}>
                    <h2 style={{ fontSize: 19, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.01em", margin: 0 }}>
                      Review your answers
                    </h2>
                    <p style={{ margin: "5px 0 0", fontSize: 13, color: "var(--muted)", lineHeight: 1.5, maxWidth: 440 }}>
                      {allComplete
                        ? "Everything's answered. Make any edits below, then compile your results."
                        : "Finish the highlighted questions before compiling your results."}
                    </p>
                  </div>
                  <button
                    onClick={() => setReviewing(false)}
                    aria-label="Back to questions"
                    style={{ background: "transparent", border: "none", color: "var(--faint)", cursor: "pointer", padding: 4, display: "flex", flexShrink: 0 }}
                  >
                    <X size={18} />
                  </button>
                </div>
                {/* completion bar */}
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--surface-inset)", overflow: "hidden", boxShadow: "var(--inner-line)" }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: allComplete ? "var(--t-leading)" : "var(--accent)", transition: "width .4s var(--ease)" }} />
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {answeredCount}/{questions.length}
                  </span>
                </div>
              </div>

              {/* grouped answer list */}
              <div style={{ overflowY: "auto", padding: "18px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
                {assessment.dimensions.map((dim) => {
                  const dimQs = dim.questions;
                  const dimAnswered = dimQs.filter((q) => answers[q.id] !== undefined).length;
                  const dimDone = dimAnswered === dimQs.length;
                  return (
                    <div key={dim.id}>
                      {/* dimension header */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{dim.name}</span>
                        <span
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            fontSize: 11, fontWeight: 600, fontFamily: "var(--font-mono)",
                            padding: "1px 7px", borderRadius: 999,
                            color: dimDone ? "var(--t-leading)" : "var(--muted)",
                            background: dimDone ? "color-mix(in srgb, var(--t-leading) 12%, var(--surface))" : "var(--surface-inset)",
                          }}
                        >
                          {dimDone && <CheckCircle2 size={12} />}
                          {dimAnswered}/{dimQs.length}
                        </span>
                      </div>

                      {/* questions in this dimension */}
                      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                        {dimQs.map((q, j) => {
                          const ans = formatAnswer(q, answers[q.id]);
                          const gi = indexById.get(q.id) ?? 0;
                          return (
                            <div
                              key={q.id}
                              style={{
                                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                                borderTop: j > 0 ? "1px solid var(--border)" : "none",
                                background: ans.answered ? "var(--surface)" : "color-mix(in srgb, var(--accent) 5%, var(--surface))",
                              }}
                            >
                              <span style={{ flexShrink: 0, display: "flex", color: ans.answered ? "var(--t-leading)" : "var(--accent)" }}>
                                {ans.answered ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.4 }}>{q.text}</div>
                                <div style={{ marginTop: 3, fontSize: 12, fontWeight: 600, color: ans.answered ? "var(--muted)" : "var(--accent)" }}>
                                  {ans.text}
                                </div>
                              </div>
                              <button
                                onClick={() => { setReviewing(false); goTo(gi); }}
                                aria-label={`Edit question ${gi + 1}`}
                                style={{
                                  flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 5,
                                  padding: "6px 10px", borderRadius: 8,
                                  border: "1px solid var(--border-strong)", background: "var(--surface)",
                                  color: "var(--ink)", fontSize: 12, fontWeight: 600, cursor: "pointer",
                                }}
                              >
                                <Pencil size={12} /> Edit
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* footer */}
              <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <button
                  onClick={() => setReviewing(false)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "9px 16px", borderRadius: "var(--radius)",
                    border: "1px solid var(--border-strong)", background: "var(--surface)",
                    color: "var(--ink)", fontWeight: 600, fontSize: 13, cursor: "pointer",
                  }}
                >
                  Back to questions
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {!allComplete && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: "var(--accent)" }}>
                      <AlertCircle size={14} /> {unansweredCount} unanswered
                    </span>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !allComplete}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "10px 18px", borderRadius: "var(--radius)",
                      background: "var(--accent)", color: "var(--accent-ink)",
                      fontWeight: 600, fontSize: 13.5, border: "none",
                      cursor: (submitting || !allComplete) ? "not-allowed" : "pointer",
                      opacity: (submitting || !allComplete) ? 0.5 : 1,
                      transition: "all .15s var(--ease)",
                    }}
                  >
                    {submitting ? (
                      <>
                        <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", animation: "spin 1s linear infinite", display: "inline-block" }} />
                        Compiling…
                      </>
                    ) : (
                      <>
                        Compile results <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
