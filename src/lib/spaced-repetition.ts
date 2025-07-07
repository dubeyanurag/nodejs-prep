import { FlashcardProgress } from '@/types/content';

export interface SpacedRepetitionConfig {
  initialInterval: number; // days
  easyMultiplier: number;
  goodMultiplier: number;
  hardMultiplier: number;
  againMultiplier: number;
  graduatingInterval: number; // days
  easyInterval: number; // days
  maxInterval: number; // days
  minInterval: number; // days
}

export const DEFAULT_SR_CONFIG: SpacedRepetitionConfig = {
  initialInterval: 1,
  easyMultiplier: 2.5,
  goodMultiplier: 2.0,
  hardMultiplier: 1.2,
  againMultiplier: 0.5,
  graduatingInterval: 1,
  easyInterval: 4,
  maxInterval: 365,
  minInterval: 1
};

export type ReviewResult = 'again' | 'hard' | 'good' | 'easy';

export class SpacedRepetitionEngine {
  private config: SpacedRepetitionConfig;

  constructor(config: SpacedRepetitionConfig = DEFAULT_SR_CONFIG) {
    this.config = config;
  }

  /**
   * Calculate the next review date based on the current progress and review result
   */
  calculateNextReview(
    progress: FlashcardProgress,
    result: ReviewResult
  ): { nextReviewDate: Date; newStatus: FlashcardProgress['status'] } {
    const now = new Date();
    let intervalDays: number;
    let newStatus: FlashcardProgress['status'] = progress.status;

    // Calculate interval based on current status and result
    switch (progress.status) {
      case 'new':
        intervalDays = this.handleNewCard(result);
        newStatus = result === 'again' ? 'new' : 'learning';
        break;
      
      case 'learning':
        intervalDays = this.handleLearningCard(progress, result);
        newStatus = this.getNewStatusFromLearning(progress, result);
        break;
      
      case 'review':
        intervalDays = this.handleReviewCard(progress, result);
        newStatus = result === 'again' ? 'learning' : 'review';
        break;
      
      case 'mastered':
        intervalDays = this.handleMasteredCard(progress, result);
        newStatus = result === 'again' ? 'learning' : 'mastered';
        break;
      
      default:
        intervalDays = this.config.initialInterval;
        newStatus = 'learning';
    }

    // Apply constraints
    intervalDays = Math.max(this.config.minInterval, Math.min(intervalDays, this.config.maxInterval));

    // Calculate next review date
    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

    return { nextReviewDate, newStatus };
  }

  private handleNewCard(result: ReviewResult): number {
    switch (result) {
      case 'again':
        return this.config.initialInterval * this.config.againMultiplier;
      case 'hard':
        return this.config.initialInterval;
      case 'good':
        return this.config.graduatingInterval;
      case 'easy':
        return this.config.easyInterval;
      default:
        return this.config.initialInterval;
    }
  }

  private handleLearningCard(progress: FlashcardProgress, result: ReviewResult): number {
    const daysSinceLastReview = this.getDaysSinceLastReview(progress.lastReviewed);
    const baseInterval = Math.max(daysSinceLastReview, this.config.initialInterval);

    switch (result) {
      case 'again':
        return baseInterval * this.config.againMultiplier;
      case 'hard':
        return baseInterval * this.config.hardMultiplier;
      case 'good':
        return baseInterval * this.config.goodMultiplier;
      case 'easy':
        return this.config.easyInterval;
      default:
        return baseInterval;
    }
  }

  private handleReviewCard(progress: FlashcardProgress, result: ReviewResult): number {
    const daysSinceLastReview = this.getDaysSinceLastReview(progress.lastReviewed);
    const baseInterval = Math.max(daysSinceLastReview, this.config.graduatingInterval);

    switch (result) {
      case 'again':
        return this.config.initialInterval;
      case 'hard':
        return baseInterval * this.config.hardMultiplier;
      case 'good':
        return baseInterval * this.config.goodMultiplier;
      case 'easy':
        return baseInterval * this.config.easyMultiplier;
      default:
        return baseInterval;
    }
  }

