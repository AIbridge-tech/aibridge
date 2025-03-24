import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import McpList, { Mcp } from '../components/mcp/McpList';
import McpFilters, { McpFilters as FilterOptions, McpSortOption } from '../components/mcp/McpFilters';
import Button, { LinkButton } from '../components/ui/Button';

// Available categories for filtering
const CATEGORIES = [
  'All Categories',
  'Natural Language Processing',
  'Computer Vision', 
  'Audio Processing',
  'Data Science',
  'Personalization',
  'Reinforcement Learning',
  'Generative AI'
];

export default function MarketplacePage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [mcps, setMcps] = React.useState<Mcp[]>([]);
  const [filteredMcps, setFilteredMcps] = React.useState<Mcp[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [sortOption, setSortOption] = React.useState<McpSortOption>('newest');

  // Fetch MCPs on mount
  React.useEffect(() => {
    const fetchMcps = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/mcps');
        // const data = await response.json();
        // setMcps(data);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data for development
        const mockMcps: Mcp[] = [
          {
            id: 'mcp1',
            name: 'GPT-4 Text Completion',
            description: 'Advanced text generation using GPT-4 architecture with customizable parameters.',
            owner: { id: 'user1', name: 'AI Research Team' },
            rating: 4.8,
            downloads: 3540,
            tags: ['text-generation', 'gpt', 'language-model'],
            version: '1.2.0'
          },
          {
            id: 'mcp2',
            name: 'Image Classification API',
            description: 'Classify images into thousands of categories with high accuracy using state-of-the-art computer vision models.',
            owner: { id: 'user2', name: 'Vision Research' },
            rating: 4.6,
            downloads: 2340,
            tags: ['computer-vision', 'classification', 'images'],
            version: '2.0.1'
          },
          {
            id: 'mcp3',
            name: 'Sentiment Analysis Engine',
            description: 'Analyze sentiment in text with high accuracy, supporting multiple languages and domains.',
            owner: { id: 'user3', name: 'NLP Solutions' },
            rating: 4.3,
            downloads: 1850,
            tags: ['nlp', 'sentiment', 'text-analysis'],
            version: '3.1.2'
          },
          {
            id: 'mcp4',
            name: 'Voice Recognition System',
            description: 'Convert speech to text with high accuracy in multiple languages and accents.',
            owner: { id: 'user4', name: 'Audio AI Lab' },
            rating: 4.5,
            downloads: 1250,
            tags: ['audio', 'speech-to-text', 'voice'],
            version: '1.5.0'
          },
          {
            id: 'mcp5',
            name: 'Recommendation Engine',
            description: 'Personalized recommendation system for e-commerce, content platforms, and more.',
            owner: { id: 'user5', name: 'Personalization Inc.' },
            rating: 4.2,
            downloads: 980,
            tags: ['recommendation', 'personalization', 'machine-learning'],
            version: '2.3.0'
          },
          {
            id: 'mcp6',
            name: 'Data Cleaning Pipeline',
            description: 'Automated data cleaning and preprocessing for machine learning pipelines.',
            owner: { id: 'user6', name: 'Data Science Tools' },
            rating: 4.1,
            downloads: 2100,
            tags: ['data-science', 'preprocessing', 'data-pipeline'],
            version: '1.0.4'
          },
        ];
        
        setMcps(mockMcps);
        setFilteredMcps(mockMcps);
      } catch (error) {
        console.error('Error fetching MCPs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMcps();
  }, []);
  
  // Filter and sort MCPs whenever filters change
  React.useEffect(() => {
    let result = [...mcps];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(mcp => 
        mcp.name.toLowerCase().includes(query) || 
        mcp.description.toLowerCase().includes(query) ||
        mcp.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'All Categories') {
      // This is a simplification - in a real app, you would have proper category mapping
      const category = selectedCategory.toLowerCase();
      result = result.filter(mcp => 
        mcp.tags.some((tag: string) => tag.toLowerCase().includes(category))
      );
    }
    
    // Sort results
    switch (sortOption) {
      case 'popular':
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'downloads':
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'newest':
      default:
        // In a real app, you'd sort by creation date
        // Here we just use the mock data order
        break;
    }
    
    setFilteredMcps(result);
  }, [mcps, searchQuery, selectedCategory, sortOption]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterChange = (filters: FilterOptions) => {
    // Handle category changes
    if (filters.categories.length > 0) {
      setSelectedCategory(filters.categories[0]);
    } else {
      setSelectedCategory('');
    }
  };
  
  const handleSortChange = (sort: McpSortOption) => {
    setSortOption(sort);
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              MCP Marketplace
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
              Browse and discover Model Control Protocols created by the community
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <LinkButton href="/mcp/create" variant="primary" size="md">
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create MCP
            </LinkButton>
          </div>
        </div>
        
        <McpFilters
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
        
        <div className="mt-6">
          <McpList 
            mcps={filteredMcps} 
            isLoading={isLoading} 
            emptyMessage="No MCPs found matching your filters"
          />
        </div>
      </div>
    </MainLayout>
  );
} 