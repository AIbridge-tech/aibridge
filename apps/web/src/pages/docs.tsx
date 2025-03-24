import React, { useState } from 'react';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout';

// Documentation sections
const DOCS_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    subsections: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'installation', title: 'Installation' },
      { id: 'basic-usage', title: 'Basic Usage' },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    subsections: [
      { id: 'mcp-format', title: 'MCP Format' },
      { id: 'schemas', title: 'Schema Reference' },
      { id: 'authentication', title: 'Authentication' },
      { id: 'endpoints', title: 'API Endpoints' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    subsections: [
      { id: 'simple-mcp', title: 'Simple MCP Example' },
      { id: 'complex-mcp', title: 'Complex MCP Example' },
      { id: 'integration', title: 'Integration Examples' },
    ],
  },
  {
    id: 'guides',
    title: 'Guides',
    subsections: [
      { id: 'creating-mcp', title: 'Creating MCPs' },
      { id: 'versioning', title: 'MCP Versioning' },
      { id: 'best-practices', title: 'Best Practices' },
    ],
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Introduction to AI Bridge</h2>
            <p className="mb-4">
              AI Bridge provides a standardized way to connect AI models with applications through Machine Control Protocols (MCPs). 
              This documentation will help you understand how to create, use, and integrate MCPs into your projects.
            </p>
            <p className="mb-4">
              Machine Control Protocols (MCPs) define the interface between AI models and applications, 
              specifying how data should be formatted, what operations are available, and how to handle errors.
            </p>
            <h3 className="text-xl font-semibold mb-2 mt-6">Key Concepts</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Protocol Definition</strong>: Describes the interface that models must implement</li>
              <li><strong>Schema</strong>: Defines the data structures used by the protocol</li>
              <li><strong>Implementation</strong>: Code that actually implements the protocol interface</li>
              <li><strong>Version Control</strong>: Manages compatibility between different implementations</li>
            </ul>
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">Why Use AI Bridge?</h4>
              <p className="text-blue-700 dark:text-blue-300">
                AI Bridge allows developers to create standardized, reusable AI components that can be easily 
                shared and integrated into various applications. This reduces development time and ensures 
                compatibility between different AI systems.
              </p>
            </div>
          </div>
        );
      case 'installation':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Installation</h2>
            <p className="mb-4">
              You can install the AI Bridge SDK using npm or yarn:
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-md mb-6 overflow-x-auto">
              <pre>npm install @ai-bridge/sdk</pre>
            </div>
            <p className="mb-4">
              Or using yarn:
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-md mb-6 overflow-x-auto">
              <pre>yarn add @ai-bridge/sdk</pre>
            </div>
            <h3 className="text-xl font-semibold mb-2 mt-6">Requirements</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Node.js 14.x or later</li>
              <li>TypeScript 4.x (recommended for type safety)</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2 mt-6">Quick Setup</h3>
            <p className="mb-4">
              After installation, you can import and configure the SDK:
            </p>
            <div className="bg-gray-800 text-white p-4 rounded-md mb-6 overflow-x-auto">
              <pre>{`import { AIBridge } from '@ai-bridge/sdk';

// Initialize with your API key
const bridge = new AIBridge({
  apiKey: 'your-api-key',
  environment: 'production' // or 'development'
});`}</pre>
            </div>
          </div>
        );
      // Add more cases for other sections...
      default:
        return (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">
              Select a topic from the sidebar to view documentation.
            </p>
          </div>
        );
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <nav className="sticky top-6 space-y-6">
              {DOCS_SECTIONS.map((section) => (
                <div key={section.id} className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-2">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.subsections.map((subsection) => (
                      <li key={subsection.id}>
                        <a
                          href={`#${subsection.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveSection(subsection.id);
                          }}
                          className={`text-sm ${
                            activeSection === subsection.id
                              ? 'text-primary-600 dark:text-primary-400 font-medium'
                              : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                          }`}
                        >
                          {subsection.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Mobile dropdown */}
          <div className="lg:hidden mb-6">
            <label htmlFor="docs-section" className="sr-only">
              Select documentation section
            </label>
            <select
              id="docs-section"
              onChange={(e) => setActiveSection(e.target.value)}
              value={activeSection}
              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              {DOCS_SECTIONS.flatMap((section) =>
                section.subsections.map((subsection) => (
                  <option key={subsection.id} value={subsection.id}>
                    {section.title} - {subsection.title}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
            <div className="prose prose-blue max-w-none dark:prose-dark">
              {renderContent()}
            </div>

            {/* Navigation buttons */}
            <div className="mt-10 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => {
                  // Find previous section logic
                  const allSubsections = DOCS_SECTIONS.flatMap((s) => s.subsections);
                  const currentIndex = allSubsections.findIndex((s) => s.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(allSubsections[currentIndex - 1].id);
                  }
                }}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                disabled={activeSection === DOCS_SECTIONS[0].subsections[0].id}
              >
                <span aria-hidden="true">&larr;</span> Previous
              </button>
              <button
                onClick={() => {
                  // Find next section logic
                  const allSubsections = DOCS_SECTIONS.flatMap((s) => s.subsections);
                  const currentIndex = allSubsections.findIndex((s) => s.id === activeSection);
                  if (currentIndex < allSubsections.length - 1) {
                    setActiveSection(allSubsections[currentIndex + 1].id);
                  }
                }}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 ml-3"
                disabled={activeSection === DOCS_SECTIONS[DOCS_SECTIONS.length - 1].subsections[DOCS_SECTIONS[DOCS_SECTIONS.length - 1].subsections.length - 1].id}
              >
                Next <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 