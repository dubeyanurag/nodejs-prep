'use client';

import React, { useState, useEffect } from 'react';
import { useProgress } from '../../lib/hooks/useProgress';
import BookmarkButton from './BookmarkButton';
import { withBasePath } from '../../lib/utils/path';

interface ProgressTrackerProps {
  topicId: string;
  topicTitle: string;
  className?: string;
  showBookmark?: boolean;
  showStudyTimer?: boolean;
}

export default function ProgressTracker({ 
  topicId, 
  topicTitle, 
  className = '',
  showBookmark = true,
  showStudyTimer = true
}: ProgressTrackerProps) {
  const progress = useProgress();
  const [showCompleteAnimation, setShowCompleteAnimation] = useState(false);
  
  const isCompleted = progress.completedTopics.has(topicId);
  const isCurrentlyStudying = progress.currentSession.currentTopic === topicId;
  const studyTime = progress.studyTime.topicTimeSpent[topicId] || 0;

  const handleToggleComplete = () => {
    if (isCompleted) {
      progress.markTopicIncomplete(topicId);
    } else {
      progress.markTopicCompleted(topicId);
      setShowCompleteAnimation(true);
      setTimeout(() => setShowCompleteAnimation(false), 2000);
    }
  };

  const handleStartStudy = () => {
    if (isCurrentlyStudying) {
      progress.endStudySession();
    } else {
      progress.startStudySession(topicId);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Progress</h3>
        {showBookmark && (
          <BookmarkButton id={topicId} type="topic" size="sm" />
        )}
      </div>

      {/* Completion Status */}
      <div className="flex items-center space-x-3 mb-4">
        <button
          onClick={handleToggleComplete}
          className={`
            flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200
            ${isCompleted 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-500 text-gray-400 hover:text-green-500'
            }
          `}
          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <div>
          <div className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
            {isCompleted ? 'Completed' : 'In Progress'}
          </div>
          <div className="text-sm text-gray-500">
            {topicTitle}
          </div>
        </div>
      </div>

      {/* Study Timer */}
      {showStudyTimer && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Study Time</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.floor(studyTime / 60)}h {studyTime % 60}m
            </span>
          </div>

          {/* Current Session */}
          {isCurrentlyStudying && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-700 font-medium">
                    Active Session
                  </span>
                </div>
                <span className="text-sm text-blue-600">
                  {progress.currentSession.sessionMinutes}m
                </span>
              </div>
            </div>
          )}

          {/* Study Button */}
          <button
            onClick={handleStartStudy}
            className={`
              w-full py-2 px-4 rounded-md text-sm font-medium transition-colors
              ${isCurrentlyStudying
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }
            `}
          >
            {isCurrentlyStudying ? 'End Study Session' : 'Start Studying'}
          </button>
        </div>
      )}

      {/* Completion Animation */}
      {showCompleteAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Topic Completed! 🎉</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TopicNavigationProps {
  currentTopicId: string;
  categorySlug: string;
  className?: string;
}

export function TopicNavigation({ 
  currentTopicId, 
  categorySlug, 
  className = '' 
}: TopicNavigationProps) {
  const progress = useProgress();
  const [adjacentTopics, setAdjacentTopics] = useState<{
    previous: any | null;
    next: any | null;
  }>({ previous: null, next: null });

  useEffect(() => {
    // This would normally use the navigation manager to get adjacent topics
    // For now, we'll use placeholder data
    setAdjacentTopics({
      previous: { id: 'prev-topic', title: 'Previous Topic', slug: 'previous-topic' },
      next: { id: 'next-topic', title: 'Next Topic', slug: 'next-topic' }
    });
  }, [currentTopicId]);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Previous Topic */}
      <div className="flex-1">
        {adjacentTopics.previous && (
          <a
            href={withBasePath(`/${categorySlug}/${adjacentTopics.previous.slug}`)}
            className="group flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div>
              <div className="text-xs text-gray-500">Previous</div>
              <div className="font-medium">{adjacentTopics.previous.title}</div>
            </div>
          </a>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center space-x-1 mx-4">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`w-2 h-2 rounded-full ${
              step <= 3 ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Next Topic */}
      <div className="flex-1 flex justify-end">
        {adjacentTopics.next && (
          <a
            href={withBasePath(`/${categorySlug}/${adjacentTopics.next.slug}`)}
            className="group flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <div className="text-right">
              <div className="text-xs text-gray-500">Next</div>
              <div className="font-medium">{adjacentTopics.next.title}</div>
            </div>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}