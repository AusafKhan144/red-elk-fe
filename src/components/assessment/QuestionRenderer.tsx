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

function BooleanInput({ value, onChange, disabled }: Omit<Props, "question">) {
  const options = [
    { label: "Yes", icon: Check, v: 1, selected: "bg-elk-red border-elk-red text-white shadow-lg shadow-red-900/25" },
    { label: "No", icon: X, v: 0, selected: "bg-elk-slate border-elk-slate text-white shadow-lg shadow-slate-900/25 dark:bg-gray-700 dark:border-gray-600" },
  ];

  return (
    <div className="flex gap-4">
      {options.map(({ label, icon: Icon, v, selected }) => {
        const isSelected = value === v;
        return (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onChange(v)}
            className={`
              flex-1 flex items-center justify-center gap-2.5 py-5 rounded-2xl border-2 font-bold text-base transition-all
              focus:outline-none focus-visible:ring-2 focus-visible:ring-elk-rose focus-visible:ring-offset-2
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:-translate-y-0.5 active:translate-y-0"}
              ${isSelected
                ? `${selected} scale-[1.02]`
                : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-white/50 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              }
            `}
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
              w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-sm font-medium text-left transition-all
              focus:outline-none focus-visible:ring-2 focus-visible:ring-elk-rose focus-visible:ring-offset-2
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:-translate-y-0.5 active:translate-y-0"}
              ${isSelected
                ? "bg-elk-red border-elk-red text-white shadow-md shadow-red-900/20"
                : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white/70 hover:border-elk-rose hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-elk-red"
              }
            `}
          >
            <span
              className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center text-xs font-bold ${
                isSelected
                  ? "border-white/50 bg-white/20 text-white"
                  : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-white/30"
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
          w-full px-4 py-3 text-sm text-gray-800 dark:text-white/80 border-2 border-gray-200 dark:border-gray-700 rounded-xl resize-none
          bg-white dark:bg-gray-800/50
          focus:outline-none focus:border-elk-rose focus:ring-2 focus:ring-elk-rose/20
          placeholder:text-gray-300 dark:placeholder:text-white/20 transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      />
      <p className="text-xs text-gray-400 dark:text-white/30 text-right">
        {value === 1 ? (
          <span className="text-elk-teal dark:text-teal-400 font-medium">✓ Response recorded</span>
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