  private handleMasteredCard(progress: FlashcardProgress, result: ReviewResult): number {
    const daysSinceLastReview = this.getDaysSinceLastReview(progress.lastReviewed);
    const baseInterval = Math.max(daysSinceLastReview, this.config.easyInterval);

    switch (result) {
      case 'again':
        return this.config.initialInterval;
      case 'hard':
        return baseInterval * this.config.hardMultiplier;
      case 'good':
        return baseInterval * this.config.goodMultiplier;
      case 'easy':
        return baseInterval * this.config.easyMultiplier;
      default:
        return baseInterval * this.config.goodMultiplier;
    }
  }

  private getNewStatusFromLearning(
    progress: FlashcardProgress,
    result: ReviewResult
  ): FlashcardProgress['status'] {
    if (result === 'again') return 'learning';
    
    // Graduate to review after multiple correct answers
    const totalCorrect = progress.correctCount + (result !== 'again' ? 1 : 0);
    if (totalCorrect >= 2 && result === 'good') return 'review';
    if (result === 'easy') return 'review';
    
    return 'learning';
  }

  private getDaysSinceLastReview(lastReviewed: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastReviewed.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get cards that are due for review
   */
  getDueCards(progressList: FlashcardProgress[]): FlashcardProgress[] {
    const now = new Date();
    return progressList.filter(progress => {
      if (!progress.nextReviewDate) return true; // New cards are always due
      return progress.nextReviewDate <= now;
    });
  }

  /**
   * Sort cards by priority (overdue cards first, then by difficulty)
   */
  sortCardsByPriority(progressList: FlashcardProgress[]): FlashcardProgress[] {
    const now = new Date();
    
    return [...progressList].sort((a, b) => {
      // Prioritize overdue cards
      const aOverdue = a.nextReviewDate ? now.getTime() - a.nextReviewDate.getTime() : 0;
      const bOverdue = b.nextReviewDate ? now.getTime() - b.nextReviewDate.getTime() : 0;
      
      if (aOverdue !== bOverdue) {
        return bOverdue - aOverdue; // More overdue first
      }

      // Then prioritize by status (new > learning > review > mastered)
      const statusPriority = { new: 4, learning: 3, review: 2, mastered: 1 };
      const aPriority = statusPriority[a.status];
      const bPriority = statusPriority[b.status];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      // Finally, prioritize cards with lower success rate
      const aSuccessRate = a.correctCount / Math.max(1, a.correctCount + a.incorrectCount);
      const bSuccessRate = b.correctCount / Math.max(1, b.correctCount + b.incorrectCount);
      
      return aSuccessRate - bSuccessRate;
    });
  }

  /**
   * Update progress after a review session
   */
  updateProgress(
    progress: FlashcardProgress,
    result: ReviewResult
  ): FlashcardProgress {
    const { nextReviewDate, newStatus } = this.calculateNextReview(progress, result);
    
    return {
      ...progress,
      status: newStatus,
      lastReviewed: new Date(),
      correctCount: result === 'again' ? progress.correctCount : progress.correctCount + 1,
      incorrectCount: result === 'again' ? progress.incorrectCount + 1 : progress.incorrectCount,
      nextReviewDate
    };
  }

  /**
   * Get study statistics
   */
  getStudyStats(progressList: FlashcardProgress[]): {
    total: number;
    new: number;
    learning: number;
    review: number;
    mastered: number;
    due: number;
    overdue: number;
  } {
    const now = new Date();
    const stats = {
      total: progressList.length,
      new: 0,
      learning: 0,
      review: 0,
      mastered: 0,
      due: 0,
      overdue: 0
    };

    progressList.forEach(progress => {
      stats[progress.status]++;
      
      if (!progress.nextReviewDate || progress.nextReviewDate <= now) {
        stats.due++;
        if (progress.nextReviewDate && progress.nextReviewDate < now) {
          stats.overdue++;
        }
      }
    });

    return stats;
  }
}