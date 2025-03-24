import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../../components/layout/MainLayout';
import ProtectedRoute from '../../../components/layout/ProtectedRoute';
import McpForm, { McpFormValues } from '../../../components/mcp/McpForm';
import { useAuth } from '../../../contexts/AuthContext';
import { mcpAPI } from '../../../services/api';

// Available categories for the form
const CATEGORIES = [
  'Natural Language Processing',
  'Computer Vision',
  'Audio Processing',
  'Data Science',
  'Personalization',
  'Reinforcement Learning',
  'Generative AI'
];

export default function EditMcpPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [initialValues, setInitialValues] = useState<Partial<McpFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch MCP data
  useEffect(() => {
    const fetchMcp = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation with API integration:
        // const response = await mcpAPI.getMcpById(id as string);
        // const mcpData = response.data;
        
        // Simulate API delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for now
        const mcpData = {
          name: 'Text Classification',
          description: 'A comprehensive protocol for text classification models.',
          version: '1.0.0',
          category: 'Natural Language Processing',
          tags: ['NLP', 'Classification', 'Text Analysis'],
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
      }
    }
  }
}`,
          implementationCode: `function process(context) {
  const { text } = context.input;
  // Implementation logic
  return { category: "example" };
}`,
          isPublic: true
        };
        
        setInitialValues(mcpData);
      } catch (err) {
        console.error('Error fetching MCP:', err);
        setError('Failed to load MCP. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMcp();
  }, [id]);

  const handleSubmit = async (values: McpFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real implementation with API integration:
      // await mcpAPI.updateMcp(id as string, values);
      
      // Simulate API delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, just log the values
      console.log('Updated MCP:', values);
      
      // Redirect to the MCP detail page
      router.push(`/mcp/${id}`);
    } catch (err) {
      console.error('Error updating MCP:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Edit MCP
            </h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              Update your Model Control Protocol.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900 p-4 rounded-md">
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
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <McpForm
              initialValues={initialValues}
              categories={CATEGORIES}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </ProtectedRoute>
    </MainLayout>
  );
} 