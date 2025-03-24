import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Simulated MCP data type
interface MCP {
  _id: string;
  name: string;
  description: string;
  owner: string;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  category: string;
  createdAt: string;
  updatedAt: string;
  downloads: number;
  rating: number;
}

type StatusStyleMap = {
  [key in 'pending' | 'approved' | 'rejected' | 'inactive']: string;
};

const MCPManagementPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState('updatedAt');
  const [sortOrder, setSortOrder] = React.useState('desc');
  
  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev: string[]) => 
      prev.includes(status) 
        ? prev.filter((s: string) => s !== status) 
        : [...prev, status]
    );
  };

  const toggleCategoryFilter = (category: string) => {
    setCategoryFilter((prev: string[]) => 
      prev.includes(category) 
        ? prev.filter((c: string) => c !== category) 
        : [...prev, category]
    );
  };

  // Simulated data
  const mcps: MCP[] = [
    {
      _id: '1',
      name: 'Image Generator',
      description: 'Generate images from text descriptions',
      owner: 'creator1@example.com',
      status: 'approved',
      category: 'Image Generation',
      createdAt: '2023-02-15T08:30:00Z',
      updatedAt: '2023-03-10T14:22:00Z',
      downloads: 1250,
      rating: 4.7
    },
    {
      _id: '2',
      name: 'Text Summarizer',
      description: 'Summarize long texts automatically',
      owner: 'creator2@example.com',
      status: 'approved',
      category: 'Text Processing',
      createdAt: '2023-01-20T11:45:00Z',
      updatedAt: '2023-03-05T10:30:00Z',
      downloads: 980,
      rating: 4.5
    },
    {
      _id: '3',
      name: 'Code Helper',
      description: 'Assists with code generation and debugging',
      owner: 'creator3@example.com',
      status: 'pending',
      category: 'Development',
      createdAt: '2023-03-01T09:15:00Z',
      updatedAt: '2023-03-01T09:15:00Z',
      downloads: 0,
      rating: 0
    },
    {
      _id: '4',
      name: 'Audio Transcriber',
      description: 'Converts audio to text with high accuracy',
      owner: 'creator2@example.com',
      status: 'approved',
      category: 'Audio Processing',
      createdAt: '2023-02-10T15:20:00Z',
      updatedAt: '2023-03-12T08:45:00Z',
      downloads: 750,
      rating: 4.2
    },
    {
      _id: '5',
      name: 'Data Visualizer',
      description: 'Creates visual representations of complex data',
      owner: 'creator4@example.com',
      status: 'rejected',
      category: 'Data Analysis',
      createdAt: '2023-02-22T13:10:00Z',
      updatedAt: '2023-02-25T11:30:00Z',
      downloads: 0,
      rating: 0
    },
    {
      _id: '6',
      name: 'Translation API',
      description: 'Translates text between multiple languages',
      owner: 'creator1@example.com',
      status: 'inactive',
      category: 'Text Processing',
      createdAt: '2023-01-05T10:00:00Z',
      updatedAt: '2023-03-08T16:15:00Z',
      downloads: 1500,
      rating: 3.8
    }
  ];
  
  // Filter and sort MCP list
  const filteredMCPs = mcps
    .filter(mcp => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        mcp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mcp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mcp.owner.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(mcp.status);
      
      // Category filter
      const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(mcp.category);
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof MCP];
      const bValue = b[sortBy as keyof MCP];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  
  // Category list - fix Set type issue
  const categories = Array.from(
    mcps.reduce((acc: string[], mcp) => {
      if (!acc.includes(mcp.category)) {
        acc.push(mcp.category);
      }
      return acc;
    }, [])
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Status style mapping
  const statusStyles: StatusStyleMap = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    inactive: 'bg-gray-100 text-gray-800'
  };
  
  // Handle status change
  const handleStatusChange = (mcpId: string, newStatus: string) => {
    // In a real application, this would call API to update MCP status
    alert(`Changing MCP ${mcpId} status to ${newStatus}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">MCP Management</h1>
            <button 
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search MCPs
              </label>
              <input
                type="text"
                id="search"
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, description or owner..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(['pending', 'approved', 'rejected', 'inactive'] as const).map(status => (
                  <button
                    key={status}
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusFilter.includes(status) 
                        ? statusStyles[status]
                        : 'bg-gray-200 text-gray-600'
                    }`}
                    onClick={() => toggleStatusFilter(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-sm ${
                      categoryFilter.includes(category) 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                    onClick={() => toggleCategoryFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <div className="flex">
                <select
                  id="sort"
                  className="flex-grow border border-gray-300 rounded-l-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="owner">Owner</option>
                  <option value="status">Status</option>
                  <option value="category">Category</option>
                  <option value="createdAt">Created Date</option>
                  <option value="updatedAt">Updated Date</option>
                  <option value="downloads">Downloads</option>
                  <option value="rating">Rating</option>
                </select>
                <button
                  className="px-4 py-2 bg-gray-200 rounded-r-md hover:bg-gray-300"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* MCP Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-700">Total MCPs</h3>
            <p className="text-3xl font-bold">{mcps.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
            <p className="text-3xl font-bold">{mcps.filter(m => m.status === 'approved').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <p className="text-3xl font-bold">{mcps.filter(m => m.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-700">Total Downloads</h3>
            <p className="text-3xl font-bold">{mcps.reduce((sum, mcp) => sum + mcp.downloads, 0)}</p>
          </div>
        </div>
        
        {/* MCP List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMCPs.map(mcp => (
                  <tr key={mcp._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{mcp.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{mcp.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mcp.owner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[mcp.status]}`}>
                        {mcp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{mcp.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(mcp.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(mcp.updatedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mcp.downloads.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mcp.rating > 0 ? mcp.rating.toFixed(1) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <Link href={`/admin/mcp/${mcp._id}`} className="text-blue-600 hover:text-blue-900">
                          View Details
                        </Link>
                        
                        <select
                          className="text-xs border border-gray-300 rounded p-1"
                          value={mcp.status}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(mcp._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredMCPs.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No MCPs found matching your search criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MCPManagementPage; 