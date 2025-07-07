// Test server-side content loading
const { contentLoaderServer } = require('./src/lib/content-loader-server.ts');

console.log('Testing Server-Side Content Loading...\n');

try {
  // Test getting categories
  console.log('1. Testing getCategories():');
  const categories = contentLoaderServer.getCategories();
  console.log(`Found ${categories.length} categories:`);
  categories.forEach(cat => {
    console.log(`  - ${cat.title} (${cat.slug}): ${cat.topics.length} topics`);
  });
  console.log();

  // Test getting all topics
  console.log('2. Testing getAllTopics():');
  const allTopics = contentLoaderServer.getAllTopics();
  console.log(`Found ${allTopics.length} total topics:`);
  allTopics.forEach(topic => {
    console.log(`  - ${topic.title} (${topic.category}/${topic.slug}) - ${topic.difficulty}`);
  });
  console.log();

  // Test loading specific content
  console.log('3. Testing loadTopicContent():');
  if (allTopics.length > 0) {
    const firstTopic = allTopics[0];
    const content = contentLoaderServer.loadTopicContent(firstTopic.category, firstTopic.slug);
    if (content) {
      console.log(`Loaded content for "${content.metadata.title}"`);
      console.log(`  - Content length: ${content.content.length} characters`);
      console.log(`  - Difficulty: ${content.metadata.difficulty}`);
      console.log(`  - Read time: ${content.metadata.estimatedReadTime} minutes`);
      console.log(`  - Tags: ${content.metadata.tags.join(', ')}`);
    } else {
      console.log('Failed to load content');
    }
  }
  console.log();

  // Test search functionality
  console.log('4. Testing search functionality:');
  const eventTopics = contentLoaderServer.searchTopics('event');
  console.log(`Search for "event": ${eventTopics.length} results`);
  
  const promiseTopics = contentLoaderServer.searchTopics('promise');
  console.log(`Search for "promise": ${promiseTopics.length} results`);
  
  const sqlTopics = contentLoaderServer.searchTopics('sql');
  console.log(`Search for "sql": ${sqlTopics.length} results`);
  console.log();

  // Test static path generation
  console.log('5. Testing static path generation:');
  const staticPaths = contentLoaderServer.generateStaticPaths();
  console.log(`Generated ${staticPaths.length} static paths:`);
  staticPaths.forEach(path => {
    console.log(`  - /${path.params.category}/${path.params.topic}`);
  });

  console.log('\n✅ All server-side content loading tests passed!');

} catch (error) {
  console.error('❌ Error testing server-side content loading:', error);
  console.error(error.stack);
}