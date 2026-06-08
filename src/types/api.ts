export type SubscriptionTier = "free" | "basic" | "premium";
export type MaturityLevel = "nascent" | "developing" | "maturing" | "leading";

export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
  company?: string | null;
  tier: SubscriptionTier;
  created_at: string;
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
  options?: unknown;
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
}

export type TierResult = MaturityLevel;

export interface RadarPoint {
  dimension: string;
  score: number;
  label: string;
}

/** Frontend-derived type: combines radar_data entry with its recommendation */
export interface DimensionResult {
  name: string;
  score: number;
  description: string;
}

export interface Report {
  id: string;
  session_id: string;
  scores: Record<string, number>;
  overall_score: number;
  tier_result: TierResult;
  recommendations: Record<string, string>;
  radar_data: RadarPoint[];
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
