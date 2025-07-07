'use client';

import React from 'react';
import { ContentSection as ContentSectionType } from '@/types/content';
import CodeExample from './CodeExample';
import DiagramRenderer from './DiagramRenderer';

interface ContentSectionProps {
  section: ContentSectionType;
  isFirst?: boolean;
  className?: string;
}

export default function ContentSection({ section, isFirst = false, className = '' }: ContentSectionProps) {
  return (
    <div className={`${className} ${!isFirst ? 'border-t border-gray-200 pt-8' : ''}`}>
      {/* Section Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {section.title}
        </h3>
        
        {/* Section Content */}
        <div className="prose prose-lg max-w-none text-gray-700">
          <div 
            dangerouslySetInnerHTML={{ __html: section.content }}
            className="mb-6"
          />
        </div>
      </div>

      {/* Key Points */}
      {section.keyPoints && section.keyPoints.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Key Points
          </h4>
          <ul className="space-y-2">
            {section.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Code Examples */}
      {section.codeExamples && section.codeExamples.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Code Examples
          </h4>
          <div className="space-y-4">
            {section.codeExamples.map((example, index) => (
              <CodeExample 
                key={example.id} 
                example={example}
              />
            ))}
          </div>
        </div>
      )}

      {/* Diagrams */}
      {section.diagrams && section.diagrams.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Diagrams
          </h4>
          <div className="space-y-6">
            {section.diagrams.map((diagramId, index) => (
              <DiagramRenderer 
                key={diagramId} 
                diagramId={diagramId}
                className="border border-gray-200 rounded-lg p-4"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}