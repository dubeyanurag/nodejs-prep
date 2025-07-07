'use client';

import React, { useState } from 'react';
import { InterviewQuestion } from '@/types/content';
import DetailedAnswer from './DetailedAnswer';
import FollowUpQuestions from './FollowUpQuestions';

interface BehavioralQuestionSectionProps {
  questions: InterviewQuestion[];
  className?: string;
}

export default function BehavioralQuestionSection({ questions, className = '' }: BehavioralQuestionSectionProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [selectedLeadership, setSelectedLeadership] = useState<string>('all');

  const behavioralQuestions = questions.filter(q => q.type === 'behavioral' && q.behavioralContext);
  
  if (behavioralQuestions.length === 0) {
    return null;
  }

  const leadershipLevels = ['all', 'individual-contributor', 'tech-lead', 'senior-engineer', 'architect'];
  
  let filteredQuestions = behavioralQuestions;
  if (selectedLeadership !== 'all') {
    filteredQuestions = behavioralQuestions.filter(q => 
      q.behavioralContext?.leadership === selectedLeadership
    );
  }

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const getLeadershipIcon = (leadership: string) => {
    switch (leadership) {
      case 'architect':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'tech-lead':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'senior-engineer':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
    }
  };

  const getLeadershipColor = (leadership: string) => {
    switch (leadership) {
      case 'architect':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tech-lead':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'senior-engineer':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatLeadershipLevel = (level: string) => {
    return level.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className={className}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Behavioral & Leadership Questions
          <span className="text-sm font-normal text-gray-500">
            ({filteredQuestions.length} questions)
          </span>
        </h2>

        {/* Leadership Level Filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 self-center">Level:</span>
          {leadershipLevels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLeadership(level)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedLeadership === level
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level === 'all' ? 'All Levels' : formatLeadershipLevel(level)}
              {level !== 'all' && (
                <span className="ml-1 text-xs opacity-75">
                  ({behavioralQuestions.filter(q => q.behavioralContext?.leadership === level).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <p className="text-purple-800 text-sm leading-relaxed">
          <strong>Behavioral questions</strong> assess your leadership experience, decision-making process, and ability to handle complex technical and team situations. 
          Use the STAR method (Situation, Task, Action, Result) to structure your responses with specific examples from your experience.
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No behavioral questions found for the selected leadership level.</p>
          </div>
        ) : (
          filteredQuestions.map((question, index) => {
            const isExpanded = expandedQuestions.has(question.id);
            const context = question.behavioralContext!;

            return (
              <div key={question.id} className="bg-white border border-purple-200 rounded-lg shadow-sm">
                {/* Question Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => toggleQuestion(question.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-600 text-white text-sm font-bold rounded-full">
                          {index + 1}
                        </span>
                        
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getLeadershipColor(context.leadership)}`}>
                          {getLeadershipIcon(context.leadership)}
                          {formatLeadershipLevel(context.leadership)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {question.question}
                      </h3>
                      
                      {/* Situation Context */}
                      <div className="bg-purple-50 rounded-lg p-3 mb-3">
                        <h4 className="text-sm font-medium text-purple-900 mb-1">Situation Context:</h4>
                        <p className="text-sm text-purple-800">{context.situation}</p>
                      </div>
                      
                      {/* Challenge */}
                      <div className="bg-orange-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-orange-900 mb-1">Key Challenge:</h4>
                        <p className="text-sm text-orange-800">{context.challenge}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {question.difficulty}
                      </span>
                      
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
                  <div className="border-t border-purple-200 bg-white">
                    <div className="p-6 space-y-6">
                      {/* Expected Behaviors */}
                      {context.expectedBehaviors && context.expectedBehaviors.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Expected Leadership Behaviors
                          </h4>
                          <ul className="space-y-2">
                            {context.expectedBehaviors.map((behavior, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">{behavior}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Red Flags */}
                      {context.redFlags && context.redFlags.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Red Flags to Avoid
                          </h4>
                          <ul className="space-y-2">
                            {context.redFlags.map((flag, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">{flag}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Detailed Answer */}
                      <div className="border-t border-gray-200 pt-6">
                        <DetailedAnswer answer={question.answer} />
                      </div>

                      {/* Follow-up Scenarios */}
                      {context.followUpScenarios && context.followUpScenarios.length > 0 && (
                        <div className="border-t border-gray-200 pt-6">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Follow-up Scenarios
                          </h4>
                          <div className="space-y-3">
                            {context.followUpScenarios.map((scenario, index) => (
                              <div key={index} className="bg-blue-50 rounded-lg p-3">
                                <p className="text-sm text-blue-800">{scenario}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-up Questions */}
                      {question.followUpQuestions && question.followUpQuestions.length > 0 && (
                        <div className="border-t border-gray-200 pt-6">
                          <FollowUpQuestions 
                            questions={question.followUpQuestions}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Expand All / Collapse All */}
      {filteredQuestions.length > 0 && (
        <div className="flex justify-center mt-6 pt-6 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setExpandedQuestions(new Set(filteredQuestions.map(q => q.id)))}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
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
      )}
    </div>
  );
}