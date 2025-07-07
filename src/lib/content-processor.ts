import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { 
  TopicContent, 
  CodeExample, 
  Diagram,
  ContentValidationResult,
  ValidationError,
  ValidationWarning,
  SearchableContent,
  ContentIndex
} from '../types/content';

export interface MarkdownContent {
  content: string;
  data: Record<string, any>;
}

export interface ProcessedContent {
  html: string;
  metadata: Record<string, any>;
  rawContent: string;
}

/**
 * Markdown content processor with frontmatter support
 */
export class ContentProcessor {
  private remarkProcessor = remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false });

  /**
   * Parse markdown content with frontmatter
   */
  parseMarkdown(markdownContent: string): MarkdownContent {
    const parsed = matter(markdownContent);
    return {
      content: parsed.content,
      data: parsed.data
    };
  }

  /**
   * Process markdown content to HTML
   */
  async processToHtml(markdownContent: string): Promise<ProcessedContent> {
    const { content, data } = this.parseMarkdown(markdownContent);
    const processedContent = await this.remarkProcessor.process(content);
    
    return {
      html: processedContent.toString(),
      metadata: data,
      rawContent: content
    };
  }

  /**
   * Extract code blocks from markdown content
   */
  extractCodeBlocks(content: string): CodeExample[] {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const codeBlocks: CodeExample[] = [];
    let match;
    let index = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'text';
      const code = match[2].trim();
      
      codeBlocks.push({
        id: `code-${index++}`,
        title: `Code Example ${index}`,
        language,
        code,
        explanation: '',
        complexity: 'O(n)',
        realWorldContext: ''
      });
    }

    return codeBlocks;
  }

  /**
   * Extract mermaid diagrams from markdown content
   */
  extractMermaidDiagrams(content: string): Diagram[] {
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    const diagrams: Diagram[] = [];
    let match;
    let index = 0;

    while ((match = mermaidRegex.exec(content)) !== null) {
      const mermaidCode = match[1].trim();
      
      diagrams.push({
        id: `diagram-${index++}`,
        type: this.detectDiagramType(mermaidCode),
        title: `Diagram ${index}`,
        description: '',
        mermaidCode,
        explanation: ''
      });
    }

    return diagrams;
  }

  private detectDiagramType(mermaidCode: string): Diagram['type'] {
    if (mermaidCode.includes('sequenceDiagram')) return 'sequence';
    if (mermaidCode.includes('erDiagram')) return 'er';
    if (mermaidCode.includes('flowchart') || mermaidCode.includes('graph')) return 'flowchart';
    if (mermaidCode.includes('C4Context') || mermaidCode.includes('architecture')) return 'architecture';
    return 'system';
  }
}

/**
 * Content validation system
 */
export class ContentValidator {
  /**
   * Validate markdown content for errors and warnings
   */
  validateContent(content: string, metadata: Record<string, any>): ContentValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate frontmatter
    this.validateFrontmatter(metadata, errors);
    
    // Validate markdown syntax
    this.validateMarkdownSyntax(content, errors);
    
    // Validate code blocks
    this.validateCodeBlocks(content, errors, warnings);
    
    // Validate links
    this.validateLinks(content, errors);
    
