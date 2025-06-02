import { createClient } from '@supabase/supabase-js';
import { projectService, deploymentService, environmentService } from '@/services/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

describe('Database Schema Tests', () => {
  let testUserId: string;
  let testProjectId: string;
  let testDeploymentId: string;

  beforeAll(async () => {
    // Create a test user
    const { data: user, error: userError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
    });

    if (userError) throw userError;
    testUserId = user.user?.id || '';
  });

  afterAll(async () => {
    // Clean up test data
    if (testDeploymentId) {
      await deploymentService.deleteDeployment(testDeploymentId);
    }
    if (testProjectId) {
      await projectService.deleteProject(testProjectId);
    }
    // Delete test user
    await supabase.auth.admin.deleteUser(testUserId);
  });

  describe('Projects', () => {
    it('should create a project', async () => {
      const project = await projectService.createProject({
        name: 'Test Project',
        description: 'Test Description',
        user_id: testUserId,
      });

      expect(project).toBeDefined();
      expect(project.name).toBe('Test Project');
      expect(project.description).toBe('Test Description');
      expect(project.user_id).toBe(testUserId);
      expect(project.status).toBe('draft');

      testProjectId = project.id;
    });

    it('should get a project', async () => {
      const project = await projectService.getProject(testProjectId);

      expect(project).toBeDefined();
      expect(project.id).toBe(testProjectId);
    });

    it('should update a project', async () => {
      const updatedProject = await projectService.updateProject(testProjectId, {
        name: 'Updated Project',
        status: 'published',
      });

      expect(updatedProject.name).toBe('Updated Project');
      expect(updatedProject.status).toBe('published');
    });

    it('should list projects', async () => {
      const projects = await projectService.listProjects(testUserId);

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0].user_id).toBe(testUserId);
    });
  });

  describe('Deployments', () => {
    it('should create a deployment', async () => {
      const deployment = await deploymentService.createDeployment({
        project_id: testProjectId,
        environment: { TEST_VAR: 'test_value' },
      });

      expect(deployment).toBeDefined();
      expect(deployment.project_id).toBe(testProjectId);
      expect(deployment.status).toBe('pending');
      expect(deployment.environment).toEqual({ TEST_VAR: 'test_value' });

      testDeploymentId = deployment.id;
    });

    it('should get a deployment', async () => {
      const deployment = await deploymentService.getDeployment(testDeploymentId);

      expect(deployment).toBeDefined();
      expect(deployment.id).toBe(testDeploymentId);
    });

    it('should update a deployment', async () => {
      const updatedDeployment = await deploymentService.updateDeployment(testDeploymentId, {
        status: 'building',
        build_logs: ['Test log'],
      });

      expect(updatedDeployment.status).toBe('building');
      expect(updatedDeployment.build_logs).toContain('Test log');
    });

    it('should list deployments', async () => {
      const deployments = await deploymentService.listDeployments(testProjectId);

      expect(Array.isArray(deployments)).toBe(true);
      expect(deployments.length).toBeGreaterThan(0);
      expect(deployments[0].project_id).toBe(testProjectId);
    });
  });

  describe('Environment Variables', () => {
    it('should set an environment variable', async () => {
      await environmentService.setEnvironmentVariable(testProjectId, {
        key: 'TEST_KEY',
        value: 'test_value',
      });

      const variables = await environmentService.getEnvironmentVariables(testProjectId);
      expect(variables).toContainEqual({
        key: 'TEST_KEY',
        value: 'test_value',
      });
    });

    it('should get environment variables', async () => {
      const variables = await environmentService.getEnvironmentVariables(testProjectId);

      expect(Array.isArray(variables)).toBe(true);
      expect(variables.length).toBeGreaterThan(0);
    });

    it('should delete an environment variable', async () => {
      await environmentService.deleteEnvironmentVariable(testProjectId, 'TEST_KEY');

      const variables = await environmentService.getEnvironmentVariables(testProjectId);
      expect(variables).not.toContainEqual({
        key: 'TEST_KEY',
        value: 'test_value',
      });
    });
  });
}); 