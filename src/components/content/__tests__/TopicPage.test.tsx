import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopicPage from '../TopicPage';
import { TopicContent } from '@/types/content';

// Mock the child components
jest.mock('../ContentSection', () => {
  return function MockContentSection({ section }: { section: any }) {
    return <div data-testid={`content-section-${section.id}`}>{section.title}</div>;
  };
});

jest.mock('../InterviewQASection', () => {
  return function MockInterviewQASection({ questions }: { questions: any[] }) {
    return <div data-testid="interview-qa-section">{questions.length} questions</div>;
  };
});

const mockTopic: TopicContent = {
  id: 'test-topic',
  title: 'Test Topic',
  category: 'Node.js',
  difficulty: 'advanced',
  sections: [
    {
      id: 'section-1',
      title: 'Introduction',
      content: '<p>This is the introduction section.</p>',
      codeExamples: [],
      diagrams: [],
      keyPoints: ['Key point 1', 'Key point 2']
    },
    {
      id: 'section-2',
      title: 'Advanced Concepts',
      content: '<p>This covers advanced concepts.</p>',
      codeExamples: [],
      diagrams: [],
      keyPoints: []
    }
  ],
  questions: [
    {
      id: 'q1',
      question: 'What is Node.js?',
      difficulty: 'junior',
      category: 'Node.js',
      type: 'technical',
      answer: {
        summary: 'Node.js is a runtime environment.',
        detailedExplanation: 'Detailed explanation here.',
        codeExamples: [],
        alternatives: [],
        commonMistakes: [],
        interviewerNotes: []
      },
      followUpQuestions: [],
      relatedTopics: []
    }
  ],
  examples: [],
  diagrams: [],
  flashcards: []
};

describe('TopicPage', () => {
  it('renders topic header with title and metadata', () => {
    render(<TopicPage topic={mockTopic} />);
    
    expect(screen.getByRole('heading', { name: 'Test Topic', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('displays topic statistics correctly', () => {
    const { getByTestId } = render(<TopicPage topic={mockTopic} />);
    const statsContainer = getByTestId('topic-stats');
    
    expect(within(statsContainer).getByText(/2 sections/)).toBeInTheDocument();
    expect(within(statsContainer).getByText(/1 questions/)).toBeInTheDocument();
    expect(within(statsContainer).getByText(/0 examples/)).toBeInTheDocument();
  });

  it('renders navigation tabs', () => {
    render(<TopicPage topic={mockTopic} />);
    
    expect(screen.getByRole('link', { name: 'Theory & Concepts' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Code Examples' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Interview Q&A' })).toBeInTheDocument();
  });

  it('renders all content sections', () => {
    render(<TopicPage topic={mockTopic} />);
    
    expect(screen.getByTestId('content-section-section-1')).toBeInTheDocument();
    expect(screen.getByTestId('content-section-section-2')).toBeInTheDocument();
  });

  it('renders interview Q&A section when questions exist', () => {
    const { getByTestId } = render(<TopicPage topic={mockTopic} />);
    
    const qaSection = getByTestId('interview-qa-section');
    expect(qaSection).toBeInTheDocument();
    expect(within(qaSection).getByText('1 questions')).toBeInTheDocument();
  });

  it('does not render interview Q&A section when no questions exist', () => {
    const topicWithoutQuestions = { ...mockTopic, questions: [] };
    render(<TopicPage topic={topicWithoutQuestions} />);
    
    expect(screen.queryByTestId('interview-qa-section')).not.toBeInTheDocument();
  });

  it('applies difficulty-specific styling', () => {
    render(<TopicPage topic={mockTopic} />);
    
    const difficultyBadge = screen.getByText('Advanced');
    expect(difficultyBadge).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  it('applies custom className when provided', () => {
    const { container } = render(<TopicPage topic={mockTopic} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});