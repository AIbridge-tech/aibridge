import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { McpVersionFormValues, McpVersion } from '../../../../../types';
import MainLayout from '../../../../../components/layouts/MainLayout';
import McpVersionForm from '../../../../../components/mcp/McpVersionForm';
import { mcpAPI } from '../../../../../services/api';

export default function EditMcpVersionPage() {
  const router = useRouter();
  const { id, version } = router.query;
  const mcpId = id as string;
  const versionId = version as string;

  const [mcpVersion, setMcpVersion] = useState<McpVersion | null>(null);
  const [existingVersions, setExistingVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mcpId || !versionId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In production, replace with actual API calls
        // Mock implementation for development
        setTimeout(() => {
          // Mock MCP version data
          const mockVersion: McpVersion = {
            id: '123',
            mcpId: mcpId,
            version: versionId,
            description: 'This version includes bug fixes and performance improvements',
            changeNotes: '- Fixed error handling\n- Improved response time\n- Added new utility functions',
            apiSchema: JSON.stringify({
              endpoints: [
                {
                  name: 'getUser',
                  method: 'GET',
                  path: '/users/:id',
                  parameters: {
                    id: 'string'
                  },
                  response: {
                    id: 'string',
                    name: 'string',
                    email: 'string'
                  }
                }
              ]
            }, null, 2),
            implementationCode: 'function getUser(id) {\n  return fetch(`/api/users/${id}`)\n    .then(res => res.json());\n}',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: {
              id: '456',
              name: 'Developer User'
            }
          };
          
          setMcpVersion(mockVersion);
          setExistingVersions(['1.0.0', '1.1.0', '1.2.0']); // Include current version
          setIsLoading(false);
        }, 1000);

        // Uncomment for production:
        // const versionResponse = await mcpAPI.getVersion(mcpId, versionId);
        // setMcpVersion(versionResponse.data);
        // const versionsResponse = await mcpAPI.getAllVersions(mcpId);
        // setExistingVersions(versionsResponse.data.map(v => v.version));
      } catch (err) {
        console.error('Error fetching MCP version data:', err);
        setError('Failed to load MCP version data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mcpId, versionId]);

  const handleSubmit = async (values: McpVersionFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // In production, replace with actual API call
      // Mock implementation for development
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Updating version:', values);

      // Uncomment for production:
      // await mcpAPI.updateVersion(mcpId, versionId, values);
      
      // Redirect to MCP version detail page
      router.push(`/mcp/${mcpId}/versions/${values.version}`);
    } catch (err) {
      console.error('Error updating MCP version:', err);
      setError('Failed to update version. Please try again.');
      setIsSubmitting(false);
    }
  };

  const initialValues: McpVersionFormValues | undefined = mcpVersion ? {
    version: mcpVersion.version,
    description: mcpVersion.description,
    changeNotes: mcpVersion.changeNotes,
    apiSchema: mcpVersion.apiSchema,
    implementationCode: mcpVersion.implementationCode,
  } : undefined;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Edit Version {versionId}
              </h1>
              {mcpVersion && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  For MCP: {mcpVersion.mcpId}
                </p>
              )}
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href={`/mcp/${mcpId}/versions/${versionId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cancel
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 ml-auto"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
            {initialValues ? (
              <McpVersionForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                existingVersions={existingVersions.filter(v => v !== versionId)}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Version not found or unable to load data.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
} 