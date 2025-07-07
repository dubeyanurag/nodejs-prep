---
title: "Node.js Core Concepts - Revision Summary"
category: "revision"
difficulty: "advanced"
estimatedReadTime: 10
tags: ["nodejs", "event-loop", "async", "express", "performance", "revision"]
lastUpdated: "2024-01-15"
printFriendly: true
---

# Node.js Core Concepts - Revision Summary

## Event Loop & Asynchronous Programming

### Key Concepts
- **Event Loop**: Single-threaded, non-blocking I/O model
- **Six Phases**: Timer → Pending Callbacks → Idle/Prepare → Poll → Check → Close Callbacks
- **Microtasks**: `process.nextTick()` and Promise callbacks have highest priority

### Critical Code Pattern
```javascript
// Execution Order Example
console.log('1');
setTimeout(() => console.log('2'), 0);
process.nextTick(() => console.log('3'));
setImmediate(() => console.log('4'));
console.log('5');
// Output: 1, 5, 3, 2, 4
```

### Interview Points
- **Q**: Difference between `setTimeout(fn, 0)` and `setImmediate(fn)`?
- **A**: `setImmediate` executes in Check phase, `setTimeout` in Timer phase. Order depends on context.

## Promises & Async/Await

### Key Concepts
- **Promise States**: Pending → Fulfilled/Rejected
- **Async/Await**: Syntactic sugar over Promises
- **Error Handling**: Try/catch with async/await, `.catch()` with Promises

### Essential Patterns
```javascript
// Promise Chain vs Async/Await
// Promise Chain
fetchUser(id)
  .then(user => fetchPosts(user.id))
  .then(posts => processData(posts))
  .catch(handleError);

// Async/Await
try {
  const user = await fetchUser(id);
  const posts = await fetchPosts(user.id);
  const result = await processData(posts);
} catch (error) {
  handleError(error);
}
```

### Interview Points
- **Q**: How to handle multiple async operations?
- **A**: `Promise.all()` for parallel, `Promise.allSettled()` for all results, sequential with for-await-of

## Express.js Framework

### Key Concepts
- **Middleware**: Functions with access to req, res, next
- **Routing**: HTTP method + path pattern
- **Error Handling**: 4-parameter middleware functions

### Essential Middleware Pattern
```javascript
// Custom Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
};
```

### Interview Points
- **Q**: Middleware execution order?
- **A**: Sequential based on registration order, `next()` passes control to next middleware

## Performance Optimization

### Key Concepts
- **Clustering**: Utilize multiple CPU cores
- **Memory Management**: Avoid memory leaks, monitor heap usage
- **Profiling**: Use built-in profiler and external tools

### Critical Optimization Patterns
```javascript
// Clustering
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  require('./app.js');
}

// Memory Monitoring
process.on('SIGTERM', () => {
  console.log('Memory usage:', process.memoryUsage());
  process.exit(0);
});
```

### Interview Points
- **Q**: How to scale Node.js applications?
- **A**: Clustering, load balancing, microservices, caching, database optimization

## Debugging & Testing

### Key Tools
- **Built-in Debugger**: `node --inspect`
- **Testing Frameworks**: Jest, Mocha, Supertest
- **Profiling**: `node --prof`, clinic.js

### Essential Test Pattern
```javascript
// API Testing with Supertest
const request = require('supertest');
const app = require('../app');

describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);
      
    expect(response.body.name).toBe(userData.name);
  });
});
```

## Quick Reference Cheat Sheet

| Concept | Key Point | Code Example |
|---------|-----------|--------------|
| Event Loop | 6 phases, microtasks first | `process.nextTick()` > Promises > setTimeout |
| Promises | Handle async operations | `await Promise.all([p1, p2])` |
| Middleware | req, res, next pattern | `(req, res, next) => { next(); }` |
| Error Handling | 4-param middleware | `(err, req, res, next) => {}` |
| Clustering | Multi-core utilization | `cluster.fork()` |
| Testing | Async test patterns | `await request(app).get('/').expect(200)` |

## Common Interview Questions

1. **Event Loop**: Explain the phases and execution order
2. **Async Patterns**: Promise.all vs Promise.allSettled vs sequential execution
3. **Express Middleware**: Order of execution and error handling
4. **Performance**: Scaling strategies and bottleneck identification
5. **Memory Management**: Heap monitoring and leak prevention
6. **Testing**: Unit vs integration testing strategies

## Performance Benchmarks to Remember

- **Event Loop Delay**: < 10ms for good performance
- **Memory Usage**: Monitor RSS and heap used
- **Response Time**: < 200ms for API endpoints
- **Throughput**: Measure requests per second under load