'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NavigationItem } from '../../types/content';
import { navigationManager } from '../../lib/navigation';
import { useSearchSuggestions } from '../../lib/hooks/useSearch';

interface MainNavigationProps {
  className?: string;
}

export default function MainNavigation({ className = '' }: MainNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const navigationTree = navigationManager.getNavigationTree();

  const isActiveRoute = (slug: string) => {
    return pathname === `/${slug}` || pathname.startsWith(`/${slug}/`);
  };

  return (
    <nav className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NI</span>
              </div>
              <span className="font-semibold text-gray-900 text-lg">
                Node.js Interview Prep
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <QuickSearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>

            {/* Category Navigation */}
            {navigationTree.map((category) => (
              <div key={category.id} className="relative group">
                <Link
                  href={`/${category.slug}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute(category.slug)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {category.title}
                </Link>

                {/* Dropdown Menu for Topics */}
                {category.children && category.children.length > 0 && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {category.children.slice(0, 8).map((topic) => (
                        <Link
                          key={topic.id}
                          href={`/${category.slug}/${topic.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        >
                          {topic.title}
                        </Link>
                      ))}
                      {category.children.length > 8 && (
                        <Link
                          href={`/${category.slug}`}
                          className="block px-4 py-2 text-sm text-blue-600 font-medium border-t border-gray-100 mt-2"
                        >
                          View all {category.children.length} topics →
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Utility Links */}
            <Link
              href="/search"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/search'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Search
            </Link>

            <Link
              href="/flashcards"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/flashcards'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Flashcards
            </Link>

            <Link
              href="/progress"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/progress'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              Progress
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              {navigationTree.map((category) => (
                <div key={category.id}>
                  <Link
                    href={`/${category.slug}`}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActiveRoute(category.slug)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {category.title}
                  </Link>
                </div>
              ))}

              <Link
                href="/search"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/search'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Search
              </Link>

              <Link
                href="/flashcards"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/flashcards'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Flashcards
              </Link>

              <Link
                href="/progress"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/progress'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Progress
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Quick Search Bar Component
function QuickSearchBar() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, isLoading } = useSearchSuggestions(query);
  const router = useRouter();

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(e.target.value.length >= 2);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(query.length >= 2)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search topics, questions..."
          className="block w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="text-gray-900">{suggestion.text}</span>
                  <span className="ml-2 text-xs text-gray-500 capitalize">
                    {suggestion.type}
                  </span>
                </div>
                {suggestion.count && (
                  <span className="text-xs text-gray-400">
                    {suggestion.count}
                  </span>
                )}
              </button>
            ))}
            <div className="border-t border-gray-100 px-3 py-2">
              <button
                onClick={() => handleSearch(query)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Search for "{query}" →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}