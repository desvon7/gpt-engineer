import React, { useState } from 'react';
import { deploymentService } from '@/services/deployment';

interface DeploymentSettingsProps {
  projectId: string;
  onSave: () => void;
}

interface EnvironmentVariable {
  key: string;
  value: string;
}

const DeploymentSettings: React.FC<DeploymentSettingsProps> = ({
  projectId,
  onSave,
}) => {
  const [environmentVars, setEnvironmentVars] = useState<EnvironmentVariable[]>([
    { key: '', value: '' },
  ]);
  const [saving, setSaving] = useState(false);

  const handleAddVariable = () => {
    setEnvironmentVars([...environmentVars, { key: '', value: '' }]);
  };

  const handleRemoveVariable = (index: number) => {
    const newVars = environmentVars.filter((_, i) => i !== index);
    setEnvironmentVars(newVars);
  };

  const handleVariableChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const newVars = [...environmentVars];
    newVars[index][field] = value;
    setEnvironmentVars(newVars);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const envObject = environmentVars.reduce((acc, { key, value }) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);

      await deploymentService.createDeployment(projectId, envObject);
      onSave();
    } catch (error) {
      console.error('Error saving deployment settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Deployment Settings</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Environment Variables</h3>
        <div className="space-y-4">
          {environmentVars.map((envVar, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Key"
                value={envVar.key}
                onChange={(e) =>
                  handleVariableChange(index, 'key', e.target.value)
                }
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Value"
                value={envVar.value}
                onChange={(e) =>
                  handleVariableChange(index, 'value', e.target.value)
                }
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleRemoveVariable(index)}
                className="p-2 text-red-500 hover:text-red-600"
                disabled={environmentVars.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleAddVariable}
          className="mt-4 px-4 py-2 text-blue-500 hover:text-blue-600"
        >
          + Add Environment Variable
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default DeploymentSettings; 