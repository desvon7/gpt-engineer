import { Project, Deployment } from '@/types';

interface GenerateOptions {
  projectId: string;
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface BuildOptions {
  projectId: string;
  deploymentId: string;
  environment?: Record<string, string>;
}

export const engineService = {
  async generateCode(options: GenerateOptions): Promise<Deployment> {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId: options.projectId,
        prompt: options.prompt,
        model: options.model || 'gpt-4',
        temperature: options.temperature || 0.7,
        maxTokens: options.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate code');
    }

    return response.json();
  },

  async buildProject(options: BuildOptions): Promise<Deployment> {
    const response = await fetch('/api/build', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId: options.projectId,
        deploymentId: options.deploymentId,
        environment: options.environment || {},
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to build project');
    }

    return response.json();
  },

  async deployProject(projectId: string, deploymentId: string): Promise<Deployment> {
    const response = await fetch('/api/deploy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        deploymentId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to deploy project');
    }

    return response.json();
  },

  async getDeploymentStatus(deploymentId: string): Promise<Deployment> {
    const response = await fetch(`/api/deployments/${deploymentId}/status`);
    
    if (!response.ok) {
      throw new Error('Failed to get deployment status');
    }

    return response.json();
  },

  async getDeploymentLogs(deploymentId: string): Promise<string[]> {
    const response = await fetch(`/api/deployments/${deploymentId}/logs`);
    
    if (!response.ok) {
      throw new Error('Failed to get deployment logs');
    }

    return response.json();
  },
}; 