const fs = require('fs');
const path = require('path');

console.log('Testing content directory structure...\n');

// Check if content directory exists
const contentDir = path.join(__dirname, 'content', 'topics');
console.log('Content directory:', contentDir);
console.log('Exists:', fs.existsSync(contentDir));

if (fs.existsSync(contentDir)) {
  // List categories
  const categories = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log('\nFound categories:', categories);
  
  // List topics in each category
  categories.forEach(category => {
    const categoryDir = path.join(contentDir, category);
    const topics = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.md'))
      .map(file => path.basename(file, '.md'));
    
    console.log(`\n${category}:`);
    topics.forEach(topic => {
      console.log(`  - ${topic}`);
      
      // Try to read the file
      const filePath = path.join(categoryDir, `${topic}.md`);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        console.log(`    ✅ File readable (${content.length} chars)`);
      } catch (error) {
        console.log(`    ❌ Error reading file: ${error.message}`);
      }
    });
  });
}

console.log('\n✅ Content structure test completed!');