import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Clock, BarChart2 } from "lucide-react";

const perks = [
  { icon: CheckCircle, text: "Free to start" },
  { icon: Clock, text: "5-minute setup" },
  { icon: BarChart2, text: "Instant scored report" },
];

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 overflow-hidden bg-elk-maroon">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(ellipse, #C0392B 0%, transparent 70%)" }}
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-elk-rose bg-white/8 border border-white/15 px-3 py-1 rounded-full mb-5">
            Get Started Today
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Start your AI assessment{" "}
            <span className="text-elk-rose" style={{ textShadow: "0 0 30px rgba(218,143,147,0.3)" }}>
              today
            </span>
          </h2>

          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join organisations using Red Elk to benchmark their AI capabilities,
            identify gaps, and build a credible roadmap forward.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/65 text-sm">
                <Icon size={15} className="text-elk-rose" />
                {text}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/login?mode=register")}
              className="flex items-center gap-2 px-8 py-4 bg-white text-elk-maroon font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started Free <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 border-2 border-white/25 hover:border-white/50 text-white font-semibold rounded-xl hover:bg-white/8 transition-all"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
