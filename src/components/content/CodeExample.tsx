'use client';

import React, { useState, useEffect } from 'react';
import { CodeExample as CodeExampleType } from '@/types/content';
import { highlightCode } from '@/lib/prism';

interface CodeExampleProps {
  example: CodeExampleType;
  compact?: boolean;
  className?: string;
}

export default function CodeExample({ 
  example, 
  compact = false, 
  className = '' 
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    const highlighted = highlightCode(example.code, example.language);
    setHighlightedCode(highlighted);
  }, [example.code, example.language]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLanguageIcon = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return '🟨';
      case 'typescript':
      case 'ts':
        return '🔷';
      case 'python':
        return '🐍';
      case 'java':
        return '☕';
      case 'sql':
        return '🗃️';
      case 'bash':
      case 'shell':
        return '💻';
      case 'json':
        return '📄';
      case 'yaml':
      case 'yml':
        return '⚙️';
      case 'docker':
        return '🐳';
      default:
        return '📝';
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h4 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
            {example.title}
          </h4>
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            <span>{getLanguageIcon(example.language)}</span>
            <span>{example.language}</span>
          </span>
          {!compact && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
              {example.complexity}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Line count indicator */}
          <span className="text-xs text-gray-500">
            {example.code.split('\n').length} lines
          </span>
          
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Copy code"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Block */}
      <div className="relative">
        <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto ${compact ? 'text-xs' : 'text-sm'} leading-relaxed`}>
          <code 
            className={`language-${example.language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
        
        {/* Line numbers overlay for non-compact mode */}
        {!compact && (
          <div className="absolute left-0 top-0 p-4 text-gray-500 text-xs leading-relaxed pointer-events-none select-none">
            {example.code.split('\n').map((_, index) => (
              <div key={index} className="text-right w-8">
                {index + 1}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Output */}
      {example.output && (
        <div className="border-t border-gray-200">
          <div className="px-4 py-2 bg-green-50 border-b border-green-200">
            <h5 className="text-sm font-medium text-green-900 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Output
            </h5>
          </div>
          <pre className={`bg-green-50 text-green-900 p-4 overflow-x-auto ${compact ? 'text-xs' : 'text-sm'} font-mono`}>
            <code>{example.output}</code>
          </pre>
        </div>
      )}

      {/* Explanation and Context */}
      {!compact && (
        <div className="px-4 py-3 space-y-3 border-t border-gray-200">
          {/* Explanation */}
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Explanation
            </h5>
            <p className="text-sm text-gray-700 leading-relaxed">
              {example.explanation}
            </p>
          </div>

          {/* Real-world Context */}
          {example.realWorldContext && (
            <div className="bg-blue-50 rounded-lg p-3">
              <h5 className="text-sm font-medium text-blue-900 mb-1 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                Real-world Application
              </h5>
              <p className="text-sm text-blue-800">
                {example.realWorldContext}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}