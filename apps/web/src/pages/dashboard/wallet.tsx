import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function WalletPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('overview');
  const [pageLoading, setPageLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Mock wallet data
  const [wallet, setWallet] = React.useState({
    connected: false,
    address: '',
    balance: 0,
    transactions: []
  });

  // Load data
  React.useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && user) {
        try {
          setPageLoading(true);
          
          // Mock data loading
          setTimeout(() => {
            setWallet({
              connected: !!user.walletAddress,
              address: user.walletAddress || '',
              balance: 2513.75,
              transactions: [
                {
                  id: '1',
                  type: 'deposit',
                  amount: 500,
                  timestamp: new Date(Date.now() - 86400000).toISOString(),
                  status: 'completed'
                },
                {
                  id: '2',
                  type: 'withdraw',
                  amount: 200,
                  timestamp: new Date(Date.now() - 172800000).toISOString(),
                  status: 'completed'
                },
                {
                  id: '3',
                  type: 'earning',
                  amount: 75.25,
                  timestamp: new Date(Date.now() - 259200000).toISOString(),
                  status: 'completed',
                  source: 'MCP Downloads'
                }
              ]
            });
            setPageLoading(false);
          }, 1000);
        } catch (err) {
          console.error('Error fetching wallet data:', err);
          setError('Error fetching wallet data. Please try again later.');
          setPageLoading(false);
        }
      } else {
        setPageLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, user]);
  
  // Redirect to login page if not logged in
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      // In a real project, this would call a wallet connection API
      // Simulate connection process
      setError(null);
      setPageLoading(true);
      
      setTimeout(() => {
        setWallet({
          ...wallet,
          connected: true,
          address: '0x' + Math.random().toString(16).slice(2, 12) + '...'
        });
        setPageLoading(false);
      }, 1500);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Error connecting wallet. Please try again later.');
      setPageLoading(false);
    }
  };
  
  // Handle withdrawal
  const handleWithdraw = async () => {
    try {
      // Show withdrawal form in a modal
      const amount = window.prompt("Enter amount to withdraw (Maximum: " + wallet.balance + " AIB):");
      
      if (!amount) {
        return; // User cancelled
      }
      
      const parsedAmount = parseFloat(amount);
      
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError("Please enter a valid amount greater than 0.");
        return;
      }
      
      if (parsedAmount > wallet.balance) {
        setError("Insufficient balance. Maximum withdrawal amount is " + wallet.balance + " AIB.");
        return;
      }
      
      // In a real project, this would call a withdrawal API
      setPageLoading(true);
      setError(null);
      
      // Simulate API call
      setTimeout(() => {
        // Update wallet balance
        setWallet({
          ...wallet,
          balance: wallet.balance - parsedAmount,
          transactions: [
            {
              id: Date.now().toString(),
              type: 'withdraw',
              amount: parsedAmount,
              timestamp: new Date().toISOString(),
              status: 'pending'
            },
            ...wallet.transactions
          ]
        });
        
        setPageLoading(false);
        alert("Withdrawal request submitted successfully. Your transaction is now pending.");
      }, 1500);
    } catch (err) {
      console.error('Error processing withdrawal:', err);
      setError('Error processing withdrawal. Please try again later.');
      setPageLoading(false);
    }
  };
  
  if (isLoading || pageLoading) {
    return (
      <MainLayout children={
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      } />
    );
  }
  
  // Wallet overview component
  const WalletOverview = () => {
    return (
      <div>
        {!wallet.connected ? (
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Connect Your Wallet</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              After connecting your wallet, you can receive MCP earnings and make withdrawals.
            </p>
            <div className="mt-6">
              <button
                onClick={handleConnectWallet}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Balance Card */}
              <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Available Balance</h3>
                  <svg className="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{wallet.balance.toFixed(2)} AIB</p>
                <div className="mt-4">
                  <button
                    onClick={handleWithdraw}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
              
              {/* Wallet Info Card */}
              <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Wallet Information</h3>
                  <svg className="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Wallet Address</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{wallet.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      Connected
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Wallet Type</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Phantom</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {wallet.transactions.map((tx: any) => (
                      <tr key={tx.id}>
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
                            {tx.type === 'withdraw' ? '-' : '+'}{tx.amount.toFixed(2)} AIB
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {wallet.transactions.length > 0 ? (
                <div className="py-2 flex justify-center">
                  <Link 
                    href="/dashboard/wallet/transactions"
                    className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    View All Transactions
                  </Link>
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No transaction records yet
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Transaction history component
  const TransactionHistory = () => {
    return (
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Transaction History</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          View all your transaction records, including deposits, withdrawals, and earnings.
        </p>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Coming Soon</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Detailed transaction history feature is under development. Stay tuned.
          </p>
        </div>
      </div>
    );
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <WalletOverview />;
      case 'history':
        return <TransactionHistory />;
      default:
        return <WalletOverview />;
    }
  };
  
  return (
    <MainLayout children={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Sidebar - In a real project, this should be a shared component */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-8">
              <nav className="space-y-1">
                <Link 
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                >
                  <svg className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/mcps"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                >
                  <svg className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  My MCPs
                </Link>
                <Link 
                  href="/dashboard/earnings"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                >
                  <svg className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Earnings
                </Link>
                <Link 
                  href="/dashboard/wallet"
                  className="bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                >
                  <svg className="text-primary-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Wallet
                </Link>
                <Link 
                  href="/dashboard/settings"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                >
                  <svg className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <main className="flex-1">
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                <div className="flex flex-wrap items-center justify-between">
                  <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Wallet Management
                  </h2>
                  {wallet.connected && (
                    <div className="mt-2 flex">
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                        Wallet Connected
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`${
                      activeTab === 'overview'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:px-6`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`${
                      activeTab === 'history'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:px-6`}
                  >
                    Transaction History
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
              
              {/* Tab content */}
              <div className="px-4 py-5 sm:px-6">
                {renderTabContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
    } />
  );
} 