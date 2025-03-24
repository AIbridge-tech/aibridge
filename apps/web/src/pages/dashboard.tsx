import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { mcpAPI } from '../services/api';
import { MCP } from '../types';

type TabType = 'mcps' | 'stats' | 'settings';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<TabType>('mcps');
  const [mcps, setMcps] = React.useState<MCP[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Fetch user MCPs
  React.useEffect(() => {
    if (user) {
      setIsLoading(true);
      
      const fetchUserMcps = async () => {
        try {
          // In a real app, call the API
          // const response = await mcpAPI.getUserMcps(user.id);
          // setMcps(response.data);
          
          // Mock data for now
          setMcps([
            {
              id: 'mcp1',
              name: 'Data Analytics Pipeline',
              description: 'Process and analyze large datasets efficiently',
              version: '1.2.0',
              category: 'Data Processing',
              tags: ['analytics', 'pipeline', 'data'],
              owner: {
                id: user.id,
                name: user.name
              },
              ratings: [],
              downloads: 1240,
              createdAt: '2023-03-10',
              updatedAt: '2023-06-22',
              isPublic: true,
              apiSchema: {},
              implementationCode: ''
            },
            {
              id: 'mcp2',
              name: 'NLP Text Classifier',
              description: 'Classify text using natural language processing',
              version: '0.9.5',
              category: 'NLP',
              tags: ['nlp', 'classification', 'text'],
              owner: {
                id: user.id,
                name: user.name
              },
              ratings: [],
              downloads: 890,
              createdAt: '2023-04-18',
              updatedAt: '2023-07-30',
              isPublic: true,
              apiSchema: {},
              implementationCode: ''
            },
            {
              id: 'mcp3',
              name: 'Image Recognition SDK',
              description: 'Identify objects in images with high accuracy',
              version: '2.0.1',
              category: 'Computer Vision',
              tags: ['vision', 'recognition', 'images'],
              owner: {
                id: user.id,
                name: user.name
              },
              ratings: [],
              downloads: 1320,
              createdAt: '2023-02-05',
              updatedAt: '2023-08-15',
              isPublic: false,
              apiSchema: {},
              implementationCode: ''
            }
          ]);
        } catch (error) {
          console.error('Failed to fetch user MCPs:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserMcps();
    }
  }, [user]);
  
  const handleDeleteMcp = async (mcpId: string) => {
    try {
      // In a real app, call the API
      // await mcpAPI.deleteMcp(mcpId);
      
      // Update local state
      setMcps(mcps.filter((mcp: MCP) => mcp.id !== mcpId));
    } catch (error) {
      console.error('Failed to delete MCP:', error);
    }
  };
  
  const handleToggleMcpVisibility = async (mcpId: string) => {
    try {
      const mcp = mcps.find((m: MCP) => m.id === mcpId);
      if (!mcp) return;
      
      // In a real app, call the API
      // await mcpAPI.updateMcp(mcpId, { isPublic: !mcp.isPublic });
      
      // Update local state
      setMcps(mcps.map((m: MCP) => 
        m.id === mcpId ? { ...m, isPublic: !m.isPublic } : m
      ));
    } catch (error) {
      console.error('Failed to update MCP visibility:', error);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'mcps':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">My MCPs</h2>
              <Link href="/mcp/create">
                <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md">
                  Create New MCP
                </button>
              </Link>
            </div>
            
            {mcps.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="font-medium text-gray-500 dark:text-gray-400">You haven't created any MCPs yet</h3>
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                  Create your first MCP to share with the community
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Version
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Downloads
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Visibility
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Updated
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {mcps.map((mcp: MCP) => (
                      <tr key={mcp.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            <Link href={`/mcp/${mcp.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                              {mcp.name}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {mcp.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {mcp.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {mcp.version}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {mcp.downloads.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              mcp.isPublic 
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {mcp.isPublic ? 'Public' : 'Private'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(mcp.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <Link href={`/mcp/edit/${mcp.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleToggleMcpVisibility(mcp.id)} 
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {mcp.isPublic ? 'Make Private' : 'Publish'}
                          </button>
                          <button 
                            onClick={() => handleDeleteMcp(mcp.id)} 
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      
      case 'stats':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total MCPs
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {user?.stats?.mcpsCreated || mcps.length}
                  </dd>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Downloads
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {(user?.stats?.totalDownloads || 0).toLocaleString()}
                  </dd>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Average Rating
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {(user?.stats?.averageRating || 0).toFixed(1)}
                  </dd>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                  <p className="text-gray-500 dark:text-gray-400">
                    Activity tracking will be available soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        // We'll keep the settings tab simple for now
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Account Settings</h2>
            
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Update your account details and profile.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <form className="px-4 py-5 sm:p-6 space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                      defaultValue={user?.name}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      disabled
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900"
                      defaultValue={user?.email}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed. Contact support for assistance.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                      defaultValue={user?.bio || ''}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      id="website"
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                      defaultValue={user?.website || ''}
                    />
                  </div>
                  
                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <MainLayout>
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            {/* Sidebar */}
            <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('mcps')}
                  className={`group flex items-center px-3 py-2 text-sm font-medium w-full rounded-md ${
                    activeTab === 'mcps'
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <svg 
                    className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 ${
                      activeTab === 'mcps' 
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  My MCPs
                </button>

                <button
                  onClick={() => setActiveTab('stats')}
                  className={`group flex items-center px-3 py-2 text-sm font-medium w-full rounded-md ${
                    activeTab === 'stats'
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <svg 
                    className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 ${
                      activeTab === 'stats' 
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`group flex items-center px-3 py-2 text-sm font-medium w-full rounded-md ${
                    activeTab === 'settings'
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <svg 
                    className={`flex-shrink-0 -ml-1 mr-3 h-6 w-6 ${
                      activeTab === 'settings' 
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
              </nav>
            </aside>

            {/* Main content area */}
            <div className="space-y-6 lg:col-span-9 lg:mt-0">
              {renderContent()}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </MainLayout>
  );
} 