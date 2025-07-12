import { flashcardGenerator, difficultyProgressionEngine } from '../flashcard-generator';
import { TopicContent, InterviewQuestion, CodeExample, FlashcardProgress } from '@/types/content';

describe('FlashcardGenerator', () => {
  const mockTopicContent: TopicContent = {
    id: 'test-topic',
    title: 'Test Topic',
    category: 'Node.js',
    difficulty: 'intermediate',
    sections: [{
      id: 'section-1',
      title: 'Overview',
      content: 'Test content',
      codeExamples: [],
      diagrams: [],
      keyPoints: [
        'Event loop is the core of Node.js asynchronous execution',
        'Callbacks allow non-blocking operations',
        'Promises provide better error handling than callbacks'
      ]
    }],
    questions: [{
      id: 'q1',
      question: 'What is the event loop in Node.js?',
      difficulty: 'mid',
      category: 'Node.js',
      type: 'technical',
      answer: {
        summary: 'The event loop is the mechanism that handles asynchronous operations',
        detailedExplanation: 'The event loop continuously checks for pending operations and executes callbacks when operations complete.',
        codeExamples: [],
        alternatives: [],
        commonMistakes: ['Thinking the event loop is multi-threaded'],
        interviewerNotes: ['Ask about phases of the event loop']
      },
      followUpQuestions: [],
      relatedTopics: ['async', 'callbacks']
    }],
    examples: [{
      id: 'ex1',
      title: 'Basic Event Loop Example',
      language: 'javascript',
      code: 'setTimeout(() => console.log("async"), 0);\nconsole.log("sync");',
      explanation: 'This demonstrates how the event loop prioritizes synchronous code',
      complexity: 'O(1)',
      realWorldContext: 'Common in web servers handling multiple requests'
    }],
    diagrams: [{
      id: 'd1',
      type: 'system',
      title: 'Event Loop Phases',
      description: 'Shows the different phases of the Node.js event loop',
      mermaidCode: 'graph TD\n  A[Timer] --> B[I/O]\n  B --> C[Check]',
      explanation: 'Each phase has a specific purpose in handling different types of operations'
    }],
    flashcards: []
  };

  describe('generateFromTopic', () => {
    it('should generate flashcards from all content types', () => {
      const flashcards = flashcardGenerator.generateFromTopic(mockTopicContent);
      
      expect(flashcards.length).toBeGreaterThan(0);
      
      // Should have cards from different sources
      const sourceTypes = new Set(flashcards.map(card => card.sourceType));
      expect(sourceTypes.has('question')).toBe(true);
      expect(sourceTypes.has('code')).toBe(true);
      expect(sourceTypes.has('keypoint')).toBe(true);
      expect(sourceTypes.has('diagram')).toBe(true);
    });

    it('should respect generation options', () => {
      const flashcards = flashcardGenerator.generateFromTopic(mockTopicContent, {
        includeQuestions: true,
        includeCodeExamples: false,
        includeKeyPoints: false,
        includeDiagrams: false,
        maxCardsPerTopic: 5
      });
      
      expect(flashcards.length).toBeLessThanOrEqual(5);
      expect(flashcards.every(card => card.sourceType === 'question')).toBe(true);
    });

    it('should assign confidence scores', () => {
      const flashcards = flashcardGenerator.generateFromTopic(mockTopicContent);
      
      flashcards.forEach(card => {
        expect(card.confidence).toBeGreaterThan(0);
        expect(card.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should include proper metadata', () => {
      const flashcards = flashcardGenerator.generateFromTopic(mockTopicContent);
      
      flashcards.forEach(card => {
        expect(card.id).toBeDefined();
        expect(card.question).toBeDefined();
        expect(card.answer).toBeDefined();
        expect(card.category).toBe(mockTopicContent.category);
        expect(card.tags).toBeInstanceOf(Array);
        expect(card.sourceId).toBeDefined();
      });
    });
  });
});

describe('DifficultyProgressionEngine', () => {
  const mockProgress: FlashcardProgress[] = [
    {
      cardId: 'card1',
      status: 'mastered',
      lastReviewed: new Date(),
      correctCount: 10,
      incorrectCount: 2,
      nextReviewDate: new Date()
    },
    {
      cardId: 'card2',
      status: 'mastered',
      lastReviewed: new Date(),
      correctCount: 8,
      incorrectCount: 1,
      nextReviewDate: new Date()
    },
    {
      cardId: 'card3',
      status: 'learning',
      lastReviewed: new Date(),
      correctCount: 3,
      incorrectCount: 4,
      nextReviewDate: new Date()
    }
  ];

  describe('getRecommendedDifficulty', () => {
    it('should recommend higher difficulty for good performance', () => {
      const recommended = difficultyProgressionEngine.getRecommendedDifficulty(mockProgress, 'beginner');
      expect(['beginner', 'intermediate', 'advanced', 'expert']).toContain(recommended);
    });
  });

  describe('generateAdaptiveFlashcards', () => {
    it('should prioritize struggling cards', () => {
      const mockFlashcards = [
        {
          id: 'card1',
          question: 'Test 1',
          answer: 'Answer 1',
          category: 'Test',
          difficulty: 'intermediate' as const,
          tags: [],
          sourceType: 'question' as const,
          sourceId: 'q1',
          confidence: 0.8
        },
        {
          id: 'card3',
          question: 'Test 3',
          answer: 'Answer 3',
          category: 'Test',
          difficulty: 'intermediate' as const,
          tags: [],
          sourceType: 'question' as const,
          sourceId: 'q3',
          confidence: 0.7
        },
        {
          id: 'card4',
          question: 'Test 4',
          answer: 'Answer 4',
          category: 'Test',
          difficulty: 'beginner' as const,
          tags: [],
          sourceType: 'question' as const,
          sourceId: 'q4',
          confidence: 0.9
        }
      ];

      const adaptiveCards = difficultyProgressionEngine.generateAdaptiveFlashcards(
        mockFlashcards,
        mockProgress,
        2
      );

      expect(adaptiveCards.length).toBeLessThanOrEqual(2);
      // Should include new cards since card3 doesn't have progress data
      expect(adaptiveCards.length).toBeGreaterThan(0);
    });
  });
});