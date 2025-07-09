const { execSync } = require('child_process');

console.log('Starting test runner...');

try {
  console.log('Running Jest tests...');
  const result = execSync('npx jest --verbose --no-cache --detectOpenHandles --forceExit', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('Tests completed successfully');
} catch (error) {
  console.error('Test execution failed:', error.message);
  console.error('Exit code:', error.status);
  if (error.stdout) {
    console.log('STDOUT:', error.stdout.toString());
  }
  if (error.stderr) {
    console.error('STDERR:', error.stderr.toString());
  }
}