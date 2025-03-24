import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { McpVersion } from '../../types';
import { formatDate } from '../../utils/helpers';

interface McpVersionHistoryProps {
  mcpId: string;
  currentVersion: string;
  versions: McpVersion[];
  isLoading: boolean;
  onSelectVersion: (version: string) => void;
}

export default function McpVersionHistory({
  mcpId,
  currentVersion,
  versions,
  isLoading,
  onSelectVersion,
}: McpVersionHistoryProps) {
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);

  // When versions change, collapse all
  useEffect(() => {
    setExpandedVersion(null);
  }, [versions]);

  const toggleExpand = (version: string) => {
    setExpandedVersion(expandedVersion === version ? null : version);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!versions.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No version history available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Version History
        </h3>
        <Link
          href={`/mcp/${mcpId}/versions/new`}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="-ml-0.5 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Version
        </Link>
      </div>

      <div className="space-y-2">
        {versions.map((version) => (
          <div 
            key={version.id}
            className={`
              border rounded-md overflow-hidden
              ${version.version === currentVersion 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}
            `}
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-2">
                  {version.version === currentVersion && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                      Current
                    </span>
                  )}
                  <div>
                    <button
                      onClick={() => toggleExpand(version.version)}
                      className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                    >
                      v{version.version}
                      <svg 
                        className={`ml-1 h-4 w-4 transition-transform ${expandedVersion === version.version ? 'transform rotate-180' : ''}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(version.createdAt)} by {version.createdBy.name}
                    </p>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  {version.version !== currentVersion && (
                    <button
                      type="button"
                      onClick={() => onSelectVersion(version.version)}
                      className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Switch to
                    </button>
                  )}
                </div>
              </div>
            </div>

            {expandedVersion === version.version && (
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
                <div className="mb-2">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </h4>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">
                    {version.description}
                  </p>
                </div>

                {version.changeNotes && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Change Notes
                    </h4>
                    <p className="text-sm text-gray-900 dark:text-white mt-1 whitespace-pre-line">
                      {version.changeNotes}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex justify-end space-x-2">
                  <Link
                    href={`/mcp/${mcpId}/versions/${version.version}`}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 