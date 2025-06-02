import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { projectService, Project } from '@/services/database';
import ProjectEditor from '@/components/editor/ProjectEditor';
import ChatInterface from '@/components/chat/ChatInterface';

const ProjectPage: React.FC = () => {
  const router = useRouter();
  const { id: projectId } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'editor' | 'chat'>('editor');

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const data = await projectService.getProject(projectId as string);
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'editor'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'chat'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'editor' ? (
          <ProjectEditor projectId={projectId as string} />
        ) : (
          <div className="h-full p-6">
            <ChatInterface projectId={projectId as string} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage; 