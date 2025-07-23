'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DifficultyLevel } from '../../types/content';
import { CategoryInfo } from '../../lib/content-loader';
import { withBasePath } from '../../lib/utils/path';

interface CategoryBrowserProps {
  categories?: CategoryInfo[];
  className?: string;
}

export default function CategoryBrowser({ 
  categories = [], 
  className = '' 
}: CategoryBrowserProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use provided categories
  const displayCategories = categories;

  const filteredCategories = displayCategories.filter(category => {
    // Search filter
    if (searchQuery) {
      const matchesSearch = category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.topics.some(topic => 
          topic.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      if (!matchesSearch) return false;
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      const hasMatchingDifficulty = category.topics.some(topic => 
        topic.difficulty === selectedDifficulty
      );
      if (!hasMatchingDifficulty) return false;
    }

    return true;
  });

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'intermediate':
        return '⭐⭐';
      case 'advanced':
        return '⭐⭐⭐';
      case 'expert':
        return '⭐⭐⭐⭐';
      default:
        return '⭐';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Course Categories
        </h2>
        
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories and topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedDifficulty === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Levels
            </button>
            {(['intermediate', 'advanced', 'expert'] as DifficultyLevel[]).map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-3 py-1 text-sm rounded-full transition-colors capitalize ${
                  selectedDifficulty === difficulty
                    ? getDifficultyColor(difficulty)
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getDifficultyIcon(difficulty)} {difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="p-6">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.207-2.175C5.25 12.09 5.25 11.438 5.25 10.5c0-.938 0-1.59.543-2.325C6.336 7.44 7.34 7 8.5 7h7c1.16 0 2.164.44 2.707 1.175.543.735.543 1.387.543 2.325 0 .938 0 1.59-.543 2.325C17.664 13.56 16.66 14 15.5 14h-7c-1.16 0-2.164-.44-2.707-1.175z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => {
              const topicCount = category.topics.length;
              const totalReadTime = category.topics.reduce((sum, topic) => sum + topic.estimatedReadTime, 0);
              
              // Get difficulty distribution
              const difficultyCount = category.topics.reduce((acc, topic) => {
                acc[topic.difficulty] = (acc[topic.difficulty] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

              return (
                <Link
                  key={category.slug}
                  href={withBasePath(`/${category.slug}`)}
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-500">
                        {Math.round(totalReadTime / 60)}h
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  {/* Topic Count and Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">
                      {topicCount} topic{topicCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm text-gray-500">
                      {totalReadTime} min total
                    </span>
                  </div>

                  {/* Difficulty Distribution */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {Object.entries(difficultyCount).map(([difficulty, count]) => (
                      <span
                        key={difficulty}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty as DifficultyLevel)}`}
                      >
                        {count} {difficulty}
                      </span>
                    ))}
                  </div>

                  {/* Sample Topics */}
                  {category.topics.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Sample Topics:</h4>
                      <div className="space-y-1">
                        {category.topics.slice(0, 3).map((topic) => (
                          <div key={topic.slug} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                            <span className="truncate">{topic.title}</span>
                          </div>
                        ))}
                        {category.topics.length > 3 && (
                          <div className="text-sm text-blue-600 font-medium">
                            +{category.topics.length - 3} more topics
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Call to Action */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span className="text-sm font-medium">Start Learning</span>
                      <svg
                        className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}