import { 
  TopicContent, 
  Flashcard, 
  InterviewQuestion, 
  CodeExample, 
  ContentSection,
  DifficultyLevel,
  FlashcardProgress 
} from '@/types/content';

export interface FlashcardGenerationOptions {
  includeQuestions: boolean;
  includeCodeExamples: boolean;
  includeKeyPoints: boolean;
  includeDiagrams: boolean;
  maxCardsPerTopic: number;
  difficultyFilter?: DifficultyLevel[];
  categoryFilter?: string[];
}

export const DEFAULT_GENERATION_OPTIONS: FlashcardGenerationOptions = {
  includeQuestions: true,
  includeCodeExamples: true,
  includeKeyPoints: true,
  includeDiagrams: true,
  maxCardsPerTopic: 20,
  difficultyFilter: undefined,
  categoryFilter: undefined
};

export interface GeneratedFlashcard extends Flashcard {
  sourceType: 'question' | 'code' | 'keypoint' | 'diagram' | 'concept';
  sourceId: string;
  confidence: number; // 0-1 score for how good this flashcard is
}

/**
 * Automatic flashcard generation from topic content
 */
export class FlashcardGenerator {
  /**
   * Generate flashcards from topic content
   */
  generateFromTopic(
    topicContent: TopicContent, 
    options: FlashcardGenerationOptions = DEFAULT_GENERATION_OPTIONS
  ): GeneratedFlashcard[] {
    const flashcards: GeneratedFlashcard[] = [];

    // Generate from interview questions
    if (options.includeQuestions) {
      const questionCards = this.generateFromQuestions(topicContent.questions, topicContent);
      flashcards.push(...questionCards);
    }

    // Generate from code examples
    if (options.includeCodeExamples) {
      const codeCards = this.generateFromCodeExamples(topicContent.examples, topicContent);
      flashcards.push(...codeCards);
    }

    // Generate from key points in sections
    if (options.includeKeyPoints) {
      const keyPointCards = this.generateFromKeyPoints(topicContent.sections, topicContent);
      flashcards.push(...keyPointCards);
    }

    // Generate from diagrams
    if (options.includeDiagrams) {
      const diagramCards = this.generateFromDiagrams(topicContent.diagrams, topicContent);
      flashcards.push(...diagramCards);
    }

    // Apply filters
    let filteredCards = flashcards;
    
    if (options.difficultyFilter) {
      filteredCards = filteredCards.filter(card => 
        options.difficultyFilter!.includes(card.difficulty)
      );
    }

    if (options.categoryFilter) {
      filteredCards = filteredCards.filter(card => 
        options.categoryFilter!.includes(card.category)
      );
    }

    // Sort by confidence and limit
    filteredCards.sort((a, b) => b.confidence - a.confidence);
    
    return filteredCards.slice(0, options.maxCardsPerTopic);
  }

  /**
   * Generate flashcards from interview questions
   */
  private generateFromQuestions(
    questions: InterviewQuestion[], 
    topicContent: TopicContent
  ): GeneratedFlashcard[] {
    return questions.map(question => ({
      id: `flashcard-q-${question.id}`,
      question: question.question,
      answer: this.formatQuestionAnswer(question),
      category: topicContent.category,
      difficulty: this.mapQuestionDifficulty(question.difficulty),
      tags: [
        ...question.relatedTopics,
        question.type,
        question.category,
        topicContent.category
      ],
      sourceType: 'question' as const,
      sourceId: question.id,
      confidence: this.calculateQuestionConfidence(question)
    }));
  }

