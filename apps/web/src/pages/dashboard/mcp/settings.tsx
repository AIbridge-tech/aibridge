import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../components/layout/MainLayout';
import { useAuth } from '../../../contexts/AuthContext';
import McpRevenueSettings from '../../../components/mcp/McpRevenueSettings';
import McpContributors from '../../../components/mcp/McpContributors';

interface MonetizationSettings {
  model: 'free' | 'paid' | 'subscription';
  price: number;
  subscriptionTiers: {
    name: string;
    price: number;
    callLimit: number;
    features: string[];
  }[];
  customRoyalty: number;
}

interface Contributor {
  userId: string;
  role: 'owner' | 'collaborator' | 'maintainer';
  revenueShare: number;
  joinedAt: string;
  name: string;
  email: string;
}

interface McpData {
  id: string;
  name: string;
  description: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  category: string;
  tags: string[];
  downloads: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function McpSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { mcpId } = router.query;
  
  const [pageLoading, setPageLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState('revenue');
  const [mcpData, setMcpData] = React.useState<McpData | null>(null);
  
  // Load MCP data
  React.useEffect(() => {
    if (isAuthenticated && user && mcpId) {
      fetchMcpData();
    }
  }, [isAuthenticated, user, mcpId]);
  
  // Redirect to login page if not logged in
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch MCP data
  const fetchMcpData = async () => {
    try {
      setPageLoading(true);
      setError(null);
      
      // Mock API call
      setTimeout(() => {
        // Simulate data from API
        const mockMcpData: McpData = {
          id: mcpId as string,
          name: 'Advanced Text Classification',
          description: 'A powerful MCP for text classification with multilingual support',
          owner: {
            id: user?.id || '',
            name: user?.name || '',
            email: user?.email || ''
          },
          category: 'Natural Language Processing',
          tags: ['classification', 'nlp', 'multilingual'],
          downloads: 1248,
          rating: 4.7,
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        setMcpData(mockMcpData);
        setPageLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching MCP data:', err);
      setError('Failed to load MCP data. Please try again later.');
      setPageLoading(false);
    }
  };

  // Handle revenue settings save
  const handleRevenueSettingsSave = (settings: MonetizationSettings, contributors: Contributor[]) => {
    setSuccess('MCP revenue settings saved successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Handle contributors save
  const handleContributorsSave = (contributors: Contributor[]) => {
    setSuccess('MCP contributors saved successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const loadingContent = (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  const mainContent = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:flex lg:gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <div className="sticky top-8">
            <nav className="space-y-1">
              <a 
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <svg className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </a>
              <a 
                href="/dashboard/mcps"
                className="bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <svg className="text-primary-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                My MCPs
              </a>
              <a 
                href="/dashboard/earnings"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <svg className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Earnings
              </a>
              <a 
                href="/dashboard/wallet"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <svg className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Wallet
              </a>
              <a 
                href="/dashboard/settings"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <svg className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </a>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1">
          {mcpData && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{mcpData.name}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{mcpData.description}</p>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex flex-wrap items-center justify-between">
                <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  MCP Settings
                </h2>
                {mcpData && (
                  <div className="mt-2 flex">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      Last updated: {new Date(mcpData.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('revenue')}
                  className={`${
                    activeTab === 'revenue'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:px-6`}
                >
                  Revenue Settings
                </button>
                <button
                  onClick={() => setActiveTab('contributors')}
                  className={`${
                    activeTab === 'contributors'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:px-6`}
                >
                  Contributors
                </button>
                <button
                  onClick={() => setActiveTab('versions')}
                  className={`${
                    activeTab === 'versions'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:px-6`}
                >
                  Versions
                </button>
                <button
                  onClick={() => setActiveTab('documentation')}
                  className={`${
                    activeTab === 'documentation'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:px-6`}
                >
                  Documentation
                </button>
              </nav>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="px-4 py-5 sm:px-6">
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          type="button"
                          onClick={() => setError(null)}
                          className="inline-flex bg-red-50 dark:bg-transparent rounded-md p-1.5 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                        >
                          <span className="sr-only">Dismiss</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Success message */}
            {success && (
              <div className="px-4 py-5 sm:px-6">
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700 dark:text-green-200">{success}</p>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          type="button"
                          onClick={() => setSuccess(null)}
                          className="inline-flex bg-green-50 dark:bg-transparent rounded-md p-1.5 text-green-500 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50"
                        >
                          <span className="sr-only">Dismiss</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tab content */}
            <div className="px-4 py-5 sm:px-6">
              {activeTab === 'revenue' && (
                <McpRevenueSettings
                  mcpId={mcpId as string}
                  onSave={handleRevenueSettingsSave}
                />
              )}
              
              {activeTab === 'contributors' && (
                <McpContributors
                  mcpId={mcpId as string}
                  onSave={handleContributorsSave}
                />
              )}
              
              {activeTab === 'versions' && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Coming Soon</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    MCP version management functionality is under development. Stay tuned.
                  </p>
                </div>
              )}
              
              {activeTab === 'documentation' && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Coming Soon</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    MCP documentation management functionality is under development. Stay tuned.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
  
  if (isLoading || pageLoading) {
    return (
      <MainLayout children={loadingContent} />
    );
  }
  
  return (
    <MainLayout children={mainContent} />
  );
} 