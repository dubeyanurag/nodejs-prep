'use client';

import React from 'react';
import { useProgress } from '../../lib/hooks/useProgress';

interface BookmarkButtonProps {
  id: string;
  type: 'topic' | 'question';
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function BookmarkButton({ 
  id, 
  type, 
  className = '', 
  showLabel = false,
  size = 'md'
}: BookmarkButtonProps) {
  const progress = useProgress();
  
  const isBookmarked = type === 'topic' 
    ? progress.bookmarkedTopics.has(id)
    : progress.bookmarkedQuestions.has(id);

  const handleToggle = () => {
    if (type === 'topic') {
      progress.toggleTopicBookmark(id);
    } else {
      progress.toggleQuestionBookmark(id);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4 text-sm',
    md: 'w-5 h-5 text-base',
    lg: 'w-6 h-6 text-lg'
  };

  const buttonClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2'
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        inline-flex items-center justify-center rounded-md transition-colors
        ${buttonClasses[size]}
        ${isBookmarked 
          ? 'text-yellow-500 hover:text-yellow-600' 
          : 'text-gray-400 hover:text-yellow-500'
        }
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
        ${className}
      `}
      title={isBookmarked ? `Remove ${type} bookmark` : `Bookmark this ${type}`}
      aria-label={isBookmarked ? `Remove ${type} bookmark` : `Bookmark this ${type}`}
    >
      <svg 
        className={sizeClasses[size]} 
        fill={isBookmarked ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
        />
      </svg>
      {showLabel && (
        <span className="ml-1 text-sm">
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
    </button>
  );
}

interface BookmarkListProps {
  type: 'topic' | 'question';
  limit?: number;
  showEmpty?: boolean;
  className?: string;
}

export function BookmarkList({ 
  type, 
  limit, 
  showEmpty = true, 
  className = '' 
}: BookmarkListProps) {
  const progress = useProgress();
  
  const bookmarks = type === 'topic' 
    ? Array.from(progress.bookmarkedTopics)
    : Array.from(progress.bookmarkedQuestions);

  const displayBookmarks = limit ? bookmarks.slice(0, limit) : bookmarks;

  if (displayBookmarks.length === 0 && !showEmpty) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {displayBookmarks.length > 0 ? (
        displayBookmarks.map((id) => (
          <BookmarkItem key={id} id={id} type={type} />
        ))
      ) : (
        showEmpty && (
          <div className="text-gray-500 text-sm italic">
            No {type}s bookmarked yet
          </div>
        )
      )}
      {limit && bookmarks.length > limit && (
        <div className="text-sm text-gray-500">
          And {bookmarks.length - limit} more...
        </div>
      )}
    </div>
  );
}

interface BookmarkItemProps {
  id: string;
  type: 'topic' | 'question';
}

function BookmarkItem({ id, type }: BookmarkItemProps) {
  const progress = useProgress();

  const handleRemove = () => {
    if (type === 'topic') {
      progress.toggleTopicBookmark(id);
    } else {
      progress.toggleQuestionBookmark(id);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <div className="flex items-center space-x-2">
        <span className="text-yellow-500">
          {type === 'topic' ? '📄' : '❓'}
        </span>
        <span className="text-sm text-gray-700 truncate">
          {id}
        </span>
      </div>
      <button
        onClick={handleRemove}
        className="text-gray-400 hover:text-red-500 p-1 rounded"
        title="Remove bookmark"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}