// Simulated code execution for demonstration purposes
// In a real implementation, this would connect to a sandboxed execution environment

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTime?: number;
}

export const executeCode = async (code: string, language: string): Promise<string> => {
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Simple JavaScript execution simulation
  if (language === 'javascript' || language === 'js') {
    return simulateJavaScriptExecution(code);
  }

  // For other languages, return a placeholder
  return `Code execution for ${language} is not available in this demo environment.\n\nYour code:\n${code}`;
};

const simulateJavaScriptExecution = (code: string): string => {
  try {
    // Very basic simulation - in reality, this would use a proper sandbox
    const outputs: string[] = [];
    
    // Mock console.log
    const mockConsole = {
      log: (...args: any[]) => {
        outputs.push(args.map(arg => String(arg)).join(' '));
      }
    };

    // Simple pattern matching for common JavaScript patterns
    if (code.includes('console.log')) {
      // Extract console.log statements and simulate their output
      const logMatches = code.match(/console\.log\([^)]+\)/g);
      if (logMatches) {
        logMatches.forEach(match => {
          const content = match.replace(/console\.log\(|\)/g, '');
          // Simple evaluation for strings and numbers
          if (content.includes('"') || content.includes("'")) {
            const stringContent = content.replace(/['"]/g, '');
            outputs.push(stringContent);
          } else if (!isNaN(Number(content))) {
            outputs.push(content);
          } else {
            outputs.push(`[Evaluated: ${content}]`);
          }
        });
      }
    }

    // Simulate some common patterns
    if (code.includes('setTimeout')) {
      outputs.push('// setTimeout callbacks would execute asynchronously');
    }

    if (code.includes('Promise')) {
      outputs.push('// Promise resolution would happen asynchronously');
    }

    if (code.includes('async') && code.includes('await')) {
      outputs.push('// Async/await execution would handle promises');
    }

    // If no specific patterns found, provide generic output
    if (outputs.length === 0) {
      outputs.push('// Code executed successfully');
      outputs.push('// No console output detected');
    }

    return outputs.join('\n');
  } catch (error) {
    throw new Error(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Predefined code examples with expected outputs
export const codeExamples = {
  eventLoop: {
    code: `console.log('Start');

setTimeout(() => {
  console.log('Timeout callback');
}, 0);

setImmediate(() => {
  console.log('Immediate callback');
});

process.nextTick(() => {
  console.log('Next tick callback');
});

console.log('End');`,
    expectedOutput: `Start
End
Next tick callback
Immediate callback
Timeout callback`
  },
  
  promises: {
    code: `const promise1 = Promise.resolve('First');
const promise2 = Promise.resolve('Second');

Promise.all([promise1, promise2])
  .then(results => {
    console.log('All resolved:', results);
  });

console.log('Synchronous code');`,
    expectedOutput: `Synchronous code
All resolved: ['First', 'Second']`
  },

  asyncAwait: {
    code: `async function fetchData() {
  console.log('Fetching data...');
  const data = await Promise.resolve('Data received');
  console.log(data);
  return data;
}

console.log('Before fetch');
fetchData().then(() => console.log('Fetch complete'));
console.log('After fetch');`,
    expectedOutput: `Before fetch
After fetch
Fetching data...
Data received
Fetch complete`
  }
};