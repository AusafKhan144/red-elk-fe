import { motion } from "framer-motion";
import { ClipboardCheck, Cpu, FileBarChart2 } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: ClipboardCheck,
    title: "Take the Assessment",
    desc: "Answer questions across each AI dimension at your own pace. Each answer is saved instantly — no losing progress.",
    color: "bg-elk-red",
    glow: "rgba(192,57,43,0.2)",
  },
  {
    n: "02",
    icon: Cpu,
    title: "Get Scored",
    desc: "Our backend scores your submission across dimensions and calculates your maturity tier automatically.",
    color: "bg-indigo-600",
    glow: "rgba(99,102,241,0.2)",
  },
  {
    n: "03",
    icon: FileBarChart2,
    title: "Download Your Report",
    desc: "A full PDF report with radar chart, dimension breakdown, and recommended next steps — ready in seconds.",
    color: "bg-green-600",
    glow: "rgba(22,163,74,0.2)",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-28 bg-elk-canvas">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-18"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-elk-red bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-5">
            Three steps to your{" "}
            <span className="text-elk-red">AI Maturity Report</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            From sign-up to a full scored PDF — the whole process takes under 15 minutes.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-elk-red/30 via-indigo-400/30 to-green-500/30 z-0" />

          {steps.map(({ n, icon: Icon, title, desc, color, glow }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative z-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
            >
              <div className="relative flex justify-center mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg`}
                  style={{ boxShadow: `0 8px 24px ${glow}` }}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-100 border-2 border-white text-gray-500 text-xs font-bold flex items-center justify-center">
                  {n.slice(-1)}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
