// Test topic page generation
const { contentLoaderServer } = require('./src/lib/content-loader-server.ts');

console.log('Testing Topic Page Generation...\n');

try {
  // Get all static paths that should be generated
  const staticPaths = contentLoaderServer.generateStaticPaths();
  console.log(`Found ${staticPaths.length} topic pages to generate:`);
  
  staticPaths.forEach(path => {
    const { category, topic } = path.params;
    console.log(`  - /${category}/${topic}`);
    
    // Test loading content for each path
    const content = contentLoaderServer.loadTopicContent(category, topic);
    if (content) {
      console.log(`    ✅ Content loaded: ${content.metadata.title}`);
      console.log(`       ${content.content.length} chars, ${content.metadata.estimatedReadTime} min read`);
    } else {
      console.log(`    ❌ Failed to load content`);
    }
  });

  console.log('\n✅ Topic page generation test completed!');

} catch (error) {
  console.error('❌ Error testing topic pages:', error);
  console.error(error.stack);
}