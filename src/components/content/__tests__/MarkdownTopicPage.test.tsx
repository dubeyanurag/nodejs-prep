import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarkdownTopicPage from '../MarkdownTopicPage';
import { ContentMetadata } from '../../../lib/content-loader-server';

// Mock the mermaid library
jest.mock('../../../lib/mermaid', () => ({
    initializeMermaid: jest.fn(),
    renderDiagram: jest.fn().mockResolvedValue('<svg>Mock SVG</svg>'),
}));

// Mock the DiagramRenderer component
jest.mock('../DiagramRenderer', () => {
    return function MockDiagramRenderer({ diagram }: any) {
        return (
            <div data-testid="diagram-renderer">
                <div>Diagram: {diagram.title}</div>
                <div>Type: {diagram.type}</div>
                <div>Code: {diagram.mermaidCode}</div>
            </div>
        );
    };
});

describe('MarkdownTopicPage', () => {
    const mockMetadata: ContentMetadata = {
        title: 'Test Topic',
        category: 'testing',
        difficulty: 'beginner',
        estimatedReadTime: 5,
        lastUpdated: '2024-01-01',
        tags: ['test', 'markdown'],
    };

    it('renders basic markdown content', () => {
        const content = '# Hello World\n\nThis is a test.';
        const mockOnHeadingsExtracted = jest.fn();

        render(<MarkdownTopicPage content={content} metadata={mockMetadata} onHeadingsExtracted={mockOnHeadingsExtracted} />);

        expect(screen.getByText('Test Topic')).toBeInTheDocument();
        expect(screen.getByText('This is a test.')).toBeInTheDocument();
        expect(mockOnHeadingsExtracted).toHaveBeenCalled();
    });

    it('renders mermaid diagrams correctly', async () => {
        const content = `
# Test Topic

Here's a diagram:

\`\`\`mermaid
graph TD
    A[Start] --> B[End]
\`\`\`

Some more content.
    `;

        render(<MarkdownTopicPage content={content} metadata={mockMetadata} onHeadingsExtracted={jest.fn()} />);

        // Wait for the diagram to be rendered
        await waitFor(() => {
            expect(screen.getByTestId('diagram-renderer')).toBeInTheDocument();
        });

        // Check that the diagram renderer is being used instead of regular code block
        expect(screen.getByTestId('diagram-renderer')).toBeInTheDocument();
        expect(screen.getByText('Type: flowchart')).toBeInTheDocument();
    });

    it('renders regular code blocks normally', () => {
        const content = `
# Test Topic

\`\`\`javascript
console.log('Hello World');
\`\`\`
    `;

        render(<MarkdownTopicPage content={content} metadata={mockMetadata} onHeadingsExtracted={jest.fn()} />);

        // Check that it's rendered as a regular code block, not a diagram
        expect(screen.queryByTestId('diagram-renderer')).not.toBeInTheDocument();
        expect(screen.getByText('console')).toBeInTheDocument();
        expect(screen.getByText('log')).toBeInTheDocument();
    });

    it('handles multiple mermaid diagrams', async () => {
        const content = `
# Test Topic

First diagram:

\`\`\`mermaid
graph TD
    A[First] --> B[Diagram]
\`\`\`

Second diagram:

\`\`\`mermaid
sequenceDiagram
    Alice->>Bob: Hello
\`\`\`
    `;

        render(<MarkdownTopicPage content={content} metadata={mockMetadata} onHeadingsExtracted={jest.fn()} />);

        // Wait for diagrams to be rendered
        await waitFor(() => {
            const diagrams = screen.getAllByTestId('diagram-renderer');
            expect(diagrams).toHaveLength(2);
        });

        // Check that both diagrams are rendered as DiagramRenderer components
        const diagrams = screen.getAllByTestId('diagram-renderer');
        expect(diagrams).toHaveLength(2);
    });

    it('displays metadata correctly', () => {
        const content = '# Test Content';

        render(<MarkdownTopicPage content={content} metadata={mockMetadata} onHeadingsExtracted={jest.fn()} />);

        expect(screen.getByText('Test Topic')).toBeInTheDocument();
        expect(screen.getByText('testing')).toBeInTheDocument();
        expect(screen.getByText('Beginner')).toBeInTheDocument();
        expect(screen.getByText('5 min read')).toBeInTheDocument();
        expect(screen.getByText('#test')).toBeInTheDocument();
        expect(screen.getByText('#markdown')).toBeInTheDocument();
    });

    it('extracts headings and calls onHeadingsExtracted', () => {
        const content = `
# Main Title
## Section 1
### Subsection 1.1
## Section 2
### Subsection 2.1
#### Sub-subsection 2.1.1
        `;
        const mockOnHeadingsExtracted = jest.fn();

        render(<MarkdownTopicPage content={content} metadata={mockMetadata} onHeadingsExtracted={mockOnHeadingsExtracted} />);

        expect(mockOnHeadingsExtracted).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    title: 'Main Title',
                    level: 1,
                    anchor: expect.any(String)
                }),
                expect.objectContaining({
                    title: 'Section 1',
                    level: 2,
                    anchor: expect.any(String)
                }),
                expect.objectContaining({
                    title: 'Subsection 1.1',
                    level: 3,
                    anchor: expect.any(String)
                }),
                expect.objectContaining({
                    title: 'Section 2',
                    level: 2,
                    anchor: expect.any(String)
                }),
                expect.objectContaining({
                    title: 'Subsection 2.1',
                    level: 3,
                    anchor: expect.any(String)
                }),
                expect.objectContaining({
                    title: 'Sub-subsection 2.1.1',
                    level: 4,
                    anchor: expect.any(String)
                })
            ])
        );
    });

    it('adds anchor IDs to heading elements', () => {
        const content = `
# Main Title
## Section One
### Subsection
        `;

        render(<MarkdownTopicPage content={content} metadata={mockMetadata} onHeadingsExtracted={jest.fn()} />);

        // Check that headings have IDs for scrolling
        const mainTitle = screen.getByRole('heading', { level: 1, name: 'Main Title' });
        const sectionOne = screen.getByRole('heading', { level: 2, name: 'Section One' });
        const subsection = screen.getByRole('heading', { level: 3, name: 'Subsection' });

        expect(mainTitle).toHaveAttribute('id');
        expect(sectionOne).toHaveAttribute('id');
        expect(subsection).toHaveAttribute('id');
    });
});