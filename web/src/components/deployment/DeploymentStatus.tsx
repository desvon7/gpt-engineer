import React, { useEffect, useState } from 'react';
import { deploymentService, Deployment } from '@/services/deployment';

interface DeploymentStatusProps {
  deploymentId: string;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({ deploymentId }) => {
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeployment();
    const interval = setInterval(loadDeployment, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [deploymentId]);

  const loadDeployment = async () => {
    try {
      const data = await deploymentService.getDeployment(deploymentId);
      setDeployment(data);
      if (data.status === 'deployed' || data.status === 'failed') {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading deployment:', error);
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
    return <div>Loading deployment status...</div>;
  }

  if (!deployment) {
    return <div>Deployment not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Deployment Status</h2>
        <span
          className={`px-3 py-1 rounded-full text-white ${getStatusColor(
            deployment.status
          )}`}
        >
          {deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
        </span>
      </div>

      {deployment.url && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Deployment URL</h3>
          <a
            href={deployment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            {deployment.url}
          </a>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-2">Build Logs</h3>
        <div className="bg-gray-100 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
          {deployment.build_logs.length > 0 ? (
            deployment.build_logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No logs available</div>
          )}
        </div>
      </div>

      {deployment.status === 'failed' && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-medium text-red-700 mb-2">
            Deployment Failed
          </h3>
          <p className="text-red-600">
            Please check the build logs for more information about the failure.
          </p>
        </div>
      )}
    </div>
  );
};

export default DeploymentStatus; 