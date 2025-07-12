import { 
  NavigationManager, 
  CurriculumBuilder, 
  ProgressTracker,
  navigationManager
} from '../navigation';
import { RouterManager, URLUtils } from '../routing';
import { Curriculum, Topic, TopicContent } from '../../types/content';

describe('NavigationManager', () => {
  let navManager: NavigationManager;
  let mockCurriculum: Curriculum;

  beforeEach(() => {
    navManager = new NavigationManager();
    
    // Create mock curriculum
    mockCurriculum = {
      categories: [
        {
          id: 'js-fundamentals',
          name: 'JavaScript Fundamentals',
          description: 'Core JavaScript concepts',
          topics: [
            {
              id: 'closures',
              title: 'Closures',
              slug: 'closures',
              category: 'JavaScript Fundamentals',
              difficulty: 'intermediate',
              content: {
                id: 'closures',
                title: 'Closures',
                category: 'JavaScript Fundamentals',
                difficulty: 'intermediate',
                sections: [
                  {
                    id: 'closures-intro',
                    title: 'Introduction to Closures',
                    content: 'Closures are...',
                    codeExamples: [],
                    diagrams: [],
                    keyPoints: []
                  }
                ],
                questions: [],
                examples: [],
                diagrams: [],
                flashcards: []
              } as TopicContent,
              metadata: {
                lastUpdated: new Date(),
                estimatedReadTime: 15,
                questionCount: 5,
                exampleCount: 3,
                diagramCount: 1,
                tags: ['javascript', 'functions']
              }
            }
          ],
          prerequisites: [],
          estimatedHours: 2
        }
      ],
      totalTopics: 1,
      estimatedStudyHours: 2
    };

    navManager.setCurriculum(mockCurriculum);
  });

  test('should build navigation tree from curriculum', () => {
    const navTree = navManager.getNavigationTree();
    
    expect(navTree).toHaveLength(1);
    expect(navTree[0].title).toBe('JavaScript Fundamentals');
    expect(navTree[0].children).toHaveLength(1);
    expect(navTree[0].children![0].title).toBe('Closures');
  });

  test('should generate breadcrumbs for topic', () => {
    const breadcrumbs = navManager.generateBreadcrumbs('closures');
    
    expect(breadcrumbs).toHaveLength(2);
    expect(breadcrumbs[0].title).toBe('JavaScript Fundamentals');
    expect(breadcrumbs[1].title).toBe('Closures');
  });

  test('should get adjacent topics', () => {
    const { previous, next } = navManager.getAdjacentTopics('closures');
    
    expect(previous).toBeNull(); // First topic
    expect(next).toBeNull(); // Only one topic
  });

  test('should search navigation items', () => {
    const results = navManager.searchNavigation('closure');
    
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some(item => item.title === 'Closures')).toBe(true);
  });
});

describe('CurriculumBuilder', () => {
  test('should create default Node.js curriculum', () => {
    const curriculum = CurriculumBuilder.createDefaultNodeJSCurriculum();
    
    expect(curriculum.categories.length).toBeGreaterThan(0);
    expect(curriculum.categories.some(cat => cat.name === 'JavaScript Fundamentals')).toBe(true);
    expect(curriculum.categories.some(cat => cat.name === 'Node.js Core')).toBe(true);
  });

  test('should build curriculum with topics', () => {
    const builder = new CurriculumBuilder();
    
    builder.addCategory({
      id: 'test-category',
      name: 'Test Category',
      description: 'Test description',
      prerequisites: [],
      estimatedHours: 0
    });

    const mockTopic: Topic = {
      id: 'test-topic',
      title: 'Test Topic',
      slug: 'test-topic',
      category: 'Test Category',
      difficulty: 'beginner',
      content: {} as TopicContent,
      metadata: {
        lastUpdated: new Date(),
        estimatedReadTime: 10,
        questionCount: 0,
        exampleCount: 0,
        diagramCount: 0,
        tags: []
      }
    };

    builder.addTopicToCategory('test-category', mockTopic);
    
    const curriculum = builder.build();
    expect(curriculum.categories).toHaveLength(1);
    expect(curriculum.categories[0].topics).toHaveLength(1);
    expect(curriculum.totalTopics).toBe(1);
  });
});

