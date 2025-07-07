'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ContentSearch, SearchResult, SearchFilters, SearchSuggestion } from '../../lib/search';
import { SearchableContent } from '../../lib/search';

interface SearchInterfaceProps {
  searchEngine: ContentSearch;
  onResultSelect?: (result: SearchableContent) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

export default function SearchInterface({
  searchEngine,
  onResultSelect,
  placeholder = "Search topics, questions, examples...",
  showFilters = true,
  className = ""
}: SearchInterfaceProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  const performSearch = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setIsLoading(true);
      
      try {
        const searchResults = searchEngine.search(searchQuery, searchFilters, 15);
        setResults(searchResults);
        setShowResults(searchQuery.length > 0);
        
        if (searchQuery.length >= 2) {
          const searchSuggestions = searchEngine.getSuggestions(searchQuery, 6);
          setSuggestions(searchSuggestions);
          setShowSuggestions(searchQuery.length > 0 && searchSuggestions.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, [searchEngine]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSelectedIndex(-1);
    performSearch(newQuery, filters);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    performSearch(query, newFilters);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults && !showSuggestions) return;

    const totalItems = (showSuggestions ? suggestions.length : 0) + (showResults ? results.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (showSuggestions && selectedIndex < suggestions.length) {
            const suggestion = suggestions[selectedIndex];
            setQuery(suggestion.text);
            performSearch(suggestion.text, filters);
          } else if (showResults) {
            const resultIndex = selectedIndex - (showSuggestions ? suggestions.length : 0);
            const result = results[resultIndex];
            if (result && onResultSelect) {
              onResultSelect(result.item);
            }
          }
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setShowResults(false);
        setSelectedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  // Handle result selection
  const handleResultClick = (result: SearchableContent) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setShowResults(false);
    setShowSuggestions(false);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    performSearch(suggestion.text, filters);
    setShowSuggestions(false);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get difficulty color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-blue-600 bg-blue-50';
      case 'advanced': return 'text-orange-600 bg-orange-50';
      case 'expert': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'topic': return '📚';
      case 'question': return '❓';
      case 'example': return '💻';
      case 'flashcard': return '🃏';
      default: return '📄';
    }
  };

  return (
    <div className={`relative ${className}`} ref={resultsRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length > 0) {
              setShowResults(results.length > 0);
              setShowSuggestions(suggestions.length > 0);
            }
          }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Search Filters */}
      {showFilters && (
        <SearchFilters
          searchEngine={searchEngine}
          filters={filters}
          onFiltersChange={handleFilterChange}
          className="mt-3"
        />
      )}

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="py-2">
            <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={`suggestion-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                  selectedIndex === index ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="text-sm text-gray-900">{suggestion.text}</span>
                  <span className="ml-2 text-xs text-gray-500 capitalize">
                    {suggestion.type}
                  </span>
                </div>
                {suggestion.count && (
                  <span className="text-xs text-gray-400">
                    {suggestion.count} items
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && results.length > 0 && (
        <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="py-2">
            <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Results ({results.length})
            </div>
            {results.map((result, index) => {
              const adjustedIndex = index + (showSuggestions ? suggestions.length : 0);
              return (
                <button
                  key={result.item.id}
                  onClick={() => handleResultClick(result.item)}
                  className={`w-full px-3 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                    selectedIndex === adjustedIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <span className="mr-2">{getTypeIcon(result.item.type)}</span>
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {result.item.title}
                        </h4>
                      </div>
                      {result.item.excerpt && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {result.item.excerpt}
                        </p>
                      )}
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs text-gray-500 capitalize">
                          {result.item.category}
                        </span>
                        {result.item.difficulty && (
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(result.item.difficulty)}`}>
                            {result.item.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    {result.score && (
                      <div className="ml-2 text-xs text-gray-400">
                        {Math.round((1 - result.score) * 100)}%
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && results.length === 0 && query.length > 0 && !isLoading && (
        <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-3 py-4 text-center text-gray-500">
            <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33" />
            </svg>
            <p className="text-sm">No results found for "{query}"</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Search Filters Component
interface SearchFiltersProps {
  searchEngine: ContentSearch;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

function SearchFilters({ searchEngine, filters, onFiltersChange, className = "" }: SearchFiltersProps) {
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
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Content Type Filter */}
      <div>
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Type</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {types.map(type => (
            <button
              key={type}
              onClick={() => handleFilterToggle('types', type)}
              className={`px-3 py-1 text-xs rounded-full border ${
                filters.types?.includes(type)
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div>
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Difficulty</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {difficulties.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => handleFilterToggle('difficulties', difficulty)}
              className={`px-3 py-1 text-xs rounded-full border capitalize ${
                filters.difficulties?.includes(difficulty)
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Category</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {categories.slice(0, 6).map(category => (
            <button
              key={category}
              onClick={() => handleFilterToggle('categories', category)}
              className={`px-3 py-1 text-xs rounded-full border ${
                filters.categories?.includes(category)
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}