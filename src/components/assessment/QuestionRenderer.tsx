import { useState } from "react";
import type { Question } from "../../types/api";
import RatingInput from "../RatingInput";

interface Props {
  question: Question;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function BooleanInput({ value, onChange, disabled }: Omit<Props, "question">) {
  return (
    <div className="flex gap-4">
      {[
        { label: "Yes", v: 1 },
        { label: "No", v: 0 },
      ].map(({ label, v }) => {
        const isSelected = value === v;
        return (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onChange(v)}
            className={`
              flex-1 py-4 rounded-xl border-2 font-bold text-base transition-all
              focus:outline-none focus-visible:ring-2 focus-visible:ring-elk-rose focus-visible:ring-offset-2
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${
                isSelected
                  ? "bg-elk-red border-elk-red text-white shadow-lg shadow-red-900/25 scale-105 -translate-y-0.5"
                  : "bg-white border-gray-200 text-gray-500 hover:border-elk-rose hover:text-elk-red hover:bg-red-50 hover:-translate-y-0.5"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function MultipleChoiceInput({ question, value, onChange, disabled }: Props) {
  const choices: string[] =
    (question.options as { choices?: string[] } | null)?.choices ?? [];

  return (
    <div className="space-y-2.5">
      {choices.map((choice, idx) => {
        const isSelected = value === idx;
        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onChange(idx)}
            className={`
              w-full flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 text-sm font-medium text-left transition-all
              focus:outline-none focus-visible:ring-2 focus-visible:ring-elk-rose focus-visible:ring-offset-2
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              ${
                isSelected
                  ? "bg-elk-red border-elk-red text-white shadow-md shadow-red-900/20"
                  : "bg-white border-gray-200 text-gray-700 hover:border-elk-rose hover:bg-red-50 hover:text-elk-red"
              }
            `}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center text-xs font-bold ${
                isSelected ? "border-white bg-white/20 text-white" : "border-gray-300"
              }`}
            >
              {String.fromCharCode(65 + idx)}
            </span>
            {choice}
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
    <div className="space-y-2">
      <textarea
        value={text}
        onChange={handleChange}
        disabled={disabled}
        rows={4}
        placeholder="Share your thoughts…"
        className={`
          w-full px-4 py-3 text-sm text-gray-800 border-2 border-gray-200 rounded-xl resize-none
          focus:outline-none focus:border-elk-rose focus:ring-2 focus:ring-elk-rose/20
          placeholder:text-gray-300 transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "bg-white"}
        `}
      />
      <p className="text-xs text-gray-400 text-right">
        {value === 1 ? (
          <span className="text-elk-red font-medium">Response recorded</span>
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
      return (
        <MultipleChoiceInput
          question={question}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );
    case "text":
      return <TextInput value={value} onChange={onChange} disabled={disabled} />;
    case "scale":
    default:
      return (
        <RatingInput
          value={value}
          onChange={onChange}
          disabled={disabled}
          max={question.max_score || 5}
        />
      );
  }
}
