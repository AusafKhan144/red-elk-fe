interface Props {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  max?: number;
}

const SCALE_LABELS: Record<number, string[]> = {
  2: ["No", "Yes"],
  3: ["Low", "Medium", "High"],
  5: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  10: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
};

function getLabels(max: number): string[] {
  if (SCALE_LABELS[max]) return SCALE_LABELS[max];
  return Array.from({ length: max }, (_, i) => String(i + 1));
}

export default function RatingInput({ value, onChange, disabled = false, max = 5 }: Props) {
  const labels = getLabels(max);
  const options = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <div className={`flex gap-2 ${max > 5 ? "flex-wrap" : ""}`}>
        {options.map((n) => {
          const isSelected = value === n;
          return (
            <button
              key={n}
              type="button"
              disabled={disabled}
              onClick={() => onChange(n)}
              aria-pressed={isSelected}
              aria-label={`${n} — ${labels[n - 1]}`}
              className={`
                flex-1 min-w-[44px] flex flex-col items-center justify-center py-5 rounded-2xl border-2 font-extrabold text-xl transition-all
                focus:outline-none focus-visible:ring-2 focus-visible:ring-elk-rose focus-visible:ring-offset-2
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1 active:translate-y-0"}
                ${
                  isSelected
                    ? "bg-elk-red border-elk-red text-white shadow-xl shadow-red-900/30 scale-[1.06] -translate-y-1"
                    : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-white/40 hover:border-elk-rose dark:hover:border-elk-red/50 hover:text-elk-red dark:hover:text-elk-red hover:bg-red-50 dark:hover:bg-red-950/20"
                }
              `}
              style={{ fontFamily: "var(--font-display)" }}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* Active description */}
      <div className="min-h-6 flex items-center justify-center">
        {value !== null && (
          <div className="flex items-center gap-2 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-white bg-elk-red px-2.5 py-0.5 rounded-full" style={{ fontFamily: "var(--font-display)" }}>
              {value}
            </span>
            <span className="text-sm font-semibold text-gray-700 dark:text-white/70">{labels[value - 1]}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between px-0.5">
        <span className="text-xs text-gray-500 dark:text-white/50">{labels[0]}</span>
        <span className="text-xs text-gray-500 dark:text-white/50">{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}
