import React from 'react';
import { notFound } from 'next/navigation';
import AppLayout from '../../../components/layout/AppLayout';
import MarkdownTopicPage from '../../../components/content/MarkdownTopicPage';
import { contentLoaderServer } from '../../../lib/content-loader-server';
import TopicPageWithTOC from '../../../components/content/TopicPageWithTOC';

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
    <TopicPageWithTOC
      content={content.content}
      metadata={content.metadata}
      relatedTopics={relatedTopics}
      category={category}
      topic={topic}
    />
  );
}

export async function generateStaticParams() {
  return contentLoaderServer.generateStaticPaths().map(path => path.params);
}