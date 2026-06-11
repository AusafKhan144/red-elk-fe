import type { SubscriptionTier } from "../types/api";

interface Props {
  tier: SubscriptionTier;
  context?: "quiz" | "report" | "dashboard";
}

export default function TierUpgradeTeaser({ tier, context = "dashboard" }: Props) {
  if (tier === "premium") return null;

  const isBasic = tier === "basic";

  const messages = {
    quiz: isBasic
      ? "You're on the Basic plan. Premium users receive a more comprehensive question set covering advanced AI maturity indicators."
      : "You're on the Free plan. Basic and Premium users unlock intermediate and advanced questions for a deeper evaluation.",
    report: isBasic
      ? "Your score reflects the Basic question set. Upgrade to Premium for a complete evaluation with advanced indicators in every dimension."
      : "Your score reflects the Free question set. Upgrade to Basic or Premium to unlock a fuller picture of your AI maturity.",
    dashboard: isBasic
      ? "Upgrade to Premium to unlock the full question suite and get a comprehensive AI maturity evaluation."
      : "You're on the Free plan. Upgrade to Basic or Premium to unlock deeper assessments with advanced questions in every dimension.",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700/40 bg-gray-50 dark:bg-white/[0.02] px-4 py-3">
      <span
        className={`shrink-0 w-2 h-2 rounded-full ${isBasic ? "bg-blue-500" : "bg-gray-400 dark:bg-white/40"}`}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500 dark:text-white/60 mb-0.5">
          {isBasic ? "Basic Plan" : "Free Plan"}
          <span className="font-normal text-gray-400 dark:text-white/45"> · Upgrade available</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">{messages[context]}</p>
      </div>
    </div>
  );
}
