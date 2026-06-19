import { useState } from "react";
import { Check, X } from "lucide-react";
import type { Question } from "../../types/api";
import RatingInput from "../RatingInput";

interface Props {
  question: Question;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const optionCard = (on: boolean, disabled?: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 14,
  width: "100%",
  textAlign: "left",
  padding: "14px 16px",
  borderRadius: "var(--radius)",
  border: `1.5px solid ${on ? "var(--accent)" : "var(--border)"}`,
  background: on ? "var(--accent-soft)" : "var(--surface)",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
  transition: "all .15s var(--ease)",
  fontFamily: "var(--font-ui)",
});

function BooleanInput({ value, onChange, disabled }: Omit<Props, "question">) {
  const options = [
    { label: "Yes", icon: Check, v: 1 },
    { label: "No", icon: X, v: 0 },
  ];

  return (
    <div style={{ display: "flex", gap: 12 }}>
      {options.map(({ label, icon: Icon, v }) => {
        const on = value === v;
        return (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onChange(v)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "18px 16px",
              borderRadius: "var(--radius)",
              border: `1.5px solid ${on ? "var(--accent)" : "var(--border)"}`,
              background: on ? "var(--accent-soft)" : "var(--surface)",
              color: on ? "var(--accent-press)" : "var(--muted)",
              fontWeight: 700,
              fontSize: 15,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
              transition: "all .15s var(--ease)",
              fontFamily: "var(--font-ui)",
            }}
          >
            <Icon size={18} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function MultipleChoiceInput({ question, value, onChange, disabled }: Props) {
  const choices: string[] = (question.options as { choices?: string[] } | null)?.choices ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {choices.map((choice, idx) => {
        const on = value === idx;
        return (
          <button key={idx} type="button" disabled={disabled} onClick={() => onChange(idx)} style={optionCard(on, disabled)}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-mono)",
                background: on ? "var(--accent)" : "var(--surface-inset)",
                color: on ? "#fff" : "var(--muted)",
                boxShadow: on ? "none" : "var(--inner-line)",
              }}
            >
              {String.fromCharCode(65 + idx)}
            </span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: on ? "var(--accent-press)" : "var(--ink)" }}>{choice}</span>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 999,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                border: `1.5px solid ${on ? "var(--accent)" : "var(--border-strong)"}`,
                background: on ? "var(--accent)" : "transparent",
              }}
            >
              {on && <Check size={12} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TextInput({ value, onChange, disabled }: Omit<Props, "question">) {
  const [text, setText] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setText(val);
    onChange(val.trim().length > 0 ? 1 : 0);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <textarea
        value={text}
        onChange={handleChange}
        disabled={disabled}
        rows={4}
        placeholder="Share your thoughts…"
        style={{
          width: "100%",
          padding: "12px 14px",
          fontSize: 14,
          color: "var(--ink)",
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius)",
          resize: "none",
          outline: "none",
          fontFamily: "var(--font-ui)",
          opacity: disabled ? 0.5 : 1,
        }}
      />
      <p style={{ margin: 0, fontSize: 12, color: "var(--faint)", textAlign: "right" }}>
        {value === 1 ? (
          <span style={{ color: "var(--t-leading)", fontWeight: 600 }}>✓ Response recorded</span>
        ) : (
          "Type your answer above"
        )}
      </p>
    </div>
  );
}

export default function QuestionRenderer({ question, value, onChange, disabled }: Props) {
  switch (question.type) {
    case "boolean":
      return <BooleanInput value={value} onChange={onChange} disabled={disabled} />;
    case "multiple_choice":
      return <MultipleChoiceInput question={question} value={value} onChange={onChange} disabled={disabled} />;
    case "text":
      return <TextInput value={value} onChange={onChange} disabled={disabled} />;
    case "scale":
    default:
      return <RatingInput value={value} onChange={onChange} disabled={disabled} max={question.max_score || 5} />;
  }
}
