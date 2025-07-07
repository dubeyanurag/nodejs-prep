'use client';

import React from 'react';
import Link from 'next/link';
import { SearchResult, SearchableContent } from '../../lib/search';

interface SearchResultsProps {
  results: SearchResult[];
  query?: string;
  isLoading?: boolean;
  onResultClick?: (result: SearchableContent) => void;
  showStats?: boolean;
  className?: string;
}

export default function SearchResults({
  results,
  query = '',
  isLoading = false,
  onResultClick,
  showStats = true,
  className = ''
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, index) => (
          <SearchResultSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600 mb-4">
          We couldn't find any content matching "{query}".
        </p>
        <div className="text-sm text-gray-500">
          <p>Try:</p>
          <ul className="mt-2 space-y-1">
            <li>• Using different keywords</li>
            <li>• Checking your spelling</li>
            <li>• Using more general terms</li>
            <li>• Browsing categories instead</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {showStats && results.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {query ? `Found ${results.length} results for "${query}"` : `Showing ${results.length} items`}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((result, index) => (
          <SearchResultCard
            key={result.item.id}
            result={result}
            onClick={onResultClick}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

// Individual Search Result Card
interface SearchResultCardProps {
  result: SearchResult;
  onClick?: (result: SearchableContent) => void;
  rank?: number;
}

function SearchResultCard({ result, onClick, rank }: SearchResultCardProps) {
  const { item, score, matches } = result;

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  const getResultUrl = (item: SearchableContent) => {
    switch (item.type) {
      case 'topic':
        return `/${item.category}/${item.slug}`;
      case 'question':
        return `/${item.category}/${item.slug || item.id}#questions`;
      case 'example':
        return `/${item.category}/${item.slug || item.id}#examples`;
      case 'flashcard':
        return `/flashcards?category=${item.category}`;
      default:
        return '#';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'advanced': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'expert': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'topic': return '📚';
      case 'question': return '❓';
      case 'example': return '💻';
      case 'flashcard': return '🃏';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'topic': return 'text-blue-600 bg-blue-50';
      case 'question': return 'text-purple-600 bg-purple-50';
      case 'example': return 'text-green-600 bg-green-50';
      case 'flashcard': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const highlightMatches = (text: string, matches?: any[]) => {
    if (!matches || matches.length === 0) return text;

    // Simple highlighting - in a real implementation, you'd want more sophisticated highlighting
    let highlightedText = text;
    matches.forEach(match => {
      if (match.value) {
        const regex = new RegExp(`(${match.value})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
      }
    });

    return highlightedText;
  };

  const resultUrl = getResultUrl(item);
  const isClickable = onClick || resultUrl !== '#';

  const CardContent = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center flex-1 min-w-0">
          {rank && (
            <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-xs font-medium text-gray-600">{rank}</span>
            </div>
          )}
          <span className="text-xl mr-3 flex-shrink-0">{getTypeIcon(item.type)}</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 truncate">
              <span dangerouslySetInnerHTML={{ __html: highlightMatches(item.title, matches) }} />
            </h3>
            <div className="flex items-center mt-1 space-x-3 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(item.type)}`}>
                {item.type}
              </span>
              <span className="text-sm text-gray-500 capitalize">
                {item.category.replace('-', ' ')}
              </span>
              {item.difficulty && (
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getDifficultyColor(item.difficulty)}`}>
                  {item.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
          {score && (
            <div className="text-sm text-gray-500">
              {Math.round((1 - score) * 100)}%
            </div>
          )}
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {item.excerpt && (
        <p className="text-gray-600 mb-4 line-clamp-3">
          <span dangerouslySetInnerHTML={{ __html: highlightMatches(item.excerpt, matches) }} />
        </p>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 5).map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 5 && (
            <span className="text-xs text-gray-500">
              +{item.tags.length - 5} more
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (!isClickable) {
    return <CardContent />;
  }

  if (onClick) {
    return (
      <button
        onClick={handleClick}
        className="w-full text-left cursor-pointer"
      >
        <CardContent />
      </button>
    );
  }

  return (
    <Link href={resultUrl} className="block cursor-pointer">
      <CardContent />
    </Link>
  );
}

// Loading skeleton for search results
function SearchResultSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center flex-1">
            <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
            <div className="w-6 h-6 bg-gray-200 rounded mr-3"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="flex space-x-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-18"></div>
              </div>
            </div>
          </div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-18"></div>
        </div>
      </div>
    </div>
  );
}

// Export additional components for reuse
export { SearchResultCard, SearchResultSkeleton };