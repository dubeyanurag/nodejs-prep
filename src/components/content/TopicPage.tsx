'use client';

import React from 'react';
import { TopicContent, ContentSection as ContentSectionType } from '@/types/content';
import ContentSection from './ContentSection';
import InterviewQASection from './InterviewQASection';
import ProgressTracker, { TopicNavigation } from './ProgressTracker';

interface TopicPageProps {
  topic: TopicContent;
  categorySlug?: string;
  className?: string;
}

export default function TopicPage({ topic, categorySlug = '', className = '' }: TopicPageProps) {
  return (
    <div className={`${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Topic Header */}
            <header className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {topic.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {topic.category}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      topic.difficulty === 'expert' ? 'bg-red-100 text-red-800' :
                      topic.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                      topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
                
                {/* Topic Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{topic.sections.length} sections</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{topic.questions.length} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span>{topic.examples.length} examples</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="border-b border-gray-200 mb-8">
              <div className="flex space-x-8 overflow-x-auto">
                <a 
                  href="#theory" 
                  className="whitespace-nowrap py-2 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600"
                >
                  Theory & Concepts
                </a>
                <a 
                  href="#examples" 
                  className="whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Code Examples
                </a>
                <a 
                  href="#qa" 
                  className="whitespace-nowrap py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Interview Q&A
                </a>
              </div>
            </nav>

            {/* Main Content */}
            <main className="space-y-12">
              {/* Theory Section */}
              <section id="theory" className="scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Theory & Concepts
                </h2>
                
                <div className="space-y-8">
                  {topic.sections.map((section, index) => (
                    <ContentSection 
                      key={section.id} 
                      section={section}
                      isFirst={index === 0}
                    />
                  ))}
                </div>
              </section>

              {/* Interview Q&A Section */}
              {topic.questions.length > 0 && (
                <section id="qa" className="scroll-mt-8">
                  <InterviewQASection questions={topic.questions} />
                </section>
              )}
            </main>

            {/* Topic Navigation */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <TopicNavigation 
                currentTopicId={topic.id} 
                categorySlug={categorySlug}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-6 space-y-6">
              <ProgressTracker 
                topicId={topic.id}
                topicTitle={topic.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}