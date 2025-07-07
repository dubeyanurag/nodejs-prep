const fs = require('fs');

console.log('Verifying sample content creation...\n');

const files = [
  'content/topics/nodejs-core/event-loop.md',
  'content/topics/nodejs-core/express-fundamentals.md', 
  'content/topics/system-design/microservices-architecture.md',
  'content/flashcards/nodejs-core-flashcards.md',
  'content/questions/behavioral-questions.md'
];

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n').length;
    const codeBlocks = (content.match(/```/g) || []).length / 2;
    const questions = (content.match(/### Question \d+:/g) || []).length;
    const mermaid = (content.match(/```mermaid/g) || []).length;
    
    console.log(`✅ ${file}`);
    console.log(`   Lines: ${lines}, Code blocks: ${codeBlocks}, Questions: ${questions}, Diagrams: ${mermaid}`);
  } catch (error) {
    console.log(`❌ ${file} - Error: ${error.message}`);
  }
});

console.log('\n🎉 Sample content verification complete!');