'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchInterface from '../../components/content/SearchInterface';
import SearchResults from '../../components/content/SearchResults';
import { ContentSearch, SearchResult, SearchFilters, SearchIndexBuilder } from '../../lib/search';
import { contentLoader } from '../../lib/content-loader';

// Mock data for demonstration - in a real app, this would come from your content management system
const createMockSearchEngine = (): ContentSearch => {
  const builder = new SearchIndexBuilder();

  // Add sample topics
  const categories = contentLoader.getCategories();
  categories.forEach(category => {
    category.topics.forEach(topic => {
      builder.addTopic({
        id: `${category.slug}-${topic.slug}`,
        title: topic.title,
        content: `Comprehensive coverage of ${topic.title} including practical examples, interview questions, and real-world applications. This topic covers fundamental concepts, advanced techniques, and best practices for ${topic.category}.`,
        category: topic.category,
        difficulty: topic.difficulty,
        tags: topic.tags,
        slug: topic.slug
      });

      // Add sample questions for each topic
      for (let i = 1; i <= 5; i++) {
        builder.addQuestion({
          id: `${topic.slug}-q${i}`,
          question: `What are the key concepts in ${topic.title}? (Question ${i})`,
          answer: `Detailed answer covering the essential aspects of ${topic.title}. This includes theoretical foundations, practical implementation details, common pitfalls, and best practices. The answer provides comprehensive coverage suitable for senior-level interviews.`,
          category: topic.category,
          difficulty: topic.difficulty,
          tags: topic.tags
        });
      }

      // Add sample code examples
      for (let i = 1; i <= 3; i++) {
        builder.addExample({
          id: `${topic.slug}-ex${i}`,
          title: `${topic.title} - Example ${i}`,
          code: `// Example implementation for ${topic.title}\nconst example = () => {\n  // Implementation details\n  return 'result';\n};`,
          explanation: `This example demonstrates practical implementation of ${topic.title} concepts with real-world applications and best practices.`,
          category: topic.category,
          tags: topic.tags
        });
      }
    });
  });

  // Add additional comprehensive content
  const additionalTopics = [
    {
      id: 'microservices-architecture',
      title: 'Microservices Architecture Patterns',
      content: 'Comprehensive guide to microservices architecture including service decomposition, communication patterns, data management, and deployment strategies.',
      category: 'system-design',
      difficulty: 'advanced',
      tags: ['microservices', 'architecture', 'distributed-systems', 'scalability'],
      slug: 'microservices-architecture'
    },
    {
      id: 'database-optimization',
      title: 'Database Performance Optimization',
      content: 'Advanced database optimization techniques including indexing strategies, query optimization, connection pooling, and performance monitoring.',
      category: 'databases',
      difficulty: 'advanced',
      tags: ['database', 'optimization', 'performance', 'indexing'],
      slug: 'database-optimization'
    },
    {
      id: 'docker-containerization',
      title: 'Docker and Containerization',
      content: 'Complete guide to Docker containerization including image optimization, multi-stage builds, orchestration, and security best practices.',
      category: 'devops',
      difficulty: 'intermediate',
      tags: ['docker', 'containers', 'devops', 'deployment'],
      slug: 'docker-containerization'
    },
    {
      id: 'security-best-practices',
      title: 'Security Best Practices',
      content: 'Comprehensive security guide covering authentication, authorization, encryption, vulnerability assessment, and secure coding practices.',
      category: 'security-monitoring',
      difficulty: 'advanced',
      tags: ['security', 'authentication', 'encryption', 'best-practices'],
      slug: 'security-best-practices'
    }
  ];

  additionalTopics.forEach(topic => {
    builder.addTopic(topic);
  });

  return builder.build();
};

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchEngine] = useState(() => createMockSearchEngine());
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(searchEngine.getStats());

  const query = searchParams.get('q') || '';

  // Perform search when query or filters change
  useEffect(() => {
    if (query) {
      setIsLoading(true);
      try {
        const searchResults = searchEngine.search(query, filters, 50);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Show recent/popular content when no query
      const recentResults = searchEngine.search('', filters, 20);
      setResults(recentResults);
    }
  }, [query, filters, searchEngine]);

  const handleResultSelect = (result: any) => {
    // Navigate to the content based on type
    if (result.type === 'topic' && result.slug) {
      router.push(`/${result.category}/${result.slug}`);
    } else {
      // For questions and examples, you might want to navigate to a specific page
      // or show a modal with the content
      console.log('Selected result:', result);
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Node.js Interview Prep
          </h1>
          <p className="text-gray-600">
            Find topics, questions, examples, and flashcards across all backend engineering domains
          </p>
        </div>

        {/* Search Interface */}
        <div className="mb-8">
          <SearchInterface
            searchEngine={searchEngine}
            onResultSelect={handleResultSelect}
            showFilters={false}
            className="max-w-2xl"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              
              {/* Search Stats */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Content Statistics</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span className="font-medium">{stats.totalContent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Topics:</span>
                    <span className="font-medium">{stats.byType.topic || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-medium">{stats.byType.question || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Examples:</span>
                    <span className="font-medium">{stats.byType.example || 0}</span>
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <SearchFilters
                searchEngine={searchEngine}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {query ? `Search Results for "${query}"` : 'Browse Content'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {isLoading ? 'Searching...' : `${results.length} results found`}
                </p>
              </div>
            </div>

            {/* Search Results */}
            <SearchResults
              results={results}
              query={query}
              isLoading={isLoading}
              onResultClick={handleResultSelect}
              showStats={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}



// Filter Component (extracted for reuse)
interface SearchFiltersProps {
  searchEngine: ContentSearch;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

function SearchFilters({ searchEngine, filters, onFiltersChange }: SearchFiltersProps) {
  const categories = searchEngine.getCategories();
  const tags = searchEngine.getTags();
  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  const types = ['topic', 'question', 'example', 'flashcard'];

  const handleFilterToggle = (filterType: keyof SearchFilters, value: string) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFiltersChange({
      ...filters,
      [filterType]: newValues.length > 0 ? newValues : undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter && filter.length > 0);

  return (
    <div className="space-y-6">
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear all filters
        </button>
      )}

      {/* Content Type */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Content Type</h3>
        <div className="space-y-2">
          {types.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.types?.includes(type) || false}
                onChange={() => handleFilterToggle('types', type)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Difficulty</h3>
        <div className="space-y-2">
          {difficulties.map(difficulty => (
            <label key={difficulty} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.difficulties?.includes(difficulty) || false}
                onChange={() => handleFilterToggle('difficulties', difficulty)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700 capitalize">{difficulty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories?.includes(category) || false}
                onChange={() => handleFilterToggle('categories', category)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700 capitalize">
                {category.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}