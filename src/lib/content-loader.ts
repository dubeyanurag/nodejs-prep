// Client-side content loader - provides static fallback data
// Server-side content loading is handled by content-loader-server.ts

export interface ContentMetadata {
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedReadTime: number;
  tags: string[];
  lastUpdated: string;
}

export interface LoadedContent {
  metadata: ContentMetadata;
  content: string;
  slug: string;
  filePath: string;
}

export interface CategoryInfo {
  slug: string;
  title: string;
  description: string;
  topics: TopicInfo[];
}

export interface TopicInfo {
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  estimatedReadTime: number;
  tags: string[];
  lastUpdated: string;
}

// Client-side content loader with static fallback data
class ContentLoader {
  /**
   * Get static fallback categories for client-side rendering
   */
  getCategories(): CategoryInfo[] {
    return [
      {
        slug: 'nodejs-core',
        title: 'Node.js Core',
        description: 'Master Node.js fundamentals including event loop, async programming, and core modules.',
        topics: [
          {
            slug: 'event-loop',
            title: 'Event Loop and Asynchronous Programming',
            category: 'nodejs-core',
            difficulty: 'intermediate',
            estimatedReadTime: 25,
            tags: ['event-loop', 'async', 'promises', 'callbacks'],
            lastUpdated: '2024-01-15'
          },
          {
            slug: 'promises-async-await',
            title: 'Promises and Async/Await',
            category: 'nodejs-core',
            difficulty: 'intermediate',
            estimatedReadTime: 20,
            tags: ['promises', 'async-await', 'error-handling', 'concurrency'],
            lastUpdated: '2024-01-15'
          }
        ]
      },
      {
        slug: 'databases',
        title: 'Databases',
        description: 'Comprehensive coverage of SQL and NoSQL databases, optimization, and design patterns.',
        topics: [
          {
            slug: 'sql-fundamentals',
            title: 'SQL Fundamentals and Advanced Queries',
            category: 'databases',
            difficulty: 'intermediate',
            estimatedReadTime: 30,
            tags: ['sql', 'mysql', 'postgresql', 'queries', 'optimization'],
            lastUpdated: '2024-01-15'
          }
        ]
      }
    ];
  }

  /**
   * Get all topics in a specific category
   */
  getTopicsInCategory(categorySlug: string): TopicInfo[] {
    const categories = this.getCategories();
    const category = categories.find(cat => cat.slug === categorySlug);
    return category ? category.topics : [];
  }

  /**
   * Load content for a specific topic (client-side fallback)
   */
  loadTopicContent(categorySlug: string, topicSlug: string): LoadedContent | null {
    // Client-side fallback - return null as content should be loaded server-side
    return null;
  }

  /**
   * Get all topics across all categories
   */
  getAllTopics(): TopicInfo[] {
    const categories = this.getCategories();
    return categories.flatMap(category => category.topics);
  }

  /**
   * Search topics by title, tags, or content
   */
  searchTopics(query: string): TopicInfo[] {
    const allTopics = this.getAllTopics();
    const searchTerm = query.toLowerCase();

    return allTopics.filter(topic => {
      return (
        topic.title.toLowerCase().includes(searchTerm) ||
        topic.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        topic.category.toLowerCase().includes(searchTerm)
      );
    });
  }

  /**
   * Get topics by difficulty level
   */
  getTopicsByDifficulty(difficulty: string): TopicInfo[] {
    const allTopics = this.getAllTopics();
    return allTopics.filter(topic => topic.difficulty === difficulty);
  }

  /**
   * Get topics by tag
   */
  getTopicsByTag(tag: string): TopicInfo[] {
    const allTopics = this.getAllTopics();
    return allTopics.filter(topic => 
      topic.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  /**
   * Get related topics based on tags and category
   */
  getRelatedTopics(currentTopic: TopicInfo, limit: number = 5): TopicInfo[] {
    const allTopics = this.getAllTopics();
    
    // Filter out the current topic
    const otherTopics = allTopics.filter(topic => 
      topic.slug !== currentTopic.slug || topic.category !== currentTopic.category
    );

    // Score topics based on similarity
    const scoredTopics = otherTopics.map(topic => {
      let score = 0;
      
      // Same category gets higher score
      if (topic.category === currentTopic.category) {
        score += 3;
      }
      
      // Shared tags get points
      const sharedTags = topic.tags.filter(tag => 
        currentTopic.tags.includes(tag)
      );
      score += sharedTags.length * 2;
      
      // Similar difficulty gets a small bonus
      if (topic.difficulty === currentTopic.difficulty) {
        score += 1;
      }

      return { topic, score };
    });

    // Sort by score and return top results
    return scoredTopics
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.topic);
  }

  /**
   * Generate static paths for all topics (for Next.js static generation)
   */
  generateStaticPaths(): Array<{ params: { category: string; topic: string } }> {
    const categories = this.getCategories();
    const paths: Array<{ params: { category: string; topic: string } }> = [];

    categories.forEach(category => {
      category.topics.forEach(topic => {
        paths.push({
          params: {
            category: category.slug,
            topic: topic.slug
          }
        });
      });
    });

    return paths;
  }

  /**
   * Generate category static paths
   */
  generateCategoryPaths(): Array<{ params: { category: string } }> {
    const categories = this.getCategories();
    return categories.map(category => ({
      params: { category: category.slug }
    }));
  }

}

// Export singleton instance
export const contentLoader = new ContentLoader();

// Note: Server-side functions are available in content-loader-server.ts