    // Performance warnings
    this.checkPerformanceIssues(content, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateFrontmatter(metadata: Record<string, any>, errors: ValidationError[]): void {
    const requiredFields = ['title', 'category', 'difficulty'];
    
    for (const field of requiredFields) {
      if (!metadata[field]) {
        errors.push({
          type: 'syntax',
          message: `Missing required frontmatter field: ${field}`,
          location: 'frontmatter',
          severity: 'error'
        });
      }
    }

    // Validate difficulty level
    if (metadata.difficulty && !['beginner', 'intermediate', 'advanced', 'expert'].includes(metadata.difficulty)) {
      errors.push({
        type: 'syntax',
        message: `Invalid difficulty level: ${metadata.difficulty}`,
        location: 'frontmatter',
        severity: 'error'
      });
    }
  }

  private validateMarkdownSyntax(content: string, errors: ValidationError[]): void {
    // Check for unmatched code blocks
    const codeBlockCount = (content.match(/```/g) || []).length;
    if (codeBlockCount % 2 !== 0) {
      errors.push({
        type: 'syntax',
        message: 'Unmatched code block delimiters',
        severity: 'error'
      });
    }

    // Check for malformed headers
    const malformedHeaders = content.match(/^#{7,}/gm);
    if (malformedHeaders) {
      errors.push({
        type: 'syntax',
        message: 'Headers with more than 6 levels are not valid',
        severity: 'error'
      });
    }
  }

  private validateCodeBlocks(content: string, errors: ValidationError[], warnings: ValidationWarning[]): void {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1];
      const code = match[2].trim();

      if (!language) {
        warnings.push({
          type: 'performance',
          message: 'Code block without language specification',
          suggestion: 'Add language identifier for syntax highlighting'
        });
      }

      // Basic syntax validation for common languages
      if (language === 'javascript' || language === 'js') {
        this.validateJavaScript(code, errors);
      }
    }
  }

  private validateJavaScript(code: string, errors: ValidationError[]): void {
    // Basic JavaScript syntax checks
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      errors.push({
        type: 'code',
        message: 'Unmatched braces in JavaScript code',
        severity: 'error'
      });
    }

    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      errors.push({
        type: 'code',
        message: 'Unmatched parentheses in JavaScript code',
        severity: 'error'
      });
    }
  }

  private validateLinks(content: string, errors: ValidationError[]): void {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[2];
      
      // Check for malformed URLs
      if (!url.startsWith('http') && !url.startsWith('/') && !url.startsWith('#')) {
        errors.push({
          type: 'link',
          message: `Potentially malformed link: ${url}`,
          severity: 'warning'
        });
      }
    }
  }

  private checkPerformanceIssues(content: string, warnings: ValidationWarning[]): void {
    // Check content length
    if (content.length > 50000) {
      warnings.push({
        type: 'performance',
        message: 'Content is very long and may impact loading performance',
        suggestion: 'Consider breaking into smaller sections'
      });
    }

    // Check for excessive code blocks
    const codeBlockCount = (content.match(/```/g) || []).length / 2;
    if (codeBlockCount > 20) {
      warnings.push({
        type: 'performance',
        message: 'Large number of code blocks may impact rendering performance',
        suggestion: 'Consider using collapsible sections for some examples'
      });
    }
  }
}

/**
 * Content indexing system for search functionality
 */
export class ContentIndexer {
  private contentIndex: ContentIndex = {
    topics: [],
    questions: [],
    examples: []
  };

  /**
   * Index topic content for search
   */
  indexTopicContent(topicContent: TopicContent): void {
    // Index the main topic
    const topicSearchable: SearchableContent = {
      id: topicContent.id,
      title: topicContent.title,
      content: this.extractTextContent(topicContent),
      category: topicContent.category,
      difficulty: topicContent.difficulty,
      tags: this.extractTags(topicContent),
      type: 'topic',
      slug: this.generateSlug(topicContent.title)
    };

    this.contentIndex.topics.push(topicSearchable);

    // Index questions
    topicContent.questions.forEach(question => {
      const questionSearchable: SearchableContent = {
        id: question.id,
        title: question.question,
        content: `${question.question} ${question.answer.summary} ${question.answer.detailedExplanation}`,
        category: question.category,
        difficulty: this.mapQuestionDifficulty(question.difficulty),
        tags: question.relatedTopics,
        type: 'question',
        slug: this.generateSlug(question.question)
      };

      this.contentIndex.questions.push(questionSearchable);
    });

    // Index code examples
    topicContent.examples.forEach(example => {
      const exampleSearchable: SearchableContent = {
        id: example.id,
        title: example.title,
        content: `${example.title} ${example.explanation} ${example.code} ${example.realWorldContext}`,
        category: topicContent.category,
        difficulty: topicContent.difficulty,
        tags: [example.language, example.complexity],
        type: 'example',
        slug: this.generateSlug(example.title)
      };

      this.contentIndex.examples.push(exampleSearchable);
    });
  }

