/**
 * Utility to sync content loader data with navigation manager
 */

import { navigationManager, CurriculumBuilder } from './navigation';
import { Curriculum, Category, Topic } from '../types/content';

// Only import server-side content loader on server
let contentLoaderServer: any = null;
if (typeof window === 'undefined') {
  try {
    contentLoaderServer = require('./content-loader-server').contentLoaderServer;
  } catch (error) {
    console.warn('Failed to load server-side content loader:', error);
  }
}

/**
 * Initialize navigation manager with content from content loader
 */
export function initializeNavigation(): void {
  try {
    // Only use server-side content loader if available (server-side)
    if (!contentLoaderServer) {
      throw new Error('Server-side content loader not available');
    }
    
    const categories = contentLoaderServer.getCategories();
    const allTopics = contentLoaderServer.getAllTopics();
    
    // Build curriculum from content loader data
    const builder = new CurriculumBuilder();
    
    // Add categories
    categories.forEach((categoryInfo: any) => {
      builder.addCategory({
        id: categoryInfo.slug,
        name: categoryInfo.title,
        description: categoryInfo.description,
        prerequisites: [], // Could be enhanced to read from content metadata
        estimatedHours: 0
      });
    });
    
    // Add topics to categories
    allTopics.forEach((topicInfo: any) => {
      // Create a basic topic structure
      const topic: Topic = {
        id: `${topicInfo.category}-${topicInfo.slug}`,
        title: topicInfo.title,
        slug: topicInfo.slug,
        category: topicInfo.category,
        difficulty: topicInfo.difficulty as any,
        content: {
          id: `${topicInfo.category}-${topicInfo.slug}`,
          title: topicInfo.title,
          category: topicInfo.category,
          difficulty: topicInfo.difficulty as any,
          sections: [], // Could be enhanced to parse actual content sections
          examples: [],
          questions: [],
          diagrams: [],
          flashcards: []
        },
        metadata: {
          lastUpdated: new Date(topicInfo.lastUpdated),
          estimatedReadTime: topicInfo.estimatedReadTime,
          questionCount: 0,
          exampleCount: 0,
          diagramCount: 0,
          tags: topicInfo.tags
        }
      };
      
      builder.addTopicToCategory(topicInfo.category, topic);
    });
    
    // Build and set curriculum
    const curriculum = builder.build();
    navigationManager.setCurriculum(curriculum);
    
  } catch (error) {
    console.warn('Failed to initialize navigation manager:', error);
    
    // Fallback to default curriculum if content loading fails
    const defaultCurriculum = CurriculumBuilder.createDefaultNodeJSCurriculum();
    navigationManager.setCurriculum(defaultCurriculum);
  }
}

/**
 * Get navigation manager instance (ensures it's initialized)
 */
export function getNavigationManager() {
  // Check if navigation manager has data
  const tree = navigationManager.getNavigationTree();
  if (tree.length === 0) {
    initializeNavigation();
  }
  
  return navigationManager;
}

/**
 * Force re-initialization of navigation manager
 */
export function reinitializeNavigation(): void {
  initializeNavigation();
}