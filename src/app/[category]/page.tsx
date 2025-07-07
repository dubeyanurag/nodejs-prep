import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/layout/AppLayout';
import { contentLoaderServer } from '../../lib/content-loader-server';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  
  // Reserved routes that should not be handled by this dynamic route
  const reservedRoutes = ['demo', 'progress', 'quick-reference', 'search', 'flashcards'];
  
  if (reservedRoutes.includes(categorySlug)) {
    notFound();
  }
  
  // Load category information from content
  const categories = contentLoaderServer.getCategories();
  const category = categories.find(cat => cat.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const topicCount = category.topics.length;

  return (
    <AppLayout>
      <div className="p-6">
        <PageHeader
          title={category.title}
          description={`Explore ${topicCount} comprehensive topics in ${category.title} for your interview preparation.`}
        />

        <div className="mt-8">
          {/* Topics Grid */}
          {category.topics && category.topics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.topics.map((topic) => (
                <div
                  key={topic.slug}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {topic.title}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {topic.estimatedReadTime} min read
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {topic.difficulty}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {topic.tags.slice(0, 2).join(', ')}
                      {topic.tags.length > 2 && ` +${topic.tags.length - 2}`}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/${categorySlug}/${topic.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Start Learning
                      <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No topics available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Topics for this category are coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export async function generateStaticParams() {
  try {
    const categories = contentLoaderServer.getCategories();
    
    // Filter out any categories that might conflict with static routes
    const reservedRoutes = ['demo', 'progress', 'quick-reference', 'search', 'flashcards'];
    const validCategories = categories.filter(category => 
      !reservedRoutes.includes(category.slug)
    );
    
    return validCategories.map((category) => ({
      category: category.slug,
    }));
  } catch (error) {
    console.warn('Error generating static params for categories:', error);
    // Return empty array if content loading fails
    return [];
  }
}