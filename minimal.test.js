// Minimal Jest test
console.log('Test file loaded');

describe('Minimal test suite', () => {
  console.log('Describe block executed');
  
  test('should run basic test', () => {
    console.log('Test executed');
    expect(1 + 1).toBe(2);
  });
  
  test('should handle async test', async () => {
    console.log('Async test executed');
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});