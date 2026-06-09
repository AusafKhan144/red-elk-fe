import { Lock, Zap, Star } from "lucide-react";
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

  if (isBasic) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800/50 px-4 py-3.5">
        <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
          <Star size={14} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-0.5 flex items-center gap-1.5">
            Basic Plan
            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-700/50">
              <Zap size={10} /> Upgrade available
            </span>
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">{messages[context]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/50 px-4 py-3.5">
      <div className="mt-0.5 shrink-0 w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
        <Lock size={14} className="text-amber-600 dark:text-amber-400" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-0.5 flex items-center gap-1.5">
          Free Plan
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-700/50">
            <Zap size={10} /> Questions locked
          </span>
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">{messages[context]}</p>
      </div>
    </div>
  );
}
