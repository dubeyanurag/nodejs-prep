'use client';

import React, { useState, useMemo } from 'react';
import { InterviewQuestion } from '@/types/content';
import QuestionBrowser from './QuestionBrowser';

interface QuestionCategoryViewProps {
  questions: InterviewQuestion[];
  className?: string;
}

interface CategoryStats {
  name: string;
  total: number;
  byDifficulty: Record<string, number>;
  averageDifficulty: number;
}

export default function QuestionCategoryView({ 
  questions, 
  className = '' 
}: QuestionCategoryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'category'>('overview');

  // Calculate category statistics
  const categoryStats = useMemo(() => {
    const stats: Record<string, CategoryStats> = {};
    
    questions.forEach(question => {
      if (!stats[question.category]) {
        stats[question.category] = {
          name: question.category,
          total: 0,
          byDifficulty: { junior: 0, mid: 0, senior: 0, expert: 0 },
          averageDifficulty: 0
        };
      }
      
      stats[question.category].total++;
      stats[question.category].byDifficulty[question.difficulty]++;
    });

    // Calculate average difficulty
    Object.values(stats).forEach(stat => {
      const difficultyWeights = { junior: 1, mid: 2, senior: 3, expert: 4 };
      const totalWeight = Object.entries(stat.byDifficulty).reduce(
        (sum, [difficulty, count]) => sum + (difficultyWeights[difficulty as keyof typeof difficultyWeights] * count),
        0
      );
      stat.averageDifficulty = totalWeight / stat.total;
    });

    return Object.values(stats).sort((a, b) => b.total - a.total);
  }, [questions]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'expert': return 'bg-red-100 text-red-800';
      case 'senior': return 'bg-orange-100 text-orange-800';
      case 'mid': return 'bg-yellow-100 text-yellow-800';
      case 'junior': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAverageDifficultyLabel = (avg: number) => {
    if (avg <= 1.5) return 'Junior';
    if (avg <= 2.5) return 'Mid-level';
    if (avg <= 3.5) return 'Senior';
    return 'Expert';
  };

  const getAverageDifficultyColor = (avg: number) => {
    if (avg <= 1.5) return 'text-green-600';
    if (avg <= 2.5) return 'text-yellow-600';
    if (avg <= 3.5) return 'text-orange-600';
    return 'text-red-600';
  };

  if (viewMode === 'category' && selectedCategory) {
    const categoryQuestions = questions.filter(q => q.category === selectedCategory);
    return (
      <div className={className}>
        <div className="mb-6">
          <button
            onClick={() => setViewMode('overview')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Categories
          </button>
        </div>
        
        <QuestionBrowser
          questions={categoryQuestions}
          title={`${selectedCategory} Questions`}
          showCategoryFilter={false}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Question Categories
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {categoryStats.length} categories • {questions.length} total questions
        </p>
      </div>

      {/* Category Grid */}
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryStats.map((category) => (
            <div
              key={category.name}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedCategory(category.name);
                setViewMode('category');
              }}
            >
              {/* Category Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.total} questions
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-medium ${getAverageDifficultyColor(category.averageDifficulty)}`}>
                    {getAverageDifficultyLabel(category.averageDifficulty)}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Difficulty Breakdown</h4>
                <div className="space-y-2">
                  {Object.entries(category.byDifficulty).map(([difficulty, count]) => (
                    count > 0 && (
                      <div key={difficulty} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{count}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                difficulty === 'expert' ? 'bg-red-500' :
                                difficulty === 'senior' ? 'bg-orange-500' :
                                difficulty === 'mid' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${(count / category.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Completion</span>
                  <span>0%</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-blue-500 h-1 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {questions.length}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {categoryStats.length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {questions.filter(q => q.difficulty === 'junior').length}
            </div>
            <div className="text-sm text-gray-600">Junior Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {questions.filter(q => q.difficulty === 'expert').length}
            </div>
            <div className="text-sm text-gray-600">Expert Level</div>
          </div>
        </div>
      </div>
    </div>
  );
}