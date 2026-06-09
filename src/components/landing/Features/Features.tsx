import { motion } from "framer-motion";
import { Target, TrendingUp, BarChart3, Users, Shield, Zap, CheckCircle, Globe } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "AI Readiness Assessment",
    desc: "Comprehensive evaluation of your organisation's AI maturity across multiple dimensions.",
    accent: "from-red-50 to-orange-50",
    iconBg: "bg-red-100",
    iconColor: "text-elk-red",
    wide: true,
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    desc: "Monitor your improvement with detailed analytics and milestone tracking over time.",
    accent: "from-indigo-50 to-purple-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    wide: false,
  },
  {
    icon: BarChart3,
    title: "Radar Reports",
    desc: "Visual radar charts and dimension breakdowns give you a clear picture of strengths.",
    accent: "from-sky-50 to-blue-50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    wide: false,
  },
  {
    icon: Users,
    title: "Role Management",
    desc: "Admin controls to manage users, assign tiers, and oversee your team's assessments.",
    accent: "from-violet-50 to-fuchsia-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    wide: true,
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    desc: "Supabase JWT auth, encrypted transport, enterprise-ready from day one.",
    accent: "from-green-50 to-emerald-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    wide: false,
  },
  {
    icon: Zap,
    title: "Instant PDF Export",
    desc: "Downloadable PDF reports generated automatically after each completed assessment.",
    accent: "from-yellow-50 to-amber-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    wide: false,
  },
  {
    icon: CheckCircle,
    title: "Actionable Roadmap",
    desc: "Personalised recommendations and next steps based on your exact scores.",
    accent: "from-teal-50 to-cyan-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    wide: false,
  },
  {
    icon: Globe,
    title: "Tiered Access",
    desc: "Nascent to Leading tiers unlock progressively deeper question sets and insights.",
    accent: "from-rose-50 to-pink-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    wide: false,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-18"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-elk-red bg-red-50 border border-red-100 px-3 py-1 rounded-full mb-4">
            Platform Features
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
            Everything You Need to{" "}
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#C0392B" }}>
              Succeed
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            A full-stack AI maturity platform — from assessment to PDF report — designed for
            enterprise teams who want real, actionable insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc, accent, iconBg, iconColor, wide }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`relative bg-gradient-to-br ${accent} border border-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
                wide ? "lg:col-span-2" : ""
              }`}
            >
              {/* Decorative ordinal number */}
              <span
                className="absolute -bottom-3 -right-1 select-none pointer-events-none font-bold leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "6rem",
                  opacity: 0.04,
                  color: "#111827",
                  lineHeight: 1,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
                <Icon size={21} className={iconColor} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
