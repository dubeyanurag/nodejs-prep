'use client';

import React, { useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ContentMetadata } from '../../lib/content-loader-server';
import DiagramRenderer from './DiagramRenderer';
import { Diagram } from '@/types/content';
import { initializeMermaid } from '@/lib/mermaid';
import { extractHeadings, generateUniqueAnchor, HeadingItem } from '../../lib/utils/markdown-headings';

interface MarkdownTopicPageProps {
  content: string;
  metadata: ContentMetadata;
  className?: string;
  onHeadingsExtracted?: (headings: HeadingItem[]) => void;
}

export default function MarkdownTopicPage({ 
  content, 
  metadata, 
  className = '',
  onHeadingsExtracted
}: MarkdownTopicPageProps) {
  // Extract headings from content
  const headings = useMemo(() => {
    const extractedHeadings = extractHeadings(content);
    const existingAnchors = new Set<string>();
    
    // Generate unique anchors for each heading
    return extractedHeadings.map(heading => ({
      ...heading,
      anchor: generateUniqueAnchor(heading.title, existingAnchors)
    }));
  }, [content]);

  // Initialize mermaid when component mounts
  useEffect(() => {
    initializeMermaid();
  }, []);

  // Notify parent component about extracted headings
  useEffect(() => {
    if (onHeadingsExtracted) {
      onHeadingsExtracted(headings);
    }
  }, [headings, onHeadingsExtracted]);

  return (
    <div className={`max-w-none ${className}`}>
      {/* Topic Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {metadata.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {metadata.category}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                metadata.difficulty === 'expert' ? 'bg-red-100 text-red-800' :
                metadata.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                metadata.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {metadata.difficulty.charAt(0).toUpperCase() + metadata.difficulty.slice(1)}
              </span>
            </div>
          </div>
          
          {/* Topic Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{metadata.estimatedReadTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Updated {metadata.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadata.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-none">
        <ReactMarkdown
          components={{
            code({ node, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const inline = props.inline;
              
              // Handle mermaid diagrams
              if (!inline && match && match[1] === 'mermaid') {
                const mermaidCode = String(children).replace(/\n$/, '');
                const diagram: Diagram = {
                  id: `diagram-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  type: 'flowchart', // Will be auto-detected by DiagramRenderer
                  title: 'Diagram',
                  description: 'Interactive diagram',
                  mermaidCode,
                  explanation: ''
                };
                
                return (
                  <div className="my-6">
                    <DiagramRenderer diagram={diagram} />
                  </div>
                );
              }
              
              return !inline && match ? (
                <SyntaxHighlighter
                  style={tomorrow as any}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            h1: ({ children }) => {
              const text = String(children);
              const heading = headings.find(h => h.title === text && h.level === 1);
              return (
                <h1 
                  id={heading?.anchor}
                  className="text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0 scroll-mt-6"
                >
                  {children}
                </h1>
              );
            },
            h2: ({ children }) => {
              const text = String(children);
              const heading = headings.find(h => h.title === text && h.level === 2);
              return (
                <h2 
                  id={heading?.anchor}
                  className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2 scroll-mt-6"
                >
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const text = String(children);
              const heading = headings.find(h => h.title === text && h.level === 3);
              return (
                <h3 
                  id={heading?.anchor}
                  className="text-xl font-semibold text-gray-900 mt-6 mb-3 scroll-mt-6"
                >
                  {children}
                </h3>
              );
            },
            h4: ({ children }) => {
              const text = String(children);
              const heading = headings.find(h => h.title === text && h.level === 4);
              return (
                <h4 
                  id={heading?.anchor}
                  className="text-lg font-semibold text-gray-900 mt-4 mb-2 scroll-mt-6"
                >
                  {children}
                </h4>
              );
            },
            p: ({ children }) => (
              <p className="text-gray-700 leading-relaxed mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">
                {children}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic">
                {children}
              </blockquote>
            ),
            a: ({ href, children }) => (
              <a 
                href={href} 
                className="text-blue-600 hover:text-blue-700 underline"
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-50">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="bg-white divide-y divide-gray-200">
                {children}
              </tbody>
            ),
            th: ({ children }) => (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {children}
              </td>
            ),
            hr: () => (
              <hr className="my-8 border-gray-200" />
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </main>
    </div>
  );
}