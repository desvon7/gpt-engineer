import { createClient } from '@supabase/supabase-js';
import { Project, Deployment, EnvironmentVariable } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const projectService = {
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getProject(id: string): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async listProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

export const deploymentService = {
  async createDeployment(deployment: Omit<Deployment, 'id' | 'created_at' | 'updated_at'>): Promise<Deployment> {
    const { data, error } = await supabase
      .from('deployments')
      .insert([deployment])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDeployment(id: string): Promise<Deployment> {
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateDeployment(id: string, updates: Partial<Deployment>): Promise<Deployment> {
    const { data, error } = await supabase
      .from('deployments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async listDeployments(projectId: string): Promise<Deployment[]> {
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

export const environmentService = {
  async setEnvironmentVariable(projectId: string, variable: EnvironmentVariable): Promise<void> {
    const { error } = await supabase
      .from('environment_variables')
      .upsert({
        project_id: projectId,
        key: variable.key,
        value: variable.value,
      });

    if (error) throw error;
  },

  async getEnvironmentVariables(projectId: string): Promise<EnvironmentVariable[]> {
    const { data, error } = await supabase
      .from('environment_variables')
      .select('key, value')
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  },

  async deleteEnvironmentVariable(projectId: string, key: string): Promise<void> {
    const { error } = await supabase
      .from('environment_variables')
      .delete()
      .eq('project_id', projectId)
      .eq('key', key);

    if (error) throw error;
  },
}; 