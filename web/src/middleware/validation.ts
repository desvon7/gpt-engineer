import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

// Project schemas
export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  files: z.record(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

// Deployment schemas
export const createDeploymentSchema = z.object({
  project_id: z.string().uuid(),
  environment: z.record(z.string()).optional(),
});

export const buildProjectSchema = z.object({
  projectId: z.string().uuid(),
  deploymentId: z.string().uuid(),
  environment: z.record(z.string()).optional(),
});

export const deployProjectSchema = z.object({
  projectId: z.string().uuid(),
  deploymentId: z.string().uuid(),
});

// Environment variable schemas
export const environmentVariableSchema = z.object({
  key: z.string().min(1).max(255),
  value: z.string(),
});

// Validation middleware
export function validateRequest(schema: z.ZodSchema) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      if (req.method === 'GET') {
        // Validate query parameters
        req.query = schema.parse(req.query);
      } else {
        // Validate request body
        req.body = schema.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Error handling middleware
export function errorHandler(
  error: Error,
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  console.error('API Error:', error);

  if (error instanceof z.ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.errors,
    });
  }

  // Handle specific error types
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (error.name === 'ForbiddenError') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (error.name === 'NotFoundError') {
    return res.status(404).json({ error: 'Not found' });
  }

  // Default error response
  return res.status(500).json({ error: 'Internal server error' });
}

// Authentication middleware
export function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // TODO: Verify token with Supabase
  // For now, we'll just pass through
  next();
} 