import React from 'react';
import Link from 'next/link';
import AppLayout from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/layout/AppLayout';
import { contentLoaderServer } from '../../lib/content-loader-server';

export default function DemoPage() {
  const categories = contentLoaderServer.getCategories();
  const allTopics = contentLoaderServer.getAllTopics();
  
  // Get some sample searches
  const nodejsTopics = contentLoaderServer.searchTopics('nodejs');
  const databaseTopics = contentLoaderServer.searchTopics('database');
  const intermediateTopics = contentLoaderServer.getTopicsByDifficulty('intermediate');

  return (
    <AppLayout>
      <div className="p-6">
        <PageHeader
          title="Content Loading Demo"
          description="Testing the dynamic content loading and routing system"
        />

        {/* Categories Overview */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category.slug} className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">
                  <Link 
                    href={`/${category.slug}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {category.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                <div className="text-sm text-gray-500">
                  {category.topics.length} topics
                </div>
                
                {/* Sample topics */}
                <div className="mt-3 space-y-1">
                  {category.topics.slice(0, 3).map(topic => (
                    <div key={topic.slug} className="text-sm">
                      <Link 
                        href={`/${category.slug}/${topic.slug}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        • {topic.title}
                      </Link>
                      <span className="text-gray-500 ml-2">
                        ({topic.difficulty}, {topic.estimatedReadTime}min)
                      </span>
                    </div>
                  ))}
                  {category.topics.length > 3 && (
                    <div className="text-sm text-gray-500">
                      ... and {category.topics.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Topics List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Topics ({allTopics.length})</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Read Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allTopics.map(topic => (
                    <tr key={`${topic.category}-${topic.slug}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          href={`/${topic.category}/${topic.slug}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {topic.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Link 
                          href={`/${topic.category}`}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          {categories.find(cat => cat.slug === topic.category)?.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          topic.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {topic.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {topic.estimatedReadTime} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {topic.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                          {topic.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{topic.tags.length - 3}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Search Examples */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Node.js Topics */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Node.js Topics ({nodejsTopics.length})</h3>
              <div className="space-y-2">
                {nodejsTopics.map(topic => (
                  <div key={`${topic.category}-${topic.slug}`} className="text-sm">
                    <Link 
                      href={`/${topic.category}/${topic.slug}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {topic.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Database Topics */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Database Topics ({databaseTopics.length})</h3>
              <div className="space-y-2">
                {databaseTopics.map(topic => (
                  <div key={`${topic.category}-${topic.slug}`} className="text-sm">
                    <Link 
                      href={`/${topic.category}/${topic.slug}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {topic.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Intermediate Topics */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Intermediate Topics ({intermediateTopics.length})</h3>
              <div className="space-y-2">
                {intermediateTopics.slice(0, 10).map(topic => (
                  <div key={`${topic.category}-${topic.slug}`} className="text-sm">
                    <Link 
                      href={`/${topic.category}/${topic.slug}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {topic.title}
                    </Link>
                    <span className="text-gray-500 ml-2">
                      ({categories.find(cat => cat.slug === topic.category)?.title})
                    </span>
                  </div>
                ))}
                {intermediateTopics.length > 10 && (
                  <div className="text-sm text-gray-500">
                    ... and {intermediateTopics.length - 10} more
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Loading Test */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Loading Test</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">Sample Content Preview</h3>
            
            {allTopics.length > 0 && (
              <div className="space-y-4">
                {allTopics.slice(0, 3).map(topic => {
                  const content = contentLoaderServer.loadTopicContent(topic.category, topic.slug);
                  return (
                    <div key={`${topic.category}-${topic.slug}`} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-900">
                        <Link 
                          href={`/${topic.category}/${topic.slug}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {topic.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Category: {categories.find(cat => cat.slug === topic.category)?.title}
                      </p>
                      {content && (
                        <p className="text-sm text-gray-700 mt-2">
                          Content loaded: {content.content.length} characters
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Home
            </Link>
            {categories.map(category => (
              <Link 
                key={category.slug}
                href={`/${category.slug}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}