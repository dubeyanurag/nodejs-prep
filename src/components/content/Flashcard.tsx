'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Flashcard as FlashcardType, FlashcardProgress } from '@/types/content';

interface FlashcardProps {
  flashcard: FlashcardType;
  progress?: FlashcardProgress;
  onAnswer: (cardId: string, isCorrect: boolean) => void;
  onSkip?: (cardId: string) => void;
  showProgress?: boolean;
  autoFlip?: boolean;
  className?: string;
}

export default function Flashcard({
  flashcard,
  progress,
  onAnswer,
  onSkip,
  showProgress = true,
  autoFlip = false,
  className = ''
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-flip functionality
  useEffect(() => {
    if (autoFlip && !isFlipped) {
      const timer = setTimeout(() => {
        handleFlip();
      }, 3000); // Auto-flip after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [autoFlip, isFlipped]);

  const handleFlip = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isUpSwipe = distanceY > 50;
    const isDownSwipe = distanceY < -50;

    // Prevent diagonal swipes
    if (Math.abs(distanceX) < Math.abs(distanceY)) {
      if (isUpSwipe) {
        handleFlip();
      }
      return;
    }

    if (isFlipped) {
      if (isLeftSwipe) {
        onAnswer(flashcard.id, false); // Incorrect
      } else if (isRightSwipe) {
        onAnswer(flashcard.id, true); // Correct
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleFlip();
    } else if (isFlipped) {
      if (e.key === 'ArrowLeft' || e.key === '1') {
        onAnswer(flashcard.id, false);
      } else if (e.key === 'ArrowRight' || e.key === '2') {
        onAnswer(flashcard.id, true);
      } else if (e.key === 'ArrowDown' || e.key === '0') {
        onSkip?.(flashcard.id);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'learning': return 'bg-yellow-500';
      case 'review': return 'bg-orange-500';
      case 'mastered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`flashcard-container ${className}`}>
      {/* Progress indicator */}
      {showProgress && progress && (
        <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getProgressColor(progress.status)}`}></div>
            <span className="capitalize">{progress.status}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-green-600">✓ {progress.correctCount}</span>
            <span className="text-red-600">✗ {progress.incorrectCount}</span>
          </div>
        </div>
      )}

      {/* Main flashcard */}
      <div
        ref={cardRef}
        className={`flashcard relative w-full h-80 cursor-pointer select-none ${
          isAnimating ? 'pointer-events-none' : ''
        }`}
        onClick={handleFlip}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Flashcard: ${flashcard.question}. Press space to flip.`}
      >
        {/* Front of card */}
        <div
          className={`flashcard-face flashcard-front absolute inset-0 w-full h-full bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform duration-300 ${
            isFlipped ? 'rotate-y-180' : 'rotate-y-0'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <div className="flex-1 flex items-center justify-center">
            <p className="text-lg font-medium text-gray-800 text-center leading-relaxed">
              {flashcard.question}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(flashcard.difficulty)}`}>
                {flashcard.difficulty}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {flashcard.category}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Tap to flip
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`flashcard-face flashcard-back absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform duration-300 ${
            isFlipped ? 'rotate-y-0' : 'rotate-y-180'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)'
          }}
        >
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-base text-gray-800 leading-relaxed mb-4">
                {flashcard.answer}
              </p>
              {flashcard.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {flashcard.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Answer buttons */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAnswer(flashcard.id, false);
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Mark as incorrect"
            >
              ✗ Incorrect
            </button>
            {onSkip && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSkip(flashcard.id);
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Skip this card"
              >
                Skip
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAnswer(flashcard.id, true);
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label="Mark as correct"
            >
              ✓ Correct
            </button>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="text-xs text-gray-500 text-center mt-2">
            Keyboard: ← Incorrect | → Correct | ↓ Skip
          </div>
        </div>
      </div>

      <style jsx>{`
        .flashcard {
          perspective: 1000px;
        }
        .flashcard-face {
          backface-visibility: hidden;
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}