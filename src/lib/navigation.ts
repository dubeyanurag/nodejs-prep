import { 
  Category, 
  Topic, 
  NavigationItem, 
  BreadcrumbItem, 
  Curriculum,
  DifficultyLevel 
} from '../types/content';

/**
 * Navigation and content organization system
 */
export class NavigationManager {
  private curriculum: Curriculum | null = null;
  private navigationTree: NavigationItem[] = [];

  /**
   * Initialize navigation with curriculum data
   */
  setCurriculum(curriculum: Curriculum): void {
    this.curriculum = curriculum;
    this.buildNavigationTree();
  }

  /**
   * Build hierarchical navigation tree from curriculum
   */
  private buildNavigationTree(): void {
    if (!this.curriculum) return;

    this.navigationTree = this.curriculum.categories.map((category, categoryIndex) => {
      const categoryNav: NavigationItem = {
        id: category.id,
        title: category.name,
        slug: this.generateSlug(category.name),
        type: 'category',
        order: categoryIndex,
        children: category.topics.map((topic, topicIndex) => ({
          id: topic.id,
          title: topic.title,
          slug: topic.slug,
          type: 'topic',
          parentId: category.id,
          order: topicIndex,
          children: topic.content.sections.map((section, sectionIndex) => ({
            id: section.id,
            title: section.title,
            slug: `${topic.slug}#${this.generateSlug(section.title)}`,
            type: 'section',
            parentId: topic.id,
            order: sectionIndex
          }))
        }))
      };

      return categoryNav;
    });
  }

  /**
   * Get complete navigation tree
   */
  getNavigationTree(): NavigationItem[] {
    return this.navigationTree;
  }

  /**
   * Get navigation items for a specific category
   */
  getCategoryNavigation(categoryId: string): NavigationItem | null {
    return this.navigationTree.find(item => item.id === categoryId) || null;
  }

  /**
   * Get flattened list of all topics for quick access
   */
  getAllTopics(): NavigationItem[] {
    const topics: NavigationItem[] = [];
    
    this.navigationTree.forEach(category => {
      if (category.children) {
        topics.push(...category.children.filter(item => item.type === 'topic'));
      }
    });

    return topics.sort((a, b) => a.order - b.order);
  }

  /**
   * Get topics filtered by difficulty level
   */
  getTopicsByDifficulty(difficulty: DifficultyLevel): NavigationItem[] {
    if (!this.curriculum) return [];

    const topics: NavigationItem[] = [];
    
    this.curriculum.categories.forEach(category => {
      category.topics
        .filter(topic => topic.difficulty === difficulty)
        .forEach(topic => {
          topics.push({
            id: topic.id,
            title: topic.title,
            slug: topic.slug,
            type: 'topic',
            parentId: category.id,
            order: 0
          });
        });
    });

    return topics;
  }

  /**
   * Generate breadcrumb navigation for a given path
   */
  generateBreadcrumbs(topicSlug: string): BreadcrumbItem[] {
    if (!this.curriculum) return [];

    const breadcrumbs: BreadcrumbItem[] = [];

    // Find the topic and its category
    for (const category of this.curriculum.categories) {
      const topic = category.topics.find(t => t.slug === topicSlug);
      if (topic) {
        // Add category breadcrumb
        breadcrumbs.push({
          title: category.name,
          slug: this.generateSlug(category.name),
          type: 'category'
        });

        // Add topic breadcrumb
        breadcrumbs.push({
          title: topic.title,
          slug: topic.slug,
          type: 'topic'
        });

        break;
      }
    }

    return breadcrumbs;
  }

  /**
   * Get next and previous topics for navigation
   */
  getAdjacentTopics(currentTopicSlug: string): {
    previous: NavigationItem | null;
    next: NavigationItem | null;
  } {
    const allTopics = this.getAllTopics();
    const currentIndex = allTopics.findIndex(topic => topic.slug === currentTopicSlug);

    if (currentIndex === -1) {
      return { previous: null, next: null };
    }

    return {
      previous: currentIndex > 0 ? allTopics[currentIndex - 1] : null,
      next: currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null
    };
  }

