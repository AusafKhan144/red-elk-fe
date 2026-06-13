export type SubscriptionTier = "free" | "basic" | "premium";
export type MaturityLevel = "nascent" | "developing" | "maturing" | "leading";

export interface RadarPoint {
  dimension: string;
  score: number;
  label: string;
}

export interface MaturitySummary {
  overall_score: number;
  tier_result: MaturityLevel;
  radar_data: RadarPoint[];
  as_of_session_id: string;
  as_of_date: string;
}

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  company?: string | null;
  tier: SubscriptionTier;
  created_at: string;
  maturity_summary?: MaturitySummary | null;
}

export interface UpdateProfilePayload {
  company?: string | null;
}

export interface Assessment {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  version: number;
}

export interface Question {
  id: string;
  text: string;
  tier: SubscriptionTier;
  type: "scale" | "boolean" | "multiple_choice" | "text";
  options: { choices?: string[] } | null;
  max_score: number;
}

export interface Dimension {
  id: string;
  name: string;
  weight: number;
  questions: Question[];
}

export interface AssessmentDetail extends Assessment {
  dimensions: Dimension[];
}

export interface Session {
  id: string;
  assessment_id: string;
  status: "in_progress" | "completed" | "abandoned";
  tier_at_time?: SubscriptionTier;
  started_at: string;
  completed_at?: string | null;
  /** Populated in GET /sessions list; null when returned from POST /sessions/start */
  assessment_name?: string | null;
  /** Populated in GET /sessions list; null when returned from POST /sessions/start */
  assessment_slug?: string | null;
  /** Completed sessions only */
  score?: number | null;
  /** AI maturity result from the linked report — not the subscription tier */
  tier_result?: MaturityLevel | null;
  /** Per-dimension scores for completed sessions */
  dimension_scores?: RadarPoint[] | null;
  /** Percentage of questions answered (0–100), in-progress sessions only */
  progress_pct?: number | null;
}

export interface AnswerOut {
  question_id: string;
  dimension_id: string;
  answer_value: number;
}

export interface Report {
  id: string;
  session_id: string;
  scores: Record<string, number>;
  overall_score: number;
  tier_result: MaturityLevel;
  recommendations: Record<string, string>;
  radar_data: RadarPoint[];
  /** Radar data from the user's previous completed session; null on first attempt */
  previous_radar_data?: RadarPoint[] | null;
  pdf_url: string | null;
  generated_at: string;
}

export interface DimensionAnalytics {
  dimension_id: string;
  dimension_name: string;
  avg_score: number;
}

export interface AdminAnalytics {
  total_sessions: number;
  completed_sessions: number;
  sessions_by_tier: Record<SubscriptionTier, number>;
  avg_overall_score: number | null;
  dimensions: DimensionAnalytics[];
}

export interface AdminSession {
  id: string;
  user_id: string;
  assessment_id: string;
  status: "in_progress" | "completed" | "abandoned";
  tier_at_time?: SubscriptionTier;
  started_at: string;
  completed_at?: string | null;
}

/** Admin users list returns the same UserProfile shape as GET /auth/me */
export type AdminUser = User;
