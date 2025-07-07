'use client';

import React, { useState } from 'react';
import { CodeExample as CodeExampleType } from '@/types/content';
import CodeExample from './CodeExample';

interface TabbedCodeExamplesProps {
  examples: CodeExampleType[];
  title?: string;
  className?: string;
}

export default function TabbedCodeExamples({ 
  examples, 
  title = "Code Examples",
  className = '' 
}: TabbedCodeExamplesProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (examples.length === 0) {
    return null;
  }

  if (examples.length === 1) {
    return <CodeExample example={examples[0]} className={className} />;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
      {/* Header with title */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          {title}
          <span className="text-sm font-normal text-gray-500">
            ({examples.length} approaches)
          </span>
        </h4>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <nav className="flex overflow-x-auto">
          {examples.map((example, index) => (
            <button
              key={example.id}
              onClick={() => setActiveTab(index)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === index
                  ? 'border-blue-500 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="truncate max-w-32">{example.title}</span>
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  {example.language}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-0">
        <CodeExample 
          example={examples[activeTab]} 
          className="border-0 shadow-none rounded-none"
        />
      </div>

      {/* Comparison Footer */}
      {examples.length > 1 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Approach {activeTab + 1} of {examples.length}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                Complexity: {examples[activeTab].complexity}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                disabled={activeTab === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous approach"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setActiveTab(Math.min(examples.length - 1, activeTab + 1))}
                disabled={activeTab === examples.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next approach"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}