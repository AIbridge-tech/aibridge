import React, { useState, ChangeEvent, FormEvent } from 'react';
import { McpVersionFormValues } from '../../types';

interface McpVersionFormProps {
  initialValues?: Partial<McpVersionFormValues>;
  onSubmit: (values: McpVersionFormValues) => void;
  isSubmitting: boolean;
  existingVersions?: string[];
}

export default function McpVersionForm({
  initialValues,
  onSubmit,
  isSubmitting,
  existingVersions = [],
}: McpVersionFormProps) {
  const defaultValues: McpVersionFormValues = {
    version: '',
    description: '',
    changeNotes: '',
    apiSchema: '',
    implementationCode: '',
  };

  const [formValues, setFormValues] = useState<McpVersionFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof McpVersionFormValues, string>>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name as keyof McpVersionFormValues]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof McpVersionFormValues, string>> = {};
    
    // Version validation
    if (!formValues.version) {
      newErrors.version = 'Version is required';
    } else if (!/^\d+\.\d+\.\d+$/.test(formValues.version)) {
      newErrors.version = 'Version must be in format x.y.z (e.g., 1.0.0)';
    } else if (
      existingVersions.includes(formValues.version) && 
      initialValues?.version !== formValues.version
    ) {
      newErrors.version = 'This version already exists';
    }
    
    // Description validation
    if (!formValues.description) {
      newErrors.description = 'Description is required';
    } else if (formValues.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    // API Schema validation
    if (!formValues.apiSchema) {
      newErrors.apiSchema = 'API Schema is required';
    } else {
      try {
        JSON.parse(formValues.apiSchema);
      } catch (e) {
        newErrors.apiSchema = 'API Schema must be valid JSON';
      }
    }
    
    // Implementation Code validation
    if (!formValues.implementationCode) {
      newErrors.implementationCode = 'Implementation Code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formValues);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label 
          htmlFor="version" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Version*
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="version"
            id="version"
            placeholder="1.0.0"
            className={`
              shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm 
              border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md
              ${errors.version ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            `}
            value={formValues.version}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.version && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.version}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Use semantic versioning (e.g., 1.0.0)
          </p>
        </div>
      </div>

      <div>
        <label 
          htmlFor="description" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description*
        </label>
        <div className="mt-1">
          <textarea
            name="description"
            id="description"
            rows={3}
            className={`
              shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm 
              border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md
              ${errors.description ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            `}
            placeholder="What does this version provide?"
            value={formValues.description}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
        </div>
      </div>

      <div>
        <label 
          htmlFor="changeNotes" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Change Notes
        </label>
        <div className="mt-1">
          <textarea
            name="changeNotes"
            id="changeNotes"
            rows={4}
            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            placeholder="What changed since the previous version?"
            value={formValues.changeNotes}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Describe what changed since the last version. Optional for first version.
          </p>
        </div>
      </div>

      <div>
        <label 
          htmlFor="apiSchema" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          API Schema*
        </label>
        <div className="mt-1">
          <textarea
            name="apiSchema"
            id="apiSchema"
            rows={8}
            className={`
              font-mono text-sm shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full 
              border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md
              ${errors.apiSchema ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            `}
            placeholder='{
  "endpoints": [
    {
      "name": "example",
      "method": "GET",
      "path": "/example",
      "response": { "type": "string" }
    }
  ]
}'
            value={formValues.apiSchema}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.apiSchema && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.apiSchema}</p>
          )}
        </div>
      </div>

      <div>
        <label 
          htmlFor="implementationCode" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Implementation Code*
        </label>
        <div className="mt-1">
          <textarea
            name="implementationCode"
            id="implementationCode"
            rows={12}
            className={`
              font-mono text-sm shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full 
              border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md
              ${errors.implementationCode ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            `}
            placeholder="// Your implementation code"
            value={formValues.implementationCode}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.implementationCode && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.implementationCode}</p>
          )}
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Version'}
          </button>
        </div>
      </div>
    </form>
  );
}