describe('ProgressTracker', () => {
  let tracker: ProgressTracker;

  beforeEach(() => {
    tracker = new ProgressTracker();
  });

  test('should track topic completion', () => {
    tracker.markTopicCompleted('topic-1');
    
    expect(tracker.isTopicCompleted('topic-1')).toBe(true);
    expect(tracker.isTopicCompleted('topic-2')).toBe(false);
  });

  test('should calculate category progress', () => {
    const category = {
      id: 'test-cat',
      name: 'Test Category',
      description: 'Test',
      topics: [
        { id: 'topic-1' } as Topic,
        { id: 'topic-2' } as Topic,
        { id: 'topic-3' } as Topic,
        { id: 'topic-4' } as Topic
      ],
      prerequisites: [],
      estimatedHours: 4
    };

    tracker.markTopicCompleted('topic-1');
    tracker.markTopicCompleted('topic-2');

    const progress = tracker.getCategoryProgress(category);
    expect(progress).toBe(50); // 2 out of 4 topics completed
  });

  test('should manage bookmarks', () => {
    tracker.bookmarkTopic('topic-1');
    
    expect(tracker.isTopicBookmarked('topic-1')).toBe(true);
    expect(tracker.getBookmarkedTopics()).toContain('topic-1');
    
    tracker.removeBookmark('topic-1');
    expect(tracker.isTopicBookmarked('topic-1')).toBe(false);
  });

  test('should export and import progress', () => {
    tracker.markTopicCompleted('topic-1');
    tracker.bookmarkTopic('topic-2');
    tracker.setCurrentTopic('topic-3');

    const exported = tracker.exportProgress();
    
    const newTracker = new ProgressTracker();
    newTracker.importProgress(exported);

    expect(newTracker.isTopicCompleted('topic-1')).toBe(true);
    expect(newTracker.isTopicBookmarked('topic-2')).toBe(true);
    expect(newTracker.getCurrentTopic()).toBe('topic-3');
  });
});

describe('RouterManager', () => {
  let router: RouterManager;

  beforeEach(() => {
    router = new RouterManager();
    // Set up navigation manager with mock data
    navigationManager.setCurriculum({
      categories: [
        {
          id: 'js-fundamentals',
          name: 'JavaScript Fundamentals',
          description: 'Core concepts',
          topics: [
            {
              id: 'closures',
              title: 'Closures',
              slug: 'closures',
              category: 'JavaScript Fundamentals',
              difficulty: 'intermediate',
              content: {
                id: 'closures',
                title: 'Closures',
                category: 'JavaScript Fundamentals',
                difficulty: 'intermediate',
                sections: [
                  {
                    id: 'closures-intro',
                    title: 'Introduction to Closures',
                    content: 'Closures are...',
                    codeExamples: [],
                    diagrams: [],
                    keyPoints: []
                  }
                ],
                questions: [],
                examples: [],
                diagrams: [],
                flashcards: []
              } as TopicContent,
              metadata: {} as any
            }
          ],
          prerequisites: [],
          estimatedHours: 2
        }
      ],
      totalTopics: 1,
      estimatedStudyHours: 2
    });
  });

  test('should generate routes from navigation', () => {
    const routes = router.generateRoutes();
    
    expect(routes.length).toBeGreaterThan(0);
    expect(routes.some(route => route.path === '/')).toBe(true);
    expect(routes.some(route => route.path === '/javascript-fundamentals')).toBe(true);
    expect(routes.some(route => route.path === '/javascript-fundamentals/closures')).toBe(true);
  });

  test('should generate sitemap', () => {
    router.generateRoutes();
    const sitemap = router.generateSitemap();
    
    expect(sitemap.length).toBeGreaterThan(0);
    expect(sitemap[0]).toHaveProperty('url');
    expect(sitemap[0]).toHaveProperty('lastModified');
    expect(sitemap[0]).toHaveProperty('changeFrequency');
    expect(sitemap[0]).toHaveProperty('priority');
  });
});

describe('URLUtils', () => {
  test('should generate topic URL', () => {
    const url = URLUtils.getTopicURL('javascript', 'closures');
    expect(url).toBe('/javascript/closures');
  });

  test('should parse URL correctly', () => {
    const parsed = URLUtils.parseURL('/javascript/closures');
    
    expect(parsed.category).toBe('javascript');
    expect(parsed.topic).toBe('closures');
    expect(parsed.isTopic).toBe(true);
    expect(parsed.isCategory).toBe(false);
    expect(parsed.isHome).toBe(false);
  });

  test('should build and parse query strings', () => {
    const params = { search: 'closures', difficulty: 'intermediate', page: 1 };
    const queryString = URLUtils.buildQueryString(params);
    
    expect(queryString).toContain('search=closures');
    expect(queryString).toContain('difficulty=intermediate');
    
    const parsed = URLUtils.parseQueryString(queryString.substring(1));
    expect(parsed.search).toBe('closures');
    expect(parsed.difficulty).toBe('intermediate');
  });

  test('should generate section anchors', () => {
    const anchor = URLUtils.getSectionAnchor('Introduction to Closures');
    expect(anchor).toBe('introduction-to-closures');
  });
});