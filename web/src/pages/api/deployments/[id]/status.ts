import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { deploymentService } from '@/services/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id: deploymentId } = req.query;

    // Get deployment
    const deployment = await deploymentService.getDeployment(deploymentId as string);
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    // Verify user has access to the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', deployment.project_id)
      .single();

    if (projectError || !project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json(deployment);
  } catch (error) {
    console.error('Error in deployment status API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 