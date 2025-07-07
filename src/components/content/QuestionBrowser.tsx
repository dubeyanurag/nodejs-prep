'use client';

import React, { useState, useMemo } from 'react';
import { InterviewQuestion } from '@/types/content';
import InterviewQuestionCard from './InterviewQuestionCard';

interface QuestionBrowserProps {
  questions: InterviewQuestion[];
  title?: string;
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  className?: string;
}

type SortOption = 'difficulty' | 'category' | 'alphabetical' | 'recent';
type ViewMode = 'list' | 'compact';

export default function QuestionBrowser({ 
  questions, 
  title = "Interview Questions",
  showSearch = true,
  showCategoryFilter = true,
  className = '' 
}: QuestionBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('difficulty');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  // Extract unique values for filters
  const difficulties = ['all', 'junior', 'mid', 'senior', 'expert'];
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(questions.map(q => q.category))];
    return cats;
  }, [questions]);

  // Filter and sort questions
  const filteredAndSortedQuestions = useMemo(() => {
    const filtered = questions.filter(question => {
      const matchesSearch = searchTerm === '' || 
        question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.answer.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.relatedTopics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
      
      return matchesSearch && matchesDifficulty && matchesCategory;
    });

    // Sort questions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder = { junior: 1, mid: 2, senior: 3, expert: 4 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'category':
          return a.category.localeCompare(b.category);
        case 'alphabetical':
          return a.question.localeCompare(b.question);
        case 'recent':
          return a.id.localeCompare(b.id); // Assuming newer questions have higher IDs
        default:
          return 0;
      }
    });

    return filtered;
  }, [questions, searchTerm, selectedDifficulty, selectedCategory, sortBy]);

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('all');
    setSelectedCategory('all');
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredAndSortedQuestions.length} of {questions.length} questions
              {(searchTerm || selectedDifficulty !== 'all' || selectedCategory !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="ml-2 text-blue-600 hover:text-blue-700 underline"
                >
                  Clear filters
                </button>
              )}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 space-y-4">
        {/* Search Bar */}
        {showSearch && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search questions, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Difficulty:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  {difficulty !== 'all' && ` (${questions.filter(q => q.difficulty === difficulty).length})`}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          {showCategoryFilter && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    {category !== 'all' && ` (${questions.filter(q => q.category === category).length})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="difficulty">Difficulty</option>
              <option value="category">Category</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="recent">Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="p-6">
        {filteredAndSortedQuestions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedDifficulty !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'No questions are available in this section.'}
            </p>
          </div>
        ) : (
          <div className={`space-y-4 ${viewMode === 'compact' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}`}>
            {filteredAndSortedQuestions.map((question, index) => (
              <InterviewQuestionCard
                key={question.id}
                question={question}
                index={index + 1}
                isExpanded={expandedQuestions.has(question.id)}
                onToggle={() => toggleQuestion(question.id)}
                className={viewMode === 'compact' ? 'h-fit' : ''}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {filteredAndSortedQuestions.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                {expandedQuestions.size} of {filteredAndSortedQuestions.length} expanded
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setExpandedQuestions(new Set(filteredAndSortedQuestions.map(q => q.id)))}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={() => setExpandedQuestions(new Set())}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}