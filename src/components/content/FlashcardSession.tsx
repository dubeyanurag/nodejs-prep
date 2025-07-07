'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard as FlashcardType, FlashcardProgress } from '@/types/content';
import { SpacedRepetitionEngine, ReviewResult } from '@/lib/spaced-repetition';
import Flashcard from './Flashcard';

interface FlashcardSessionProps {
  flashcards: FlashcardType[];
  initialProgress?: FlashcardProgress[];
  onProgressUpdate: (progress: FlashcardProgress[]) => void;
  onSessionComplete?: (stats: SessionStats) => void;
  maxCardsPerSession?: number;
  showProgressBar?: boolean;
  className?: string;
}

interface SessionStats {
  totalCards: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedCards: number;
  sessionDuration: number; // in seconds
  cardsReviewed: string[];
}

export default function FlashcardSession({
  flashcards,
  initialProgress = [],
  onProgressUpdate,
  onSessionComplete,
  maxCardsPerSession = 20,
  showProgressBar = true,
  className = ''
}: FlashcardSessionProps) {
  const [srEngine] = useState(() => new SpacedRepetitionEngine());
  const [progress, setProgress] = useState<FlashcardProgress[]>(initialProgress);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<FlashcardType[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalCards: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    skippedCards: 0,
    sessionDuration: 0,
    cardsReviewed: []
  });
  const [sessionStartTime] = useState(() => Date.now());
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  // Initialize session
  useEffect(() => {
    initializeSession();
  }, [flashcards, initialProgress]);

  const initializeSession = useCallback(() => {
    // Create progress entries for new cards
    const progressMap = new Map(initialProgress.map(p => [p.cardId, p]));
    const allProgress: FlashcardProgress[] = flashcards.map(card => {
      if (progressMap.has(card.id)) {
        return progressMap.get(card.id)!;
      }
      return {
        cardId: card.id,
        status: 'new' as const,
        lastReviewed: new Date(),
        correctCount: 0,
        incorrectCount: 0,
        nextReviewDate: new Date()
      };
    });

    // Get due cards and sort by priority
    const dueProgress = srEngine.getDueCards(allProgress);
    const sortedProgress = srEngine.sortCardsByPriority(dueProgress);
    
    // Limit session size
    const sessionProgress = sortedProgress.slice(0, maxCardsPerSession);
    const sessionCardIds = new Set(sessionProgress.map(p => p.cardId));
    const cardsForSession = flashcards.filter(card => sessionCardIds.has(card.id));

    setProgress(allProgress);
    setSessionCards(cardsForSession);
    setSessionStats(prev => ({
      ...prev,
      totalCards: cardsForSession.length
    }));
    setCurrentCardIndex(0);
    setIsSessionComplete(false);
  }, [flashcards, initialProgress, maxCardsPerSession, srEngine]);

  const handleAnswer = useCallback((cardId: string, isCorrect: boolean) => {
    const result: ReviewResult = isCorrect ? 'good' : 'again';
    
    setProgress(prevProgress => {
      const updatedProgress = prevProgress.map(p => {
        if (p.cardId === cardId) {
          return srEngine.updateProgress(p, result);
        }
        return p;
      });
      
      // Update session stats
      setSessionStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
        cardsReviewed: [...prev.cardsReviewed, cardId]
      }));

      // Move to next card or complete session
      if (currentCardIndex < sessionCards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        completeSession(updatedProgress);
      }

      return updatedProgress;
    });
  }, [currentCardIndex, sessionCards.length, srEngine]);

  const handleSkip = useCallback((cardId: string) => {
    setSessionStats(prev => ({
      ...prev,
      skippedCards: prev.skippedCards + 1,
      cardsReviewed: [...prev.cardsReviewed, cardId]
    }));

    // Move to next card or complete session
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      completeSession(progress);
    }
  }, [currentCardIndex, sessionCards.length, progress]);

  const completeSession = useCallback((finalProgress: FlashcardProgress[]) => {
    const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
    const finalStats = {
      ...sessionStats,
      sessionDuration
    };

    setIsSessionComplete(true);
    onProgressUpdate(finalProgress);
    onSessionComplete?.(finalStats);
  }, [sessionStats, sessionStartTime, onProgressUpdate, onSessionComplete]);

  const restartSession = () => {
    initializeSession();
  };

  const getCurrentProgress = () => {
    return progress.find(p => p.cardId === sessionCards[currentCardIndex]?.id);
  };

  if (sessionCards.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No cards due for review!
          </h3>
          <p className="text-gray-600 mb-6">
            Great job! You're all caught up with your flashcard reviews. 
            Check back later for more cards to review.
          </p>
          <button
            onClick={initializeSession}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Refresh Session
          </button>
        </div>
      </div>
    );
  }

  if (isSessionComplete) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Session Complete!
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h4 className="font-medium text-gray-800 mb-3">Session Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Cards reviewed:</span>
                <span className="font-medium">{sessionStats.totalCards}</span>
              </div>
              <div className="flex justify-between">
                <span>Correct answers:</span>
                <span className="font-medium text-green-600">{sessionStats.correctAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span>Incorrect answers:</span>
                <span className="font-medium text-red-600">{sessionStats.incorrectAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span>Skipped cards:</span>
                <span className="font-medium text-gray-600">{sessionStats.skippedCards}</span>
              </div>
              <div className="flex justify-between">
                <span>Session time:</span>
                <span className="font-medium">{Math.floor(sessionStats.sessionDuration / 60)}m {sessionStats.sessionDuration % 60}s</span>
              </div>
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="font-medium">
                  {sessionStats.totalCards > 0 
                    ? Math.round((sessionStats.correctAnswers / (sessionStats.correctAnswers + sessionStats.incorrectAnswers)) * 100) || 0
                    : 0}%
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={restartSession}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  const currentCard = sessionCards[currentCardIndex];
  const currentProgress = getCurrentProgress();

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress bar */}
      {showProgressBar && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Card {currentCardIndex + 1} of {sessionCards.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentCardIndex) / sessionCards.length) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentCardIndex / sessionCards.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Current session stats */}
      <div className="flex justify-center space-x-6 mb-6 text-sm">
        <div className="text-center">
          <div className="text-green-600 font-semibold">{sessionStats.correctAnswers}</div>
          <div className="text-gray-500">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-red-600 font-semibold">{sessionStats.incorrectAnswers}</div>
          <div className="text-gray-500">Incorrect</div>
        </div>
        <div className="text-center">
          <div className="text-gray-600 font-semibold">{sessionStats.skippedCards}</div>
          <div className="text-gray-500">Skipped</div>
        </div>
      </div>

      {/* Current flashcard */}
      {currentCard && (
        <Flashcard
          flashcard={currentCard}
          progress={currentProgress}
          onAnswer={handleAnswer}
          onSkip={handleSkip}
          showProgress={true}
        />
      )}

      {/* Session controls */}
      <div className="mt-6 text-center">
        <button
          onClick={() => completeSession(progress)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
        >
          End Session Early
        </button>
      </div>
    </div>
  );
}