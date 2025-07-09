import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailedAnswer from '../DetailedAnswer';
import { DetailedAnswer as DetailedAnswerType } from '@/types/content';

const mockDetailedAnswer: DetailedAnswerType = {
  summary: 'This is a quick summary of the answer.',
  detailedExplanation: '<p>This is a detailed explanation with <strong>HTML formatting</strong>.</p>',
  codeExamples: [
    {
      id: '1',
      title: 'Basic Example',
      language: 'javascript',
      code: 'console.log("Hello World");',
      explanation: 'A simple console log example',
      complexity: 'O(1)',
      realWorldContext: 'Used for debugging'
    }
  ],
  alternatives: [
    {
      title: 'Alternative Approach 1',
      description: 'This is an alternative way to solve the problem.',
      code: 'const result = alternative();',
      pros: ['Faster execution', 'Less memory usage'],
      cons: ['More complex', 'Harder to maintain']
    },
    {
      title: 'Alternative Approach 2',
      description: 'Another alternative solution.',
      pros: ['Easier to understand'],
      cons: ['Slower performance']
    }
  ],
  commonMistakes: [
    'Forgetting to handle edge cases',
    'Not considering performance implications'
  ],
  interviewerNotes: [
    'Look for understanding of time complexity',
    'Check if candidate considers edge cases'
  ]
};

const mockEmptyAnswer: DetailedAnswerType = {
  summary: 'Basic answer summary.',
  detailedExplanation: '<p>Basic explanation.</p>',
  codeExamples: [],
  alternatives: [],
  commonMistakes: [],
  interviewerNotes: []
};

describe('DetailedAnswer', () => {
  it('renders the summary section', () => {
    render(<DetailedAnswer answer={mockDetailedAnswer} />);
    
    expect(screen.getByText('Quick Answer')).toBeInTheDocument();
    expect(screen.getByText('This is a quick summary of the answer.')).toBeInTheDocument();
  });

  it('renders tab navigation with correct counts', () => {
    render(<DetailedAnswer answer={mockDetailedAnswer} />);
    
    expect(screen.getByText('Explanation')).toBeInTheDocument();
    expect(screen.getByText('Alternatives')).toBeInTheDocument();
    expect(screen.getByText('Mistakes')).toBeInTheDocument();
    expect(screen.getByText('Interview Tips')).toBeInTheDocument();
    
    // Check counts in tabs - use getAllByText since there are multiple "2"s
    const countElements = screen.getAllByText('2');
    expect(countElements.length).toBeGreaterThanOrEqual(2); // alternatives and mistakes counts
  });

  it('shows explanation tab by default', () => {
    render(<DetailedAnswer answer={mockDetailedAnswer} />);
    
    expect(screen.getByText('Code Examples')).toBeInTheDocument();
    expect(screen.getByText('Basic Example')).toBeInTheDocument();
  });

  it('switches to alternatives tab when clicked', () => {
    render(<DetailedAnswer answer={mockDetailedAnswer} />);
    
    fireEvent.click(screen.getByText('Alternatives'));
    
    expect(screen.getByText('Alternative Approaches & Trade-offs')).toBeInTheDocument();
    expect(screen.getByText('Alternative Approach 1')).toBeInTheDocument();
    expect(screen.getByText('Alternative Approach 2')).toBeInTheDocument();
  });

  it('displays pros and cons for alternatives', () => {
    render(<DetailedAnswer answer={mockDetailedAnswer} />);
    
    fireEvent.click(screen.getByText('Alternatives'));
    
    const advantagesElements = screen.getAllByText('Advantages');
    const disadvantagesElements = screen.getAllByText('Disadvantages');
    expect(advantagesElements.length).toBeGreaterThanOrEqual(1);
    expect(disadvantagesElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Faster execution')).toBeInTheDocument();
    expect(screen.getByText('More complex')).toBeInTheDocument();
  });

  it('switches to mistakes tab when clicked', () => {
    render(<DetailedAnswer answer={mockDetailedAnswer} />);
    
    fireEvent.click(screen.getByText('Mistakes'));
    
    expect(screen.getByText('Common Mistakes to Avoid')).toBeInTheDocument();
    expect(screen.getByText('Forgetting to handle edge cases')).toBeInTheDocument();
    expect(screen.getByText('Not considering performance implications')).toBeInTheDocument();
  });

  it('switches to interview tips tab when clicked', () => {
    render(<DetailedAnswer answer={mockDetailedAnswer} />);
    
    fireEvent.click(screen.getByText('Interview Tips'));
    
    expect(screen.getByText('What Interviewers Look For')).toBeInTheDocument();
    expect(screen.getByText('Look for understanding of time complexity')).toBeInTheDocument();
    expect(screen.getByText('Check if candidate considers edge cases')).toBeInTheDocument();
  });

  it('shows empty state for alternatives when none exist', () => {
    render(<DetailedAnswer answer={mockEmptyAnswer} />);
    
    fireEvent.click(screen.getByText('Alternatives'));
    
    expect(screen.getByText('No alternative approaches available for this question.')).toBeInTheDocument();
  });

  it('shows empty state for mistakes when none exist', () => {
    render(<DetailedAnswer answer={mockEmptyAnswer} />);
    
    fireEvent.click(screen.getByText('Mistakes'));
    
    expect(screen.getByText('No common mistakes documented for this question.')).toBeInTheDocument();
  });

  it('shows empty state for interview tips when none exist', () => {
    render(<DetailedAnswer answer={mockEmptyAnswer} />);
    
    fireEvent.click(screen.getByText('Interview Tips'));
    
    expect(screen.getByText('No interviewer notes available for this question.')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<DetailedAnswer answer={mockDetailedAnswer} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders HTML content in detailed explanation', () => {
    render(<DetailedAnswer answer={mockDetailedAnswer} />);
    
    const strongElement = screen.getByText('HTML formatting');
    expect(strongElement).toBeInTheDocument();
    expect(strongElement.tagName).toBe('STRONG');
  });
});