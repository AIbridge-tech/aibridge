import React from 'react';
import Link from 'next/link';
import { StarIcon, DownloadIcon } from '@heroicons/react/solid';

interface McpCardProps {
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

export default function McpCard({
  id,
  name,
  description,
  owner,
  rating,
  downloads,
  tags,
  version,
}: McpCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition hover:shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <Link 
            href={`/marketplace/${id}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
          >
            {name}
          </Link>
          <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            v{version}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <Link
            href={`/profile/${owner.id}`}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
          >
            By {owner.name}
          </Link>
          
          <div className="flex space-x-4">
            <div className="flex items-center text-amber-500 dark:text-amber-400">
              <StarIcon className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
            
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <DownloadIcon className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{downloads}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 