'use client';

import React from 'react';
import { InterviewQuestion } from '@/types/content';
import DetailedAnswer from './DetailedAnswer';
import FollowUpQuestions from './FollowUpQuestions';
import BookmarkButton from './BookmarkButton';

interface InterviewQuestionCardProps {
  question: InterviewQuestion;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

export default function InterviewQuestionCard({ 
  question, 
  index, 
  isExpanded, 
  onToggle, 
  className = '' 
}: InterviewQuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'expert':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'senior':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'mid':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'junior':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scenario':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'behavioral':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Question Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-medium rounded-full">
                {index}
              </span>
              
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
                  {getTypeIcon(question.type)}
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </span>
                
                {question.type && question.type !== 'technical' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                  </span>
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {question.question}
            </h3>
            
            {question.category && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{question.category}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Bookmark Button */}
            <BookmarkButton 
              id={question.id} 
              type="question" 
              size="sm"
            />
            
            {/* Related Topics Count */}
            {question.relatedTopics && question.relatedTopics.length > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {question.relatedTopics.length} related
              </span>
            )}
            
            {/* Expand/Collapse Icon */}
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="p-4">
            {/* Detailed Answer */}
            <DetailedAnswer answer={question.answer} />
            
            {/* Follow-up Questions */}
            {question.followUpQuestions && question.followUpQuestions.length > 0 && (
              <div className="mt-6">
                <FollowUpQuestions 
                  questions={question.followUpQuestions}
                />
              </div>
            )}
            
            {/* Related Topics */}
            {question.relatedTopics && question.relatedTopics.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Related Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {question.relatedTopics.map((topic, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer transition-colors"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}