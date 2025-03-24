// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  bio?: string;
  website?: string;
  avatarUrl?: string;
  stats?: {
    mcpsCreated: number;
    totalDownloads: number;
    averageRating: number;
  };
}

// MCP related types
export interface Rating {
  userId: string;
  userName: string;
  value: number;
  comment: string;
  createdAt: string;
}

export interface MCP {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  owner: {
    id: string;
    name: string;
  };
  apiSchema: object;
  implementationCode: string;
  isPublic: boolean;
  ratings: Rating[];
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export interface McpVersion {
  id: string;
  mcpId: string;
  version: string;
  description: string;
  changeNotes: string;
  apiSchema: string;
  implementationCode: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface McpFormValues {
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  apiSchema: string;
  implementationCode: string;
  isPublic: boolean;
}

export interface McpVersionFormValues {
  version: string;
  description: string;
  changeNotes: string;
  apiSchema: string;
  implementationCode: string;
}

// Filters and Sorting
export interface McpFilters {
  categories: string[];
  tags: string[];
  onlyPublic: boolean;
}

export type McpSortOption = 'newest' | 'popular' | 'rating' | 'downloads';

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: {
    message: string;
    code?: string;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  inquiryType: string;
  message: string;
} 