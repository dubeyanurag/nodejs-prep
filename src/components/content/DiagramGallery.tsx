'use client';

import React, { useState } from 'react';
import { Diagram } from '@/types/content';
import DiagramRenderer from './DiagramRenderer';

interface DiagramGalleryProps {
  diagrams: Diagram[];
  title?: string;
  className?: string;
}

export default function DiagramGallery({ 
  diagrams, 
  title = "System Diagrams",
  className = '' 
}: DiagramGalleryProps) {
  const [selectedDiagram, setSelectedDiagram] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'single'>('single');

  if (diagrams.length === 0) {
    return null;
  }

  const diagramTypes = [...new Set(diagrams.map(d => d.type))];

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {title}
              <span className="text-sm font-normal text-gray-500">
                ({diagrams.length} diagrams)
              </span>
            </h4>
            
            {/* Type Filter */}
            <div className="flex gap-1">
              {diagramTypes.map((type) => (
                <span 
                  key={type}
                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('single')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === 'single'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Single
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Single View) */}
      {viewMode === 'single' && diagrams.length > 1 && (
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex overflow-x-auto">
            {diagrams.map((diagram, index) => (
              <button
                key={diagram.id}
                onClick={() => setSelectedDiagram(index)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedDiagram === index
                    ? 'border-purple-500 text-purple-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-32">{diagram.title}</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                    {diagram.type}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Content */}
      <div className="p-0">
        {viewMode === 'single' ? (
          <DiagramRenderer 
            diagram={diagrams[selectedDiagram]} 
            className="border-0 shadow-none rounded-none"
          />
        ) : (
          <div className="grid gap-6 p-6">
            {diagrams.map((diagram) => (
              <DiagramRenderer 
                key={diagram.id}
                diagram={diagram} 
                className="border border-gray-200 rounded-lg"
              />
            ))}
          </div>
        )}
      </div>

      {/* Navigation Footer (Single View) */}
      {viewMode === 'single' && diagrams.length > 1 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Diagram {selectedDiagram + 1} of {diagrams.length}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                Type: {diagrams[selectedDiagram].type}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDiagram(Math.max(0, selectedDiagram - 1))}
                disabled={selectedDiagram === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Previous diagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedDiagram(Math.min(diagrams.length - 1, selectedDiagram + 1))}
                disabled={selectedDiagram === diagrams.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Next diagram"
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