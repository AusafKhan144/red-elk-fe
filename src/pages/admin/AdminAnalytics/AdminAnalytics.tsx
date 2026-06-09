import type { ReactNode } from "react";
import { ClipboardList, CheckCircle, BarChart2, TrendingUp } from "lucide-react";
import PageWrapper from "../../../components/common/PageWrapper";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAdminAnalytics } from "../../../hooks/useAdmin";

const BAR_COLORS = ["#C0392B", "#D4A72C", "#0D9488", "#7C3AED", "#6366f1", "#da8f93"];

export default function AdminAnalytics() {
  const { data, isLoading } = useAdminAnalytics();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-elk-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageWrapper>
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl font-extrabold text-gray-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Platform Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of all activity across the platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GradientStatCard
          icon={<ClipboardList size={20} className="text-white" />}
          label="Total Sessions"
          value={data.total_sessions}
          gradient="linear-gradient(135deg, #5b1013 0%, #C0392B 100%)"
        />
        <GradientStatCard
          icon={<CheckCircle size={20} className="text-white" />}
          label="Completed Sessions"
          value={data.completed_sessions}
          gradient="linear-gradient(135deg, #1A1D2E 0%, #0E0F1A 100%)"
        />
        <GradientStatCard
          icon={<BarChart2 size={20} className="text-white" />}
          label="Avg Overall Score"
          value={data.avg_overall_score != null ? Math.round(data.avg_overall_score) : "—"}
          gradient="linear-gradient(135deg, #065f46 0%, #0D9488 100%)"
        />
        <TierStatCard
          icon={<TrendingUp size={20} className="text-amber-500" />}
          label="Free Tier Sessions"
          value={data.sessions_by_tier.free ?? 0}
        />
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2
          className="text-base font-bold text-gray-900 mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Average Score by Dimension
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.dimensions} margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="dimension_name" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="avg_score" radius={[4, 4, 0, 0]} name="Avg Score">
              {data.dimensions.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </PageWrapper>
  );
}

function GradientStatCard({
  icon,
  label,
  value,
  gradient,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  gradient: string;
}) {
  return (
    <div className="rounded-2xl p-5 text-white" style={{ background: gradient }}>
      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-3">
        {icon}
      </div>
      <div
        className="text-2xl font-extrabold text-white leading-none mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <p className="text-xs text-white/60">{label}</p>
    </div>
  );
}

function TierStatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 border-l-4 border-l-elk-gold">
      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
        {icon}
      </div>
      <div
        className="text-2xl font-extrabold text-gray-900 leading-none mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
