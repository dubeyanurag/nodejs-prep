import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TableOfContents from '../TableOfContents';
import { HeadingItem } from '../../../lib/utils/markdown-headings';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('TableOfContents', () => {
  const mockHeadings: HeadingItem[] = [
    {
      id: 'heading-0',
      title: 'Introduction',
      level: 1,
      anchor: 'introduction'
    },
    {
      id: 'heading-1',
      title: 'Getting Started',
      level: 2,
      anchor: 'getting-started'
    },
    {
      id: 'heading-2',
      title: 'Installation',
      level: 3,
      anchor: 'installation'
    },
    {
      id: 'heading-3',
      title: 'Configuration',
      level: 2,
      anchor: 'configuration'
    }
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock getElementById to return mock elements
    document.getElementById = jest.fn((id) => {
      const mockElement = document.createElement('div');
      mockElement.id = id;
      return mockElement;
    });
  });

  it('renders table of contents with headings', () => {
    render(<TableOfContents headings={mockHeadings} />);

    expect(screen.getByText('On This Page')).toBeInTheDocument();
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Installation')).toBeInTheDocument();
    expect(screen.getByText('Configuration')).toBeInTheDocument();
  });

  it('does not render when no headings provided', () => {
    const { container } = render(<TableOfContents headings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles click to scroll to heading', () => {
    render(<TableOfContents headings={mockHeadings} />);

    const introductionButton = screen.getByText('Introduction');
    fireEvent.click(introductionButton);

    expect(document.getElementById).toHaveBeenCalledWith('introduction');
  });

  it('applies correct indentation based on heading level', () => {
    render(<TableOfContents headings={mockHeadings} />);

    const buttons = screen.getAllByRole('button');
    
    // Check that different heading levels have different padding
    const introButton = buttons.find(btn => btn.textContent === 'Introduction');
    const gettingStartedButton = buttons.find(btn => btn.textContent === 'Getting Started');
    const installationButton = buttons.find(btn => btn.textContent === 'Installation');

    expect(introButton).toHaveStyle('padding-left: 8px'); // Level 1
    expect(gettingStartedButton).toHaveStyle('padding-left: 20px'); // Level 2
    expect(installationButton).toHaveStyle('padding-left: 32px'); // Level 3
  });

  it('sets up intersection observer for heading tracking', () => {
    render(<TableOfContents headings={mockHeadings} />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '-20% 0% -35% 0%',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      })
    );
  });

  it('applies custom className', () => {
    const { container } = render(
      <TableOfContents headings={mockHeadings} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('truncates long heading titles', () => {
    const longHeadings: HeadingItem[] = [
      {
        id: 'heading-0',
        title: 'This is a very long heading title that should be truncated when displayed in the table of contents',
        level: 1,
        anchor: 'long-heading'
      }
    ];

    render(<TableOfContents headings={longHeadings} />);

    const button = screen.getByRole('button');
    const span = button.querySelector('span');
    
    expect(span).toHaveClass('truncate');
  });
});