  /**
   * Get the complete content index
   */
  getContentIndex(): ContentIndex {
    return this.contentIndex;
  }

  /**
   * Clear the content index
   */
  clearIndex(): void {
    this.contentIndex = {
      topics: [],
      questions: [],
      examples: []
    };
  }

  /**
   * Search across all indexed content
   */
  searchContent(query: string, type?: 'topic' | 'question' | 'example'): SearchableContent[] {
    const allContent = [
      ...this.contentIndex.topics,
      ...this.contentIndex.questions,
      ...this.contentIndex.examples
    ];

    const filteredContent = type ? allContent.filter(item => item.type === type) : allContent;

    // Simple text search (in a real implementation, you'd use Fuse.js here)
    const searchTerms = query.toLowerCase().split(' ');
    
    return filteredContent.filter(item => {
      const searchableText = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase();
      return searchTerms.some(term => searchableText.includes(term));
    }).sort((a, b) => {
      // Simple relevance scoring based on title matches
      const aScore = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
      const bScore = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
      return bScore - aScore;
    });
  }

  private extractTextContent(topicContent: TopicContent): string {
    const sectionTexts = topicContent.sections.map(section => 
      `${section.title} ${section.content} ${section.keyPoints.join(' ')}`
    ).join(' ');

    return `${topicContent.title} ${sectionTexts}`;
  }

  private extractTags(topicContent: TopicContent): string[] {
    const tags = new Set<string>();
    
    // Add category and difficulty as tags
    tags.add(topicContent.category);
    tags.add(topicContent.difficulty);
    
    // Add programming languages from code examples
    topicContent.examples.forEach(example => {
      tags.add(example.language);
    });
    
    // Add question categories
    topicContent.questions.forEach(question => {
      tags.add(question.category);
    });

    return Array.from(tags);
  }

  private mapQuestionDifficulty(difficulty: 'junior' | 'mid' | 'senior' | 'expert'): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const mapping = {
      'junior': 'beginner' as const,
      'mid': 'intermediate' as const,
      'senior': 'advanced' as const,
      'expert': 'expert' as const
    };
    return mapping[difficulty];
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

/**
 * Main content processing utility that combines all functionality
 */
export class ContentManager {
  private processor = new ContentProcessor();
  private validator = new ContentValidator();
  private indexer = new ContentIndexer();

  /**
   * Process and validate markdown content
   */
  async processContent(markdownContent: string): Promise<{
    processed: ProcessedContent;
    validation: ContentValidationResult;
  }> {
    const processed = await this.processor.processToHtml(markdownContent);
    const validation = this.validator.validateContent(processed.rawContent, processed.metadata);

    return { processed, validation };
  }

  /**
   * Build topic content from markdown
   */
  async buildTopicContent(markdownContent: string, topicId: string): Promise<TopicContent> {
    const { processed } = await this.processContent(markdownContent);
    const codeExamples = this.processor.extractCodeBlocks(processed.rawContent);
    const diagrams = this.processor.extractMermaidDiagrams(processed.rawContent);

    const topicContent: TopicContent = {
      id: topicId,
      title: processed.metadata.title || 'Untitled Topic',
      category: processed.metadata.category || 'General',
      difficulty: processed.metadata.difficulty || 'beginner',
      sections: [{
        id: `${topicId}-main`,
        title: 'Overview',
        content: processed.html,
        codeExamples,
        diagrams: diagrams.map(d => d.id),
        keyPoints: processed.metadata.keyPoints || []
      }],
      questions: processed.metadata.questions || [],
      examples: codeExamples,
      diagrams,
      flashcards: processed.metadata.flashcards || []
    };

    // Index the content for search
    this.indexer.indexTopicContent(topicContent);

    return topicContent;
  }

  /**
   * Get content index for search
   */
  getSearchIndex(): ContentIndex {
    return this.indexer.getContentIndex();
  }

  /**
   * Search content
   */
  searchContent(query: string, type?: 'topic' | 'question' | 'example'): SearchableContent[] {
    return this.indexer.searchContent(query, type);
  }
}

// Export singleton instance
export const contentManager = new ContentManager();