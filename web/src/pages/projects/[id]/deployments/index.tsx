import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DeploymentStatus from '@/components/deployment/DeploymentStatus';
import DeploymentHistory from '@/components/deployment/DeploymentHistory';
import DeploymentSettings from '@/components/deployment/DeploymentSettings';

const DeploymentsPage: React.FC = () => {
  const router = useRouter();
  const { id: projectId } = router.query;
  const [activeDeploymentId, setActiveDeploymentId] = useState<string | null>(
    null
  );

  const handleDeploymentCreated = () => {
    // Refresh the deployment history
    router.reload();
  };

  if (!projectId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <DeploymentSettings
            projectId={projectId as string}
            onSave={handleDeploymentCreated}
          />
          {activeDeploymentId && (
            <DeploymentStatus deploymentId={activeDeploymentId} />
          )}
        </div>
        <div>
          <DeploymentHistory
            projectId={projectId as string}
            onSelectDeployment={setActiveDeploymentId}
          />
        </div>
      </div>
    </div>
  );
};

export default DeploymentsPage; 