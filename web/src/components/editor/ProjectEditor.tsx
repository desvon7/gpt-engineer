import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useRouter } from 'next/router';
import { projectService, Project } from '@/services/database';
import { deploymentService } from '@/services/deployment';

interface ProjectEditorProps {
  projectId: string;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ projectId }) => {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const data = await projectService.getProject(projectId);
      setProject(data);
      if (data.files && Object.keys(data.files).length > 0) {
        const firstFile = Object.keys(data.files)[0];
        setSelectedFile(firstFile);
        setFileContent(data.files[firstFile]);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (filename: string) => {
    if (project?.files[filename]) {
      setSelectedFile(filename);
      setFileContent(project.files[filename]);
    }
  };

  const handleFileContentChange = async (value: string | undefined) => {
    if (!value || !project) return;

    setFileContent(value);
    const updatedFiles = { ...project.files, [selectedFile]: value };
    
    try {
      await projectService.updateProjectFiles(projectId, updatedFiles);
      setProject({ ...project, files: updatedFiles });
    } catch (error) {
      console.error('Error updating file:', error);
    }
  };

  const handleDeploy = async () => {
    if (!project) return;

    setDeploying(true);
    try {
      const deployment = await deploymentService.createDeployment(projectId);
      router.push(`/deployments/${deployment.id}`);
    } catch (error) {
      console.error('Error deploying project:', error);
    } finally {
      setDeploying(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex h-screen">
      {/* File Explorer */}
      <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Files</h2>
        <div className="space-y-2">
          {Object.keys(project.files).map((filename) => (
            <button
              key={filename}
              onClick={() => handleFileSelect(filename)}
              className={`w-full text-left px-3 py-2 rounded ${
                selectedFile === filename
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              {filename}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 bg-white border-b px-4 flex items-center justify-between">
          <h3 className="font-medium">{selectedFile}</h3>
          <button
            onClick={handleDeploy}
            disabled={deploying}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {deploying ? 'Deploying...' : 'Deploy'}
          </button>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language="typescript"
            theme="vs-dark"
            value={fileContent}
            onChange={handleFileContentChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor; 