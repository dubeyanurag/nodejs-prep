import Fuse from 'fuse.js';

export interface SearchableContent {
  id: string;
  title: string;
  content: string;
  category: string;
  type: 'topic' | 'question' | 'example' | 'flashcard';
  difficulty?: string;
  tags?: string[];
  slug?: string;
  excerpt?: string;
}

export interface SearchFilters {
  categories?: string[];
  types?: SearchableContent['type'][];
  difficulties?: string[];
  tags?: string[];
}

export interface SearchResult {
  item: SearchableContent;
  score?: number;
  matches?: Fuse.FuseResultMatch[];
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'category' | 'tag' | 'topic';
  count?: number;
}

export class ContentSearch {
  private fuse: Fuse<SearchableContent>;
  private content: SearchableContent[];
  private categories: Set<string>;
  private tags: Set<string>;

  constructor(content: SearchableContent[]) {
    this.content = content;
    this.categories = new Set(content.map(item => item.category));
    this.tags = new Set(content.flatMap(item => item.tags || []));

    const options = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'content', weight: 0.25 },
        { name: 'excerpt', weight: 0.2 },
        { name: 'category', weight: 0.1 },
        { name: 'tags', weight: 0.05 }
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
    };

    this.fuse = new Fuse(content, options);
  }

  /**
   * Perform a comprehensive search with optional filters
   */
  search(query: string, filters?: SearchFilters, limit: number = 20): SearchResult[] {
    if (!query.trim()) {
      return this.getRecentOrPopular(limit);
    }

    let results = this.fuse.search(query, { limit: limit * 2 });

    // Apply filters
    if (filters) {
      results = results.filter(result => {
        const item = result.item;

        if (filters.categories && filters.categories.length > 0) {
          if (!filters.categories.includes(item.category)) return false;
        }

        if (filters.types && filters.types.length > 0) {
          if (!filters.types.includes(item.type)) return false;
        }

        if (filters.difficulties && filters.difficulties.length > 0) {
          if (!item.difficulty || !filters.difficulties.includes(item.difficulty)) return false;
        }

        if (filters.tags && filters.tags.length > 0) {
          const itemTags = item.tags || [];
          if (!filters.tags.some(tag => itemTags.includes(tag))) return false;
        }

        return true;
      });
    }

    return results.slice(0, limit);
  }

  /**
   * Get search suggestions based on partial query
   */
  getSuggestions(query: string, limit: number = 8): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    if (query.length < 2) return suggestions;

    // Topic title suggestions
    const topicMatches = this.content
      .filter(item => item.type === 'topic' && item.title.toLowerCase().includes(queryLower))
      .slice(0, 3)
      .map(item => ({
        text: item.title,
        type: 'topic' as const,
        count: 1
      }));

    // Category suggestions
    const categoryMatches = Array.from(this.categories)
      .filter(category => category.toLowerCase().includes(queryLower))
      .slice(0, 2)
      .map(category => ({
        text: category,
        type: 'category' as const,
        count: this.content.filter(item => item.category === category).length
      }));

    // Tag suggestions
    const tagMatches = Array.from(this.tags)
      .filter(tag => tag.toLowerCase().includes(queryLower))
      .slice(0, 3)
      .map(tag => ({
        text: tag,
        type: 'tag' as const,
        count: this.content.filter(item => item.tags?.includes(tag)).length
      }));

    suggestions.push(...topicMatches, ...categoryMatches, ...tagMatches);

    return suggestions.slice(0, limit);
  }

  /**
   * Search within a specific category
   */
  searchByCategory(query: string, category: string, limit: number = 10): SearchResult[] {
    return this.search(query, { categories: [category] }, limit);
  }

  /**
   * Search by content type
   */
  searchByType(query: string, type: SearchableContent['type'], limit: number = 10): SearchResult[] {
    return this.search(query, { types: [type] }, limit);
  }

  /**
   * Get all available categories
   */
  getCategories(): string[] {
    return Array.from(this.categories).sort();
  }

  /**
   * Get all available tags
   */
  getTags(): string[] {
    return Array.from(this.tags).sort();
  }

  /**
   * Get content statistics
   */
  getStats(): {
    totalContent: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    byDifficulty: Record<string, number>;
  } {
    const stats = {
      totalContent: this.content.length,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>
    };

    this.content.forEach(item => {
      // Count by type
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
      
      // Count by category
      stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
      
      // Count by difficulty
      if (item.difficulty) {
        stats.byDifficulty[item.difficulty] = (stats.byDifficulty[item.difficulty] || 0) + 1;
      }
    });

    return stats;
  }

  /**
   * Get recent or popular content when no query is provided
   */
  private getRecentOrPopular(limit: number): SearchResult[] {
    // For now, return topics first, then questions, then examples
    const prioritizedContent = [
      ...this.content.filter(item => item.type === 'topic'),
      ...this.content.filter(item => item.type === 'question'),
      ...this.content.filter(item => item.type === 'example'),
      ...this.content.filter(item => item.type === 'flashcard')
    ];

    return prioritizedContent.slice(0, limit).map(item => ({ item }));
  }

  /**
   * Get related content based on tags and category
   */
  getRelatedContent(contentId: string, limit: number = 5): SearchResult[] {
    const currentItem = this.content.find(item => item.id === contentId);
    if (!currentItem) return [];

    const related = this.content
      .filter(item => item.id !== contentId)
      .map(item => {
        let score = 0;

        // Same category bonus
        if (item.category === currentItem.category) {
          score += 3;
        }

        // Shared tags bonus
        const currentTags = currentItem.tags || [];
        const itemTags = item.tags || [];
        const sharedTags = currentTags.filter(tag => itemTags.includes(tag));
        score += sharedTags.length * 2;

        // Same type bonus
        if (item.type === currentItem.type) {
          score += 1;
        }

        // Same difficulty bonus
        if (item.difficulty === currentItem.difficulty) {
          score += 1;
        }

        return { item, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return related;
  }
}

/**
 * Search index builder for creating searchable content from various sources
 */
export class SearchIndexBuilder {
  private content: SearchableContent[] = [];

  /**
   * Add topic content to search index
   */
  addTopic(topic: {
    id: string;
    title: string;
    content: string;
    category: string;
    difficulty: string;
    tags: string[];
    slug: string;
  }): SearchIndexBuilder {
    this.content.push({
      id: topic.id,
      title: topic.title,
      content: topic.content,
      category: topic.category,
      type: 'topic',
      difficulty: topic.difficulty,
      tags: topic.tags,
      slug: topic.slug,
      excerpt: this.generateExcerpt(topic.content)
    });
    return this;
  }

  /**
   * Add question content to search index
   */
  addQuestion(question: {
    id: string;
    question: string;
    answer: string;
    category: string;
    difficulty: string;
    tags?: string[];
  }): SearchIndexBuilder {
    this.content.push({
      id: question.id,
      title: question.question,
      content: question.answer,
      category: question.category,
      type: 'question',
      difficulty: question.difficulty,
      tags: question.tags || [],
      excerpt: this.generateExcerpt(question.answer)
    });
    return this;
  }

  /**
   * Add code example to search index
   */
  addExample(example: {
    id: string;
    title: string;
    code: string;
    explanation: string;
    category: string;
    tags?: string[];
  }): SearchIndexBuilder {
    this.content.push({
      id: example.id,
      title: example.title,
      content: `${example.explanation}\n\n${example.code}`,
      category: example.category,
      type: 'example',
      tags: example.tags || [],
      excerpt: this.generateExcerpt(example.explanation)
    });
    return this;
  }

  /**
   * Add flashcard to search index
   */
  addFlashcard(flashcard: {
    id: string;
    question: string;
    answer: string;
    category: string;
    difficulty: string;
    tags: string[];
  }): SearchIndexBuilder {
    this.content.push({
      id: flashcard.id,
      title: flashcard.question,
      content: flashcard.answer,
      category: flashcard.category,
      type: 'flashcard',
      difficulty: flashcard.difficulty,
      tags: flashcard.tags,
      excerpt: this.generateExcerpt(flashcard.answer)
    });
    return this;
  }

  /**
   * Build the search index
   */
  build(): ContentSearch {
    return new ContentSearch(this.content);
  }

  /**
   * Generate excerpt from content
   */
  private generateExcerpt(content: string, maxLength: number = 150): string {
    const cleanContent = content.replace(/[#*`]/g, '').trim();
    if (cleanContent.length <= maxLength) return cleanContent;
    
    const truncated = cleanContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }
}