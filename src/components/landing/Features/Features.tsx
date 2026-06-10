import { motion, useReducedMotion } from "framer-motion";
import { Target, BarChart3, TrendingUp, FileDown, CheckCircle } from "lucide-react";

export default function Features() {
  const prefersReduced = useReducedMotion();
  const fade = {
    initial: prefersReduced ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
  };
  return (
    <section id="features" className="py-28 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          {...fade}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-5 leading-tight">
            Everything you need to{" "}
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#C0392B" }}>
              succeed
            </span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-300 leading-relaxed">
            A full-stack AI maturity platform — from assessment to PDF report — built for
            enterprise teams who want real, actionable insight.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-5">
          {/* Hero feature — dark, large */}
          <motion.div
            {...fade}
            transition={{ duration: 0.6 }}
            className="grain relative overflow-hidden lg:col-span-4 lg:row-span-2 rounded-2xl bg-elk-maroon p-9 flex flex-col"
          >
            {/* concentric ring motif */}
            <div className="absolute -top-24 -right-24 pointer-events-none opacity-60" aria-hidden="true">
              {[440, 340, 240, 140].map((s) => (
                <div
                  key={s}
                  className="absolute rounded-full border border-white/8"
                  style={{ width: s, height: s, top: -s / 2, right: -s / 2 }}
                />
              ))}
            </div>

            <div className="relative w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mb-6">
              <Target size={22} className="text-elk-rose" />
            </div>
            <h3 className="relative text-2xl font-bold text-white mb-3 leading-snug max-w-sm">
              AI Readiness Assessment
            </h3>
            <p className="relative text-white/60 leading-relaxed max-w-md mb-8">
              A comprehensive evaluation of your organisation&apos;s AI maturity across every
              dimension — strategy, data, technology, talent, and governance — scored and
              benchmarked against industry tiers.
            </p>
            <div className="relative mt-auto flex flex-wrap gap-2">
              {["Strategy", "Data", "Technology", "Talent", "Governance"].map((d) => (
                <span
                  key={d}
                  className="text-xs font-medium text-white/70 bg-white/8 border border-white/12 rounded-full px-3 py-1"
                >
                  {d}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stacked tinted cells */}
          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-2 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-100/60 dark:border-sky-900/40 p-7"
          >
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center mb-4 shadow-sm">
              <BarChart3 size={20} className="text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">Radar Reports</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Visual radar charts and per-dimension breakdowns give you a clear picture of strengths and gaps.
            </p>
          </motion.div>

          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40 p-7"
          >
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center mb-4 shadow-sm">
              <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">Progress Tracking</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Monitor improvement over time with detailed analytics and milestone tracking across sessions.
            </p>
          </motion.div>

          {/* Horizontal split cells */}
          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lg:col-span-3 rounded-2xl border border-gray-100 dark:border-gray-800 p-7 flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center shrink-0">
              <FileDown size={20} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">Instant PDF Export</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Downloadable PDF reports generated automatically the moment an assessment is complete.
              </p>
            </div>
          </motion.div>

          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 rounded-2xl border border-gray-100 dark:border-gray-800 p-7 flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center shrink-0">
              <CheckCircle size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">Actionable Roadmap</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Personalised recommendations and next steps based on your exact scores in every dimension.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
