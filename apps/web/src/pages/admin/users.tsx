import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// User data type
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'creator';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLoginAt: string;
  mcpCount: number;
  walletBalance: number;
}

type RoleStyleMap = {
  [key in 'user' | 'admin' | 'creator']: string;
};

type StatusStyleMap = {
  [key in 'active' | 'inactive' | 'suspended']: string;
};

const UserManagementPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState('createdAt');
  const [sortOrder, setSortOrder] = React.useState('desc');
  
  const toggleRoleFilter = (role: string) => {
    setRoleFilter((prev: string[]) => 
      prev.includes(role) 
        ? prev.filter((r: string) => r !== role) 
        : [...prev, role]
    );
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev: string[]) => 
      prev.includes(status) 
        ? prev.filter((s: string) => s !== status) 
        : [...prev, status]
    );
  };

  // Mock user data
  const users: User[] = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user',
      status: 'active',
      createdAt: '2023-01-15T08:30:00Z',
      lastLoginAt: '2023-03-10T14:22:00Z',
      mcpCount: 0,
      walletBalance: 0
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'creator',
      status: 'active',
      createdAt: '2023-02-03T11:45:00Z',
      lastLoginAt: '2023-03-09T16:30:00Z',
      mcpCount: 3,
      walletBalance: 250
    },
    {
      _id: '3',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      createdAt: '2022-12-01T09:00:00Z',
      lastLoginAt: '2023-03-11T10:15:00Z',
      mcpCount: 0,
      walletBalance: 0
    },
    {
      _id: '4',
      name: 'Suspended User',
      email: 'suspended@example.com',
      role: 'user',
      status: 'suspended',
      createdAt: '2023-01-20T13:20:00Z',
      lastLoginAt: '2023-02-15T11:30:00Z',
      mcpCount: 0,
      walletBalance: 0
    },
    {
      _id: '5',
      name: 'Inactive Creator',
      email: 'inactive@example.com',
      role: 'creator',
      status: 'inactive',
      createdAt: '2023-02-10T15:00:00Z',
      lastLoginAt: '2023-02-11T09:45:00Z',
      mcpCount: 1,
      walletBalance: 75
    }
  ];
  
  // Filter and sort user list
  const filteredUsers = users
    .filter(user => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Role filter
      const matchesRole = roleFilter.length === 0 || roleFilter.includes(user.role);
      
      // Status filter
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(user.status);
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof User];
      const bValue = b[sortBy as keyof User];
      
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
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Style mapping
  const roleStyleMap: Record<string, string> = {
    user: 'bg-gray-100 text-gray-800',
    creator: 'bg-blue-100 text-blue-800',
    admin: 'bg-purple-100 text-purple-800'
  };
  
  const statusStyleMap: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800'
  };
  
  // Handle status change
  const handleStatusChange = (userId: string, newStatus: string) => {
    // In a real application, this would call API to update user status
    alert(`Changing user ${userId} status to ${newStatus}`);
  };
  
  // Handle role change
  const handleRoleChange = (userId: string, newRole: string) => {
    // In a real application, this would call API to update user role
    alert(`Changing user ${userId} role to ${newRole}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
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
                Search Users
              </label>
              <input
                type="text"
                id="search"
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Role
              </label>
              <div className="flex flex-wrap gap-2">
                {['user', 'creator', 'admin'].map(role => (
                  <button
                    key={role}
                    className={`px-3 py-1 rounded-full text-sm ${
                      roleFilter.includes(role) 
                        ? roleStyleMap[role]
                        : 'bg-gray-200 text-gray-600'
                    }`}
                    onClick={() => toggleRoleFilter(role)}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['active', 'inactive', 'suspended'].map(status => (
                  <button
                    key={status}
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusFilter.includes(status) 
                        ? statusStyleMap[status]
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
                  <option value="email">Email</option>
                  <option value="role">Role</option>
                  <option value="status">Status</option>
                  <option value="createdAt">Created Date</option>
                  <option value="lastLoginAt">Last Login</option>
                  <option value="mcpCount">MCP Count</option>
                  <option value="walletBalance">Wallet Balance</option>
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
        
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-green-600">
              {users.filter(user => user.status === 'active').length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Creators</h3>
            <p className="text-3xl font-bold text-blue-600">
              {users.filter(user => user.role === 'creator').length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Admins</h3>
            <p className="text-3xl font-bold text-purple-600">
              {users.filter(user => user.role === 'admin').length}
            </p>
          </div>
        </div>
        
        {/* User List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MCPs
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleStyleMap[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyleMap[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastLoginAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {user.mcpCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${user.walletBalance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <Link href={`/admin/user/${user._id}`} className="text-blue-600 hover:text-blue-900">
                          View Details
                        </Link>
                        
                        {/* Role Management */}
                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900">
                            Change Role
                          </button>
                          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                              {user.role !== 'user' && (
                                <button
                                  onClick={() => handleRoleChange(user._id, 'user')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Set as User
                                </button>
                              )}
                              {user.role !== 'creator' && (
                                <button
                                  onClick={() => handleRoleChange(user._id, 'creator')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Set as Creator
                                </button>
                              )}
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleRoleChange(user._id, 'admin')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Set as Admin
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Management */}
                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900">
                            Change Status
                          </button>
                          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                              {user.status !== 'active' && (
                                <button
                                  onClick={() => handleStatusChange(user._id, 'active')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Set as Active
                                </button>
                              )}
                              {user.status !== 'suspended' && (
                                <button
                                  onClick={() => handleStatusChange(user._id, 'suspended')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Suspend User
                                </button>
                              )}
                              {user.status !== 'inactive' && (
                                <button
                                  onClick={() => handleStatusChange(user._id, 'inactive')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Set as Inactive
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No users found matching your search criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserManagementPage; 