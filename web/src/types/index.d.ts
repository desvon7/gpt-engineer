import { User } from '@supabase/supabase-js';

declare global {
  interface Window {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    };
  }
}

export interface AuthUser extends User {
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  files: Record<string, string>;
  status: 'draft' | 'published' | 'archived';
}

export interface Deployment {
  id: string;
  project_id: string;
  status: 'pending' | 'building' | 'deployed' | 'failed';
  url: string;
  created_at: string;
  updated_at: string;
  build_logs: string[];
  environment: Record<string, string>;
}

export interface EnvironmentVariable {
  key: string;
  value: string;
} 