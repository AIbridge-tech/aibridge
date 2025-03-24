import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { McpVersionFormValues, MCP } from '../../../../types';
import MainLayout from '../../../../components/layouts/MainLayout';
import McpVersionForm from '../../../../components/mcp/McpVersionForm';
import { mcpAPI } from '../../../../services/api';

export default function NewMcpVersionPage() {
  const router = useRouter();
  const { id } = router.query;
  const mcpId = id as string;

  const [mcp, setMcp] = useState<MCP | null>(null);
  const [existingVersions, setExistingVersions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mcpId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In production, replace with actual API calls
        // Mock implementation for development
        setTimeout(() => {
          // Mock MCP data
          const mockMcp: MCP = {
            id: mcpId,
            name: 'Sample MCP',
            description: 'Sample MCP description',
            version: '1.0.0',
            category: 'AI',
            tags: ['ai', 'testing'],
            owner: {
              id: '123',
              name: 'Test User'
            },
            apiSchema: {},
            implementationCode: 'console.log("Hello")',
            isPublic: true,
            ratings: [],
            downloads: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setMcp(mockMcp);
          setExistingVersions(['1.0.0']);
          setIsLoading(false);
        }, 1000);

        // Uncomment for production:
        // const mcpResponse = await mcpAPI.get(mcpId);
        // setMcp(mcpResponse.data);
        // const versionsResponse = await mcpAPI.getAllVersions(mcpId);
        // setExistingVersions(versionsResponse.data.map(v => v.version));
      } catch (err) {
        console.error('Error fetching MCP data:', err);
        setError('Failed to load MCP data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mcpId]);

  const handleSubmit = async (values: McpVersionFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // In production, replace with actual API call
      // Mock implementation for development
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Creating new version:', values);

      // Uncomment for production:
      // await mcpAPI.createVersion(mcpId, values);
      
      // Redirect to MCP detail page
      router.push(`/mcp/${mcpId}`);
    } catch (err) {
      console.error('Error creating MCP version:', err);
      setError('Failed to create new version. Please try again.');
      setIsSubmitting(false);
    }
  };

  const initialValues: Partial<McpVersionFormValues> = {
    // Pre-fill with latest version data if editing or incrementing
    version: mcp ? incrementVersion(mcp.version) : '',
    apiSchema: mcp?.apiSchema ? JSON.stringify(mcp.apiSchema, null, 2) : '',
    implementationCode: mcp?.implementationCode || '',
  };

  // Helper function to increment version number for suggestion
  function incrementVersion(version: string): string {
    const parts = version.split('.');
    if (parts.length !== 3) return '';
    
    // Increment patch version
    const newPatch = parseInt(parts[2]) + 1;
    return `${parts[0]}.${parts[1]}.${newPatch}`;
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Create New Version
              </h1>
              {mcp && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  For MCP: {mcp.name}
                </p>
              )}
            </div>
            <div className="mt-4 sm:mt-0">
              <Link
                href={`/mcp/${mcpId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to MCP
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
            <McpVersionForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              existingVersions={existingVersions}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
} 