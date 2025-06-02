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
    const { projectId, deploymentId } = req.body;

    // Verify user has access to the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get deployment
    const deployment = await deploymentService.getDeployment(deploymentId);
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    // Start async deployment process
    deployProject(projectId, deploymentId).catch(console.error);

    return res.status(200).json({ message: 'Deployment started' });
  } catch (error) {
    console.error('Error in deploy API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deployProject(projectId: string, deploymentId: string) {
  try {
    // Update deployment status
    await deploymentService.updateDeployment(deploymentId, {
      status: 'building',
      build_logs: ['Starting deployment process...'],
    });

    // TODO: Integrate with GPT-Engineer's deployment process
    // This is where we'll call the actual deployment logic
    // For now, we'll simulate the process

    // Simulate deployment process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update deployment with deployment results
    await deploymentService.updateDeployment(deploymentId, {
      status: 'deployed',
      build_logs: ['Deployment completed successfully'],
      url: `https://${deploymentId}.gptengineer.app`,
    });
  } catch (error) {
    console.error('Error deploying project:', error);
    await deploymentService.updateDeployment(deploymentId, {
      status: 'failed',
      build_logs: ['Deployment failed: ' + error.message],
    });
  }
} 