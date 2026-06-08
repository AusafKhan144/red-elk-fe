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
} from "recharts";
import { useAdminAnalytics } from "../../../hooks/useAdmin";

export default function AdminAnalytics() {
  const { data, isLoading } = useAdminAnalytics();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-elk-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { icon: <ClipboardList size={20} className="text-elk-red" />, label: "Total Sessions", value: data.total_sessions },
    { icon: <CheckCircle size={20} className="text-elk-red" />, label: "Completed Sessions", value: data.completed_sessions },
    { icon: <BarChart2 size={20} className="text-elk-red" />, label: "Avg Overall Score", value: data.avg_overall_score != null ? Math.round(data.avg_overall_score) : "—" },
    { icon: <TrendingUp size={20} className="text-elk-red" />, label: "Free Tier Sessions", value: data.sessions_by_tier.free ?? 0 },
  ];

  return (
    <PageWrapper>
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Platform Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of all activity across the platform.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon, label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">{icon}</div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-xl font-extrabold text-gray-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-6">Average Score by Dimension</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.dimensions} margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="dimension_name" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="avg_score" fill="#C0392B" radius={[4, 4, 0, 0]} name="Avg Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </PageWrapper>
  );
}
