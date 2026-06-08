import {
  RadarChart as RechartsRadar,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RadarPoint } from "../types/api";

export default function RadarChart({ data }: { data: RadarPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <RechartsRadar data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "#374151", fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#C0392B"
          fill="#C0392B"
          fillOpacity={0.18}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
