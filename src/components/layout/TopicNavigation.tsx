'use client';

import React from 'react';
import Link from 'next/link';
import { NavigationItem } from '../../types/content';
import { withBasePath } from '../../lib/utils/path';
import { navigationManager, progressTracker } from '../../lib/navigation';

interface TopicNavigationProps {
  currentTopicSlug: string;
  categorySlug: string;
  className?: string;
}

export default function TopicNavigation({ 
  currentTopicSlug, 
  categorySlug, 
  className = '' 
}: TopicNavigationProps) {
  const { previous, next } = navigationManager.getAdjacentTopics(currentTopicSlug);

  return (
    <nav className={`flex justify-between items-center ${className}`}>
      {/* Previous Topic */}
      <div className="flex-1">
        {previous ? (
          <Link
            href={withBasePath(`/${categorySlug}/${previous.slug}`)}
            className="group flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <div className="text-left">
              <div className="text-xs text-gray-500">Previous</div>
              <div className="font-medium truncate max-w-xs">{previous.title}</div>
            </div>
          </Link>
        ) : (
          <div></div>
        )}
      </div>

      {/* Category Link */}
      <div className="flex-shrink-0 mx-4">
        <Link
          href={withBasePath(`/${categorySlug}`)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-blue-600 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          All Topics
        </Link>
      </div>

      {/* Next Topic */}
      <div className="flex-1 flex justify-end">
        {next ? (
          <Link
            href={withBasePath(`/${categorySlug}/${next.slug}`)}
            className="group flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <div className="text-right">
              <div className="text-xs text-gray-500">Next</div>
              <div className="font-medium truncate max-w-xs">{next.title}</div>
            </div>
            <svg
              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
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
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </nav>
  );
}

interface TableOfContentsProps {
  sections: { id: string; title: string; level: number }[];
  className?: string;
}

export function TableOfContents({ sections, className = '' }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = React.useState<string>('');

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Table of Contents
      </h3>
      
      <div className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`block w-full text-left px-2 py-1 text-sm rounded transition-colors ${
              activeSection === section.id
                ? 'text-blue-600 bg-blue-50 font-medium'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
            style={{ paddingLeft: `${(section.level - 1) * 12 + 8}px` }}
          >
            {section.title}
          </button>
        ))}
      </div>
    </nav>
  );
}

interface TopicActionsProps {
  topicId: string;
  className?: string;
}

export function TopicActions({ topicId, className = '' }: TopicActionsProps) {
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  React.useEffect(() => {
    // Initialize state from progress tracker
    setIsCompleted(progressTracker.isTopicCompleted(topicId));
    setIsBookmarked(progressTracker.isTopicBookmarked(topicId));
  }, [topicId]);

  const toggleCompleted = () => {
    if (isCompleted) {
      // Remove completion (would need to implement this in progressTracker)
      setIsCompleted(false);
    } else {
      progressTracker.markTopicCompleted(topicId);
      setIsCompleted(true);
    }
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      progressTracker.removeBookmark(topicId);
      setIsBookmarked(false);
    } else {
      progressTracker.bookmarkTopic(topicId);
      setIsBookmarked(true);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Mark as Complete */}
      <button
        onClick={toggleCompleted}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isCompleted
            ? 'text-green-700 bg-green-100 hover:bg-green-200'
            : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <svg
          className={`w-4 h-4 mr-2 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        {isCompleted ? 'Completed' : 'Mark Complete'}
      </button>

      {/* Bookmark */}
      <button
        onClick={toggleBookmark}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isBookmarked
            ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
            : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
        }`}
      >
        <svg
          className={`w-4 h-4 mr-2 ${isBookmarked ? 'text-yellow-600' : 'text-gray-400'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </button>

      {/* Share */}
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: document.title,
              url: window.location.href
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
            // Could show a toast notification here
          }
        }}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        </svg>
        Share
      </button>
    </div>
  );
}