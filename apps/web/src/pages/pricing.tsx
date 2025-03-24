import React from 'react';
import Link from 'next/link';
import MainLayout from '../components/layout/MainLayout';

const PRICING_PLANS = [
  {
    name: 'Free',
    description: 'For hobbyists and individual developers',
    price: '$0',
    frequency: '/month',
    features: [
      'Access to public MCPs',
      '3 private MCPs',
      'Basic analytics',
      'Community support'
    ],
    cta: 'Start Free',
    ctaLink: '/signup',
    highlighted: false
  },
  {
    name: 'Pro',
    description: 'For professional developers and small teams',
    price: '$49',
    frequency: '/month',
    features: [
      'Everything in Free',
      'Unlimited private MCPs',
      'Advanced analytics',
      'Priority support',
      'API access with 100k requests/month',
      'Team collaboration (up to 5 users)'
    ],
    cta: 'Start Pro Trial',
    ctaLink: '/signup?plan=pro',
    highlighted: true
  },
  {
    name: 'Enterprise',
    description: 'For organizations with advanced needs',
    price: 'Custom',
    frequency: '',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom integrations',
      'Unlimited API requests',
      'SLA guarantees',
      'On-premise deployment option',
      'Unlimited team members'
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    highlighted: false
  }
];

const FREQUENTLY_ASKED_QUESTIONS = [
  {
    question: 'What is a Machine Control Protocol (MCP)?',
    answer: 'A Machine Control Protocol (MCP) is a standardized interface that defines how AI models interact with applications. It specifies the format for inputs and outputs, error handling, and other aspects of model integration.'
  },
  {
    question: 'Can I upgrade or downgrade my plan at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated amount for the remainder of your billing cycle. When downgrading, the changes will take effect at the start of your next billing cycle.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards including Visa, Mastercard, American Express, and Discover. For Enterprise plans, we also offer invoicing options.'
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes, we offer a 14-day free trial for our Pro plan. No credit card is required to start your trial.'
  },
  {
    question: 'What happens if I exceed my API request limit?',
    answer: 'If you exceed your monthly API request limit, additional requests will be charged at a pay-as-you-go rate. You can also upgrade to a higher plan to increase your included request limit.'
  }
];

export default function PricingPage() {
  return (
    <MainLayout>
      <div className="bg-gray-50 dark:bg-gray-900">
        {/* Pricing header */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Flexible Plans for Every Developer
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that best fits your needs. Start with our free tier and upgrade as you grow.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg overflow-hidden flex flex-col
                ${plan.highlighted 
                  ? 'border-2 border-primary-500 transform md:-translate-y-4 bg-white dark:bg-gray-800 ring-2 ring-primary-500 ring-opacity-50' 
                  : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
            >
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 h-12">{plan.description}</p>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-400">{plan.frequency}</span>
                </p>
              </div>
              
              <div className="flex-1 bg-gray-50 dark:bg-gray-900 px-6 py-8">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="px-6 py-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={plan.ctaLink}
                  className={`block w-full text-center px-4 py-3 rounded-md shadow text-sm font-medium sm:text-base
                    ${plan.highlighted
                      ? 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                      : 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature comparison */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Compare Plan Features
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Detailed breakdown of what's included in each plan
          </p>
        </div>
        
        <div className="mt-10 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Feature
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Free
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                  Pro
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Private MCPs</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">3</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white font-medium">Unlimited</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">API Requests</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">10k/month</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white font-medium">100k/month</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Team Members</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white font-medium">Up to 5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Support</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">Community</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white font-medium">Priority</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">Dedicated</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">SLA</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">—</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white font-medium">99.9% uptime</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">Custom</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ section */}
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              {FREQUENTLY_ASKED_QUESTIONS.map((faq) => (
                <div key={faq.question} className="space-y-2">
                  <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </dt>
                  <dd className="text-base text-gray-500 dark:text-gray-400">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-16 text-center">
            <p className="text-base text-gray-500 dark:text-gray-400">
              Have more questions? Contact our support team at{' '}
              <a href="mailto:support@aibridge.io" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                support@aibridge.io
              </a>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 