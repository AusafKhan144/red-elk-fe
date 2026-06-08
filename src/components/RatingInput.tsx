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
    <div className="space-y-3">
      <div className="flex gap-2.5">
        {options.map((n) => {
          const isSelected = value === n;
          return (
            <button
              key={n}
              type="button"
              disabled={disabled}
              onClick={() => onChange(n)}
              className={`
                flex-1 flex flex-col items-center py-3.5 rounded-xl border-2 font-bold text-base transition-all
                focus:outline-none focus-visible:ring-2 focus-visible:ring-elk-rose focus-visible:ring-offset-2
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${
                  isSelected
                    ? "bg-elk-red border-elk-red text-white shadow-lg shadow-red-900/25 scale-105 -translate-y-0.5"
                    : "bg-white border-gray-200 text-gray-500 hover:border-elk-rose hover:text-elk-red hover:bg-red-50 hover:-translate-y-0.5"
                }
              `}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* Active description */}
      <div className="h-5 flex items-center justify-center">
        {value !== null && (
          <p className="text-xs font-semibold text-elk-red animate-in fade-in duration-200">
            {value} — {labels[value - 1]}
          </p>
        )}
      </div>

      <div className="flex justify-between px-0.5">
        <span className="text-xs text-gray-400">{labels[0]}</span>
        <span className="text-xs text-gray-400">{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}
