import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

class ContentLoaderServer {
  private contentDir: string;
  private topicsDir: string;

  constructor() {
    this.contentDir = path.join(process.cwd(), 'content');
    this.topicsDir = path.join(this.contentDir, 'topics');
  }

  /**
   * Get all available categories
   */
  getCategories(): CategoryInfo[] {
    if (!fs.existsSync(this.topicsDir)) {
      return [];
    }

    const categoryDirs = fs.readdirSync(this.topicsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    return categoryDirs.map(categorySlug => {
      const topics = this.getTopicsInCategory(categorySlug);
      return {
        slug: categorySlug,
        title: this.formatCategoryTitle(categorySlug),
        description: this.getCategoryDescription(categorySlug),
        topics
      };
    });
  }

  /**
   * Get all topics in a specific category
   */
  getTopicsInCategory(categorySlug: string): TopicInfo[] {
    const categoryDir = path.join(this.topicsDir, categorySlug);
    
    if (!fs.existsSync(categoryDir)) {
      return [];
    }

    const files = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.md'));

    return files.map(file => {
      const filePath = path.join(categoryDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      
      const slug = path.basename(file, '.md');
      
      return {
        slug,
        title: data.title || this.formatTitle(slug),
        category: categorySlug,
        difficulty: data.difficulty || 'intermediate',
        estimatedReadTime: data.estimatedReadTime || 15,
        tags: data.tags || [],
        lastUpdated: data.lastUpdated || new Date().toISOString().split('T')[0]
      };
    });
  }

  /**
   * Load content for a specific topic
   */
  loadTopicContent(categorySlug: string, topicSlug: string): LoadedContent | null {
    const filePath = path.join(this.topicsDir, categorySlug, `${topicSlug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      metadata: {
        title: data.title || this.formatTitle(topicSlug),
        category: categorySlug,
        difficulty: data.difficulty || 'intermediate',
        estimatedReadTime: data.estimatedReadTime || 15,
        tags: data.tags || [],
        lastUpdated: data.lastUpdated || new Date().toISOString().split('T')[0]
      },
      content,
      slug: topicSlug,
      filePath
    };
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

  private formatTitle(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatCategoryTitle(slug: string): string {
    const titleMap: Record<string, string> = {
      'nodejs-core': 'Node.js Core',
      'databases': 'Databases',
      'system-design': 'System Design',
      'devops': 'DevOps & Infrastructure',
      'object-oriented-design': 'Object-Oriented Design',
      'advanced-topics': 'Advanced Topics'
    };

    return titleMap[slug] || this.formatTitle(slug);
  }

  private getCategoryDescription(slug: string): string {
    const descriptionMap: Record<string, string> = {
      'nodejs-core': 'Master Node.js fundamentals including event loop, async programming, and core modules.',
      'databases': 'Comprehensive coverage of SQL and NoSQL databases, optimization, and design patterns.',
      'system-design': 'Learn scalable system architecture, microservices, and distributed system patterns.',
      'devops': 'Docker, Kubernetes, CI/CD pipelines, and cloud platform best practices.',
      'object-oriented-design': 'Design patterns, SOLID principles, and software architecture patterns.',
      'advanced-topics': 'Message queues, security, monitoring, and other specialized backend topics.'
    };

    return descriptionMap[slug] || `Comprehensive coverage of ${this.formatCategoryTitle(slug)} topics.`;
  }
}

// Export singleton instance
export const contentLoaderServer = new ContentLoaderServer();