import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Contributor {
  userId: string;
  role: 'owner' | 'collaborator' | 'maintainer';
  revenueShare: number;
  joinedAt: string;
  name: string;
  email: string;
}

interface McpContributorsProps {
  mcpId: string;
  initialContributors?: Contributor[];
  onSave?: (contributors: Contributor[]) => void;
}

export default function McpContributors({
  mcpId,
  initialContributors,
  onSave
}: McpContributorsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Contributors state
  const [contributors, setContributors] = useState<Contributor[]>(
    initialContributors || []
  );
  
  const [newContributor, setNewContributor] = useState<Partial<Contributor>>({
    role: 'collaborator',
    revenueShare: 10
  });

  // Effect to fetch data if needed
  useEffect(() => {
    if (!initialContributors) {
      fetchContributors();
    }
  }, [mcpId, initialContributors]);

  // Fetch MCP contributors
  const fetchContributors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock API call
      setTimeout(() => {
        // Simulate data from API
        const mockContributors: Contributor[] = [
          {
            userId: 'user-123',
            role: 'owner',
            revenueShare: 60,
            joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            name: 'John Doe',
            email: 'john@example.com'
          },
          {
            userId: 'user-456',
            role: 'collaborator',
            revenueShare: 25,
            joinedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          {
            userId: 'user-789',
            role: 'maintainer',
            revenueShare: 15,
            joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            name: 'Bob Johnson',
            email: 'bob@example.com'
          }
        ];
        
        setContributors(mockContributors);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching MCP contributors:', err);
      setError('Failed to load MCP contributors. Please try again later.');
      setLoading(false);
    }
  };

  // Update contributor
  const handleContributorChange = (index: number, field: keyof Contributor, value: any) => {
    const updatedContributors = [...contributors];
    
    if (field === 'revenueShare') {
      updatedContributors[index][field] = parseFloat(value) || 0;
    } else {
      updatedContributors[index][field] = value;
    }
    
    setContributors(updatedContributors);
  };

  // Handle new contributor input change
  const handleNewContributorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setNewContributor({
      ...newContributor,
      [name]: name === 'revenueShare' ? (parseFloat(value) || 0) : value
    });
  };

  // Add new contributor
  const handleAddContributor = () => {
    if (!newContributor.name || !newContributor.email) {
      setError('Please enter name and email for the new contributor.');
      return;
    }
    
    // Validate total share does not exceed 100%
    const totalShare = contributors.reduce((sum: number, contributor: Contributor) => sum + contributor.revenueShare, 0) + (newContributor.revenueShare || 0);
    
    if (totalShare > 100) {
      setError('Total revenue share cannot exceed 100%.');
      return;
    }
    
    setContributors([
      ...contributors,
      {
        userId: `user-${Date.now()}`, // This would be handled by the backend in a real app
        role: newContributor.role as 'owner' | 'collaborator' | 'maintainer',
        revenueShare: newContributor.revenueShare || 0,
        joinedAt: new Date().toISOString(),
        name: newContributor.name || '',
        email: newContributor.email || ''
      }
    ]);
    
    // Reset new contributor form
    setNewContributor({
      role: 'collaborator',
      revenueShare: 10
    });
    
    setError(null);
  };

  // Remove contributor
  const handleRemoveContributor = (index: number) => {
    // Cannot remove owner
    if (contributors[index].role === 'owner') {
      setError('Cannot remove the owner from contributors.');
      return;
    }
    
    const updatedContributors = [...contributors];
    updatedContributors.splice(index, 1);
    
    setContributors(updatedContributors);
  };

  // Save all contributors
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate total share equals 100%
      const totalShare = contributors.reduce((sum: number, contributor: Contributor) => sum + contributor.revenueShare, 0);
      
      if (totalShare !== 100) {
        setError(`Total revenue share must equal 100%. Current total: ${totalShare}%`);
        setLoading(false);
        return;
      }
      
      // In a real app, this would call an API endpoint
      setTimeout(() => {
        if (onSave) {
          onSave(contributors);
        }
        
        setSuccess('MCP contributors saved successfully!');
        setLoading(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }, 1500);
    } catch (err) {
      console.error('Error saving MCP contributors:', err);
      setError('Failed to save MCP contributors. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          MCP Contributors
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Manage your MCP contributors and revenue sharing.
        </p>
      </div>
      
      {error && (
        <div className="px-4 py-3 sm:px-6">
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
      
      {success && (
        <div className="px-4 py-3 sm:px-6">
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
            </div>
          </div>
        </div>
      )}
      
      <div className="px-4 py-5 sm:px-6">
        <div className="space-y-6">
          {/* Contributors Section */}
          <div>
            <h4 className="text-base font-medium text-gray-900 dark:text-white">Revenue Sharing</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Define how revenue is distributed among contributors. Total revenue share must equal 100%.
            </p>
            
            <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Revenue Share</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Joined</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-700">
                  {contributors.map((contributor: Contributor, index: number) => (
                    <tr key={contributor.userId}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            {contributor.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">{contributor.name}</div>
                            <div className="text-gray-500 dark:text-gray-400">{contributor.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <select
                          value={contributor.role}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleContributorChange(index, 'role', e.target.value)}
                          className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          disabled={contributor.role === 'owner'} // Cannot change owner role
                        >
                          <option value="owner">Owner</option>
                          <option value="collaborator">Collaborator</option>
                          <option value="maintainer">Maintainer</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={contributor.revenueShare}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleContributorChange(index, 'revenueShare', e.target.value)}
                            min="0"
                            max="100"
                            step="0.1"
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-20 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                          />
                          <span className="ml-2 text-gray-500 dark:text-gray-400">%</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(contributor.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          onClick={() => handleRemoveContributor(index)}
                          disabled={contributor.role === 'owner'} // Cannot remove owner
                          className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ${
                            contributor.role === 'owner' ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Total Share Display */}
            <div className="mt-2 flex justify-end">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Total Share: <span className={`font-medium ${
                  contributors.reduce((sum: number, c: Contributor) => sum + c.revenueShare, 0) === 100 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {contributors.reduce((sum: number, c: Contributor) => sum + c.revenueShare, 0)}%
                </span>
              </div>
            </div>
            
            {/* Add New Contributor Form */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Add New Contributor</h5>
              <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-12">
                <div className="sm:col-span-4">
                  <label htmlFor="contributor-name" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="contributor-name"
                      value={newContributor.name || ''}
                      onChange={handleNewContributorChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                      placeholder="Contributor name"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-4">
                  <label htmlFor="contributor-email" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="contributor-email"
                      value={newContributor.email || ''}
                      onChange={handleNewContributorChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="contributor-role" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="contributor-role"
                      name="role"
                      value={newContributor.role}
                      onChange={handleNewContributorChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                    >
                      <option value="collaborator">Collaborator</option>
                      <option value="maintainer">Maintainer</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="contributor-share" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Share (%)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="revenueShare"
                      id="contributor-share"
                      value={newContributor.revenueShare || ''}
                      onChange={handleNewContributorChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-12 mt-1">
                  <button
                    type="button"
                    onClick={handleAddContributor}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add Contributor
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="pt-5 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {loading ? 'Saving...' : 'Save Contributors'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 