export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  job_title?: string;
  tier: 'free' | 'basic' | 'premium';
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company?: string;
  job_title?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}