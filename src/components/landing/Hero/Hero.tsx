import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

const badges = ["500+ Assessments Completed", "Enterprise Ready", "AI-Powered Scoring"];

const dimensionData = [
  { label: "Strategy", score: 82, color: "#C0392B" },
  { label: "Data", score: 74, color: "#da8f93" },
  { label: "Technology", score: 79, color: "#C0392B" },
  { label: "Talent", score: 71, color: "#da8f93" },
  { label: "Governance", score: 68, color: "#C0392B" },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-elk-maroon min-h-[90vh] flex items-center">
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(192,57,43,0.25) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-60 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(218,143,147,0.12) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* ── Left copy ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-4 py-1.5 mb-7">
            <Sparkles size={13} className="text-elk-rose" />
            <span className="text-elk-rose text-xs font-semibold tracking-wide">
              AI Maturity Assessment Platform
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
            AI Maturity,{" "}
            <span
              className="text-elk-rose"
              style={{ textShadow: "0 0 40px rgba(218,143,147,0.35)" }}
            >
              Measured.
            </span>
          </h1>

          <p className="text-lg text-white/65 leading-relaxed mb-9 max-w-lg">
            Benchmark your organisation&apos;s AI capabilities across every dimension.
            Get a scored report, radar chart, and a PDF roadmap in minutes.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            {badges.map((b) => (
              <div key={b} className="flex items-center gap-1.5 text-white/55 text-sm">
                <CheckCircle size={14} className="text-elk-rose shrink-0" />
                {b}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/login?mode=register")}
              className="flex items-center gap-2 px-7 py-3.5 bg-elk-red hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/40 hover:shadow-xl hover:shadow-red-900/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started Free <ArrowRight size={17} />
            </button>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-7 py-3.5 bg-white/8 hover:bg-white/14 border border-white/20 hover:border-white/35 text-white/90 font-semibold rounded-xl transition-all"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        {/* ── Score card mockup ── */}
        <motion.div
          initial={{ opacity: 0, x: 48, y: 16 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <div className="glass-card max-w-sm ml-auto relative">
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/50 text-xs font-medium mb-0.5">AI Maturity Score</p>
                <p className="text-white/30 text-xs">Enterprise Assessment · 2026</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/15 text-green-300 border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Leading
              </span>
            </div>

            {/* Score */}
            <div className="flex items-end gap-3 mb-6">
              <span className="text-6xl font-extrabold text-white leading-none">78</span>
              <div className="mb-2">
                <div className="w-32 bg-white/10 rounded-full h-2.5 mb-1">
                  <div className="h-2.5 rounded-full bg-elk-rose" style={{ width: "78%" }} />
                </div>
                <p className="text-white/35 text-xs">out of 100</p>
              </div>
            </div>

            {/* Dimension bars */}
            <div className="space-y-2.5">
              {dimensionData.map(({ label, score }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-white/50 text-xs w-20 shrink-0">{label}</span>
                  <div className="flex-1 bg-white/8 rounded-full h-1.5">
                    <motion.div
                      className="h-1.5 rounded-full bg-elk-red"
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-white/40 text-xs w-5 text-right">{score}</span>
                </div>
              ))}
            </div>

            {/* Glow under card */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-8 blur-2xl rounded-full opacity-40"
              style={{ background: "#C0392B" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
