import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { buildProject, deployProject, getDeploymentStatus, getDeploymentLogs } from '@/pages/api/projects/[id]/deploy';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

describe('API Endpoint Tests', () => {
  let testUserId: string;
  let testProjectId: string;
  let testDeploymentId: string;
  let testToken: string;

  beforeAll(async () => {
    // Create a test user and get session
    const { data: user, error: userError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
    });

    if (userError) throw userError;
    testUserId = user.user?.id || '';

    const { data: session, error: sessionError } = await supabase.auth.signIn({
      email: 'test@example.com',
      password: 'testpassword123',
    });

    if (sessionError) throw sessionError;
    testToken = session.session?.access_token || '';

    // Create a test project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: 'Test Project',
        description: 'Test Description',
        user_id: testUserId,
        status: 'draft',
        files: {},
      })
      .select()
      .single();

    if (projectError) throw projectError;
    testProjectId = project.id;
  });

  afterAll(async () => {
    // Clean up test data
    await supabase.from('projects').delete().eq('id', testProjectId);
    await supabase.auth.admin.deleteUser(testUserId);
  });

  describe('Build Project', () => {
    it('should build a project', async () => {
      const mockReq = {
        method: 'POST',
        query: { id: testProjectId },
        headers: { authorization: `Bearer ${testToken}` },
      } as NextApiRequest;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as NextApiResponse;

      await buildProject(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          status: 'building',
        })
      );
    });

    it('should return 401 for unauthorized request', async () => {
      const mockReq = {
        method: 'POST',
        query: { id: testProjectId },
      } as NextApiRequest;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as NextApiResponse;

      await buildProject(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('Deploy Project', () => {
    it('should deploy a project', async () => {
      const mockReq = {
        method: 'POST',
        query: { id: testProjectId },
        headers: { authorization: `Bearer ${testToken}` },
      } as NextApiRequest;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as NextApiResponse;

      await deployProject(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          status: 'deploying',
        })
      );
    });
  });

  describe('Get Deployment Status', () => {
    it('should get deployment status', async () => {
      const mockReq = {
        method: 'GET',
        query: { id: testProjectId },
        headers: { authorization: `Bearer ${testToken}` },
      } as NextApiRequest;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as NextApiResponse;

      await getDeploymentStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: expect.any(String),
        })
      );
    });
  });

  describe('Get Deployment Logs', () => {
    it('should get deployment logs', async () => {
      const mockReq = {
        method: 'GET',
        query: { id: testProjectId },
        headers: { authorization: `Bearer ${testToken}` },
      } as NextApiRequest;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as NextApiResponse;

      await getDeploymentLogs(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          logs: expect.any(Array),
        })
      );
    });
  });
}); 