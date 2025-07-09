console.log('Testing imports...');

try {
  // Test if we can import the content processor
  const { ContentProcessor } = require('./src/lib/content-processor.ts');
  console.log('ContentProcessor imported successfully');
} catch (error) {
  console.error('Failed to import ContentProcessor:', error.message);
}

try {
  // Test if we can import React Testing Library
  const { render } = require('@testing-library/react');
  console.log('React Testing Library imported successfully');
} catch (error) {
  console.error('Failed to import React Testing Library:', error.message);
}

console.log('Import test completed');