'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationItem, Category } from '../../types/content';
import { navigationManager, progressTracker } from '../../lib/navigation';
import { withBasePath } from '../../lib/utils/path';

interface SidebarNavigationProps {
  currentCategory?: string;
  className?: string;
}

export default function SidebarNavigation({ 
  currentCategory, 
  className = '' 
}: SidebarNavigationProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(currentCategory ? [currentCategory] : [])
  );
  const pathname = usePathname();
  const navigationTree = navigationManager.getNavigationTree();

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const isActiveRoute = (categorySlug: string, topicSlug?: string) => {
    if (topicSlug) {
      return pathname === `/${categorySlug}/${topicSlug}`;
    }
    return pathname === `/${categorySlug}` || pathname.startsWith(`/${categorySlug}/`);
  };

  return (
    <nav className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Course Navigation
        </h2>
        
        <div className="space-y-2">
          {navigationTree.map((category) => {
            const isExpanded = expandedCategories.has(category.id);
            const isActive = isActiveRoute(category.slug);
            const hasTopics = category.children && category.children.length > 0;

            return (
              <div key={category.id} className="space-y-1">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <Link
                    href={withBasePath(`/${category.slug}`)}
                    className={`flex-1 flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{category.title}</span>
                    {hasTopics && (
                      <span className="ml-2 text-xs text-gray-500">
                        {category.children?.length}
                      </span>
                    )}
                  </Link>
                  
                  {hasTopics && (
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      <svg
                        className={`w-4 h-4 transform transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Topics List */}
                {hasTopics && isExpanded && (
                  <div className="ml-4 space-y-1">
                    {category.children?.map((topic) => {
                      const isTopicActive = isActiveRoute(category.slug, topic.slug);
                      const isCompleted = progressTracker.isTopicCompleted(topic.id);
                      const isBookmarked = progressTracker.isTopicBookmarked(topic.id);

                      return (
                        <Link
                          key={topic.id}
                          href={withBasePath(`/${category.slug}/${topic.slug}`)}
                          className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors group ${
                            isTopicActive
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                          }`}
                        >
                          {/* Completion Status */}
                          <div className="flex-shrink-0 mr-2">
                            {isCompleted ? (
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                            )}
                          </div>

                          {/* Topic Title */}
                          <span className="flex-1 truncate">{topic.title}</span>

                          {/* Bookmark Icon */}
                          {isBookmarked && (
                            <svg className="w-4 h-4 text-yellow-500 flex-shrink-0 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

interface CategoryProgressProps {
  category: Category;
  className?: string;
}

export function CategoryProgress({ category, className = '' }: CategoryProgressProps) {
  const progress = progressTracker.getCategoryProgress(category);
  const completedTopics = category.topics.filter(topic => 
    progressTracker.isTopicCompleted(topic.id)
  ).length;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Progress</h3>
        <span className="text-sm text-gray-600">
          {completedTopics}/{category.topics.length}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-xs text-gray-600">
        {progress}% complete
      </p>
    </div>
  );
}

interface QuickLinksProps {
  className?: string;
}

export function QuickLinks({ className = '' }: QuickLinksProps) {
  const bookmarkedTopics = progressTracker.getBookmarkedTopics();
  const recommendedTopics = navigationManager.getAllTopics().slice(0, 3);

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Links</h3>
      
      <div className="space-y-3">
        {/* Bookmarks */}
        {bookmarkedTopics.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Bookmarks</h4>
            <div className="space-y-1">
              {bookmarkedTopics.slice(0, 3).map((topicId) => {
                const allTopics = navigationManager.getAllTopics();
                const topic = allTopics.find(t => t.id === topicId);
                if (!topic) return null;

                return (
                  <Link
                    key={topicId}
                    href={withBasePath(`/${topic.parentId}/${topic.slug}`)}
                    className="block text-xs text-blue-600 hover:text-blue-800 truncate"
                  >
                    {topic.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommended */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-2">Recommended</h4>
          <div className="space-y-1">
            {recommendedTopics.map((topic) => (
              <Link
                key={topic.id}
                href={withBasePath(`/${topic.parentId}/${topic.slug}`)}
                className="block text-xs text-blue-600 hover:text-blue-800 truncate"
              >
                {topic.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-2">Quick Actions</h4>
          <div className="space-y-1">
            <Link
              href={withBasePath("/search")}
              className="block text-xs text-blue-600 hover:text-blue-800"
            >
              Search Topics
            </Link>
            <Link
              href={withBasePath("/flashcards")}
              className="block text-xs text-blue-600 hover:text-blue-800"
            >
              Practice Flashcards
            </Link>
            <Link
              href={withBasePath("/progress")}
              className="block text-xs text-blue-600 hover:text-blue-800"
            >
              View Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}