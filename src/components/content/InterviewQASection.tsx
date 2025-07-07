'use client';

import React, { useState } from 'react';
import { InterviewQuestion } from '@/types/content';
import InterviewQuestionCard from './InterviewQuestionCard';
import ScenarioBasedQuestion from './ScenarioBasedQuestion';
import BehavioralQuestionSection from './BehavioralQuestionSection';

interface InterviewQASectionProps {
  questions: InterviewQuestion[];
  className?: string;
  showSeparateSections?: boolean;
}

export default function InterviewQASection({ questions, className = '', showSeparateSections = false }: InterviewQASectionProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const difficulties = ['all', 'junior', 'mid', 'senior', 'expert'];
  const types = ['all', 'technical', 'scenario', 'behavioral'];
  
  let filteredQuestions = questions;
  
  if (selectedDifficulty !== 'all') {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === selectedDifficulty);
  }
  
  if (selectedType !== 'all') {
    filteredQuestions = filteredQuestions.filter(q => q.type === selectedType);
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

  // If showing separate sections, render them individually
  if (showSeparateSections) {
    const technicalQuestions = questions.filter(q => q.type === 'technical' || !q.type);
    const scenarioQuestions = questions.filter(q => q.type === 'scenario');
    const behavioralQuestions = questions.filter(q => q.type === 'behavioral');

    return (
      <div className={className}>
        {/* Technical Questions */}
        {technicalQuestions.length > 0 && (
          <div className="mb-12">
            <InterviewQASection 
              questions={technicalQuestions} 
              showSeparateSections={false}
            />
          </div>
        )}

        {/* Scenario-Based Questions */}
        {scenarioQuestions.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Scenario-Based Questions
                <span className="text-sm font-normal text-gray-500">
                  ({scenarioQuestions.length} questions)
                </span>
              </h2>
              <p className="text-gray-600 mt-2">
                Real-world scenarios that test your ability to apply technical knowledge in business contexts.
              </p>
            </div>
            <div className="space-y-6">
              {scenarioQuestions.map((question, index) => (
                <ScenarioBasedQuestion
                  key={question.id}
                  question={question}
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Behavioral Questions */}
        {behavioralQuestions.length > 0 && (
          <div className="mb-12">
            <BehavioralQuestionSection questions={behavioralQuestions} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Interview Questions & Answers
          <span className="text-sm font-normal text-gray-500">
            ({filteredQuestions.length} questions)
          </span>
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Type:</span>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                {type !== 'all' && (
                  <span className="ml-1 text-xs opacity-75">
                    ({questions.filter(q => q.type === type).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Level:</span>
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedDifficulty === difficulty
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                {difficulty !== 'all' && (
                  <span className="ml-1 text-xs opacity-75">
                    ({questions.filter(q => q.difficulty === difficulty).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No questions found for the selected difficulty level.</p>
          </div>
        ) : (
          filteredQuestions.map((question, index) => {
            if (question.type === 'scenario' && question.scenario) {
              return (
                <ScenarioBasedQuestion
                  key={question.id}
                  question={question}
                  index={index + 1}
                />
              );
            } else if (question.type === 'behavioral' && question.behavioralContext) {
              // Behavioral questions are handled separately by BehavioralQuestionSection
              // For individual rendering, we'll use a simplified card
              return (
                <InterviewQuestionCard
                  key={question.id}
                  question={question}
                  index={index + 1}
                  isExpanded={expandedQuestions.has(question.id)}
                  onToggle={() => toggleQuestion(question.id)}
                />
              );
            } else {
              return (
                <InterviewQuestionCard
                  key={question.id}
                  question={question}
                  index={index + 1}
                  isExpanded={expandedQuestions.has(question.id)}
                  onToggle={() => toggleQuestion(question.id)}
                />
              );
            }
          })
        )}
      </div>

      {/* Expand All / Collapse All */}
      {filteredQuestions.length > 0 && (
        <div className="flex justify-center mt-6 pt-6 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setExpandedQuestions(new Set(filteredQuestions.map(q => q.id)))}
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
      )}
    </div>
  );
}