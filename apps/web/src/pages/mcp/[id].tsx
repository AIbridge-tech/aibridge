import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import McpDetail from '../../components/mcp/McpDetail';

// Mock MCP data (in a real app, this would come from an API)
const mockMcp = {
  id: 'mcp-1',
  name: 'Text Classification',
  description: 'A comprehensive protocol for text classification models that categorize text into predefined categories. This MCP standardizes input formats, output structures, and evaluation metrics to ensure compatibility across different implementations.\n\nText classification is a fundamental task in natural language processing with applications in sentiment analysis, topic categorization, intent detection, and content moderation.',
  version: '1.0.0',
  apiSchema: `{
  "name": "text-classification",
  "description": "A protocol for text classification models",
  "input": {
    "type": "object",
    "required": ["text"],
    "properties": {
      "text": {
        "type": "string",
        "description": "The text to classify"
      },
      "categories": {
        "type": "array",
        "description": "Optional list of categories to consider. If not provided, all categories are considered.",
        "items": {
          "type": "string"
        }
      }
    }
  },
  "output": {
    "type": "object",
    "required": ["category", "confidence"],
    "properties": {
      "category": {
        "type": "string",
        "description": "The predicted category"
      },
      "confidence": {
        "type": "number",
        "description": "Confidence score between 0 and 1"
      },
      "all_categories": {
        "type": "array",
        "description": "All categories with their confidence scores",
        "items": {
          "type": "object",
          "required": ["category", "score"],
          "properties": {
            "category": {
              "type": "string"
            },
            "score": {
              "type": "number"
            }
          }
        }
      }
    }
  }
}`,
  implementationCode: `/**
 * Text Classification MCP Implementation
 * @param {Object} context - The context object containing input, state, and configuration
 * @returns {Object} - The classification result
 */
function process(context) {
  // Extract the input
  const { text, categories } = context.input;
  
  // Simple validation
  if (!text || text.trim() === '') {
    throw new Error('Input text cannot be empty');
  }
  
  // In a real implementation, you would:
  // 1. Preprocess the text (tokenization, normalization, etc.)
  // 2. Apply your classification model
  // 3. Format the output according to the schema
  
  // This is a mock implementation for demonstration
  const mockClassify = (text, categories) => {
    // Predefined categories and their detection patterns
    const availableCategories = {
      'business': ['company', 'market', 'finance', 'economy'],
      'technology': ['computer', 'software', 'hardware', 'tech'],
      'sports': ['game', 'player', 'team', 'score'],
      'entertainment': ['movie', 'music', 'actor', 'show'],
      'health': ['doctor', 'patient', 'medical', 'health']
    };
    
    // Filter categories if specified
    const categoriesToConsider = categories && categories.length > 0
      ? Object.keys(availableCategories).filter(c => categories.includes(c))
      : Object.keys(availableCategories);
    
    // Calculate scores based on simple word matching
    const lowerText = text.toLowerCase();
    const scores = categoriesToConsider.map(category => {
      const keywords = availableCategories[category];
      const matches = keywords.filter(word => lowerText.includes(word)).length;
      const score = matches > 0 ? matches / keywords.length : 0;
      return { category, score: Math.min(score + Math.random() * 0.3, 1) };
    });
    
    // Sort by score
    scores.sort((a, b) => b.score - a.score);
    
    return {
      category: scores[0].category,
      confidence: scores[0].score,
      all_categories: scores
    };
  };
  
  // Return the classification result
  return mockClassify(text, categories);
}`,
  owner: {
    id: 'user-1',
    name: 'AI Research Lab'
  },
  category: 'Natural Language Processing',
  tags: ['NLP', 'Classification', 'Text Analysis', 'Machine Learning'],
  ratings: [
    {
      userId: 'user-2',
      userName: 'Vision Technologies',
      value: 5,
      comment: 'Excellent protocol design with clear documentation. Easy to implement and integrate with our existing systems.',
      createdAt: '2023-01-20T14:30:00Z'
    },
    {
      userId: 'user-3',
      userName: 'Language Labs',
      value: 4,
      comment: 'Works well for most use cases. Could use more detailed examples for edge cases.',
      createdAt: '2023-02-05T09:15:00Z'
    },
    {
      userId: 'user-4',
      userName: 'Data Insights Inc',
      value: 5,
      comment: 'The standardized format made it very easy to switch between different classification implementations.',
      createdAt: '2023-03-12T16:45:00Z'
    }
  ],
  downloads: 1245,
  createdAt: '2023-01-15T08:30:00Z',
  updatedAt: '2023-01-15T08:30:00Z',
  isPublic: true
};

export default function McpDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [mcp, setMcp] = useState<typeof mockMcp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMcp = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would be an API call
        // const response = await mcpAPI.getMcpById(id as string);
        // const mcpData = response.data;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, use mock data
        setMcp({
          ...mockMcp,
          id: id as string
        });
      } catch (err) {
        console.error('Error fetching MCP:', err);
        setError('Failed to load MCP. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMcp();
  }, [id]);

  const handleDownload = () => {
    // In a real implementation, this would trigger the API call
    // mcpAPI.downloadMcp(id as string).then(response => {
    //   // Handle download logic
    // });
    
    // For demo purposes, just show an alert
    alert(`Downloading MCP: ${id}`);
  };

  // Check if the current user is the owner of the MCP
  const isOwner = user && mcp?.owner?.id === user.id;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : mcp ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                  {mcp.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">v{mcp.version}</span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {mcp.category}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {mcp.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4 md:mt-0">
                {isOwner && (
                  <button
                    onClick={() => router.push(`/mcp/edit/${mcp.id}`)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                )}
                
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
            
            <McpDetail 
              {...mcp}
              onDownload={handleDownload}
            />
          </>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Not Found</h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>The requested MCP could not be found.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 