export interface Question {
  id: number;
  text: string;
  description?: string;
  question_type: 'scale' | 'boolean' | 'multiple_choice' | 'text';
  options: {
    min_value?: number;
    max_value?: number;
    labels?: string[];
    choices?: string[];
    scoring?: Record<string, number>;
  };
  required_tier: 'free' | 'basic' | 'premium';
  scoring_weight: number;
  order_index: number;
}

export interface Dimension {
  id: number;
  name: string;
  description?: string;
  weight: number;
  order_index: number;
  questions: Question[];
}

export interface Assessment {
  id: number;
  name: string;
  description?: string;
  category: string;
  is_active: boolean;
  created_at: string;
  dimensions: Dimension[];
}

export interface AssessmentSubmission {
  id: number;
  assessment_id: number;
  user_id: number;
  company_name?: string;
  responses: Record<string, any>;
  scores: {
    overall_score: number;
    dimension_scores: Record<string, {
      score: number;
      percentage: number;
      weight: number;
    }>;
    tier_used: string;
    calculated_at: string;
  };
  tier_used: 'free' | 'basic' | 'premium';
  is_completed: boolean;
  started_at: string;
  completed_at?: string;
}