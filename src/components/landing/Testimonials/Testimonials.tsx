import { motion, useReducedMotion } from "framer-motion";
import { ClipboardCheck, Cpu, FileBarChart2 } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: ClipboardCheck,
    title: "Take the Assessment",
    desc: "Answer questions across each AI dimension at your own pace. Each answer is saved instantly — no losing progress.",
    iconBg: "bg-elk-red",
    glow: "rgba(192,57,43,0.2)",
  },
  {
    n: "02",
    icon: Cpu,
    title: "Get Scored",
    desc: "Our backend scores your submission across dimensions and calculates your maturity tier automatically.",
    iconBg: "bg-indigo-600",
    glow: "rgba(99,102,241,0.2)",
  },
  {
    n: "03",
    icon: FileBarChart2,
    title: "Download Your Report",
    desc: "A full PDF report with radar chart, dimension breakdown, and recommended next steps — ready in seconds.",
    iconBg: "bg-elk-teal",
    glow: "rgba(13,148,136,0.2)",
  },
];

export default function HowItWorks() {
  const prefersReduced = useReducedMotion();
  return (
    <section className="py-28 bg-elk-canvas dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReduced ? 0 : 0.6 }}
          className="text-center mb-18"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-elk-red bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-5">
            Three steps to your{" "}
            <span className="text-elk-red">AI Maturity Report</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
            From sign-up to a full scored PDF — the whole process takes under 15 minutes.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px z-0"
            style={{ background: "linear-gradient(90deg, #C0392B 0%, #6366f1 50%, #0D9488 100%)", opacity: 0.3 }}
          />

          {steps.map(({ n, icon: Icon, title, desc, iconBg, glow }, i) => (
            <motion.div
              key={n}
              initial={prefersReduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: prefersReduced ? 0 : 0.5, delay: prefersReduced ? 0 : i * 0.15 }}
              className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center overflow-hidden"
            >
              <div className="relative flex justify-center mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg`}
                  style={{ boxShadow: `0 8px 24px ${glow}` }}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 text-gray-500 dark:text-gray-300 text-xs font-bold flex items-center justify-center">
                  {n.slice(-1)}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
