import React from 'react';
import { notFound } from 'next/navigation';
import AppLayout from '../../../components/layout/AppLayout';
import MarkdownTopicPage from '../../../components/content/MarkdownTopicPage';
import { contentLoaderServer } from '../../../lib/content-loader-server';

interface TopicPageProps {
  params: Promise<{
    category: string;
    topic: string;
  }>;
}

export default async function DynamicTopicPage({ params }: TopicPageProps) {
  const { category, topic } = await params;
  
  // Load the topic content
  const content = contentLoaderServer.loadTopicContent(category, topic);
  
  if (!content) {
    notFound();
  }

  // Get related topics
  const allTopics = contentLoaderServer.getAllTopics();
  const currentTopic = allTopics.find(t => t.slug === topic && t.category === category);
  const relatedTopics = currentTopic ? contentLoaderServer.getRelatedTopics(currentTopic) : [];

  return (
    <AppLayout>
      <div className="p-6">
        <MarkdownTopicPage 
          content={content.content}
          metadata={content.metadata}
        />

        {/* Related topics */}
        {relatedTopics.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {contentLoaderServer.getCategories().find(cat => cat.slug === relatedTopic.category)?.title}
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
    </AppLayout>
  );
}

export async function generateStaticParams() {
  return contentLoaderServer.generateStaticPaths().map(path => path.params);
}