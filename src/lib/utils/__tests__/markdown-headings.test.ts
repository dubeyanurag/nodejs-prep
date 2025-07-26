import { extractHeadings, generateUniqueAnchor } from '../markdown-headings';

describe('markdown-headings', () => {
  describe('extractHeadings', () => {
    it('extracts headings from markdown content', () => {
      const content = `
# Main Title
Some content here.

## Section 1
More content.

### Subsection 1.1
Even more content.

## Section 2
Final content.
      `;

      const headings = extractHeadings(content);

      expect(headings).toHaveLength(4);
      expect(headings[0]).toEqual({
        id: 'heading-0',
        title: 'Main Title',
        level: 1,
        anchor: 'main-title'
      });
      expect(headings[1]).toEqual({
        id: 'heading-1',
        title: 'Section 1',
        level: 2,
        anchor: 'section-1'
      });
      expect(headings[2]).toEqual({
        id: 'heading-2',
        title: 'Subsection 1.1',
        level: 3,
        anchor: 'subsection-11'
      });
      expect(headings[3]).toEqual({
        id: 'heading-3',
        title: 'Section 2',
        level: 2,
        anchor: 'section-2'
      });
    });

    it('handles headings with special characters', () => {
      const content = `
# What is Node.js?
## How to Use Express.js
### API & Database Integration
#### Testing (Unit & Integration)
      `;

      const headings = extractHeadings(content);

      expect(headings).toHaveLength(4);
      expect(headings[0].anchor).toBe('what-is-nodejs');
      expect(headings[1].anchor).toBe('how-to-use-expressjs');
      expect(headings[2].anchor).toBe('api-database-integration');
      expect(headings[3].anchor).toBe('testing-unit-integration');
    });

    it('handles empty content', () => {
      const headings = extractHeadings('');
      expect(headings).toHaveLength(0);
    });

    it('handles content without headings', () => {
      const content = `
This is just regular content.
No headings here.
      `;

      const headings = extractHeadings(content);
      expect(headings).toHaveLength(0);
    });

    it('handles different heading levels', () => {
      const content = `
# H1
## H2
### H3
#### H4
##### H5
###### H6
      `;

      const headings = extractHeadings(content);

      expect(headings).toHaveLength(6);
      expect(headings.map(h => h.level)).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('generateUniqueAnchor', () => {
    it('generates basic anchor from title', () => {
      const existingAnchors = new Set<string>();
      const anchor = generateUniqueAnchor('Hello World', existingAnchors);
      
      expect(anchor).toBe('hello-world');
      expect(existingAnchors.has('hello-world')).toBe(true);
    });

    it('handles duplicate anchors by adding numbers', () => {
      const existingAnchors = new Set<string>();
      
      const anchor1 = generateUniqueAnchor('Section', existingAnchors);
      const anchor2 = generateUniqueAnchor('Section', existingAnchors);
      const anchor3 = generateUniqueAnchor('Section', existingAnchors);
      
      expect(anchor1).toBe('section');
      expect(anchor2).toBe('section-1');
      expect(anchor3).toBe('section-2');
    });

    it('removes special characters', () => {
      const existingAnchors = new Set<string>();
      const anchor = generateUniqueAnchor('What is Node.js? (Overview)', existingAnchors);
      
      expect(anchor).toBe('what-is-nodejs-overview');
    });

    it('handles multiple spaces and hyphens', () => {
      const existingAnchors = new Set<string>();
      const anchor = generateUniqueAnchor('Multiple   Spaces -- And   Hyphens', existingAnchors);
      
      expect(anchor).toBe('multiple-spaces-and-hyphens');
    });

    it('handles leading and trailing hyphens', () => {
      const existingAnchors = new Set<string>();
      const anchor = generateUniqueAnchor('-Leading and Trailing-', existingAnchors);
      
      expect(anchor).toBe('leading-and-trailing');
    });
  });
});