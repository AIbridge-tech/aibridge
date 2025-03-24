import React, { useState } from 'react';
import { XCircleIcon } from '@heroicons/react/solid';

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

interface McpFormProps {
  initialValues?: Partial<McpFormValues>;
  categories: string[];
  onSubmit: (values: McpFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

// Default values for a new MCP
const defaultValues: McpFormValues = {
  name: '',
  description: '',
  version: '1.0.0',
  category: '',
  tags: [],
  apiSchema: '',
  implementationCode: '',
  isPublic: true,
};

export default function McpForm({
  initialValues = {},
  categories = [],
  onSubmit,
  isSubmitting = false,
}: McpFormProps) {
  const [values, setValues] = useState<McpFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof McpFormValues, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof McpFormValues]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !values.tags.includes(newTag.trim())) {
      setValues(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValues(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof McpFormValues, string>> = {};

    if (!values.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!values.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!values.version.trim()) {
      newErrors.version = 'Version is required';
    } else if (!/^\d+\.\d+\.\d+$/.test(values.version)) {
      newErrors.version = 'Version must be in format x.y.z';
    }

    if (!values.category) {
      newErrors.category = 'Category is required';
    }

    if (!values.apiSchema.trim()) {
      newErrors.apiSchema = 'API Schema is required';
    }

    if (!values.implementationCode.trim()) {
      newErrors.implementationCode = 'Implementation code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Failed to submit MCP:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={values.name}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.name 
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500'
              } rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* Version */}
          <div>
            <label htmlFor="version" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Version *
            </label>
            <input
              type="text"
              name="version"
              id="version"
              value={values.version}
              onChange={handleChange}
              placeholder="1.0.0"
              className={`mt-1 block w-full border ${
                errors.version 
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500'
              } rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm`}
            />
            {errors.version && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.version}</p>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            value={values.description}
            onChange={handleChange}
            className={`mt-1 block w-full border ${
              errors.description 
                ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500'
            } rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm`}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <select
              name="category"
              id="category"
              value={values.category}
              onChange={handleChange}
              className={`mt-1 block w-full border ${
                errors.category 
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500'
              } rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.category}</p>
            )}
          </div>
          
          {/* Visibility */}
          <div className="flex items-center h-full pt-6">
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              checked={values.isPublic}
              onChange={(e) => setValues(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-700 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Make this MCP public
            </label>
          </div>
        </div>
        
        {/* Tags */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              name="newTag"
              id="newTag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white py-2 px-3"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm"
            >
              Add
            </button>
          </div>
          
          {values.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {values.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-primary-400 hover:text-primary-500 focus:outline-none focus:text-primary-500"
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* API Schema */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">API Schema *</h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Define the JSON schema for your Model Context Protocol (MCP).
        </p>
        
        <textarea
          name="apiSchema"
          id="apiSchema"
          rows={12}
          value={values.apiSchema}
          onChange={handleChange}
          className={`font-mono mt-1 block w-full border ${
            errors.apiSchema 
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500'
          } rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm`}
          placeholder='{
  "name": "example",
  "description": "Example MCP schema",
  "parameters": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "First parameter"
      }
    }
  }
}'
        />
        {errors.apiSchema && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.apiSchema}</p>
        )}
      </div>
      
      {/* Implementation Code */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Implementation Code *</h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Provide the reference implementation for your MCP.
        </p>
        
        <textarea
          name="implementationCode"
          id="implementationCode"
          rows={16}
          value={values.implementationCode}
          onChange={handleChange}
          className={`font-mono mt-1 block w-full border ${
            errors.implementationCode 
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-700 focus:ring-primary-500 focus:border-primary-500'
          } rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white sm:text-sm`}
          placeholder='/**
 * Example implementation
 * @param {Object} context - The context object
 * @returns {Object} - The result
 */
function process(context) {
  // Implementation logic here
  return {
    result: "Success"
  };
}'
        />
        {errors.implementationCode && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.implementationCode}</p>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save MCP'}
        </button>
      </div>
    </form>
  );
} 