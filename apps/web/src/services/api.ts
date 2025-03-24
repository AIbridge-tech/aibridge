import { storage, toQueryString } from '../utils/helpers';
import { ApiResponse, ApiError, LoginCredentials, SignupData, User, MCP, McpFormValues, McpVersion, McpVersionFormValues } from '../types';

// Extend Window interface
declare global {
  interface Window {
    ENV?: {
      API_URL?: string;
    };
  }
}

// Base API configuration
const API_BASE_URL = typeof window !== 'undefined' 
  ? (window.ENV?.API_URL || 'http://localhost:3001/api')
  : 'http://localhost:3001/api';

/**
 * Fetch API wrapper with error handling and authentication
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Set default headers
  const defaultHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
  const customHeaders: Record<string, string> = {};
  
  // Convert options.headers to our format if it exists
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        customHeaders[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      for (const [key, value] of options.headers) {
        customHeaders[key] = value;
      }
    } else {
      Object.assign(customHeaders, options.headers);
    }
  }
  
  // Merge headers
  const headers: Record<string, string> = { ...defaultHeaders, ...customHeaders };
  
  // Include auth token if available
  const token = storage.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = data;
      throw new Error(error.error?.message || 'An unknown error occurred');
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error');
  }
}

/**
 * Authentication API
 */
export const authAPI = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> {
    return fetchAPI<ApiResponse<{ token: string; user: User }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async signup(data: SignupData): Promise<ApiResponse<{ token: string; user: User }>> {
    return fetchAPI<ApiResponse<{ token: string; user: User }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return fetchAPI<ApiResponse<User>>('/auth/me');
  },

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return fetchAPI<ApiResponse<null>>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    return fetchAPI<ApiResponse<null>>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  logout(): void {
    storage.removeToken();
  },
};

/**
 * User API
 */
export const userAPI = {
  async getProfile(userId: string): Promise<ApiResponse<User>> {
    return fetchAPI<ApiResponse<User>>(`/users/${userId}`);
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return fetchAPI<ApiResponse<User>>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getUserMcps(userId: string): Promise<ApiResponse<MCP[]>> {
    return fetchAPI<ApiResponse<MCP[]>>(`/users/${userId}/mcps`);
  },
};

/**
 * MCP API
 */
export const mcpAPI = {
  async getAllMcps(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tags?: string[];
    sort?: string;
  }): Promise<ApiResponse<{ mcps: MCP[]; total: number }>> {
    const queryString = params ? `?${toQueryString(params)}` : '';
    return fetchAPI<ApiResponse<{ mcps: MCP[]; total: number }>>(`/mcps${queryString}`);
  },

  async getMcpById(id: string): Promise<ApiResponse<MCP>> {
    return fetchAPI<ApiResponse<MCP>>(`/mcps/${id}`);
  },

  async createMcp(data: McpFormValues): Promise<ApiResponse<MCP>> {
    return fetchAPI<ApiResponse<MCP>>('/mcps', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateMcp(id: string, data: Partial<McpFormValues>): Promise<ApiResponse<MCP>> {
    return fetchAPI<ApiResponse<MCP>>(`/mcps/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteMcp(id: string): Promise<ApiResponse<null>> {
    return fetchAPI<ApiResponse<null>>(`/mcps/${id}`, {
      method: 'DELETE',
    });
  },

  async rateMcp(id: string, rating: number, comment: string = ''): Promise<ApiResponse<MCP>> {
    return fetchAPI<ApiResponse<MCP>>(`/mcps/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  },

  async downloadMcp(id: string): Promise<ApiResponse<{ downloadUrl: string }>> {
    return fetchAPI<ApiResponse<{ downloadUrl: string }>>(`/mcps/${id}/download`, {
      method: 'POST',
    });
  },

  async searchMcps(query: string): Promise<ApiResponse<MCP[]>> {
    return fetchAPI<ApiResponse<MCP[]>>(`/mcps/search?q=${encodeURIComponent(query)}`);
  },

  // MCP Version methods
  async getAllVersions(mcpId: string): Promise<ApiResponse<McpVersion[]>> {
    return fetchAPI<ApiResponse<McpVersion[]>>(`/mcps/${mcpId}/versions`);
  },

  async getVersion(mcpId: string, version: string): Promise<ApiResponse<McpVersion>> {
    return fetchAPI<ApiResponse<McpVersion>>(`/mcps/${mcpId}/versions/${version}`);
  },

  async createVersion(mcpId: string, data: McpVersionFormValues): Promise<ApiResponse<McpVersion>> {
    return fetchAPI<ApiResponse<McpVersion>>(`/mcps/${mcpId}/versions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateVersion(mcpId: string, version: string, data: Partial<McpVersionFormValues>): Promise<ApiResponse<McpVersion>> {
    return fetchAPI<ApiResponse<McpVersion>>(`/mcps/${mcpId}/versions/${version}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteVersion(mcpId: string, version: string): Promise<ApiResponse<null>> {
    return fetchAPI<ApiResponse<null>>(`/mcps/${mcpId}/versions/${version}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Contact API
 */
export const contactAPI = {
  async sendContactForm(data: {
    name: string;
    email: string;
    message: string;
    company?: string;
    phone?: string;
    inquiryType: string;
  }): Promise<ApiResponse<null>> {
    return fetchAPI<ApiResponse<null>>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
}; 