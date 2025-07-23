import { BreadcrumbItem } from '../types/content';
import { getNavigationManager } from './navigation-sync';

/**
 * Route configuration for the application
 */
export interface Route {
  path: string;
  component: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Dynamic routing system for static site generation
 */
export class RouterManager {
  private routes: Map<string, Route> = new Map();

  /**
   * Generate all routes from navigation structure
   */
  generateRoutes(): Route[] {
    const routes: Route[] = [];
    const navigationManager = getNavigationManager();
    const navigationTree = navigationManager.getNavigationTree();

    // Home route
    routes.push({
      path: '/',
      component: 'HomePage',
      title: 'Node.js Interview Preparation',
      description: 'Comprehensive guide for Node.js technical interviews'
    });

    // Category routes
    navigationTree.forEach(category => {
      routes.push({
        path: `/${category.slug}`,
        component: 'CategoryPage',
        title: category.title,
        description: `${category.title} topics and interview questions`,
        breadcrumbs: [
          { title: 'Home', slug: '', type: 'category' },
          { title: category.title, slug: category.slug, type: 'category' }
        ]
      });

      // Topic routes
      if (category.children) {
        category.children.forEach(topic => {
          const breadcrumbs = navigationManager.generateBreadcrumbs(topic.slug);
          routes.push({
            path: `/${category.slug}/${topic.slug}`,
            component: 'TopicPage',
            title: topic.title,
            description: `Learn ${topic.title} for Node.js interviews`,
            breadcrumbs: [
              { title: 'Home', slug: '', type: 'category' },
              ...breadcrumbs
            ]
          });
        });
      }
    });

    // Special routes
    routes.push(
      {
        path: '/search',
        component: 'SearchPage',
        title: 'Search',
        description: 'Search topics, questions, and examples'
      },
      {
        path: '/flashcards',
        component: 'FlashcardsPage',
        title: 'Flashcards',
        description: 'Interactive flashcards for quick review'
      },
      {
        path: '/progress',
        component: 'ProgressPage',
        title: 'Your Progress',
        description: 'Track your learning progress'
      },
      {
        path: '/bookmarks',
        component: 'BookmarksPage',
        title: 'Bookmarks',
        description: 'Your saved topics and questions'
      }
    );

    // Store routes for quick lookup
    routes.forEach(route => {
      this.routes.set(route.path, route);
    });

    return routes;
  }

  /**
   * Get route by path
   */
  getRoute(path: string): Route | null {
    return this.routes.get(path) || null;
  }

  /**
   * Get all routes
   */
  getAllRoutes(): Route[] {
    return Array.from(this.routes.values());
  }

  /**
   * Generate sitemap data
   */
  generateSitemap(): {
    url: string;
    lastModified: string;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
    priority: number;
  }[] {
    const sitemap = this.getAllRoutes().map(route => ({
      url: route.path,
      lastModified: new Date().toISOString(),
      changeFrequency: this.getChangeFrequency(route.path),
      priority: this.getPriority(route.path)
    }));

    return sitemap;
  }

  private getChangeFrequency(path: string): 'daily' | 'weekly' | 'monthly' {
    if (path === '/') return 'weekly';
    if (path.includes('/search') || path.includes('/progress')) return 'daily';
    return 'monthly';
  }

  private getPriority(path: string): number {
    if (path === '/') return 1.0;
    if (path.split('/').length === 2) return 0.8; // Category pages
    if (path.split('/').length === 3) return 0.6; // Topic pages
    return 0.4; // Other pages
  }
}

/**
 * URL utilities for navigation
 */
export class URLUtils {
  /**
   * Generate URL for a topic
   */
  static getTopicURL(categorySlug: string, topicSlug: string): string {
    return `/${categorySlug}/${topicSlug}`;
  }

  /**
   * Generate URL for a category
   */
  static getCategoryURL(categorySlug: string): string {
    return `/${categorySlug}`;
  }

  /**
   * Parse URL to extract category and topic
   */
  static parseURL(path: string): {
    category?: string;
    topic?: string;
    isHome: boolean;
    isCategory: boolean;
    isTopic: boolean;
  } {
    const segments = path.split('/').filter(Boolean);

    return {
      category: segments[0],
      topic: segments[1],
      isHome: segments.length === 0,
      isCategory: segments.length === 1,
      isTopic: segments.length === 2
    };
  }

  /**
   * Generate anchor link for a section
   */
  static getSectionAnchor(sectionTitle: string): string {
    return sectionTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Build query string from parameters
   */
  static buildQueryString(params: Record<string, string | number | boolean>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Parse query string to object
   */
  static parseQueryString(queryString: string): Record<string, string> {
    const params: Record<string, string> = {};
    const searchParams = new URLSearchParams(queryString);
    
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  }
}

// Export singleton instance
export const routerManager = new RouterManager();