import React from 'react';
import { SearchIcon, AdjustmentsIcon } from '@heroicons/react/outline';

interface McpFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: McpFilters) => void;
  onSortChange: (sort: McpSortOption) => void;
  categories?: string[];
  selectedCategory?: string;
}

export interface McpFilters {
  categories: string[];
  tags: string[];
  onlyPublic: boolean;
}

export type McpSortOption = 'newest' | 'popular' | 'rating' | 'downloads';

export default function McpFilters({
  onSearch,
  onFilterChange,
  onSortChange,
  categories = [],
  selectedCategory = '',
}: McpFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    selectedCategory ? [selectedCategory] : []
  );
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [sortOption, setSortOption] = React.useState<McpSortOption>('newest');
  const [onlyPublic, setOnlyPublic] = React.useState(true);

  // Initialize with selected category if provided
  React.useEffect(() => {
    if (selectedCategory && !selectedCategories.includes(selectedCategory)) {
      setSelectedCategories([...selectedCategories, selectedCategory]);
      onFilterChange({
        categories: [...selectedCategories, selectedCategory],
        tags: selectedTags,
        onlyPublic,
      });
    }
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryChange = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c: string) => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedCategories);
    onFilterChange({
      categories: updatedCategories,
      tags: selectedTags,
      onlyPublic,
    });
  };

  const handleTagChange = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t: string) => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(updatedTags);
    onFilterChange({
      categories: selectedCategories,
      tags: updatedTags,
      onlyPublic,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as McpSortOption;
    setSortOption(value);
    onSortChange(value);
  };

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setOnlyPublic(value);
    onFilterChange({
      categories: selectedCategories,
      tags: selectedTags,
      onlyPublic: value,
    });
  };

  const commonTags = [
    'AI', 'NLP', 'Computer Vision', 'Integration',
    'Database', 'Analytics', 'Automation', 'Speech'
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search MCPs..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Sort */}
        <div className="flex items-center space-x-4">
          <label htmlFor="sort" className="text-sm text-gray-700 dark:text-gray-300">
            Sort by:
          </label>
          <select
            id="sort"
            className="block w-48 py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="downloads">Most Downloads</option>
          </select>

          {/* Filter Toggle */}
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <AdjustmentsIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isFiltersOpen && (
        <div className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      name={`category-${category}`}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {commonTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                      ${
                        selectedTags.includes(tag)
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    onClick={() => handleTagChange(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Visibility</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="only-public"
                    name="only-public"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={onlyPublic}
                    onChange={handleVisibilityChange}
                  />
                  <label
                    htmlFor="only-public"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Show only public MCPs
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 