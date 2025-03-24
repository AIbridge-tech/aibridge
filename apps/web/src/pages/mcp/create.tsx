import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import McpForm, { McpFormValues } from '../../components/mcp/McpForm';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

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

export default function CreateMcpPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (values: McpFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real implementation, you would send the data to your API
      // const response = await fetch('/api/mcps', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...values,
      //     owner: {
      //       id: user?.id,
      //       name: user?.name
      //     }
      //   }),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to create MCP');
      // }
      
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, just log the values
      console.log('Submitted MCP:', {
        ...values,
        owner: {
          id: user?.id,
          name: user?.name
        }
      });
      
      // Redirect to the dashboard page
      router.push('/dashboard');
    } catch (err) {
      console.error('Error creating MCP:', err);
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
              Create New MCP
            </h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              Define a new Model Control Protocol to standardize AI model interactions.
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
          
          <McpForm
            categories={CATEGORIES}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </ProtectedRoute>
    </MainLayout>
  );
} 