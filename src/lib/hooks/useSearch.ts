'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ContentSearch, SearchResult, SearchFilters, SearchSuggestion, SearchIndexBuilder } from '../search';
import { contentLoader } from '../content-loader';

interface UseSearchOptions {
  debounceMs?: number;
  maxResults?: number;
  maxSuggestions?: number;
}

interface UseSearchReturn {
  searchEngine: ContentSearch;
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  suggestions: SearchSuggestion[];
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  isLoading: boolean;
  error: string | null;
  stats: {
    totalContent: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    byDifficulty: Record<string, number>;
  };
  search: (query: string, filters?: SearchFilters) => void;
  clearSearch: () => void;
}

/**
 * Custom hook for search functionality
 */
export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    debounceMs = 300,
    maxResults = 20,
    maxSuggestions = 8
  } = options;

  // Initialize search engine
  const searchEngine = useMemo(() => {
    return createSearchEngine();
  }, []);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => searchEngine.getStats(), [searchEngine]);

  // Debounced search function
  const performSearch = useCallback(
    debounce((searchQuery: string, searchFilters: SearchFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        const searchResults = searchEngine.search(searchQuery, searchFilters, maxResults);
        setResults(searchResults);

        if (searchQuery.length >= 2) {
          const searchSuggestions = searchEngine.getSuggestions(searchQuery, maxSuggestions);
          setSuggestions(searchSuggestions);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs),
    [searchEngine, maxResults, maxSuggestions, debounceMs]
  );

  // Search function
  const search = useCallback((searchQuery: string, searchFilters?: SearchFilters) => {
    const filtersToUse = searchFilters || filters;
    performSearch(searchQuery, filtersToUse);
  }, [performSearch, filters]);

  // Auto-search when query or filters change
  useEffect(() => {
    if (query || Object.keys(filters).length > 0) {
      search(query, filters);
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [query, filters, search]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setFilters({});
    setError(null);
  }, []);

  return {
    searchEngine,
    query,
    setQuery,
    results,
    suggestions,
    filters,
    setFilters,
    isLoading,
    error,
    stats,
    search,
    clearSearch
  };
}

/**
 * Hook for getting related content
 */
export function useRelatedContent(contentId: string, limit: number = 5) {
  const searchEngine = useMemo(() => createSearchEngine(), []);
  
  const relatedContent = useMemo(() => {
    if (!contentId) return [];
    return searchEngine.getRelatedContent(contentId, limit);
  }, [searchEngine, contentId, limit]);

  return relatedContent;
}

/**
 * Hook for search suggestions only
 */
export function useSearchSuggestions(query: string, limit: number = 8) {
  const searchEngine = useMemo(() => createSearchEngine(), []);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSuggestions = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = searchEngine.getSuggestions(searchQuery, limit);
        setSuggestions(results);
      } catch (error) {
        console.error('Suggestions error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 200),
    [searchEngine, limit]
  );

  useEffect(() => {
    getSuggestions(query);
  }, [query, getSuggestions]);

  return { suggestions, isLoading };
}

// Helper function to create search engine with mock data
function createSearchEngine(): ContentSearch {
  const builder = new SearchIndexBuilder();

  // Add content from content loader
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

      // Add sample questions
      for (let i = 1; i <= 5; i++) {
        builder.addQuestion({
          id: `${topic.slug}-q${i}`,
          question: `What are the key concepts in ${topic.title}? (Question ${i})`,
          answer: `Detailed answer covering the essential aspects of ${topic.title}. This includes theoretical foundations, practical implementation details, common pitfalls, and best practices.`,
          category: topic.category,
          difficulty: topic.difficulty,
          tags: topic.tags
        });
      }

      // Add sample examples
      for (let i = 1; i <= 3; i++) {
        builder.addExample({
          id: `${topic.slug}-ex${i}`,
          title: `${topic.title} - Example ${i}`,
          code: `// Example implementation for ${topic.title}\nconst example = () => {\n  // Implementation details\n  return 'result';\n};`,
          explanation: `This example demonstrates practical implementation of ${topic.title} concepts.`,
          category: topic.category,
          tags: topic.tags
        });
      }
    });
  });

  // Add comprehensive additional content
  const additionalContent = [
    {
      id: 'microservices-patterns',
      title: 'Microservices Architecture Patterns',
      content: 'Comprehensive guide to microservices patterns including service decomposition, API gateway, circuit breaker, and event sourcing patterns.',
      category: 'system-design',
      difficulty: 'advanced',
      tags: ['microservices', 'architecture', 'patterns', 'distributed-systems'],
      slug: 'microservices-patterns'
    },
    {
      id: 'database-sharding',
      title: 'Database Sharding Strategies',
      content: 'Advanced database sharding techniques including horizontal partitioning, shard key selection, and cross-shard queries.',
      category: 'databases',
      difficulty: 'expert',
      tags: ['database', 'sharding', 'scalability', 'partitioning'],
      slug: 'database-sharding'
    },
    {
      id: 'kubernetes-deployment',
      title: 'Kubernetes Deployment Strategies',
      content: 'Complete guide to Kubernetes deployment patterns including rolling updates, blue-green deployments, and canary releases.',
      category: 'devops',
      difficulty: 'advanced',
      tags: ['kubernetes', 'deployment', 'orchestration', 'containers'],
      slug: 'kubernetes-deployment'
    },
    {
      id: 'event-driven-architecture',
      title: 'Event-Driven Architecture',
      content: 'Comprehensive coverage of event-driven systems including event sourcing, CQRS, and message queues.',
      category: 'system-design',
      difficulty: 'advanced',
      tags: ['events', 'architecture', 'messaging', 'async'],
      slug: 'event-driven-architecture'
    },
    {
      id: 'security-oauth',
      title: 'OAuth 2.0 and JWT Security',
      content: 'Complete guide to OAuth 2.0 flows, JWT tokens, and security best practices for authentication and authorization.',
      category: 'security-monitoring',
      difficulty: 'intermediate',
      tags: ['oauth', 'jwt', 'security', 'authentication'],
      slug: 'security-oauth'
    }
  ];

  additionalContent.forEach(content => {
    builder.addTopic(content);
  });

  return builder.build();
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}