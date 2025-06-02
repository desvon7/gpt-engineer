import React, { useEffect, useState } from 'react';
import { deploymentService, Deployment } from '@/services/deployment';
import { formatDistanceToNow } from 'date-fns';

interface DeploymentHistoryProps {
  projectId: string;
}

const DeploymentHistory: React.FC<DeploymentHistoryProps> = ({ projectId }) => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeployments();
  }, [projectId]);

  const loadDeployments = async () => {
    try {
      const data = await deploymentService.getProjectDeployments(projectId);
      setDeployments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading deployments:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: Deployment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'building':
        return 'bg-blue-500';
      case 'deployed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div>Loading deployment history...</div>;
  }

  if (deployments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No deployments found for this project.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Deployment History</h2>
      </div>
      <div className="divide-y">
        {deployments.map((deployment) => (
          <div key={deployment.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">
                  Deployment {deployment.id.slice(0, 8)}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(deployment.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                  deployment.status
                )}`}
              >
                {deployment.status.charAt(0).toUpperCase() +
                  deployment.status.slice(1)}
              </span>
            </div>

            {deployment.url && (
              <div className="mb-4">
                <a
                  href={deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  {deployment.url}
                </a>
              </div>
            )}

            {deployment.status === 'failed' && (
              <div className="mt-2 text-sm text-red-600">
                {deployment.build_logs[deployment.build_logs.length - 1] ||
                  'Deployment failed'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeploymentHistory; 