  /**
   * Generate flashcards from code examples
   */
  private generateFromCodeExamples(
    examples: CodeExample[], 
    topicContent: TopicContent
  ): GeneratedFlashcard[] {
    const flashcards: GeneratedFlashcard[] = [];

    examples.forEach(example => {
      // Create a "what does this code do" flashcard
      flashcards.push({
        id: `flashcard-code-what-${example.id}`,
        question: `What does this ${example.language} code do?\n\n\`\`\`${example.language}\n${example.code}\n\`\`\``,
        answer: `${example.title}\n\n${example.explanation}\n\nComplexity: ${example.complexity}\n\nReal-world context: ${example.realWorldContext}`,
        category: topicContent.category,
        difficulty: topicContent.difficulty,
        tags: [example.language, 'code-reading', topicContent.category, example.complexity],
        sourceType: 'code' as const,
        sourceId: example.id,
        confidence: this.calculateCodeConfidence(example)
      });

      // Create a "write code for" flashcard if explanation suggests implementation
      if (example.explanation.toLowerCase().includes('implement') || 
          example.explanation.toLowerCase().includes('write') ||
          example.explanation.toLowerCase().includes('create')) {
        flashcards.push({
          id: `flashcard-code-write-${example.id}`,
          question: `How would you implement: ${example.title}?`,
          answer: `\`\`\`${example.language}\n${example.code}\n\`\`\`\n\n${example.explanation}\n\nComplexity: ${example.complexity}`,
          category: topicContent.category,
          difficulty: this.increaseDifficulty(topicContent.difficulty),
          tags: [example.language, 'code-writing', topicContent.category, 'implementation'],
          sourceType: 'code' as const,
          sourceId: example.id,
          confidence: this.calculateCodeConfidence(example) * 0.8 // Slightly lower confidence for implementation cards
        });
      }
    });

    return flashcards;
  }

  /**
   * Generate flashcards from key points in content sections
   */
  private generateFromKeyPoints(
    sections: ContentSection[], 
    topicContent: TopicContent
  ): GeneratedFlashcard[] {
    const flashcards: GeneratedFlashcard[] = [];

    sections.forEach(section => {
      section.keyPoints.forEach((keyPoint, index) => {
        // Create definition/concept flashcards
        const question = this.extractQuestionFromKeyPoint(keyPoint);
        if (question) {
          flashcards.push({
            id: `flashcard-key-${section.id}-${index}`,
            question,
            answer: keyPoint,
            category: topicContent.category,
            difficulty: topicContent.difficulty,
            tags: ['concept', 'key-point', topicContent.category, section.title.toLowerCase()],
            sourceType: 'keypoint' as const,
            sourceId: `${section.id}-${index}`,
            confidence: this.calculateKeyPointConfidence(keyPoint)
          });
        }
      });
    });

    return flashcards;
  }

  /**
   * Generate flashcards from diagrams
   */
  private generateFromDiagrams(
    diagrams: any[], 
    topicContent: TopicContent
  ): GeneratedFlashcard[] {
    return diagrams.map(diagram => ({
      id: `flashcard-diagram-${diagram.id}`,
      question: `Explain the ${diagram.type} diagram: ${diagram.title}`,
      answer: `${diagram.description}\n\n${diagram.explanation}`,
      category: topicContent.category,
      difficulty: topicContent.difficulty,
      tags: ['diagram', diagram.type, 'visual', topicContent.category],
      sourceType: 'diagram' as const,
      sourceId: diagram.id,
      confidence: this.calculateDiagramConfidence(diagram)
    }));
  }

  /**
   * Extract a question from a key point
   */
  private extractQuestionFromKeyPoint(keyPoint: string): string | null {
    // Simple heuristics to create questions from statements
    const lowerPoint = keyPoint.toLowerCase();
    
    if (lowerPoint.includes(' is ') || lowerPoint.includes(' are ')) {
      // Convert "X is Y" to "What is X?"
      const parts = keyPoint.split(/\s+is\s+|\s+are\s+/i);
      if (parts.length >= 2) {
        return `What is ${parts[0].trim()}?`;
      }
    }
    
    if (lowerPoint.includes(' allows ') || lowerPoint.includes(' enables ')) {
      // Convert "X allows Y" to "What does X allow/enable?"
      const parts = keyPoint.split(/\s+allows\s+|\s+enables\s+/i);
      if (parts.length >= 2) {
        return `What does ${parts[0].trim()} allow or enable?`;
      }
    }
    
    if (lowerPoint.includes(' provides ') || lowerPoint.includes(' offers ')) {
      // Convert "X provides Y" to "What does X provide?"
      const parts = keyPoint.split(/\s+provides\s+|\s+offers\s+/i);
      if (parts.length >= 2) {
        return `What does ${parts[0].trim()} provide?`;
      }
    }
    
    // For other statements, create a general question
    if (keyPoint.length > 20 && keyPoint.length < 200) {
      return `Explain: ${keyPoint.split('.')[0]}`;
    }
    
    return null;
  }

