import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '../../../components/layout/MainLayout';
import { useAuth } from '../../../contexts/AuthContext';

interface Earning {
  id: string;
  earningId: string;
  source: 'download' | 'usage' | 'reward' | 'referral';
  amount: number;
  currency: string;
  timestamp: string;
  mcpId: string;
  mcpName: string;
  details?: string;
}

interface Filters {
  source: string;
  startDate: string;
  endDate: string;
  mcpId: string;
}

export default function EarningsHistoryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  // Mock earnings data
  const [earnings, setEarnings] = React.useState<Earning[]>([]);
  const [mcps, setMcps] = React.useState<{id: string, name: string}[]>([]);

  // Filter conditions
  const [filters, setFilters] = React.useState<Filters>({
    source: 'all',
    startDate: '',
    endDate: '',
    mcpId: 'all'
  });

  // Load data
  React.useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && user) {
        try {
          setPageLoading(true);
          
          // Mock data loading
          setTimeout(() => {
            // Generate some mock MCPs
            const mockMcps = [
              { id: '123', name: 'Text Classification MCP' },
              { id: '456', name: 'Image Generation MCP' },
              { id: '789', name: 'Sentiment Analysis MCP' }
            ];
            
            // Generate some mock earnings
            const mockEarnings: Earning[] = [
              {
                id: '1',
                earningId: 'EARN-1654321987-ABCDEF',
                source: 'download',
                amount: 25.50,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                mcpId: '123',
                mcpName: 'Text Classification MCP'
              },
              {
                id: '2',
                earningId: 'EARN-1654221985-BCDEFG',
                source: 'usage',
                amount: 12.75,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                mcpId: '123',
                mcpName: 'Text Classification MCP'
              },
              {
                id: '3',
                earningId: 'EARN-1654121983-CDEFGH',
                source: 'download',
                amount: 50.00,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 259200000).toISOString(),
                mcpId: '456',
                mcpName: 'Image Generation MCP'
              },
              {
                id: '4',
                earningId: 'EARN-1654021981-DEFGHI',
                source: 'usage',
                amount: 18.25,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 345600000).toISOString(),
                mcpId: '456',
                mcpName: 'Image Generation MCP'
              },
              {
                id: '5',
                earningId: 'EARN-1653921979-EFGHIJ',
                source: 'reward',
                amount: 100.00,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 432000000).toISOString(),
                mcpId: '789',
                mcpName: 'Sentiment Analysis MCP',
                details: 'Featured MCP of the month'
              },
              {
                id: '6',
                earningId: 'EARN-1653821977-FGHIJK',
                source: 'referral',
                amount: 15.00,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 518400000).toISOString(),
                mcpId: '123',
                mcpName: 'Text Classification MCP',
                details: 'Referred by user123'
              },
              {
                id: '7',
                earningId: 'EARN-1653721975-GHIJKL',
                source: 'usage',
                amount: 8.75,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 604800000).toISOString(),
                mcpId: '789',
                mcpName: 'Sentiment Analysis MCP'
              }
            ];
            
            setMcps(mockMcps);
            
            // Apply filter conditions
            let filteredEarnings = [...mockEarnings];
            
            if (filters.source !== 'all') {
              filteredEarnings = filteredEarnings.filter(earning => earning.source === filters.source);
            }
            
            if (filters.mcpId !== 'all') {
              filteredEarnings = filteredEarnings.filter(earning => earning.mcpId === filters.mcpId);
            }
            
            if (filters.startDate) {
              const startDate = new Date(filters.startDate);
              filteredEarnings = filteredEarnings.filter(earning => new Date(earning.timestamp) >= startDate);
            }
            
            if (filters.endDate) {
              const endDate = new Date(filters.endDate);
              filteredEarnings = filteredEarnings.filter(earning => new Date(earning.timestamp) <= endDate);
            }
            
            setEarnings(filteredEarnings);
            setTotalPages(Math.ceil(filteredEarnings.length / 10));
            setPageLoading(false);
          }, 1000);
        } catch (err) {
          console.error('Error fetching earnings data:', err);
          setError('Error fetching earnings data. Please try again later.');
          setPageLoading(false);
        }
      } else {
        setPageLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, user, filters]);
  
  // Redirect to login page if not logged in
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev: typeof filters) => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page
  };
  
  // Pagination handling
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const loadingContent = (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  const mainContent = (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href="/dashboard/earnings"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Earnings Dashboard
            </Link>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Earnings History</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View all your earnings from MCPs, including downloads, API usage, rewards, and referrals.
            </p>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4 mb-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Filter Earnings</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
            <select
              id="source"
              name="source"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.source}
              onChange={handleFilterChange}
            >
              <option value="all">All Sources</option>
              <option value="download">Downloads</option>
              <option value="usage">API Usage</option>
              <option value="reward">Rewards</option>
              <option value="referral">Referrals</option>
            </select>
          </div>
          <div>
            <label htmlFor="mcpId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">MCP</label>
            <select
              id="mcpId"
              name="mcpId"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.mcpId}
              onChange={handleFilterChange}
            >
              <option value="all">All MCPs</option>
              {mcps.map((mcp: {id: string, name: string}) => (
                <option key={mcp.id} value={mcp.id}>{mcp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>
      
      {/* Earnings List */}
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden">
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
              </div>
            </div>
          </div>
        )}
        
        {earnings.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Earning ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MCP</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                  {earnings.map((earning: Earning) => (
                    <tr key={earning.id} className="hover:bg-gray-50 dark:hover:bg-gray-650">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {earning.earningId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {earning.source === 'download' ? 'Download' : 
                        earning.source === 'usage' ? 'API Usage' :
                        earning.source === 'reward' ? 'Reward' : 'Referral'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <Link href={`/mcp/${earning.mcpId}`} className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                          {earning.mcpName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-medium text-green-600 dark:text-green-400">
                          +{earning.amount.toFixed(2)} {earning.currency}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(earning.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button 
                          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                          onClick={() => alert(`Details for ${earning.earningId}\nSource: ${earning.source}\nMCP: ${earning.mcpName}\nAmount: ${earning.amount} ${earning.currency}\nDate: ${new Date(earning.timestamp).toLocaleString()}\n${earning.details ? 'Additional Info: ' + earning.details : ''}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                      : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800'
                      : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{Math.min((currentPage - 1) * 10 + 1, earnings.length)}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * 10, earnings.length)}</span> of{' '}
                    <span className="font-medium">{earnings.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                        currentPage === 1
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-650'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === index + 1
                            ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650'
                        } text-sm font-medium`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${
                        currentPage === totalPages
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-650'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No earnings found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your filter criteria or clearing filters.
            </p>
          </div>
        )}
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