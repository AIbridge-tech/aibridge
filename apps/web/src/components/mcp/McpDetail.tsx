import React, { useState } from 'react';
import Link from 'next/link';
import { StarIcon, DownloadIcon, CodeIcon, TagIcon, UserIcon, CalendarIcon } from '@heroicons/react/solid';
import { Rating, McpVersion } from '../../types';
import { formatDate, calculateAverageRating } from '../../utils/helpers';
import McpVersionHistory from './McpVersionHistory';

export interface McpDetailProps {
  id: string;
  name: string;
  description: string;
  version: string;
  apiSchema: string;
  implementationCode: string;
  owner: {
    id: string;
    name: string;
  };
  category: string;
  tags: string[];
  ratings: Rating[];
  downloads: number;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  onDownload: () => void;
  onSubmitRating?: (rating: number, comment: string) => Promise<void>;
}

export default function McpDetail({
  id,
  name,
  description,
  version,
  apiSchema,
  implementationCode,
  owner,
  category,
  tags,
  ratings,
  downloads,
  createdAt,
  updatedAt,
  isPublic,
  onDownload,
  onSubmitRating
}: McpDetailProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'api' | 'implementation' | 'reviews' | 'versions'>('details');
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [versionHistoryLoading, setVersionHistoryLoading] = useState<boolean>(true);
  const [versions, setVersions] = useState<McpVersion[]>([]);

  // Calculate average rating
  const averageRating = calculateAverageRating(ratings.map(r => r.value));

  // Handle rating submission
  const handleSubmitRating = async () => {
    if (!userRating) {
      setErrorMessage('Please select a rating');
      return;
    }

    if (!onSubmitRating) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSubmitRating(userRating, userComment);
      setUserRating(0);
      setUserComment('');
    } catch (error) {
      setErrorMessage('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load version history when tab is selected
  React.useEffect(() => {
    if (activeTab === 'versions' && versions.length === 0) {
      // Mock loading version history data
      setVersionHistoryLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockVersions: McpVersion[] = [
          {
            id: 'v3',
            mcpId: id,
            version: version,
            description: 'Current stable version with performance improvements',
            changeNotes: '- Improved response time\n- Fixed memory leak\n- Added better error handling',
            apiSchema: JSON.stringify(apiSchema),
            implementationCode: implementationCode,
            createdAt: updatedAt,
            updatedAt: updatedAt,
            createdBy: {
              id: owner.id,
              name: owner.name
            }
          },
          {
            id: 'v2',
            mcpId: id,
            version: '1.1.0',
            description: 'Added new features and fixed bugs',
            changeNotes: '- Added support for multi-language input\n- Fixed parsing issues\n- Improved documentation',
            apiSchema: JSON.stringify(apiSchema),
            implementationCode: 'function process(context) { /* older implementation */ }',
            createdAt: '2023-02-15T10:30:00Z',
            updatedAt: '2023-02-15T10:30:00Z',
            createdBy: {
              id: owner.id,
              name: owner.name
            }
          },
          {
            id: 'v1',
            mcpId: id,
            version: '1.0.0',
            description: 'Initial release',
            changeNotes: '',
            apiSchema: JSON.stringify({ simplifiedSchema: true }),
            implementationCode: 'function process(context) { /* initial implementation */ }',
            createdAt: createdAt,
            updatedAt: createdAt,
            createdBy: {
              id: owner.id,
              name: owner.name
            }
          }
        ];
        
        setVersions(mockVersions);
        setVersionHistoryLoading(false);
      }, 1500);
      
      // In production, replace with actual API call:
      // const fetchVersions = async () => {
      //   try {
      //     const response = await mcpAPI.getAllVersions(id);
      //     setVersions(response.data);
      //   } catch (error) {
      //     console.error('Failed to fetch versions:', error);
      //   } finally {
      //     setVersionHistoryLoading(false);
      //   }
      // };
      // fetchVersions();
    }
  }, [activeTab, id, versions.length, apiSchema, implementationCode, createdAt, updatedAt, owner.id, owner.name, version]);

  // Handle selecting a different version
  const handleSelectVersion = (versionNumber: string) => {
    // Navigate to specific version
    window.location.href = `/mcp/${id}/versions/${versionNumber}`;
    
    // In production with client-side routing:
    // router.push(`/mcp/${id}/versions/${versionNumber}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
            <div className="flex items-center mt-1 space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300">
                v{version}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                {category}
              </span>
              {isPublic ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                  Public
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">
                  Private
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {averageRating.toFixed(1)} ({ratings.length} reviews)
              </span>
            </div>
            <div className="flex items-center">
              <DownloadIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {downloads} downloads
              </span>
            </div>
            <button
              onClick={onDownload}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="px-6 -mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'api'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('api')}
          >
            API Schema
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'implementation'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('implementation')}
          >
            Implementation
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'versions'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('versions')}
          >
            Versions
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'details' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">About this MCP</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{description}</p>
            
            {/* Tags */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                <TagIcon className="h-4 w-4 mr-2" />
                Tags
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Owner Info */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                Author
              </h3>
              <div className="mt-2">
                <Link href={`/profile/${owner.id}`} className="text-primary-600 hover:text-primary-500">
                  {owner.name}
                </Link>
              </div>
            </div>
            
            {/* Dates */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Dates
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Created: {formatDate(createdAt)}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Last updated: {formatDate(updatedAt)}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">API Schema</h2>
            <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-[600px]">
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {typeof apiSchema === 'object' 
                  ? JSON.stringify(apiSchema, null, 2) 
                  : apiSchema}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'implementation' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Implementation Code</h2>
            <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-[600px]">
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {implementationCode}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Reviews & Ratings</h2>
            
            {/* Submit a review */}
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Submit your review</h3>
              <form onSubmit={handleSubmitRating}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your rating
                  </label>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className="focus:outline-none"
                        onClick={() => setUserRating(rating)}
                      >
                        <StarIcon
                          className={`h-7 w-7 ${
                            rating <= userRating
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your comment
                  </label>
                  <textarea
                    id="comment"
                    rows={4}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-md"
                    placeholder="Write your review here..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={userRating === 0 || isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
            
            {/* Existing reviews */}
            <div className="space-y-6">
              {ratings.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic">No reviews yet. Be the first to review!</p>
              ) : (
                ratings.map((rating) => (
                  <div key={`${rating.userId}-${rating.createdAt}`} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900 dark:text-white">{rating.userName}</div>
                        <time className="ml-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(rating.createdAt)}</time>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-5 w-5 ${
                              star <= rating.value
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {rating.comment && (
                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        <p>{rating.comment}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'versions' && (
          <McpVersionHistory
            mcpId={id}
            currentVersion={version}
            versions={versions}
            isLoading={versionHistoryLoading}
            onSelectVersion={handleSelectVersion}
          />
        )}
      </div>
    </div>
  );
} 