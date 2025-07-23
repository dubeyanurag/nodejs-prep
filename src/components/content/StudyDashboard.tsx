'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProgress } from '../../lib/hooks/useProgress';
import { NavigationItem } from '../../types/content';
import BookmarkButton, { BookmarkList } from './BookmarkButton';
import { getNavigationManager } from '../../lib/navigation-sync';
import { withBasePath } from '../../lib/utils/path';

interface StudyDashboardProps {
  className?: string;
}

export default function StudyDashboard({ className = '' }: StudyDashboardProps) {
  const progress = useProgress();
  const [recommendations, setRecommendations] = useState<NavigationItem[]>([]);
  const [recentTopics, setRecentTopics] = useState<NavigationItem[]>([]);
  const [weeklyGoal, setWeeklyGoal] = useState(420); // 7 hours in minutes

  useEffect(() => {
    // Generate recommendations based on progress and prerequisites
    const navigationManager = getNavigationManager();
    const allTopics = navigationManager.getAllTopics();
    const incompleteTopics = allTopics.filter(topic => !progress.completedTopics.has(topic.id));

    // Sort by difficulty and prerequisites
    const sortedRecommendations = incompleteTopics
      .slice(0, 6)
      .map(topic => ({
        ...topic,
        priority: calculateTopicPriority(topic, progress)
      }))
      .sort((a, b) => b.priority - a.priority);

    setRecommendations(sortedRecommendations);

    // Get recently studied topics
    const topicsWithTime = Object.entries(progress.studyTime.topicTimeSpent)
      .map(([topicId, time]) => ({
        id: topicId,
        time,
        topic: allTopics.find(t => t.id === topicId)
      }))
      .filter(item => item.topic)
      .sort((a, b) => b.time - a.time)
      .slice(0, 5)
      .map(item => item.topic!);

    setRecentTopics(topicsWithTime);
  }, [progress.completedTopics, progress.studyTime]);

  const weeklyProgress = Math.min(100, (progress.studyTime.totalMinutes / weeklyGoal) * 100);
  const dailyAverage = progress.studyTime.sessionCount > 0
    ? Math.round(progress.studyTime.totalMinutes / Math.max(1, progress.getStudyStreak()))
    : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
        <p className="text-blue-100">
          You've completed {progress.completedTopics.size} topics and studied for{' '}
          {Math.floor(progress.studyTime.totalMinutes / 60)} hours total.
        </p>
        {progress.getStudyStreak() > 0 && (
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-2xl">🔥</span>
            <span className="font-medium">
              {progress.getStudyStreak()} day study streak!
            </span>
          </div>
        )}
      </div>

      {/* Current Session Alert */}
      {progress.currentSession.startTime && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-medium text-green-900">Active Study Session</h3>
                <p className="text-green-700 text-sm">
                  Studying: {progress.currentSession.currentTopic} •
                  {progress.currentSession.sessionMinutes} minutes
                </p>
              </div>
            </div>
            <button
              onClick={progress.endStudySession}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              End Session
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Topics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
              <Link
                href={withBasePath("/progress")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.slice(0, 4).map((topic) => (
                <RecommendationCard
                  key={topic.id}
                  topic={topic}
                  onStartStudy={() => progress.startStudySession(topic.id)}
                />
              ))}
            </div>

            {recommendations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎉</div>
                <p>All topics completed! Great job!</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

            {recentTopics.length > 0 ? (
              <div className="space-y-3">
                {recentTopics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${progress.completedTopics.has(topic.id) ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                      <div>
                        <Link
                          href={withBasePath(`/${topic.parentId}/${topic.slug}`)}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {topic.title}
                        </Link>
                        <div className="text-sm text-gray-500">
                          {progress.studyTime.topicTimeSpent[topic.id] || 0} minutes studied
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookmarkButton id={topic.id} type="topic" size="sm" />
                      {progress.completedTopics.has(topic.id) && (
                        <span className="text-green-500 text-sm">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>No recent activity. Start studying to see your progress here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weekly Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Goal</h3>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{Math.round(weeklyProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">This week</span>
                <span className="font-medium">
                  {Math.floor(progress.studyTime.totalMinutes / 60)}h {progress.studyTime.totalMinutes % 60}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily average</span>
                <span className="font-medium">{dailyAverage}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Goal</span>
                <span className="font-medium">{Math.floor(weeklyGoal / 60)}h</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">📚</span>
                  <span className="text-sm text-gray-600">Topics completed</span>
                </div>
                <span className="font-medium">{progress.completedTopics.size}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">🔖</span>
                  <span className="text-sm text-gray-600">Bookmarks</span>
                </div>
                <span className="font-medium">
                  {progress.bookmarkedTopics.size + progress.bookmarkedQuestions.size}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">📊</span>
                  <span className="text-sm text-gray-600">Study sessions</span>
                </div>
                <span className="font-medium">{progress.studyTime.sessionCount}</span>
              </div>
            </div>
          </div>

          {/* Bookmarks */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Bookmarks</h3>
              <Link
                href={withBasePath("/bookmarks")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Topics</h4>
                <BookmarkList type="topic" limit={3} />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Questions</h4>
                <BookmarkList type="question" limit={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RecommendationCardProps {
  topic: NavigationItem & { priority?: number };
  onStartStudy: () => void;
}

function RecommendationCard({ topic, onStartStudy }: RecommendationCardProps) {
  const progress = useProgress();
  const studyTime = progress.studyTime.topicTimeSpent[topic.id] || 0;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <Link
          href={withBasePath(`/${topic.parentId}/${topic.slug}`)}
          className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
        >
          {topic.title}
        </Link>
        <BookmarkButton id={topic.id} type="topic" size="sm" />
      </div>

      <div className="text-sm text-gray-500 mb-3">
        {studyTime > 0 ? `${studyTime}m studied` : 'Not started'}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onStartStudy}
          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
        >
          Start Studying
        </button>

        {topic.priority && topic.priority > 0.8 && (
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
            High Priority
          </span>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate topic priority based on prerequisites and difficulty
function calculateTopicPriority(topic: NavigationItem, progress: any): number {
  let priority = 0.5; // Base priority

  // Boost priority for topics that haven't been started
  const studyTime = progress.studyTime.topicTimeSpent[topic.id] || 0;
  if (studyTime === 0) {
    priority += 0.2;
  }

  // Boost priority for bookmarked topics
  if (progress.bookmarkedTopics.has(topic.id)) {
    priority += 0.3;
  }

  // Random factor to add variety
  priority += Math.random() * 0.1;

  return Math.min(1, priority);
}