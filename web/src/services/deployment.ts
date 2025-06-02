import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export const deploymentService = {
  async createDeployment(projectId: string, environment: Record<string, string> = {}) {
    const { data, error } = await supabase
      .from('deployments')
      .insert([
        {
          project_id: projectId,
          status: 'pending',
          build_logs: [],
          environment,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDeployments(projectId: string) {
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getDeployment(id: string) {
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateDeploymentStatus(id: string, status: Deployment['status'], logs: string[] = []) {
    const { data, error } = await supabase
      .from('deployments')
      .update({ status, build_logs: logs })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDeploymentUrl(id: string, url: string) {
    const { data, error } = await supabase
      .from('deployments')
      .update({ url })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDeployment(id: string) {
    const { error } = await supabase
      .from('deployments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
}; 