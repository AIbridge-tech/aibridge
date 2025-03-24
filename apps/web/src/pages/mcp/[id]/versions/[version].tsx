import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { McpVersion } from '../../../../types';
import MainLayout from '../../../../components/layouts/MainLayout';
import { mcpAPI } from '../../../../services/api';
import { formatDate } from '../../../../utils/helpers';

export default function McpVersionDetailPage() {
  const router = useRouter();
  const { id, version } = router.query;
  const mcpId = id as string;
  const versionId = version as string;

  const [mcpVersion, setMcpVersion] = useState<McpVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'apiSchema' | 'implementation'>('overview');

  useEffect(() => {
    if (!mcpId || !versionId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In production, replace with actual API call
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
          setIsLoading(false);
        }, 1000);

        // Uncomment for production:
        // const response = await mcpAPI.getVersion(mcpId, versionId);
        // setMcpVersion(response.data);
      } catch (err) {
        console.error('Error fetching MCP version:', err);
        setError('Failed to load MCP version data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mcpId, versionId]);

  const handleDeleteVersion = async () => {
    if (!window.confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
      return;
    }

    try {
      // In production, replace with actual API call
      // Mock implementation for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Deleting version:', versionId);

      // Uncomment for production:
      // await mcpAPI.deleteVersion(mcpId, versionId);
      
      // Redirect to MCP detail page
      router.push(`/mcp/${mcpId}`);
    } catch (err) {
      console.error('Error deleting MCP version:', err);
      setError('Failed to delete version. Please try again.');
    }
  };

  const renderTabContent = () => {
    if (!mcpVersion) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Description</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {mcpVersion.description}
              </p>
            </div>

            {mcpVersion.changeNotes && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Notes</h3>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 whitespace-pre-line">
                  {mcpVersion.changeNotes}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Version Information</h3>
              <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{mcpVersion.version}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{mcpVersion.createdBy.name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created On</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(mcpVersion.createdAt)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(mcpVersion.updatedAt)}</dd>
                </div>
              </dl>
            </div>
          </div>
        );
      
      case 'apiSchema':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">API Schema</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 overflow-auto">
              <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre">
                {mcpVersion.apiSchema}
              </pre>
            </div>
          </div>
        );
      
      case 'implementation':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Implementation Code</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 overflow-auto">
              <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre">
                {mcpVersion.implementationCode}
              </pre>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center">
                <Link
                  href={`/mcp/${mcpId}`}
                  className="mr-2 text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  Version {versionId}
                </h1>
              </div>
              {mcpVersion && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Created {formatDate(mcpVersion.createdAt)} by {mcpVersion.createdBy.name}
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-col-reverse sm:flex-row sm:mt-0 space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
              <Link
                href={`/mcp/${mcpId}/versions/edit/${versionId}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDeleteVersion}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
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
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex">
                  <button
                    className={`
                      ${activeTab === 'overview' 
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'}
                      w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base
                    `}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`
                      ${activeTab === 'apiSchema' 
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'}
                      w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base
                    `}
                    onClick={() => setActiveTab('apiSchema')}
                  >
                    API Schema
                  </button>
                  <button
                    className={`
                      ${activeTab === 'implementation' 
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'}
                      w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base
                    `}
                    onClick={() => setActiveTab('implementation')}
                  >
                    Implementation
                  </button>
                </nav>
              </div>
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
} 