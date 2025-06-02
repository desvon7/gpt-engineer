import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { projectService, deploymentService } from '@/services/database';

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
    const { projectId, deploymentId, environment } = req.body;

    // Verify user has access to the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update deployment status
    await deploymentService.updateDeployment(deploymentId, {
      status: 'building',
      build_logs: ['Starting build process...'],
      environment,
    });

    // Start async build process
    buildProject(projectId, deploymentId, environment).catch(console.error);

    return res.status(200).json({ message: 'Build started' });
  } catch (error) {
    console.error('Error in build API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function buildProject(
  projectId: string,
  deploymentId: string,
  environment: Record<string, string>
) {
  try {
    // Update deployment status
    await deploymentService.updateDeployment(deploymentId, {
      status: 'building',
      build_logs: ['Processing project files...'],
    });

    // TODO: Integrate with GPT-Engineer's build process
    // This is where we'll call the actual build logic
    // For now, we'll simulate the process

    // Simulate build process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update deployment with build results
    await deploymentService.updateDeployment(deploymentId, {
      status: 'deployed',
      build_logs: ['Build completed successfully'],
      url: `https://${deploymentId}.gptengineer.app`,
    });
  } catch (error) {
    console.error('Error building project:', error);
    await deploymentService.updateDeployment(deploymentId, {
      status: 'failed',
      build_logs: ['Build failed: ' + error.message],
    });
  }
} 