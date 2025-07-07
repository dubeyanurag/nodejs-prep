'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProgress, StudyTimeTracker, FlashcardProgress } from '../../types/content';

interface ProgressState {
  completedTopics: Set<string>;
  bookmarkedQuestions: Set<string>;
  bookmarkedTopics: Set<string>;
  flashcardProgress: Map<string, FlashcardProgress>;
  studyTime: StudyTimeTracker;
  currentSession: {
    startTime: Date | null;
    currentTopic: string | null;
    sessionMinutes: number;
  };
}

interface ProgressActions {
  markTopicCompleted: (topicId: string) => void;
  markTopicIncomplete: (topicId: string) => void;
  toggleTopicBookmark: (topicId: string) => void;
  toggleQuestionBookmark: (questionId: string) => void;
  startStudySession: (topicId: string) => void;
  endStudySession: () => void;
  updateFlashcardProgress: (cardId: string, correct: boolean) => void;
  getTopicProgress: (topicId: string) => number;
  getCategoryProgress: (categoryId: string, topicIds: string[]) => number;
  getOverallProgress: (totalTopics: number) => number;
  getStudyStreak: () => number;
  exportProgress: () => UserProgress;
  importProgress: (progress: UserProgress) => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'nodejs-interview-prep-progress';

const initialState: ProgressState = {
  completedTopics: new Set(),
  bookmarkedQuestions: new Set(),
  bookmarkedTopics: new Set(),
  flashcardProgress: new Map(),
  studyTime: {
    totalMinutes: 0,
    sessionCount: 0,
    lastStudyDate: new Date(),
    topicTimeSpent: {},
    dailyGoalMinutes: 60,
    streakDays: 0
  },
  currentSession: {
    startTime: null,
    currentTopic: null,
    sessionMinutes: 0
  }
};

export function useProgress(): ProgressState & ProgressActions {
  const [state, setState] = useState<ProgressState>(initialState);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setState(prevState => ({
          ...prevState,
          completedTopics: new Set(parsed.completedTopics || []),
          bookmarkedQuestions: new Set(parsed.bookmarkedQuestions || []),
          bookmarkedTopics: new Set(parsed.bookmarkedTopics || []),
          flashcardProgress: new Map(
            (parsed.flashcardProgress || []).map((item: any) => [
              item.cardId,
              {
                ...item,
                lastReviewed: new Date(item.lastReviewed),
                nextReviewDate: item.nextReviewDate ? new Date(item.nextReviewDate) : undefined
              }
            ])
          ),
          studyTime: {
            ...parsed.studyTime,
            lastStudyDate: new Date(parsed.studyTime?.lastStudyDate || Date.now())
          }
        }));
      } catch (error) {
        console.error('Failed to load progress from localStorage:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    const progressToSave = {
      completedTopics: Array.from(state.completedTopics),
      bookmarkedQuestions: Array.from(state.bookmarkedQuestions),
      bookmarkedTopics: Array.from(state.bookmarkedTopics),
      flashcardProgress: Array.from(state.flashcardProgress.entries()).map(([cardId, progress]) => ({
        cardId,
        ...progress,
        lastReviewed: progress.lastReviewed.toISOString(),
        nextReviewDate: progress.nextReviewDate?.toISOString()
      })),
      studyTime: {
        ...state.studyTime,
        lastStudyDate: state.studyTime.lastStudyDate.toISOString()
      }
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressToSave));
  }, [state]);

  // Update session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.currentSession.startTime) {
      interval = setInterval(() => {
        setState(prevState => {
          const now = new Date();
          const sessionMinutes = Math.floor(
            (now.getTime() - (prevState.currentSession.startTime?.getTime() || 0)) / (1000 * 60)
          );

          return {
            ...prevState,
            currentSession: {
              ...prevState.currentSession,
              sessionMinutes
            }
          };
        });
      }, 60000); // Update every minute
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.currentSession.startTime]);

  const markTopicCompleted = useCallback((topicId: string) => {
    setState(prevState => ({
      ...prevState,
      completedTopics: new Set([...prevState.completedTopics, topicId])
    }));
  }, []);

  const markTopicIncomplete = useCallback((topicId: string) => {
    setState(prevState => {
      const newCompleted = new Set(prevState.completedTopics);
      newCompleted.delete(topicId);
      return {
        ...prevState,
        completedTopics: newCompleted
      };
    });
  }, []);

  const toggleTopicBookmark = useCallback((topicId: string) => {
    setState(prevState => {
      const newBookmarks = new Set(prevState.bookmarkedTopics);
      if (newBookmarks.has(topicId)) {
        newBookmarks.delete(topicId);
      } else {
        newBookmarks.add(topicId);
      }
      return {
        ...prevState,
        bookmarkedTopics: newBookmarks
      };
    });
  }, []);

  const toggleQuestionBookmark = useCallback((questionId: string) => {
    setState(prevState => {
      const newBookmarks = new Set(prevState.bookmarkedQuestions);
      if (newBookmarks.has(questionId)) {
        newBookmarks.delete(questionId);
      } else {
        newBookmarks.add(questionId);
      }
      return {
        ...prevState,
        bookmarkedQuestions: newBookmarks
      };
    });
  }, []);

  const startStudySession = useCallback((topicId: string) => {
    setState(prevState => ({
      ...prevState,
      currentSession: {
        startTime: new Date(),
        currentTopic: topicId,
        sessionMinutes: 0
      }
    }));
  }, []);

  const endStudySession = useCallback(() => {
    setState(prevState => {
      if (!prevState.currentSession.startTime || !prevState.currentSession.currentTopic) {
        return prevState;
      }

      const sessionMinutes = prevState.currentSession.sessionMinutes;
      const topicId = prevState.currentSession.currentTopic;
      const now = new Date();

      // Calculate streak
      const lastStudyDate = prevState.studyTime.lastStudyDate;
      const daysDiff = Math.floor((now.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24));
      let newStreak = prevState.studyTime.streakDays;

      if (daysDiff === 0) {
        // Same day, maintain streak
      } else if (daysDiff === 1) {
        // Next day, increment streak
        newStreak += 1;
      } else {
        // Gap in days, reset streak
        newStreak = 1;
      }

      return {
        ...prevState,
        studyTime: {
          ...prevState.studyTime,
          totalMinutes: prevState.studyTime.totalMinutes + sessionMinutes,
          sessionCount: prevState.studyTime.sessionCount + 1,
          lastStudyDate: now,
          topicTimeSpent: {
            ...prevState.studyTime.topicTimeSpent,
            [topicId]: (prevState.studyTime.topicTimeSpent[topicId] || 0) + sessionMinutes
          },
          streakDays: newStreak
        },
        currentSession: {
          startTime: null,
          currentTopic: null,
          sessionMinutes: 0
        }
      };
    });
  }, []);

  const updateFlashcardProgress = useCallback((cardId: string, correct: boolean) => {
    setState(prevState => {
      const currentProgress = prevState.flashcardProgress.get(cardId) || {
        cardId,
        status: 'new' as const,
        lastReviewed: new Date(),
        correctCount: 0,
        incorrectCount: 0
      };

      const newProgress: FlashcardProgress = {
        ...currentProgress,
        lastReviewed: new Date(),
        correctCount: correct ? currentProgress.correctCount + 1 : currentProgress.correctCount,
        incorrectCount: correct ? currentProgress.incorrectCount : currentProgress.incorrectCount + 1
      };

      // Update status based on performance
      const totalReviews = newProgress.correctCount + newProgress.incorrectCount;
      const accuracy = totalReviews > 0 ? newProgress.correctCount / totalReviews : 0;

      if (accuracy >= 0.8 && totalReviews >= 3) {
        newProgress.status = 'mastered';
      } else if (accuracy >= 0.6 && totalReviews >= 2) {
        newProgress.status = 'review';
      } else if (totalReviews > 0) {
        newProgress.status = 'learning';
      }

      // Calculate next review date using spaced repetition
      const baseInterval = correct ? 
        (newProgress.status === 'mastered' ? 7 : newProgress.status === 'review' ? 3 : 1) : 
        1;
      
      newProgress.nextReviewDate = new Date(Date.now() + baseInterval * 24 * 60 * 60 * 1000);

      const newFlashcardProgress = new Map(prevState.flashcardProgress);
      newFlashcardProgress.set(cardId, newProgress);

      return {
        ...prevState,
        flashcardProgress: newFlashcardProgress
      };
    });
  }, []);

  const getTopicProgress = useCallback((topicId: string): number => {
    return state.completedTopics.has(topicId) ? 100 : 0;
  }, [state.completedTopics]);

  const getCategoryProgress = useCallback((categoryId: string, topicIds: string[]): number => {
    if (topicIds.length === 0) return 0;
    const completedCount = topicIds.filter(id => state.completedTopics.has(id)).length;
    return Math.round((completedCount / topicIds.length) * 100);
  }, [state.completedTopics]);

  const getOverallProgress = useCallback((totalTopics: number): number => {
    if (totalTopics === 0) return 0;
    return Math.round((state.completedTopics.size / totalTopics) * 100);
  }, [state.completedTopics]);

  const getStudyStreak = useCallback((): number => {
    return state.studyTime.streakDays;
  }, [state.studyTime.streakDays]);

  const exportProgress = useCallback((): UserProgress => {
    return {
      completedTopics: Array.from(state.completedTopics),
      bookmarkedQuestions: Array.from(state.bookmarkedQuestions),
      flashcardProgress: Array.from(state.flashcardProgress.values()),
      studyTime: state.studyTime
    };
  }, [state]);

  const importProgress = useCallback((progress: UserProgress) => {
    setState(prevState => ({
      ...prevState,
      completedTopics: new Set(progress.completedTopics),
      bookmarkedQuestions: new Set(progress.bookmarkedQuestions),
      flashcardProgress: new Map(
        progress.flashcardProgress.map(item => [item.cardId, item])
      ),
      studyTime: progress.studyTime
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    ...state,
    markTopicCompleted,
    markTopicIncomplete,
    toggleTopicBookmark,
    toggleQuestionBookmark,
    startStudySession,
    endStudySession,
    updateFlashcardProgress,
    getTopicProgress,
    getCategoryProgress,
    getOverallProgress,
    getStudyStreak,
    exportProgress,
    importProgress,
    resetProgress
  };
}