  /**
   * Search navigation items by title
   */
  searchNavigation(query: string): NavigationItem[] {
    const results: NavigationItem[] = [];
    const searchTerm = query.toLowerCase();

    const searchInTree = (items: NavigationItem[]) => {
      items.forEach(item => {
        if (item.title.toLowerCase().includes(searchTerm)) {
          results.push(item);
        }
        if (item.children) {
          searchInTree(item.children);
        }
      });
    };

    searchInTree(this.navigationTree);
    return results;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

/**
 * Curriculum builder for organizing content hierarchically
 */
export class CurriculumBuilder {
  private categories: Category[] = [];

  /**
   * Add a new category to the curriculum
   */
  addCategory(category: Omit<Category, 'topics'>): CurriculumBuilder {
    this.categories.push({
      ...category,
      topics: []
    });
    return this;
  }

  /**
   * Add a topic to a specific category
   */
  addTopicToCategory(categoryId: string, topic: Topic): CurriculumBuilder {
    const category = this.categories.find(cat => cat.id === categoryId);
    if (category) {
      category.topics.push(topic);
      // Update category metadata
      category.estimatedHours += topic.metadata.estimatedReadTime / 60;
    }
    return this;
  }

  /**
   * Build the complete curriculum
   */
  build(): Curriculum {
    const totalTopics = this.categories.reduce((sum, cat) => sum + cat.topics.length, 0);
    const estimatedStudyHours = this.categories.reduce((sum, cat) => sum + cat.estimatedHours, 0);

    return {
      categories: this.categories.sort((a, b) => a.name.localeCompare(b.name)),
      totalTopics,
      estimatedStudyHours: Math.ceil(estimatedStudyHours)
    };
  }

  /**
   * Create default Node.js curriculum structure
   */
  static createDefaultNodeJSCurriculum(): Curriculum {
    const builder = new CurriculumBuilder();

    // JavaScript Fundamentals
    builder.addCategory({
      id: 'js-fundamentals',
      name: 'JavaScript Fundamentals',
      description: 'Core JavaScript concepts essential for Node.js development',
      prerequisites: [],
      estimatedHours: 0
    });

    // Node.js Core
    builder.addCategory({
      id: 'nodejs-core',
      name: 'Node.js Core',
      description: 'Essential Node.js concepts and built-in modules',
      prerequisites: ['js-fundamentals'],
      estimatedHours: 0
    });

    // Web Frameworks
    builder.addCategory({
      id: 'web-frameworks',
      name: 'Web Frameworks',
      description: 'Express.js and other Node.js web frameworks',
      prerequisites: ['nodejs-core'],
      estimatedHours: 0
    });

    // Databases
    builder.addCategory({
      id: 'databases',
      name: 'Databases',
      description: 'SQL and NoSQL databases with Node.js',
      prerequisites: ['nodejs-core'],
      estimatedHours: 0
    });

    // System Design
    builder.addCategory({
      id: 'system-design',
      name: 'System Design',
      description: 'Scalable architecture and distributed systems',
      prerequisites: ['web-frameworks', 'databases'],
      estimatedHours: 0
    });

    // DevOps & Deployment
    builder.addCategory({
      id: 'devops',
      name: 'DevOps & Deployment',
      description: 'Containerization, CI/CD, and cloud deployment',
      prerequisites: ['system-design'],
      estimatedHours: 0
    });

    // Advanced Topics
    builder.addCategory({
      id: 'advanced-topics',
      name: 'Advanced Topics',
      description: 'Performance optimization, security, and specialized patterns',
      prerequisites: ['system-design'],
      estimatedHours: 0
    });

    return builder.build();
  }
}

/**
 * Progress tracking for user navigation
 */
export class ProgressTracker {
  private completedTopics: Set<string> = new Set();
  private bookmarkedTopics: Set<string> = new Set();
  private currentTopic: string | null = null;

  /**
   * Mark a topic as completed
   */
  markTopicCompleted(topicId: string): void {
    this.completedTopics.add(topicId);
  }

  /**
   * Check if a topic is completed
   */
  isTopicCompleted(topicId: string): boolean {
    return this.completedTopics.has(topicId);
  }

  /**
   * Get completion percentage for a category
   */
  getCategoryProgress(category: Category): number {
    const totalTopics = category.topics.length;
    if (totalTopics === 0) return 0;

    const completedCount = category.topics.filter(topic => 
      this.completedTopics.has(topic.id)
    ).length;

    return Math.round((completedCount / totalTopics) * 100);
  }

  /**
   * Get overall curriculum progress
   */
  getOverallProgress(curriculum: Curriculum): number {
    const totalTopics = curriculum.totalTopics;
    if (totalTopics === 0) return 0;

    return Math.round((this.completedTopics.size / totalTopics) * 100);
  }

  /**
   * Bookmark a topic
   */
  bookmarkTopic(topicId: string): void {
    this.bookmarkedTopics.add(topicId);
  }

  /**
   * Remove bookmark from a topic
   */
  removeBookmark(topicId: string): void {
    this.bookmarkedTopics.delete(topicId);
  }

  /**
   * Check if a topic is bookmarked
   */
  isTopicBookmarked(topicId: string): boolean {
    return this.bookmarkedTopics.has(topicId);
  }

  /**
   * Get all bookmarked topics
   */
  getBookmarkedTopics(): string[] {
    return Array.from(this.bookmarkedTopics);
  }

  /**
   * Set current topic being viewed
   */
  setCurrentTopic(topicId: string): void {
    this.currentTopic = topicId;
  }

  /**
   * Get current topic
   */
  getCurrentTopic(): string | null {
    return this.currentTopic;
  }

  /**
   * Get recommended next topics based on prerequisites and progress
   */
  getRecommendedTopics(curriculum: Curriculum): NavigationItem[] {
    const recommendations: NavigationItem[] = [];

    curriculum.categories.forEach(category => {
      // Check if prerequisites are met
      const prerequisitesMet = category.prerequisites.every(prereqId => {
        const prereqCategory = curriculum.categories.find(cat => cat.id === prereqId);
        return prereqCategory ? this.getCategoryProgress(prereqCategory) >= 80 : false;
      });

      if (prerequisitesMet || category.prerequisites.length === 0) {
        // Find incomplete topics in this category
        category.topics
          .filter(topic => !this.completedTopics.has(topic.id))
          .slice(0, 3) // Limit to 3 recommendations per category
          .forEach(topic => {
            recommendations.push({
              id: topic.id,
              title: topic.title,
              slug: topic.slug,
              type: 'topic',
              parentId: category.id,
              order: 0
            });
          });
      }
    });

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  /**
   * Export progress data
   */
  exportProgress(): {
    completedTopics: string[];
    bookmarkedTopics: string[];
    currentTopic: string | null;
  } {
    return {
      completedTopics: Array.from(this.completedTopics),
      bookmarkedTopics: Array.from(this.bookmarkedTopics),
      currentTopic: this.currentTopic
    };
  }

  /**
   * Import progress data
   */
  importProgress(data: {
    completedTopics: string[];
    bookmarkedTopics: string[];
    currentTopic: string | null;
  }): void {
    this.completedTopics = new Set(data.completedTopics);
    this.bookmarkedTopics = new Set(data.bookmarkedTopics);
    this.currentTopic = data.currentTopic;
  }
}

// Export singleton instances
export const navigationManager = new NavigationManager();
export const progressTracker = new ProgressTracker();