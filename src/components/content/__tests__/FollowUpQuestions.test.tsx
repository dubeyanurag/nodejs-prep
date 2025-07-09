import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FollowUpQuestions from '../FollowUpQuestions';
import { FollowUpQuestion } from '@/types/content';

const mockFollowUpQuestions: FollowUpQuestion[] = [
  {
    id: '1',
    question: 'How would you handle this at scale?',
    trigger: 'always',
    difficulty: 'senior',
    category: 'depth',
    expectedAnswer: 'Should discuss horizontal scaling, load balancing, and caching strategies.',
    hints: ['Consider database sharding', 'Think about CDN usage']
  },
  {
    id: '2',
    question: 'What if the database becomes unavailable?',
    trigger: 'conditional',
    condition: 'If candidate mentions database dependency',
    difficulty: 'expert',
    category: 'edge-case',
    expectedAnswer: 'Should cover circuit breakers, fallback mechanisms, and graceful degradation.'
  },
  {
    id: '3',
    question: 'How would you optimize this for performance?',
    trigger: 'depth',
    difficulty: 'mid',
    category: 'optimization',
    hints: ['Consider caching layers', 'Think about query optimization']
  }
];

describe('FollowUpQuestions', () => {
  it('renders follow-up questions with correct count', () => {
    render(<FollowUpQuestions questions={mockFollowUpQuestions} />);
    
    expect(screen.getByText('Dynamic Follow-up Questions')).toBeInTheDocument();
    expect(screen.getByText('(3 questions)')).toBeInTheDocument();
  });

  it('filters questions by category', () => {
    render(<FollowUpQuestions questions={mockFollowUpQuestions} />);
    
    // Click on depth category filter - use the button element
    const depthButton = screen.getAllByText(/🔍 depth/i)[0]; // Get the first one (the filter button)
    fireEvent.click(depthButton);
    
    // Should show only 1 question
    expect(screen.getByText('(1 questions)')).toBeInTheDocument();
    expect(screen.getByText('How would you handle this at scale?')).toBeInTheDocument();
  });

  it('expands and shows question details', () => {
    render(<FollowUpQuestions questions={mockFollowUpQuestions} />);
    
    // Click on first question to expand
    fireEvent.click(screen.getByText('How would you handle this at scale?'));
    
    // Should show expected answer
    expect(screen.getByText('Expected Answer Direction')).toBeInTheDocument();
    expect(screen.getByText(/Should discuss horizontal scaling/)).toBeInTheDocument();
    
    // Should show hints
    expect(screen.getByText('Interviewer Hints')).toBeInTheDocument();
    expect(screen.getByText('Consider database sharding')).toBeInTheDocument();
  });

  it('shows conditional trigger information', () => {
    render(<FollowUpQuestions questions={mockFollowUpQuestions} />);
    
    // Click on conditional question to expand
    fireEvent.click(screen.getByText('What if the database becomes unavailable?'));
    
    // Should show trigger condition
    expect(screen.getByText('Trigger Condition')).toBeInTheDocument();
    expect(screen.getByText('If candidate mentions database dependency')).toBeInTheDocument();
  });

  it('handles expand all and collapse all', () => {
    render(<FollowUpQuestions questions={mockFollowUpQuestions} />);
    
    // Click expand all
    fireEvent.click(screen.getByText('Expand All'));
    
    // All questions should be expanded (check for multiple expected answers)
    expect(screen.getAllByText('Expected Answer Direction')).toHaveLength(2); // Only 2 have expected answers
    
    // Click collapse all
    fireEvent.click(screen.getByText('Collapse All'));
    
    // Expected answer sections should be hidden
    expect(screen.queryByText('Expected Answer Direction')).not.toBeInTheDocument();
  });

  it('displays correct category icons and colors', () => {
    render(<FollowUpQuestions questions={mockFollowUpQuestions} />);
    
    // Check for category filters with icons
    expect(screen.getAllByText(/🔍 depth/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/⚠️ edge-case/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/⚡ optimization/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows difficulty levels correctly', () => {
    render(<FollowUpQuestions questions={mockFollowUpQuestions} />);
    
    // Expand first question
    fireEvent.click(screen.getByText('How would you handle this at scale?'));
    
    // Should show senior difficulty
    expect(screen.getByText('senior')).toBeInTheDocument();
  });

  it('renders empty state when no questions provided', () => {
    render(<FollowUpQuestions questions={[]} />);
    
    // Component should not render anything
    expect(screen.queryByText('Dynamic Follow-up Questions')).not.toBeInTheDocument();
  });
});