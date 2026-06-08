interface Props {
  value: number;
  max?: number;
  className?: string;
}

export default function ProgressBar({ value, max = 100, className = "" }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full bg-gray-100 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="h-2 rounded-full bg-elk-red transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
