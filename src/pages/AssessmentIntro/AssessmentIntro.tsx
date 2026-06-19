import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAssessments } from "../../hooks/useAssessments";
import { useStartSession } from "../../hooks/useSession";
import PageWrapper from "../../components/common/PageWrapper";
import type { Assessment } from "../../types/api";

/**
 * Assessment catalog — the "Take assessment" screen.
 * Lists every published assessment; choosing one starts a fresh session and
 * drops the user straight into the quiz.
 */
export default function AssessmentCatalog() {
  const navigate = useNavigate();
  const { data: assessments, isLoading } = useAssessments();
  const { mutateAsync: startSession } = useStartSession();
  const [startingSlug, setStartingSlug] = useState<string | null>(null);

  async function handleStart(slug: string) {
    if (startingSlug) return;
    setStartingSlug(slug);
    try {
      const session = await startSession(slug);
      // Quiz resume pattern: the slug must be in sessionStorage before navigating.
      sessionStorage.setItem(`session-${session.id}-slug`, slug);
      navigate(`/sessions/${session.id}/quiz`);
    } catch {
      toast.error("Failed to start session. Please try again.");
      setStartingSlug(null);
    }
  }

  return (
    <PageWrapper>
      <div className="re-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Intro hero */}
        <div className="re-card" style={{ padding: 24 }}>
          <span className="re-eyebrow">Take an assessment</span>
          <h2
            style={{
              fontSize: 24, fontWeight: 800, margin: "8px 0 8px", lineHeight: 1.1,
              color: "var(--ink)", letterSpacing: "-.015em",
            }}
          >
            Choose a framework to begin
          </h2>
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted)", lineHeight: 1.55, maxWidth: 560 }}>
            Each assessment scores your organisation across its capability dimensions. Pick one to
            start — your answers save automatically and you can pause and resume any time.
          </p>
        </div>

        {/* Catalog */}
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 160, borderRadius: "var(--radius-lg)", background: "var(--surface-inset)" }} />
            ))}
          </div>
        ) : !assessments || assessments.length === 0 ? (
          <div
            style={{
              padding: "48px 24px", textAlign: "center",
              border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)",
            }}
          >
            <p style={{ fontSize: 13.5, color: "var(--faint)", margin: 0 }}>No assessments are available yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
            {assessments.map((a) => (
              <AssessmentCard
                key={a.id}
                assessment={a}
                starting={startingSlug === a.slug}
                disabled={!!startingSlug && startingSlug !== a.slug}
                onStart={() => handleStart(a.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

function AssessmentCard({
  assessment,
  starting,
  disabled,
  onStart,
}: {
  assessment: Assessment;
  starting: boolean;
  disabled: boolean;
  onStart: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onStart}
      disabled={disabled || starting}
      className="re-card re-card-hover"
      style={{
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        textAlign: "left",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        fontFamily: "var(--font-ui)",
        transition: "all .15s var(--ease)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <span
          style={{
            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--accent)", background: "var(--accent-soft)",
          }}
        >
          <FileText size={20} />
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
            color: "var(--faint)", background: "var(--surface-inset)",
            padding: "3px 8px", borderRadius: 999,
          }}
        >
          v{assessment.version}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 15.5, fontWeight: 700, color: "var(--ink)", marginBottom: 4, letterSpacing: "-.01em" }}>
          {assessment.name}
        </h3>
        {assessment.description && (
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>{assessment.description}</p>
        )}
      </div>

      <span
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
          marginTop: 2, padding: "9px 14px", borderRadius: "var(--radius)",
          background: starting ? "var(--surface-inset)" : "var(--accent)",
          color: starting ? "var(--muted)" : "var(--accent-ink)",
          fontWeight: 600, fontSize: 13,
        }}
      >
        {starting ? (
          <>
            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Starting…
          </>
        ) : (
          <>
            Start assessment <ArrowRight size={14} />
          </>
        )}
      </span>
    </button>
  );
}
