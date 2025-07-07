'use client';

import React, { useState, useEffect } from 'react';
import { highlightCode } from '@/lib/prism';

interface CodePlaygroundProps {
  initialCode: string;
  language: string;
  title?: string;
  onRun?: (code: string) => Promise<string>;
  className?: string;
}

export default function CodePlayground({ 
  initialCode, 
  language, 
  title = "Interactive Code",
  onRun,
  className = '' 
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    const highlighted = highlightCode(code, language);
    setHighlightedCode(highlighted);
  }, [code, language]);

  const runCode = async () => {
    if (!onRun) {
      setOutput('Code execution not available in this environment');
      return;
    }

    setIsRunning(true);
    setError(null);
    
    try {
      const result = await onRun(code);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setError(null);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 18h6" />
            </svg>
            {title}
          </h4>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
            Interactive
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Copy code"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={resetCode}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Reset to original"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-gray-100 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
          placeholder="Enter your code here..."
          spellCheck={false}
        />
        
        {/* Syntax highlighting overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <pre className="p-4 font-mono text-sm bg-transparent text-transparent overflow-hidden">
            <code 
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Lines: {code.split('\n').length}</span>
          <span>•</span>
          <span>Characters: {code.length}</span>
        </div>
        
        <button
          onClick={runCode}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Running...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 18h6" />
              </svg>
              <span>Run Code</span>
            </>
          )}
        </button>
      </div>

      {/* Output */}
      {(output || error) && (
        <div className="border-t border-gray-200">
          <div className={`px-4 py-2 border-b ${error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <h5 className={`text-sm font-medium flex items-center gap-2 ${error ? 'text-red-900' : 'text-green-900'}`}>
              {error ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Error
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Output
                </>
              )}
            </h5>
          </div>
          <pre className={`p-4 text-sm font-mono overflow-x-auto ${error ? 'bg-red-50 text-red-900' : 'bg-green-50 text-green-900'}`}>
            <code>{error || output}</code>
          </pre>
        </div>
      )}

      {/* Help Text */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        <p>
          💡 Tip: Modify the code above and click &quot;Run Code&quot; to see the results. 
          Use the reset button to restore the original code.
        </p>
      </div>
    </div>
  );
}