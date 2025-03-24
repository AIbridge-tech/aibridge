import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import McpList from '../../components/mcp/McpList';

// Mock user data
const mockUser = {
  id: 'user-1',
  name: 'AI Research Lab',
  email: 'contact@airesearchlab.com',
  bio: 'Leading research lab focused on creating standardized protocols for AI model interactions and integrations.',
  website: 'https://airesearchlab.com',
  joinedDate: '2022-10-15T00:00:00Z',
  avatarUrl: '/images/avatars/ai-research-lab.png',
  stats: {
    mcpsCreated: 12,
    totalDownloads: 8547,
    averageRating: 4.7
  }
};

// Mock MCPs created by this user
const mockUserMcps = [
  {
    id: 'mcp-1',
    name: 'Text Classification',
    description: 'A protocol for text classification models that categorize text into predefined categories.',
    version: '1.0.0',
    category: 'Natural Language Processing',
    owner: {
      id: 'user-1',
      name: 'AI Research Lab'
    },
    tags: ['NLP', 'Classification', 'Text Analysis'],
    rating: 4.8,
    downloads: 1245,
    createdAt: '2023-01-15T08:30:00Z'
  },
  {
    id: 'mcp-4',
    name: 'Speech Recognition',
    description: 'A protocol for speech recognition models that convert spoken language into text.',
    version: '1.1.0',
    category: 'Audio Processing',
    owner: {
      id: 'user-1',
      name: 'AI Research Lab'
    },
    tags: ['Audio', 'Speech', 'Recognition'],
    rating: 4.6,
    downloads: 1089,
    createdAt: '2023-02-05T09:15:00Z'
  },
  {
    id: 'mcp-7',
    name: 'Document Question Answering',
    description: 'A protocol for models that answer questions based on document content.',
    version: '1.0.2',
    category: 'Natural Language Processing',
    owner: {
      id: 'user-1',
      name: 'AI Research Lab'
    },
    tags: ['NLP', 'QA', 'Documents'],
    rating: 4.5,
    downloads: 842,
    createdAt: '2023-03-12T10:45:00Z'
  }
];

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [userMcps, setUserMcps] = useState<typeof mockUserMcps | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, you would fetch the user data from an API
        // const response = await fetch(`/api/users/${id}`);
        // if (!response.ok) throw new Error('Failed to fetch user data');
        // const userData = await response.json();
        
        // const mcpsResponse = await fetch(`/api/users/${id}/mcps`);
        // if (!mcpsResponse.ok) throw new Error('Failed to fetch user MCPs');
        // const mcpsData = await mcpsResponse.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data for demonstration
        setUser(mockUser);
        setUserMcps(mockUserMcps);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error || 'User not found'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="md:flex md:items-center md:justify-between md:space-x-5 p-6">
            <div className="flex items-start space-x-5">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-white">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name} 
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
              </div>
              
              {/* User info */}
              <div className="pt-1.5">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Joined {formatDate(user.joinedDate)}
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-4 justify-between md:justify-end md:mt-0">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900 dark:text-white">{user.stats.mcpsCreated}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">MCPs Created</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900 dark:text-white">{user.stats.totalDownloads.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Downloads</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900 dark:text-white">{user.stats.averageRating.toFixed(1)}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Rating</p>
              </div>
            </div>
          </div>
          
          {/* Bio and website */}
          {(user.bio || user.website) && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-5">
              {user.bio && (
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>
              )}
              {user.website && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* User's MCPs */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Created MCPs
          </h2>
          
          <McpList 
            mcps={userMcps}
            isLoading={false}
            emptyMessage="This user hasn't created any MCPs yet."
          />
        </div>
      </div>
    </MainLayout>
  );
} 