export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface TopicContent {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  sections: ContentSection[];
  questions: InterviewQuestion[];
  examples: CodeExample[];
  diagrams: Diagram[];
  flashcards: Flashcard[];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  codeExamples: CodeExample[];
  diagrams: string[];
  keyPoints: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  difficulty: 'junior' | 'mid' | 'senior' | 'expert';
  category: string;
  type: 'technical' | 'scenario' | 'behavioral';
  answer: DetailedAnswer;
  followUpQuestions: FollowUpQuestion[];
  relatedTopics: string[];
  scenario?: ScenarioContext;
  behavioralContext?: BehavioralContext;
}

export interface DetailedAnswer {
  summary: string;
  detailedExplanation: string;
  codeExamples: CodeExample[];
  alternatives: Alternative[];
  commonMistakes: string[];
  interviewerNotes: string[];
}

export interface Alternative {
  title: string;
  description: string;
  code?: string;
  pros: string[];
  cons: string[];
}

export interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
  explanation: string;
  output?: string;
  complexity: string;
  realWorldContext: string;
}

export interface Diagram {
  id: string;
  type: 'system' | 'sequence' | 'er' | 'flowchart' | 'architecture';
  title: string;
  description: string;
  mermaidCode: string;
  explanation: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: DifficultyLevel;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
  prerequisites: string[];
  estimatedHours: number;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: DifficultyLevel;
  content: TopicContent;
  metadata: TopicMetadata;
}

export interface TopicMetadata {
  lastUpdated: Date;
  estimatedReadTime: number;
  questionCount: number;
  exampleCount: number;
  diagramCount: number;
  tags: string[];
}

export interface Curriculum {
  categories: Category[];
  totalTopics: number;
  estimatedStudyHours: number;
}

// User Progress and Learning Tracking Interfaces
export interface UserProgress {
  completedTopics: string[];
  bookmarkedQuestions: string[];
  flashcardProgress: FlashcardProgress[];
  studyTime: StudyTimeTracker;
}

export interface FlashcardProgress {
  cardId: string;
  status: 'new' | 'learning' | 'review' | 'mastered';
  lastReviewed: Date;
  correctCount: number;
  incorrectCount: number;
  nextReviewDate?: Date;
}

export interface StudyTimeTracker {
  totalMinutes: number;
  sessionCount: number;
  lastStudyDate: Date;
  topicTimeSpent: Record<string, number>; // topicId -> minutes
  dailyGoalMinutes: number;
  streakDays: number;
}

// Content Management and Navigation Interfaces
export interface NavigationItem {
  id: string;
  title: string;
  slug: string;
  type: 'category' | 'topic' | 'section';
  parentId?: string;
  children?: NavigationItem[];
  order: number;
}

export interface BreadcrumbItem {
  title: string;
  slug: string;
  type: 'category' | 'topic';
}

export interface ContentIndex {
  topics: SearchableContent[];
  questions: SearchableContent[];
  examples: SearchableContent[];
}

export interface SearchableContent {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: DifficultyLevel;
  tags: string[];
  type: 'topic' | 'question' | 'example';
  slug: string;
}

// Content Validation and Processing Interfaces
export interface ContentValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: 'syntax' | 'link' | 'code' | 'reference';
  message: string;
  location?: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  type: 'performance' | 'accessibility' | 'seo';
  message: string;
  suggestion?: string;
}

// Follow-up Questions and Scenario-based Content Interfaces
export interface FollowUpQuestion {
  id: string;
  question: string;
  trigger: 'always' | 'conditional' | 'depth';
  condition?: string; // For conditional triggers
  difficulty: 'junior' | 'mid' | 'senior' | 'expert';
  expectedAnswer?: string;
  hints?: string[];
  category: 'clarification' | 'depth' | 'application' | 'edge-case' | 'optimization';
}

export interface ScenarioContext {
  industry: 'healthcare' | 'fintech' | 'ecommerce' | 'gaming' | 'enterprise' | 'startup';
  problemStatement: string;
  constraints: string[];
  stakeholders: string[];
  businessImpact: string;
  technicalChallenges: string[];
  successCriteria: string[];
}

export interface BehavioralContext {
  leadership: 'individual-contributor' | 'tech-lead' | 'senior-engineer' | 'architect';
  situation: string;
  challenge: string;
  expectedBehaviors: string[];
  redFlags: string[];
  followUpScenarios: string[];
}

// Quick Reference and Cheat Sheet Interfaces
export interface CheatSheet {
  id: string;
  title: string;
  category: string;
  description: string;
  sections: CheatSheetSection[];
  tags: string[];
  lastUpdated: Date;
  difficulty: DifficultyLevel;
  estimatedReadTime: number;
}

export interface CheatSheetSection {
  id: string;
  title: string;
  type: 'table' | 'list' | 'code' | 'comparison' | 'flowchart';
  content: CheatSheetContent;
  priority: 'high' | 'medium' | 'low';
}

export interface CheatSheetContent {
  // For table type
  table?: {
    headers: string[];
    rows: string[][];
    sortable?: boolean;
    searchable?: boolean;
  };
  
  // For list type
  list?: {
    items: CheatSheetItem[];
    ordered: boolean;
  };
  
  // For code type
  code?: {
    language: string;
    snippet: string;
    description: string;
    copyable: boolean;
  };
  
  // For comparison type
  comparison?: {
    items: ComparisonItem[];
    criteria: string[];
  };
  
  // For flowchart type
  flowchart?: {
    mermaidCode: string;
    description: string;
  };
}

export interface CheatSheetItem {
  title: string;
  description: string;
  code?: string;
  example?: string;
  notes?: string[];
}

export interface ComparisonItem {
  name: string;
  values: Record<string, string | number>;
  pros?: string[];
  cons?: string[];
  useCase?: string;
}

export interface PerformanceBenchmark {
  id: string;
  category: string;
  operation: string;
  metrics: BenchmarkMetric[];
  context: string;
  lastUpdated: Date;
  source?: string;
}

export interface BenchmarkMetric {
  technology: string;
  value: number;
  unit: string;
  conditions: string[];
  notes?: string;
}