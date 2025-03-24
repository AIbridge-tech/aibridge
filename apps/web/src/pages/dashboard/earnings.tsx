import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import { mcpAPI } from '../../services/api';

export default function EarningsDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('overview');
  const [pageLoading, setPageLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Mock data
  const [earnings, setEarnings] = React.useState({
    totalEarned: 0,
    monthlyEarnings: 0,
    sourceBreakdown: {
      download: 0,
      usage: 0,
      reward: 0,
      referral: 0
    },
    recentEarnings: []
  });
  
  // Load data
  React.useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && user) {
        try {
          setPageLoading(true);
          
          // In a real project, this should call an API to get data
          // const response = await mcpAPI.getEarningsOverview();
          // setEarnings(response.data);
          
          // Mock data
          setTimeout(() => {
            setEarnings({
              totalEarned: 1250.75,
              monthlyEarnings: 325.50,
              sourceBreakdown: {
                download: 725.25,
                usage: 375.50,
                reward: 100.00,
                referral: 50.00
              },
              recentEarnings: [
                {
                  id: '1',
                  amount: 25.50,
                  source: 'download',
                  mcpId: '123',
                  mcpName: 'Text Classification MCP',
                  timestamp: new Date(Date.now() - 86400000).toISOString()
                },
                {
                  id: '2',
                  amount: 12.75,
                  source: 'usage',
                  mcpId: '123',
                  mcpName: 'Text Classification MCP',
                  timestamp: new Date(Date.now() - 172800000).toISOString()
                },
                {
                  id: '3',
                  amount: 50.00,
                  source: 'download',
                  mcpId: '456',
                  mcpName: 'Image Generation MCP',
                  timestamp: new Date(Date.now() - 259200000).toISOString()
                }
              ]
            });
            setPageLoading(false);
          }, 1000);
        } catch (err) {
          console.error('Error fetching earnings data:', err);
          setError('Error fetching earnings data. Please try again later.');
          setPageLoading(false);
        }
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
  
  if (isLoading || pageLoading) {
    return (
      <MainLayout children={
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      } />
    );
  }
  
  // Earnings overview component
  const EarningsOverview = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Earnings Card */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-primary-100 dark:bg-primary-800 p-3">
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</h2>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{earnings.totalEarned.toFixed(2)} AIB</p>
              </div>
            </div>
          </div>
          
          {/* Monthly Earnings Card */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-green-100 dark:bg-green-800 p-3">
                <svg className="h-6 w-6 text-green-600 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Earnings</h2>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{earnings.monthlyEarnings.toFixed(2)} AIB</p>
              </div>
            </div>
          </div>
          
          {/* Download Earnings Card */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-blue-100 dark:bg-blue-800 p-3">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Download Earnings</h2>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{earnings.sourceBreakdown.download.toFixed(2)} AIB</p>
              </div>
            </div>
          </div>
          
          {/* Usage Earnings Card */}
          <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-purple-100 dark:bg-purple-800 p-3">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">API Usage Earnings</h2>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{earnings.sourceBreakdown.usage.toFixed(2)} AIB</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Earnings */}
        <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4 overflow-hidden">
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Recent Earnings</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">MCP</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                {earnings.recentEarnings.map((earning: any) => (
                  <tr key={earning.id}>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {earning.amount.toFixed(2)} AIB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(earning.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="py-2 flex justify-center">
            <Link
              href="/dashboard/earnings/history"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              View Full History
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  // Earnings history component
  const EarningsList = () => {
    return (
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4 overflow-hidden">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Earnings History</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          View your MCP earnings history. You can filter by date range, MCP, or earning type.
        </p>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Coming Soon</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Detailed earning history functionality is under development. Stay tuned.
          </p>
        </div>
      </div>
    );
  };
  
  // Payment settings component
  const PaymentSettings = () => {
    const [settings, setSettings] = React.useState({
      preferredCurrency: 'AIB',
      autoWithdraw: false,
      withdrawThreshold: 100
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      
      setSettings((prev: typeof settings) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert('Settings saved!');
    };
    
    return (
      <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Payment Settings</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="preferredCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Preferred Currency
              </label>
              <select
                id="preferredCurrency"
                name="preferredCurrency"
                value={settings.preferredCurrency}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="AIB">AIB Token</option>
                <option value="SOL">Solana (SOL)</option>
                <option value="USDC">USDC</option>
                <option value="ETH">Ethereum (ETH)</option>
              </select>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="autoWithdraw"
                  name="autoWithdraw"
                  type="checkbox"
                  checked={settings.autoWithdraw}
                  onChange={handleChange}
                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="autoWithdraw" className="font-medium text-gray-700 dark:text-gray-300">
                  Auto-withdraw
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  Automatically withdraw earnings when they reach the threshold
                </p>
              </div>
            </div>
            
            <div>
              <label htmlFor="withdrawThreshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Withdrawal Threshold (AIB)
              </label>
              <input
                type="number"
                name="withdrawThreshold"
                id="withdrawThreshold"
                value={settings.withdrawThreshold}
                onChange={handleChange}
                min="10"
                step="10"
                disabled={!settings.autoWithdraw}
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md disabled:opacity-50"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Must be at least 10 AIB
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <EarningsOverview />;
      case 'history':
        return <EarningsList />;
      case 'settings':
        return <PaymentSettings />;
      default:
        return <EarningsOverview />;
    }
  };
  
  return (
    <MainLayout children={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Sidebar */}
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
                  className="bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                >
                  <svg className="text-primary-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Earnings
                </Link>
                <Link 
                  href="/dashboard/wallet"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                >
                  <svg className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    Earnings Dashboard
                  </h2>
                  <div className="mt-2 flex">
                    <span className="text-sm text-green-500 dark:text-green-400 flex items-center">
                      <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      Earnings this month: +{earnings.monthlyEarnings.toFixed(2)} AIB
                    </span>
                  </div>
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
                    Earnings History
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`${
                      activeTab === 'settings'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm sm:px-6`}
                  >
                    Payment Settings
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