'use client';

import React, { useState } from 'react';
import AppLayout from '../layout/AppLayout';
import MarkdownTopicPage from './MarkdownTopicPage';
import TableOfContents, { FloatingTableOfContents } from './TableOfContents';
import TopicNavigation, { TopicActions } from '../layout/TopicNavigation';
import { ContentMetadata } from '../../lib/content-loader-server';
import { HeadingItem } from '../../lib/utils/markdown-headings';

interface RelatedTopic {
  title: string;
  category: string;
  slug: string;
  difficulty: string;
  estimatedReadTime: number;
}

interface TopicPageWithTOCProps {
  content: string;
  metadata: ContentMetadata;
  relatedTopics: RelatedTopic[];
  category: string;
  topic: string;
}

export default function TopicPageWithTOC({
  content,
  metadata,
  relatedTopics,
  category,
  topic
}: TopicPageWithTOCProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  const handleHeadingsExtracted = (extractedHeadings: HeadingItem[]) => {
    setHeadings(extractedHeadings);
  };

  return (
    <AppLayout showSidebar={false}>
      <div className="flex flex-col lg:flex-row gap-8 max-w-none">
        {/* Main Content */}
        <main className="flex-1 min-w-0 max-w-none">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 lg:p-8">
              {/* Topic Navigation */}
              <div className="mb-6">
                <TopicNavigation 
                  currentTopicSlug={topic}
                  categorySlug={category}
                />
              </div>

              {/* Topic Actions */}
              <div className="mb-6 flex justify-end">
                <TopicActions topicId={`${category}-${topic}`} />
              </div>

              {/* Main Content */}
              <div className="max-w-none">
                <MarkdownTopicPage 
                  content={content}
                  metadata={metadata}
                  onHeadingsExtracted={handleHeadingsExtracted}
                />
              </div>

              {/* Related topics */}
              {relatedTopics.length > 0 && (
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Topics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {relatedTopics.map(relatedTopic => (
                      <a
                        key={`${relatedTopic.category}-${relatedTopic.slug}`}
                        href={`/${relatedTopic.category}/${relatedTopic.slug}`}
                        className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200"
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {relatedTopic.title}
                        </h3>
                        <div className="text-sm text-gray-600 mb-2">
                          {relatedTopic.category}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="capitalize">{relatedTopic.difficulty}</span>
                          <span className="mx-2">•</span>
                          <span>{relatedTopic.estimatedReadTime} min</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Table of Contents */}
        <aside className="hidden lg:block lg:w-80 xl:w-96 flex-shrink-0">
          <div className="sticky top-6 h-[calc(100vh-8rem)]">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>

      {/* Floating TOC for mobile */}
      <FloatingTableOfContents headings={headings} />
    </AppLayout>
  );
}