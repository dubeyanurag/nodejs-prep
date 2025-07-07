'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '../../components/layout/AppLayout';
import { useProgress } from '../../lib/hooks/useProgress';
import { navigationManager } from '../../lib/navigation';
import { NavigationItem, Category } from '../../types/content';

export default function ProgressPage() {
  const progress = useProgress();
  const [navigationTree, setNavigationTree] = useState<NavigationItem[]>([]);
  const [recommendations, setRecommendations] = useState<NavigationItem[]>([]);

  useEffect(() => {
    // Initialize navigation with sample data
    const sampleCategories: Category[] = [
      {
        id: 'nodejs-core',
        name: 'Node.js Core',
        description: 'Essential Node.js concepts',
        topics: [
          { id: 'event-loop', title: 'Event Loop', slug: 'event-loop', category: 'nodejs-core', difficulty: 'intermediate', content: {} as any, metadata: {} as any },
          { id: 'async-await', title: 'Async/Await', slug: 'async-await', category: 'nodejs-core', difficulty: 'intermediate', content: {} as any, metadata: {} as any },
          { id: 'streams', title: 'Streams', slug: 'streams', category: 'nodejs-core', difficulty: 'advanced', content: {} as any, metadata: {} as any }
        ],
        prerequisites: [],
        estimatedHours: 8
      },
      {
        id: 'databases',
        name: 'Databases',
        description: 'SQL and NoSQL databases',
        topics: [
          { id: 'sql-basics', title: 'SQL Fundamentals', slug: 'sql-basics', category: 'databases', difficulty: 'intermediate', content: {} as any, metadata: {} as any },
          { id: 'mongodb', title: 'MongoDB', slug: 'mongodb', category: 'databases', difficulty: 'intermediate', content: {} as any, metadata: {} as any },
          { id: 'redis', title: 'Redis', slug: 'redis', category: 'databases', difficulty: 'advanced', content: {} as any, metadata: {} as any }
        ],
        prerequisites: ['nodejs-core'],
        estimatedHours: 12
      },
      {
        id: 'system-design',
        name: 'System Design',
        description: 'Scalable architecture patterns',
        topics: [
          { id: 'microservices', title: 'Microservices', slug: 'microservices', category: 'system-design', difficulty: 'advanced', content: {} as any, metadata: {} as any },
          { id: 'load-balancing', title: 'Load Balancing', slug: 'load-balancing', category: 'system-design', difficulty: 'advanced', content: {} as any, metadata: {} as any }
        ],
        prerequisites: ['nodejs-core', 'databases'],
        estimatedHours: 15
      }
    ];

    const curriculum = {
      categories: sampleCategories,
      totalTopics: sampleCategories.reduce((sum, cat) => sum + cat.topics.length, 0),
      estimatedStudyHours: sampleCategories.reduce((sum, cat) => sum + cat.estimatedHours, 0)
    };

    navigationManager.setCurriculum(curriculum);
    setNavigationTree(navigationManager.getNavigationTree());

    // Generate recommendations based on progress
    const allTopics = navigationManager.getAllTopics();
    const incompleteTopics = allTopics.filter(topic => !progress.completedTopics.has(topic.id));
    setRecommendations(incompleteTopics.slice(0, 5));
  }, [progress.completedTopics]);

  const totalTopics = navigationTree.reduce((sum, category) => 
    sum + (category.children?.length || 0), 0
  );

  const overallProgress = progress.getOverallProgress(totalTopics);
  const studyStreak = progress.getStudyStreak();

  return (
    <AppLayout showSidebar={false}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Progress</h1>
          <p className="text-gray-600">Track your learning journey and stay motivated</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Overall Progress"
            value={`${overallProgress}%`}
            subtitle={`${progress.completedTopics.size} of ${totalTopics} topics`}
            color="blue"
            icon="📊"
          />
          <ProgressCard
            title="Study Streak"
            value={`${studyStreak} days`}
            subtitle="Keep it up!"
            color="green"
            icon="🔥"
          />
          <ProgressCard
            title="Total Study Time"
            value={`${Math.floor(progress.studyTime.totalMinutes / 60)}h ${progress.studyTime.totalMinutes % 60}m`}
            subtitle={`${progress.studyTime.sessionCount} sessions`}
            color="purple"
            icon="⏱️"
          />
          <ProgressCard
            title="Bookmarks"
            value={`${progress.bookmarkedTopics.size + progress.bookmarkedQuestions.size}`}
            subtitle="Saved items"
            color="yellow"
            icon="🔖"
          />
        </div>

        {/* Current Session */}
        {progress.currentSession.startTime && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Active Study Session</h3>
                <p className="text-blue-700">
                  Studying: {progress.currentSession.currentTopic} • 
                  Time: {progress.currentSession.sessionMinutes} minutes
                </p>
              </div>
              <button
                onClick={progress.endStudySession}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress by Category</h2>
              <div className="space-y-4">
                {navigationTree.map((category) => {
                  const topicIds = category.children?.map(topic => topic.id) || [];
                  const categoryProgress = progress.getCategoryProgress(category.id, topicIds);
                  const completedTopics = topicIds.filter(id => progress.completedTopics.has(id)).length;
                  
                  return (
                    <div key={category.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/${category.slug}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {category.title}
                        </Link>
                        <span className="text-sm text-gray-500">
                          {completedTopics}/{topicIds.length} topics
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${categoryProgress}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{categoryProgress}% complete</span>
                        {categoryProgress === 100 && (
                          <span className="text-green-600 font-medium">✓ Completed</span>
                        )}
                      </div>

                      {/* Topic List */}
                      {category.children && category.children.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {category.children.map((topic) => (
                            <div key={topic.id} className="flex items-center justify-between text-sm">
                              <Link
                                href={`/${category.slug}/${topic.slug}`}
                                className="text-gray-600 hover:text-blue-600 flex items-center"
                              >
                                <span className="mr-2">
                                  {progress.completedTopics.has(topic.id) ? '✅' : '⭕'}
                                </span>
                                {topic.title}
                              </Link>
                              <div className="flex items-center space-x-2">
                                {progress.bookmarkedTopics.has(topic.id) && (
                                  <span className="text-yellow-500">🔖</span>
                                )}
                                <button
                                  onClick={() => progress.toggleTopicBookmark(topic.id)}
                                  className="text-gray-400 hover:text-yellow-500"
                                  title={progress.bookmarkedTopics.has(topic.id) ? 'Remove bookmark' : 'Add bookmark'}
                                >
                                  {progress.bookmarkedTopics.has(topic.id) ? '★' : '☆'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommendations */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Next</h3>
              <div className="space-y-3">
                {recommendations.length > 0 ? (
                  recommendations.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between">
                      <Link
                        href={`/${topic.parentId}/${topic.slug}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {topic.title}
                      </Link>
                      <button
                        onClick={() => progress.startStudySession(topic.id)}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        Start
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">All topics completed! 🎉</p>
                )}
              </div>
            </div>

            {/* Bookmarks */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bookmarks</h3>
              <div className="space-y-2">
                {progress.bookmarkedTopics.size > 0 ? (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Topics</h4>
                    {Array.from(progress.bookmarkedTopics).slice(0, 5).map((topicId) => (
                      <div key={topicId} className="text-sm text-gray-600">
                        📄 {topicId}
                      </div>
                    ))}
                  </div>
                ) : null}
                
                {progress.bookmarkedQuestions.size > 0 ? (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Questions</h4>
                    {Array.from(progress.bookmarkedQuestions).slice(0, 5).map((questionId) => (
                      <div key={questionId} className="text-sm text-gray-600">
                        ❓ {questionId}
                      </div>
                    ))}
                  </div>
                ) : null}

                {progress.bookmarkedTopics.size === 0 && progress.bookmarkedQuestions.size === 0 && (
                  <p className="text-gray-500 text-sm">No bookmarks yet</p>
                )}
              </div>
            </div>

            {/* Study Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Daily Goal</span>
                  <span className="font-medium">{progress.studyTime.dailyGoalMinutes} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average Session</span>
                  <span className="font-medium">
                    {progress.studyTime.sessionCount > 0 
                      ? Math.round(progress.studyTime.totalMinutes / progress.studyTime.sessionCount)
                      : 0} min
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Study</span>
                  <span className="font-medium">
                    {progress.studyTime.lastStudyDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const data = progress.exportProgress();
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'progress-backup.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-1"
                >
                  📥 Export Progress
                </button>
                <label className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-1 cursor-pointer block">
                  📤 Import Progress
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = JSON.parse(event.target?.result as string);
                            progress.importProgress(data);
                            alert('Progress imported successfully!');
                          } catch (error) {
                            alert('Failed to import progress. Please check the file format.');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                      progress.resetProgress();
                    }
                  }}
                  className="w-full text-left text-sm text-red-600 hover:text-red-800 py-1"
                >
                  🗑️ Reset Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

interface ProgressCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  icon: string;
}

function ProgressCard({ title, value, subtitle, color, icon }: ProgressCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900'
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium opacity-75">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-75">{subtitle}</div>
    </div>
  );
}