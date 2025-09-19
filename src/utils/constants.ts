export const API_BASE_URL = '/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ASSESSMENTS: '/assessments',
  ASSESSMENT_DETAIL: '/assessments/:id',
} as const;

export const TIER_COLORS = {
  free: 'bg-gray-100 text-gray-800',
  basic: 'bg-blue-100 text-blue-800',
  premium: 'bg-purple-100 text-purple-800',
} as const;

export const QUESTION_TYPES = {
  scale: 'Rating Scale',
  boolean: 'Yes/No',
  multiple_choice: 'Multiple Choice',
  text: 'Text Response',
} as const;