import React from 'react';
import McpCard from './McpCard';

// MCP类型定义
export interface Mcp {
  id: string;
  name: string;
  description: string;
  owner: {
    name: string;
    id: string;
  };
  rating: number;
  downloads: number;
  tags: string[];
  version: string;
}

interface McpListProps {
  mcps: Mcp[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function McpList({
  mcps = [],
  isLoading = false,
  emptyMessage = 'No MCPs found',
}: McpListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
            <div className="flex space-x-2 mb-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (mcps.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-gray-500 dark:text-gray-400">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mcps.map((mcp) => (
        <McpCard key={mcp.id} {...mcp} />
      ))}
    </div>
  );
} 