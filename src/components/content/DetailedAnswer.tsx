'use client';

import React, { useState } from 'react';
import { DetailedAnswer as DetailedAnswerType } from '@/types/content';
import CodeExample from './CodeExample';

interface DetailedAnswerProps {
  answer: DetailedAnswerType;
  className?: string;
}

export default function DetailedAnswer({ answer, className = '' }: DetailedAnswerProps) {
  const [activeTab, setActiveTab] = useState<'explanation' | 'alternatives' | 'mistakes' | 'notes'>('explanation');

  const tabs = [
    { id: 'explanation' as const, label: 'Explanation', icon: '📝' },
    { id: 'alternatives' as const, label: 'Alternatives', icon: '🔄', count: answer.alternatives.length },
    { id: 'mistakes' as const, label: 'Mistakes', icon: '⚠️', count: answer.commonMistakes.length },
    { id: 'notes' as const, label: 'Interview Tips', icon: '💡', count: answer.interviewerNotes.length }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Quick Answer
        </h4>
        <p className="text-blue-800 text-sm leading-relaxed">
          {answer.summary}
        </p>
      </div>

      {/* Tabbed Content */}
      <div>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 'explanation' && (
            <div className="space-y-4">
              {/* Detailed Explanation */}
              <div>
                <div 
                  className="prose prose-gray max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: answer.detailedExplanation }}
                />
              </div>

              {/* Code Examples */}
              {answer.codeExamples.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Code Examples
                  </h5>
                  <div className="space-y-3">
                    {answer.codeExamples.map((example) => (
                      <CodeExample key={example.id} example={example} compact />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'alternatives' && (
            <div className="space-y-4">
              {answer.alternatives.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p>No alternative approaches available for this question.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <h5 className="font-medium text-gray-900">Alternative Approaches & Trade-offs</h5>
                  </div>
                  
                  {answer.alternatives.map((alt, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h6 className="font-medium text-gray-900 flex items-center gap-2">
                          <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          {alt.title}
                        </h6>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">{alt.description}</p>
                      
                      {alt.code && (
                        <div className="mb-4">
                          <div className="bg-gray-50 rounded-lg p-3 border">
                            <pre className="text-xs overflow-x-auto">
                              <code className="language-javascript">{alt.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-lg p-3">
                          <h6 className="font-medium text-green-800 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Advantages
                          </h6>
                          <ul className="space-y-1">
                            {alt.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-green-600 font-bold mt-0.5">+</span>
                                <span className="text-green-800">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-red-50 rounded-lg p-3">
                          <h6 className="font-medium text-red-800 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Disadvantages
                          </h6>
                          <ul className="space-y-1">
                            {alt.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-red-600 font-bold mt-0.5">-</span>
                                <span className="text-red-800">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'mistakes' && (
            <div>
              {answer.commonMistakes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No common mistakes documented for this question.</p>
                </div>
              ) : (
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h5 className="font-medium text-red-900">Common Mistakes to Avoid</h5>
                  </div>
                  
                  <div className="space-y-3">
                    {answer.commonMistakes.map((mistake, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
                        <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-red-800 text-sm leading-relaxed">{mistake}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              {answer.interviewerNotes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <p>No interviewer notes available for this question.</p>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <h5 className="font-medium text-yellow-900">What Interviewers Look For</h5>
                  </div>
                  
                  <div className="space-y-3">
                    {answer.interviewerNotes.map((note, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-yellow-200">
                        <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                          💡
                        </div>
                        <div className="flex-1">
                          <p className="text-yellow-800 text-sm leading-relaxed">{note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}