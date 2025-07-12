import { ContentProcessor, ContentValidator, ContentIndexer, contentManager } from '../content-processor';

describe('ContentProcessor', () => {
  const processor = new ContentProcessor();

  test('should parse markdown with frontmatter', () => {
    const markdown = `---
title: Test Topic
category: JavaScript
difficulty: beginner
---

# Test Content

This is a test topic with some content.

\`\`\`javascript
console.log('Hello World');
\`\`\`
`;

    const result = processor.parseMarkdown(markdown);
    expect(result.data.title).toBe('Test Topic');
    expect(result.data.category).toBe('JavaScript');
    expect(result.data.difficulty).toBe('beginner');
    expect(result.content).toContain('# Test Content');
  });

  test('should extract code blocks', () => {
    const content = `
Some text here.

\`\`\`javascript
const x = 1;
console.log(x);
\`\`\`

More text.

\`\`\`python
print("Hello")
\`\`\`
`;

    const codeBlocks = processor.extractCodeBlocks(content);
    expect(codeBlocks).toHaveLength(2);
    expect(codeBlocks[0].language).toBe('javascript');
    expect(codeBlocks[1].language).toBe('python');
  });

  test('should extract mermaid diagrams', () => {
    const content = `
Some content.

\`\`\`mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`

More content.

\`\`\`mermaid
sequenceDiagram
    Alice->>Bob: Hello
\`\`\`
`;

    const diagrams = processor.extractMermaidDiagrams(content);
    expect(diagrams).toHaveLength(2);
    expect(diagrams[0].type).toBe('flowchart');
    expect(diagrams[1].type).toBe('sequence');
  });
});

describe('ContentValidator', () => {
  const validator = new ContentValidator();

  test('should validate required frontmatter fields', () => {
    const metadata = { title: 'Test' }; // missing category and difficulty
    const result = validator.validateContent('# Test', metadata);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2); // missing category and difficulty
  });

  test('should detect unmatched code blocks', () => {
    const content = `
# Test

\`\`\`javascript
console.log('test');
// Missing closing backticks
`;
    
    const result = validator.validateContent(content, { title: 'Test', category: 'JS', difficulty: 'beginner' });
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.message.includes('Unmatched code block'))).toBe(true);
  });

  test('should validate JavaScript syntax', () => {
    const content = `
\`\`\`javascript
function test() {
  console.log('missing closing brace');
\`\`\`
`;
    
    const result = validator.validateContent(content, { title: 'Test', category: 'JS', difficulty: 'beginner' });
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.message.includes('Unmatched braces'))).toBe(true);
  });
});

describe('ContentIndexer', () => {
  const indexer = new ContentIndexer();

  test('should index topic content', () => {
    const topicContent = {
      id: 'test-topic',
      title: 'Test Topic',
      category: 'JavaScript',
      difficulty: 'beginner' as const,
      sections: [],
      questions: [],
      examples: [],
      diagrams: [],
      flashcards: []
    };

    indexer.indexTopicContent(topicContent);
    const index = indexer.getContentIndex();
    
    expect(index.topics).toHaveLength(1);
    expect(index.topics[0].title).toBe('Test Topic');
  });

  test('should search content', () => {
    const topicContent = {
      id: 'js-topic',
      title: 'JavaScript Basics',
      category: 'JavaScript',
      difficulty: 'beginner' as const,
      sections: [],
      questions: [],
      examples: [],
      diagrams: [],
      flashcards: []
    };

    indexer.clearIndex();
    indexer.indexTopicContent(topicContent);
    
    const results = indexer.searchContent('JavaScript');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('JavaScript Basics');
  });
});

describe('ContentManager Integration', () => {
  test('should process complete markdown content', async () => {
    const markdown = `---
title: Event Loop
category: Node.js
difficulty: intermediate
keyPoints:
  - Single-threaded execution
  - Non-blocking I/O
  - Callback queue
---

# Event Loop in Node.js

The event loop is the heart of Node.js asynchronous execution.

\`\`\`javascript
console.log('Start');
setTimeout(() => console.log('Timeout'), 0);
console.log('End');
\`\`\`

\`\`\`mermaid
graph TD
    A[Call Stack] --> B[Event Loop]
    B --> C[Callback Queue]
\`\`\`
`;

    const topicContent = await contentManager.buildTopicContent(markdown, 'event-loop');
    
    expect(topicContent.title).toBe('Event Loop');
    expect(topicContent.category).toBe('Node.js');
    expect(topicContent.difficulty).toBe('intermediate');
    expect(topicContent.examples).toHaveLength(2);
    expect(topicContent.diagrams).toHaveLength(1);
    expect(topicContent.sections[0].keyPoints).toContain('Single-threaded execution');
  });
});