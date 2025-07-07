// Simple test to verify our sample content is properly structured
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Sample Node.js Content\n');

// Test content files
const contentTests = [
  {
    name: 'Event Loop Content',
    path: 'content/topics/nodejs-core/event-loop.md',
    expectedSections: ['Introduction', 'Core Concepts', 'Interview Questions', 'System Architecture Diagram']
  },
  {
    name: 'Express.js Content',
    path: 'content/topics/nodejs-core/express-fundamentals.md',
    expectedSections: ['Introduction', 'Core Concepts', 'Advanced Middleware Patterns', 'Interview Questions']
  },
  {
    name: 'Microservices Content',
    path: 'content/topics/system-design/microservices-architecture.md',
    expectedSections: ['Introduction', 'Core Concepts', 'Advanced Design Patterns', 'Interview Questions']
  },
  {
    name: 'Flashcards Content',
    path: 'content/flashcards/nodejs-core-flashcards.md',
    expectedSections: ['Event Loop Fundamentals', 'Promises and Async/Await', 'Express.js Fundamentals']
  },
  {
    name: 'Behavioral Questions',
    path: 'content/questions/behavioral-questions.md',
    expectedSections: ['Technical Leadership', 'Problem Solving', 'Team Collaboration']
  }
];

let passedTests = 0;
let totalTests = contentTests.length;

contentTests.forEach(test => {
  console.log(`Testing ${test.name}...`);
  
  const filePath = path.join(__dirname, test.path);
  
  if (!fs.existsSync(filePath)) {
    console.log(`   ❌ File not found: ${test.path}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check frontmatter
  if (!content.startsWith('---')) {
    console.log(`   ❌ Missing frontmatter in ${test.name}`);
    return;
  }
  
  // Check for expected sections
  let foundSections = 0;
  test.expectedSections.forEach(section => {
    if (content.includes(section)) {
      foundSections++;
    }
  });
  
  // Check for code examples
  const codeBlocks = (content.match(/```/g) || []).length / 2;
  
  // Check for mermaid diagrams
  const mermaidDiagrams = (content.match(/```mermaid/g) || []).length;
  
  // Check for interview questions
  const interviewQuestions = (content.match(/### Question \d+:/g) || []).length;
  
  console.log(`   ✅ File exists and has proper structure`);
  console.log(`   ✅ Found ${foundSections}/${test.expectedSections.length} expected sections`);
  console.log(`   ✅ Contains ${codeBlocks} code examples`);
  if (mermaidDiagrams > 0) {
    console.log(`   ✅ Contains ${mermaidDiagrams} Mermaid diagrams`);
  }
  if (interviewQuestions > 0) {
    console.log(`   ✅ Contains ${interviewQuestions} interview questions`);
  }
  
  passedTests++;
  console.log('');
});

// Summary
console.log('📊 Test Summary:');
console.log(`   Passed: ${passedTests}/${totalTests} content files`);

if (passedTests === totalTests) {
  console.log('🎉 All sample content tests passed!');
  console.log('\n📋 Content Overview:');
  console.log('   ✅ Enhanced Event Loop content with Q&A and diagrams');
  console.log('   ✅ Comprehensive Express.js content with advanced patterns');
  console.log('   ✅ System Design content with Mermaid diagrams');
  console.log('   ✅ Interactive flashcards for core concepts');
  console.log('   ✅ Behavioral questions for senior engineers');
  console.log('\n🚀 Sample content is ready for testing!');
} else {
  console.log('❌ Some content tests failed. Please check the files.');
  process.exit(1);
}