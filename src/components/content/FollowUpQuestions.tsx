'use client';

import React, { useState } from 'react';
import { FollowUpQuestion } from '@/types/content';

interface FollowUpQuestionsProps {
  questions: FollowUpQuestion[];
  className?: string;
}

export default function FollowUpQuestions({ questions, className = '' }: FollowUpQuestionsProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'clarification', 'depth', 'application', 'edge-case', 'optimization'];
  
  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'clarification': return '❓';
      case 'depth': return '🔍';
      case 'application': return '🛠️';
      case 'edge-case': return '⚠️';
      case 'optimization': return '⚡';
      default: return '💭';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'clarification': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'depth': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'application': return 'bg-green-100 text-green-800 border-green-200';
      case 'edge-case': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'optimization': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'expert': return 'bg-red-100 text-red-800';
      case 'senior': return 'bg-orange-100 text-orange-800';
      case 'mid': return 'bg-yellow-100 text-yellow-800';
      case 'junior': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Dynamic Follow-up Questions
          <span className="text-sm font-normal text-gray-500">
            ({filteredQuestions.length} questions)
          </span>
        </h4>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All' : `${getCategoryIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}`}
              {category !== 'all' && (
                <span className="ml-1 text-xs opacity-75">
                  ({questions.filter(q => q.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredQuestions.map((question, index) => (
          <div key={question.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleQuestion(question.id)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(question.category)}`}>
                      {getCategoryIcon(question.category)} {question.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    {question.trigger !== 'always' && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {question.trigger}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {question.question}
                  </p>
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expandedQuestions.has(question.id) ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {expandedQuestions.has(question.id) && (
              <div className="px-4 pb-4 border-t border-gray-200 bg-white">
                {/* Conditional Trigger Info */}
                {question.condition && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                    <h6 className="font-medium text-blue-900 mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Trigger Condition
                    </h6>
                    <p className="text-blue-800 text-sm">{question.condition}</p>
                  </div>
                )}

                {/* Expected Answer */}
                {question.expectedAnswer && (
                  <div className="mb-3">
                    <h6 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Expected Answer Direction
                    </h6>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-green-800 text-sm leading-relaxed">{question.expectedAnswer}</p>
                    </div>
                  </div>
                )}

                {/* Hints */}
                {question.hints && question.hints.length > 0 && (
                  <div className="mb-3">
                    <h6 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Interviewer Hints
                    </h6>
                    <div className="space-y-2">
                      {question.hints.map((hint, hintIndex) => (
                        <div key={hintIndex} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                          <span className="flex-shrink-0 w-5 h-5 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                            {hintIndex + 1}
                          </span>
                          <p className="text-yellow-800 text-sm leading-relaxed">{hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {filteredQuestions.length > 0 && (
        <div className="flex justify-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setExpandedQuestions(new Set(filteredQuestions.map(q => q.id)))}
              className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={() => setExpandedQuestions(new Set())}
              className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}