  /**
   * Format interview question answer for flashcard
   */
  private formatQuestionAnswer(question: InterviewQuestion): string {
    let answer = question.answer.summary;
    
    if (question.answer.detailedExplanation) {
      answer += `\n\n${question.answer.detailedExplanation}`;
    }
    
    if (question.answer.commonMistakes.length > 0) {
      answer += `\n\nCommon mistakes:\n${question.answer.commonMistakes.map(m => `• ${m}`).join('\n')}`;
    }
    
    return answer;
  }

  /**
   * Map interview question difficulty to flashcard difficulty
   */
  private mapQuestionDifficulty(difficulty: 'junior' | 'mid' | 'senior' | 'expert'): DifficultyLevel {
    const mapping = {
      'junior': 'beginner' as const,
      'mid': 'intermediate' as const,
      'senior': 'advanced' as const,
      'expert': 'expert' as const
    };
    return mapping[difficulty];
  }

  /**
   * Increase difficulty level by one step
   */
  private increaseDifficulty(difficulty: DifficultyLevel): DifficultyLevel {
    const levels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levels.indexOf(difficulty);
    return levels[Math.min(currentIndex + 1, levels.length - 1)];
  }

  /**
   * Calculate confidence score for question-based flashcards
   */
  private calculateQuestionConfidence(question: InterviewQuestion): number {
    let confidence = 0.8; // Base confidence for questions
    
    // Higher confidence for questions with detailed answers
    if (question.answer.detailedExplanation.length > 100) confidence += 0.1;
    if (question.answer.codeExamples.length > 0) confidence += 0.05;
    if (question.answer.alternatives.length > 0) confidence += 0.05;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Calculate confidence score for code-based flashcards
   */
  private calculateCodeConfidence(example: CodeExample): number {
    let confidence = 0.7; // Base confidence for code examples
    
    // Higher confidence for well-documented examples
    if (example.explanation.length > 50) confidence += 0.1;
    if (example.realWorldContext.length > 20) confidence += 0.1;
    if (example.output) confidence += 0.05;
    if (example.complexity !== 'O(n)') confidence += 0.05; // Non-default complexity suggests more thought
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Calculate confidence score for key point flashcards
   */
  private calculateKeyPointConfidence(keyPoint: string): number {
    let confidence = 0.6; // Base confidence for key points
    
    // Higher confidence for well-formed statements
    if (keyPoint.length > 30 && keyPoint.length < 150) confidence += 0.2;
    if (keyPoint.includes('important') || keyPoint.includes('key') || keyPoint.includes('critical')) confidence += 0.1;
    if (keyPoint.match(/\b(is|are|allows|enables|provides|offers)\b/i)) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Calculate confidence score for diagram flashcards
   */
  private calculateDiagramConfidence(diagram: any): number {
    let confidence = 0.75; // Base confidence for diagrams
    
    // Higher confidence for well-documented diagrams
    if (diagram.description.length > 30) confidence += 0.1;
    if (diagram.explanation.length > 50) confidence += 0.1;
    if (diagram.type === 'system' || diagram.type === 'architecture') confidence += 0.05;
    
    return Math.min(confidence, 1.0);
  }
}

/**
 * Difficulty progression system based on user performance
 */
export class DifficultyProgressionEngine {
  /**
   * Determine if user should progress to harder flashcards
   */
  shouldProgressDifficulty(
    progress: FlashcardProgress[], 
    currentDifficulty: DifficultyLevel,
    minMasteredCount: number = 10,
    minSuccessRate: number = 0.8
  ): boolean {
    const currentDifficultyCards = progress.filter(p => {
      // We'd need to get the actual flashcard to check difficulty
      // For now, assume we have this information
      return true; // Placeholder
    });

    const masteredCards = currentDifficultyCards.filter(p => p.status === 'mastered');
    
    if (masteredCards.length < minMasteredCount) {
      return false;
    }

    // Calculate success rate for mastered cards
    const totalAttempts = masteredCards.reduce((sum, p) => sum + p.correctCount + p.incorrectCount, 0);
    const correctAttempts = masteredCards.reduce((sum, p) => sum + p.correctCount, 0);
    const successRate = totalAttempts > 0 ? correctAttempts / totalAttempts : 0;

    return successRate >= minSuccessRate;
  }

  /**
   * Get recommended difficulty level for new flashcards
   */
  getRecommendedDifficulty(
    progress: FlashcardProgress[],
    currentLevel: DifficultyLevel = 'beginner'
  ): DifficultyLevel {
    const levels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levels.indexOf(currentLevel);

    // Check if user should progress
    if (this.shouldProgressDifficulty(progress, currentLevel)) {
      return levels[Math.min(currentIndex + 1, levels.length - 1)];
    }

    return currentLevel;
  }

  /**
   * Generate adaptive flashcard set based on user performance
   */
  generateAdaptiveFlashcards(
    allFlashcards: GeneratedFlashcard[],
    progress: FlashcardProgress[],
    targetCount: number = 20
  ): GeneratedFlashcard[] {
    const progressMap = new Map(progress.map(p => [p.cardId, p]));
    
    // Categorize flashcards by user performance
    const strugglingCards: GeneratedFlashcard[] = [];
    const masteredCards: GeneratedFlashcard[] = [];
    const newCards: GeneratedFlashcard[] = [];

    allFlashcards.forEach(card => {
      const cardProgress = progressMap.get(card.id);
      
      if (!cardProgress) {
        newCards.push(card);
      } else {
        const successRate = cardProgress.correctCount / Math.max(1, cardProgress.correctCount + cardProgress.incorrectCount);
        
        if (cardProgress.status === 'mastered') {
          masteredCards.push(card);
        } else if (successRate < 0.6) {
          strugglingCards.push(card);
        }
      }
    });

    // Adaptive selection strategy
    const selectedCards: GeneratedFlashcard[] = [];
    
    // Prioritize struggling cards (40% of selection)
    const strugglingCount = Math.min(Math.floor(targetCount * 0.4), strugglingCards.length);
    selectedCards.push(...strugglingCards.slice(0, strugglingCount));
    
    // Add new cards (50% of selection)
    const newCount = Math.min(Math.floor(targetCount * 0.5), newCards.length);
    selectedCards.push(...newCards.slice(0, newCount));
    
    // Fill remaining with review cards (10% of selection)
    const reviewCount = targetCount - selectedCards.length;
    const reviewCards = masteredCards
      .filter(card => {
        const cardProgress = progressMap.get(card.id);
        return cardProgress && this.shouldReviewCard(cardProgress);
      })
      .slice(0, reviewCount);
    
    selectedCards.push(...reviewCards);

    return selectedCards;
  }

  /**
   * Determine if a mastered card should be included for review
   */
  private shouldReviewCard(progress: FlashcardProgress): boolean {
    const daysSinceReview = Math.floor(
      (Date.now() - progress.lastReviewed.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Review mastered cards every 30 days
    return daysSinceReview >= 30;
  }
}

// Export singleton instances
export const flashcardGenerator = new FlashcardGenerator();
export const difficultyProgressionEngine = new DifficultyProgressionEngine();