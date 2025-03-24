import React from 'react';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Standardize AI Integration</span>
              <span className="block text-primary-600 dark:text-primary-400">with Model Control Protocols</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto lg:mx-0 text-xl text-gray-500 dark:text-gray-300">
              AI Bridge simplifies the process of integrating AI models into your applications with standardized protocols and clear documentation.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/marketplace">
                <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:text-lg">
                  Explore MCPs
                </button>
              </Link>
              <Link href="/docs">
                <button className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800 md:text-lg">
                  Read Documentation
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute inset-y-0 right-0 hidden lg:block lg:w-1/2">
          <div className="relative h-full">
            <svg className="absolute right-0 h-full w-48 text-primary-50 dark:text-gray-900 transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Why Use AI Bridge?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Designed to make AI integration simple, standardized, and scalable
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Simplified Integration</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Common interfaces for diverse AI models reduce integration complexity and development time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Standardized Protocols</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Well-defined Model Control Protocols ensure consistent behavior across different AI implementations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-md flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Community-Driven</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                Share and reuse protocols created by the community, accelerating development across the ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How AI Bridge Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              A simple process to standardize your AI model integrations
            </p>
          </div>

          <div className="mt-16">
            <div className="relative">
              {/* Steps connector */}
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              
              {/* Steps */}
              <div className="relative flex justify-between">
                {/* Step 1 */}
                <div className="text-center">
                  <span className="relative flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary-600 text-white">1</span>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Create or Select MCP</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                    Define a Model Control Protocol or choose from existing ones in the marketplace.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="text-center">
                  <span className="relative flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary-600 text-white">2</span>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Implement Interface</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                    Add the MCP interface to your AI model or application following the standard.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="text-center">
                  <span className="relative flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary-600 text-white">3</span>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Integrate & Deploy</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                    Connect your application with various AI models seamlessly using the standard protocol.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 dark:bg-primary-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to simplify AI integration?</span>
            <span className="block text-primary-200">Start using AI Bridge today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/signup">
                <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50">
                  Get Started
                </button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/docs">
                <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 