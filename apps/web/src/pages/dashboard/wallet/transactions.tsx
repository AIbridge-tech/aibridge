import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '../../../components/layout/MainLayout';
import { useAuth } from '../../../contexts/AuthContext';

interface Transaction {
  id: string;
  transactionId: string;
  type: 'deposit' | 'withdraw' | 'earning';
  amount: number;
  currency: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  sender: string;
  recipient: string;
  source?: string;
}

interface Filters {
  type: string;
  startDate: string;
  endDate: string;
}

export default function TransactionsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  // Mock transaction data
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  // Filter conditions
  const [filters, setFilters] = React.useState<Filters>({
    type: 'all',
    startDate: '',
    endDate: ''
  });

  // Load data
  React.useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && user) {
        try {
          setPageLoading(true);
          
          // Mock data loading
          setTimeout(() => {
            // Generate some mock transactions
            const mockTransactions: Transaction[] = [
              {
                id: '1',
                transactionId: 'TXN-1654321987-ABCDEF',
                type: 'deposit',
                amount: 500,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                status: 'completed',
                sender: 'System',
                recipient: user.name
              },
              {
                id: '2',
                transactionId: 'TXN-1654221985-BCDEFG',
                type: 'withdraw',
                amount: 200,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                status: 'completed',
                sender: user.name,
                recipient: 'External Wallet'
              },
              {
                id: '3',
                transactionId: 'TXN-1654121983-CDEFGH',
                type: 'earning',
                amount: 75.25,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 259200000).toISOString(),
                status: 'completed',
                sender: 'MCP Platform',
                recipient: user.name,
                source: 'Text Classification MCP Downloads'
              },
              {
                id: '4',
                transactionId: 'TXN-1654021981-DEFGHI',
                type: 'earning',
                amount: 45.50,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 345600000).toISOString(),
                status: 'completed',
                sender: 'MCP Platform',
                recipient: user.name,
                source: 'Image Generation MCP Usage'
              },
              {
                id: '5',
                transactionId: 'TXN-1653921979-EFGHIJ',
                type: 'withdraw',
                amount: 100,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 432000000).toISOString(),
                status: 'pending',
                sender: user.name,
                recipient: 'External Wallet'
              },
              {
                id: '6',
                transactionId: 'TXN-1653821977-FGHIJK',
                type: 'earning',
                amount: 30.75,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 518400000).toISOString(),
                status: 'completed',
                sender: 'MCP Platform',
                recipient: user.name,
                source: 'Text Classification MCP Usage'
              },
              {
                id: '7',
                transactionId: 'TXN-1653721975-GHIJKL',
                type: 'deposit',
                amount: 300,
                currency: 'AIB',
                timestamp: new Date(Date.now() - 604800000).toISOString(),
                status: 'completed',
                sender: 'External Wallet',
                recipient: user.name
              }
            ];
            
            // Apply filter conditions
            let filteredTransactions = [...mockTransactions];
            
            if (filters.type !== 'all') {
              filteredTransactions = filteredTransactions.filter(tx => tx.type === filters.type);
            }
            
            if (filters.startDate) {
              const startDate = new Date(filters.startDate);
              filteredTransactions = filteredTransactions.filter(tx => new Date(tx.timestamp) >= startDate);
            }
            
            if (filters.endDate) {
              const endDate = new Date(filters.endDate);
              filteredTransactions = filteredTransactions.filter(tx => new Date(tx.timestamp) <= endDate);
            }
            
            setTransactions(filteredTransactions);
            setTotalPages(Math.ceil(filteredTransactions.length / 10));
            setPageLoading(false);
          }, 1000);
        } catch (err) {
          console.error('Error fetching transaction data:', err);
          setError('Error fetching transaction data. Please try again later.');
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
    setFilters((prev: Filters) => ({
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
              href="/dashboard/wallet"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Wallet
            </Link>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View all your transactions, including deposits, withdrawals, and earnings.
            </p>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4 mb-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Filter Transactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Type</label>
            <select
              id="type"
              name="type"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdrawal</option>
              <option value="earning">Earning</option>
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
      
      {/* Transaction List */}
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
        
        {transactions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                  {transactions.map((tx: Transaction) => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-650">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {tx.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {tx.type === 'deposit' ? 'Deposit' : 
                        tx.type === 'withdraw' ? 'Withdrawal' :
                        tx.type === 'earning' ? 'Earning' : tx.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${
                          tx.type === 'withdraw' 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {tx.type === 'withdraw' ? '-' : '+'}{tx.amount.toFixed(2)} {tx.currency}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {tx.status === 'completed' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                            Completed
                          </span>
                        ) : tx.status === 'pending' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button 
                          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                          onClick={() => alert(`Details: ${tx.transactionId}\nSender: ${tx.sender}\nRecipient: ${tx.recipient}\n${tx.source ? 'Source: ' + tx.source : ''}`)}
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
                    Showing <span className="font-medium">{Math.min((currentPage - 1) * 10 + 1, transactions.length)}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * 10, transactions.length)}</span> of{' '}
                    <span className="font-medium">{transactions.length}</span> results
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
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions found</h3>
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