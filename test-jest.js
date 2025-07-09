// Very basic test to check Jest functionality
const { execSync } = require('child_process');

console.log('=== Testing Jest directly ===');

try {
  // Run a simple inline test
  const result = execSync('echo "test(\\"basic test\\", () => { expect(1).toBe(1); });" | npx jest --stdin --verbose', {
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('Jest output:', result);
} catch (error) {
  console.error('Jest error:', error.message);
  console.error('Status:', error.status);
  console.error('Stdout:', error.stdout);
  console.error('Stderr:', error.stderr);
}