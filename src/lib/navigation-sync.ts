/**
 * Utility to sync content loader data with navigation manager
 */

import { navigationManager, CurriculumBuilder } from './navigation';
import { contentLoaderServer } from './content-loader-server';
import { Curriculum, Category, Topic } from '../types/content';

/**
 * Initialize navigation manager with content from content loader
 */
export function initializeNavigation(): void {
  try {
    const categories = contentLoaderServer.getCategories();
    const allTopics = contentLoaderServer.getAllTopics();
    
    // Build curriculum from content loader data
    const builder = new CurriculumBuilder();
    
    // Add categories
    categories.forEach(categoryInfo => {
      builder.addCategory({
        id: categoryInfo.slug,
        name: categoryInfo.title,
        description: categoryInfo.description,
        prerequisites: [], // Could be enhanced to read from content metadata
        estimatedHours: 0
      });
    });
    
    // Add topics to categories
    allTopics.forEach(topicInfo => {
      // Create a basic topic structure
      const topic: Topic = {
        id: `${topicInfo.category}-${topicInfo.slug}`,
        title: topicInfo.title,
        slug: topicInfo.slug,
        difficulty: topicInfo.difficulty as any,
        content: {
          sections: [], // Could be enhanced to parse actual content sections
          examples: [],
          questions: []
        },
        metadata: {
          estimatedReadTime: topicInfo.estimatedReadTime,
          lastUpdated: topicInfo.lastUpdated,
          tags: topicInfo.tags,
          prerequisites: []
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