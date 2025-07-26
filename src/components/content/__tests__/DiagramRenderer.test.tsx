import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiagramRenderer from '../DiagramRenderer';
import { Diagram } from '../../../types/content';

// Mock the mermaid library
const mockMermaid = {
  initialize: jest.fn(),
  render: jest.fn(),
};

jest.mock('mermaid', () => ({
  default: mockMermaid,
}));

describe('DiagramRenderer', () => {
  const mockDiagram: Diagram = {
    id: 'test-diagram',
    type: 'flowchart',
    title: 'Test Diagram',
    description: 'A test diagram',
    mermaidCode: 'graph TD\n  A[Start] --> B[End]',
    explanation: 'This is a test diagram'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockMermaid.render.mockResolvedValue({ svg: '<svg>Mock SVG</svg>' });
  });

  it('shows loading state initially', () => {
    render(<DiagramRenderer diagram={mockDiagram} />);

    expect(screen.getByText('Rendering diagram...')).toBeInTheDocument();
  });

  it('renders diagram successfully', async () => {
    render(<DiagramRenderer diagram={mockDiagram} />);

    await waitFor(() => {
      expect(mockMermaid.initialize).toHaveBeenCalled();
      expect(mockMermaid.render).toHaveBeenCalledWith(
        expect.stringContaining('mermaid-test-diagram'),
        mockDiagram.mermaidCode
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Test Diagram')).toBeInTheDocument();
    });
  });

  it('shows error state when rendering fails', async () => {
    mockMermaid.render.mockRejectedValue(new Error('Rendering failed'));

    render(<DiagramRenderer diagram={mockDiagram} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to render diagram')).toBeInTheDocument();
      expect(screen.getByText('Rendering failed')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('shows retry button on error', async () => {
    mockMermaid.render.mockRejectedValue(new Error('Rendering failed'));

    render(<DiagramRenderer diagram={mockDiagram} />);

    await waitFor(() => {
      expect(screen.getByText('Retry Rendering')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('shows diagram code in error state', async () => {
    mockMermaid.render.mockRejectedValue(new Error('Rendering failed'));

    render(<DiagramRenderer diagram={mockDiagram} />);

    await waitFor(() => {
      expect(screen.getByText('Show diagram code')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('handles missing diagram data', () => {
    render(<DiagramRenderer />);

    expect(screen.getByText('Diagram not found')).toBeInTheDocument();
    expect(screen.getByText('No diagram data provided')).toBeInTheDocument();
  });

  it('handles diagram by ID', () => {
    render(<DiagramRenderer diagramId="nonexistent" />);

    expect(screen.getByText('Diagram not found')).toBeInTheDocument();
    expect(screen.getByText('No diagram found with ID: nonexistent')).toBeInTheDocument();
  });

  it('retries rendering on failure', async () => {
    // First call fails, second succeeds
    mockMermaid.render
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockResolvedValueOnce({ svg: '<svg>Success SVG</svg>' });

    render(<DiagramRenderer diagram={mockDiagram} />);

    // Should retry automatically
    await waitFor(() => {
      expect(mockMermaid.render).toHaveBeenCalledTimes(2);
    }, { timeout: 3000 });
  });
});