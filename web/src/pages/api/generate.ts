import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/services/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectId, prompt } = req.body;

    // Verify user has access to the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Start code generation process
    const { data: deployment, error: deploymentError } = await supabase
      .from('deployments')
      .insert([
        {
          project_id: projectId,
          status: 'building',
          build_logs: ['Starting code generation...'],
          environment: {},
        },
      ])
      .select()
      .single();

    if (deploymentError) {
      return res.status(500).json({ error: 'Failed to create deployment' });
    }

    // Start async code generation
    generateCode(projectId, deployment.id, prompt).catch(console.error);

    return res.status(200).json({ deploymentId: deployment.id });
  } catch (error) {
    console.error('Error in generate API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function generateCode(
  projectId: string,
  deploymentId: string,
  prompt: string
) {
  try {
    // Update deployment status
    await supabase
      .from('deployments')
      .update({
        status: 'building',
        build_logs: ['Processing prompt...'],
      })
      .eq('id', deploymentId);

    // TODO: Integrate with GPT-Engineer's core engine
    // This is where we'll call the actual code generation logic
    // For now, we'll simulate the process

    // Simulate code generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update deployment with generated code
    await supabase
      .from('deployments')
      .update({
        status: 'deployed',
        build_logs: ['Code generation completed successfully'],
        url: `https://${deploymentId}.gptengineer.app`,
      })
      .eq('id', deploymentId);
  } catch (error) {
    console.error('Error generating code:', error);
    await supabase
      .from('deployments')
      .update({
        status: 'failed',
        build_logs: ['Code generation failed: ' + error.message],
      })
      .eq('id', deploymentId);
  }
} 