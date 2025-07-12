---
title: "Performance Optimization Coding Challenges"
description: "Advanced coding problems focused on performance optimization, memory management, and algorithmic efficiency"
category: "coding-challenges"
difficulty: "intermediate-advanced"
tags: ["performance", "optimization", "memory-management", "algorithms", "concurrency", "database-optimization"]
---

# Performance Optimization Coding Challenges

## Memory Management Challenges

### Challenge 1: Memory-Efficient Data Processing
**Problem**: Process a large dataset (10M+ records) with minimal memory footprint.

```javascript
// Inefficient approach - loads everything into memory
function processLargeDatasetBad(data) {
  const results = [];
  for (const item of data) {
    results.push(expensiveTransformation(item));
  }
  return results;
}

// Your task: Implement a memory-efficient version
function processLargeDatasetOptimized(dataStream) {
  // TODO: Implement streaming approach
}
```

**Requirements**:
- Process data in chunks/streams
- Memory usage should remain constant regardless of dataset size
- Maintain processing speed

**Solution Approach**:
```javascript
async function* processLargeDatasetOptimized(dataStream, chunkSize = 1000) {
  let chunk = [];
  
  for await (const item of dataStream) {
    chunk.push(item);
    
    if (chunk.length >= chunkSize) {
      yield chunk.map(expensiveTransformation);
      chunk = []; // Clear memory
    }
  }
  
  if (chunk.length > 0) {
    yield chunk.map(expensiveTransformation);
  }
}
```

### Challenge 2: Object Pool Pattern
**Problem**: Implement an object pool to reduce garbage collection overhead.

```javascript
class ExpensiveObject {
  constructor() {
    this.data = new Array(1000).fill(0);
    this.isInUse = false;
  }
  
  reset() {
    this.data.fill(0);
    this.isInUse = false;
  }
  
  use() {
    this.isInUse = true;
    // Simulate expensive operations
  }
}

// TODO: Implement ObjectPool class
class ObjectPool {
  // Your implementation here
}
```

**Solution**:
```javascript
class ObjectPool {
  constructor(createFn, resetFn, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.maxSize = maxSize;
  }
  
  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }
  
  release(obj) {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }
}
```

### Challenge 3: Memory Leak Detection
**Problem**: Identify and fix memory leaks in the following code.

```javascript
class EventManager {
  constructor() {
    this.listeners = new Map();
    this.cache = new Map();
  }
  
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  processEvent(event, data) {
    // Cache results indefinitely - MEMORY LEAK!
    const cacheKey = `${event}_${JSON.stringify(data)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const result = this.expensiveProcessing(data);
    this.cache.set(cacheKey, result);
    return result;
  }
  
  // Missing cleanup methods - MEMORY LEAK!
}
```

**Your Task**: Fix the memory leaks and implement proper cleanup.

## Algorithmic Efficiency Challenges

### Challenge 4: Optimize Database Query Performance
**Problem**: Optimize a slow database query operation.

```javascript
// Inefficient: N+1 query problem
async function getUsersWithPostsBad(userIds) {
  const users = [];
  for (const userId of userIds) {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const posts = await db.query('SELECT * FROM posts WHERE user_id = ?', [userId]);
    users.push({ ...user, posts });
  }
  return users;
}

// TODO: Optimize to reduce database calls
async function getUsersWithPostsOptimized(userIds) {
  // Your implementation here
}
```

### Challenge 5: Efficient Data Structure Selection
**Problem**: Choose the most efficient data structure for frequent lookups and updates.

```javascript
// Scenario: Implement a cache with O(1) get/set and LRU eviction
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    // TODO: Choose appropriate data structures
  }
  
  get(key) {
    // TODO: O(1) lookup with LRU update
  }
  
  set(key, value) {
    // TODO: O(1) insertion with LRU eviction
  }
}
```

## Concurrent Programming Challenges

### Challenge 6: Worker Pool Implementation
**Problem**: Implement a worker pool for CPU-intensive tasks.

```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// TODO: Implement WorkerPool class
class WorkerPool {
  constructor(poolSize, workerScript) {
    // Your implementation
  }
  
  async execute(data) {
    // Execute task on available worker
  }
  
  terminate() {
    // Clean shutdown of all workers
  }
}

// Worker script (worker.js)
if (!isMainThread) {
  parentPort.on('message', (data) => {
    // TODO: Process data and send result back
  });
}
```

### Challenge 7: Rate Limiting with Concurrency Control
**Problem**: Implement a rate limiter that handles concurrent requests efficiently.

```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    // TODO: Implement efficient rate limiting
  }
  
  async isAllowed(key) {
    // TODO: Check if request is allowed
    // Handle concurrent access safely
  }
}
```

## API Response Optimization Challenges

### Challenge 8: Response Caching Strategy
**Problem**: Implement intelligent caching for API responses.

```javascript
class APICache {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
    // TODO: Add cache invalidation and optimization
  }
  
  async get(key, fetchFn, options = {}) {
    // TODO: Implement cache-aside pattern with TTL
    // Handle cache warming and invalidation
  }
  
  invalidate(pattern) {
    // TODO: Invalidate cache entries matching pattern
  }
}
```

### Challenge 9: Batch API Requests
**Problem**: Optimize multiple API calls by batching them efficiently.

```javascript
class BatchProcessor {
  constructor(batchSize = 10, delayMs = 100) {
    this.batchSize = batchSize;
    this.delayMs = delayMs;
    this.queue = [];
    this.timer = null;
  }
  
  async add(request) {
    // TODO: Add request to batch and process efficiently
  }
  
  async processBatch(requests) {
    // TODO: Process batch of requests
  }
}
```

## Database Optimization Challenges

### Challenge 10: Query Optimization
**Problem**: Optimize slow database queries.

```javascript
// Slow query example
const slowQuery = `
  SELECT u.name, COUNT(p.id) as post_count, AVG(p.views) as avg_views
  FROM users u
  LEFT JOIN posts p ON u.id = p.user_id
  WHERE u.created_at > '2023-01-01'
  AND p.status = 'published'
  GROUP BY u.id, u.name
  HAVING COUNT(p.id) > 5
  ORDER BY avg_views DESC
  LIMIT 100
`;

// TODO: Identify performance issues and optimize
// Consider: indexes, query structure, data access patterns
```

### Challenge 11: Connection Pool Optimization
**Problem**: Implement efficient database connection pooling.

```javascript
class ConnectionPool {
  constructor(config) {
    this.config = config;
    this.pool = [];
    this.activeConnections = 0;
    this.waitingQueue = [];
  }
  
  async getConnection() {
    // TODO: Implement connection pooling with:
    // - Maximum pool size
    // - Connection reuse
    // - Queue management for waiting requests
    // - Connection health checks
  }
  
  releaseConnection(connection) {
    // TODO: Return connection to pool or close if pool is full
  }
}
```

## Advanced Performance Challenges

### Challenge 12: CPU-Intensive Task Optimization
**Problem**: Optimize a CPU-intensive algorithm.

```javascript
// Inefficient prime number calculation
function findPrimesInefficient(limit) {
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    let isPrime = true;
    for (let j = 2; j < i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
}

// TODO: Optimize using Sieve of Eratosthenes
function findPrimesOptimized(limit) {
  // Your implementation here
}
```

### Challenge 13: Parallel Processing with Worker Threads
**Problem**: Implement parallel matrix multiplication.

```javascript
// Sequential matrix multiplication - O(n³)
function multiplyMatricesSequential(a, b) {
  const rows = a.length;
  const cols = b[0].length;
  const result = Array(rows).fill().map(() => Array(cols).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < b.length; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  
  return result;
}

// TODO: Implement parallel version using worker threads
async function multiplyMatricesParallel(a, b, numWorkers = 4) {
  // Your implementation here
}
```

### Challenge 14: Stream Processing Optimization
**Problem**: Process large files efficiently using streams.

```javascript
const fs = require('fs');
const { Transform } = require('stream');

// TODO: Implement efficient log file processing
class LogProcessor extends Transform {
  constructor(options) {
    super({ objectMode: true, ...options });
    // Initialize your processor
  }
  
  _transform(chunk, encoding, callback) {
    // Process log entries efficiently
    // Extract metrics, filter, aggregate
  }
}

// Usage: Process 10GB+ log files with minimal memory
async function processLargeLogFile(inputPath, outputPath) {
  // Your implementation here
}
```

## Performance Testing Challenges

### Challenge 15: Benchmark and Profile Code
**Problem**: Create a comprehensive benchmarking suite.

```javascript
class PerformanceBenchmark {
  constructor() {
    this.results = new Map();
  }
  
  async benchmark(name, fn, iterations = 1000) {
    // TODO: Implement accurate benchmarking with:
    // - Warm-up runs
    // - Statistical analysis
    // - Memory usage tracking
    // - GC impact measurement
  }
  
  profile(name, fn) {
    // TODO: Profile function execution
    // - CPU usage
    // - Memory allocation
    // - Call stack analysis
  }
  
  compare(results) {
    // TODO: Compare benchmark results
  }
}
```

## Summary

These performance optimization challenges cover comprehensive areas:

### Memory Management
- Object pooling for reducing GC pressure
- Memory leak detection and prevention
- Efficient data structure selection
- Stream processing for large datasets

### Algorithmic Optimization
- Time complexity improvements
- Space complexity optimization
- Efficient sorting and searching algorithms
- Data structure selection for specific use cases

### Concurrent Programming
- Worker thread pools for CPU-intensive tasks
- Rate limiting with proper concurrency control
- Parallel processing techniques
- Async operation optimization with backpressure

### Database and API Performance
- Query optimization and indexing strategies
- Connection pooling implementation
- Batch processing for API calls
- Multi-level caching strategies

### Performance Testing
- Comprehensive benchmarking frameworks
- Load testing with realistic scenarios
- Resource monitoring and profiling
- Statistical analysis of performance metrics

### Key Performance Principles

1. **Measure First**: Always profile before optimizing
2. **Optimize Bottlenecks**: Focus on the slowest parts
3. **Consider Trade-offs**: Balance speed, memory, and complexity
4. **Test Thoroughly**: Validate optimizations don't break functionality
5. **Monitor Production**: Continuous performance monitoring
6. **Scale Appropriately**: Design for expected load patterns

These challenges prepare you for senior-level performance optimization discussions in technical interviews, covering both theoretical knowledge and practical implementation skills.
#
# Additional Advanced Challenges

### Challenge 16: Efficient String Processing
**Problem**: Optimize string manipulation operations for large text processing.

```javascript
// Inefficient string concatenation
function processTextInefficient(lines) {
  let result = '';
  for (const line of lines) {
    result += line.toUpperCase() + '\n';
  }
  return result;
}

// TODO: Optimize for processing millions of lines
function processTextOptimized(lines) {
  // Your implementation here
}
```

**Solution**:
```javascript
function processTextOptimized(lines) {
  // Use array join instead of string concatenation
  const processed = [];
  const batchSize = 10000;
  
  for (let i = 0; i < lines.length; i += batchSize) {
    const batch = lines.slice(i, i + batchSize);
    processed.push(...batch.map(line => line.toUpperCase()));
  }
  
  return processed.join('\n');
}

// Even more optimized with streaming
function* processTextStream(lines) {
  const batchSize = 1000;
  let batch = [];
  
  for (const line of lines) {
    batch.push(line.toUpperCase());
    
    if (batch.length >= batchSize) {
      yield batch.join('\n') + '\n';
      batch = [];
    }
  }
  
  if (batch.length > 0) {
    yield batch.join('\n');
  }
}
```

### Challenge 17: Multi-Level Cache Implementation
**Problem**: Implement multi-level caching with intelligent eviction.

```javascript
class MultiLevelCache {
  constructor(l1Size = 100, l2Size = 1000, l3Size = 10000) {
    // TODO: Implement L1 (memory), L2 (SSD), L3 (disk) cache levels
    // with appropriate eviction policies
  }
  
  async get(key) {
    // TODO: Check L1 -> L2 -> L3 -> source
    // Promote data up the cache hierarchy
  }
  
  async set(key, value) {
    // TODO: Store in appropriate cache level
    // Handle eviction and promotion
  }
}
```

**Solution**:
```javascript
class MultiLevelCache {
  constructor(l1Size = 100, l2Size = 1000, l3Size = 10000) {
    // L1: In-memory LRU cache (fastest)
    this.l1Cache = new Map();
    this.l1Size = l1Size;
    
    // L2: Simulated SSD cache (medium speed)
    this.l2Cache = new Map();
    this.l2Size = l2Size;
    this.l2AccessTimes = new Map();
    
    // L3: Simulated disk cache (slowest)
    this.l3Cache = new Map();
    this.l3Size = l3Size;
    this.l3AccessTimes = new Map();
    
    this.stats = {
      l1Hits: 0,
      l2Hits: 0,
      l3Hits: 0,
      misses: 0
    };
  }
  
  async get(key) {
    // Check L1 cache first
    if (this.l1Cache.has(key)) {
      this.stats.l1Hits++;
      // Move to end (most recently used)
      const value = this.l1Cache.get(key);
      this.l1Cache.delete(key);
      this.l1Cache.set(key, value);
      return value;
    }
    
    // Check L2 cache
    if (this.l2Cache.has(key)) {
      this.stats.l2Hits++;
      const value = this.l2Cache.get(key);
      
      // Promote to L1
      this.setL1(key, value);
      
      // Update L2 access time
      this.l2AccessTimes.set(key, Date.now());
      
      // Simulate SSD access delay
      await this.delay(1);
      return value;
    }
    
    // Check L3 cache
    if (this.l3Cache.has(key)) {
      this.stats.l3Hits++;
      const value = this.l3Cache.get(key);
      
      // Promote to L2 and L1
      this.setL2(key, value);
      this.setL1(key, value);
      
      // Simulate disk access delay
      await this.delay(10);
      return value;
    }
    
    // Cache miss
    this.stats.misses++;
    return null;
  }
  
  async set(key, value) {
    // Always store in L1 first
    this.setL1(key, value);
    
    // Asynchronously populate lower levels
    setTimeout(() => {
      this.setL2(key, value);
      this.setL3(key, value);
    }, 0);
  }
  
  setL1(key, value) {
    // LRU eviction for L1
    if (this.l1Cache.size >= this.l1Size && !this.l1Cache.has(key)) {
      const firstKey = this.l1Cache.keys().next().value;
      const evictedValue = this.l1Cache.get(firstKey);
      this.l1Cache.delete(firstKey);
      
      // Demote to L2
      this.setL2(firstKey, evictedValue);
    }
    
    this.l1Cache.set(key, value);
  }
  
  setL2(key, value) {
    // LFU eviction for L2 (Least Frequently Used)
    if (this.l2Cache.size >= this.l2Size && !this.l2Cache.has(key)) {
      let leastUsedKey = null;
      let oldestTime = Infinity;
      
      for (const [k, time] of this.l2AccessTimes.entries()) {
        if (time < oldestTime) {
          oldestTime = time;
          leastUsedKey = k;
        }
      }
      
      if (leastUsedKey) {
        const evictedValue = this.l2Cache.get(leastUsedKey);
        this.l2Cache.delete(leastUsedKey);
        this.l2AccessTimes.delete(leastUsedKey);
        
        // Demote to L3
        this.setL3(leastUsedKey, evictedValue);
      }
    }
    
    this.l2Cache.set(key, value);
    this.l2AccessTimes.set(key, Date.now());
  }
  
  setL3(key, value) {
    // FIFO eviction for L3 (First In, First Out)
    if (this.l3Cache.size >= this.l3Size && !this.l3Cache.has(key)) {
      const firstKey = this.l3Cache.keys().next().value;
      this.l3Cache.delete(firstKey);
      this.l3AccessTimes.delete(firstKey);
    }
    
    this.l3Cache.set(key, value);
    this.l3AccessTimes.set(key, Date.now());
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  getStats() {
    const total = this.stats.l1Hits + this.stats.l2Hits + this.stats.l3Hits + this.stats.misses;
    return {
      ...this.stats,
      total,
      hitRate: total > 0 ? ((total - this.stats.misses) / total * 100).toFixed(2) + '%' : '0%',
      l1HitRate: total > 0 ? (this.stats.l1Hits / total * 100).toFixed(2) + '%' : '0%'
    };
  }
}
```

### Challenge 18: Real-time Data Processing with Backpressure
**Problem**: Process real-time data streams with backpressure handling.

```javascript
const EventEmitter = require('events');

class RealTimeProcessor extends EventEmitter {
  constructor(options = {}) {
    super();
    this.bufferSize = options.bufferSize || 10000;
    this.processingRate = options.processingRate || 1000;
    this.batchSize = options.batchSize || 100;
    this.backpressureThreshold = options.backpressureThreshold || 0.8;
    
    this.buffer = [];
    this.isProcessing = false;
    this.droppedCount = 0;
    this.processedCount = 0;
    this.lastProcessTime = Date.now();
    
    this.metrics = {
      ingestionRate: 0,
      processingRate: 0,
      bufferUtilization: 0,
      backpressureEvents: 0
    };
    
    this.startMetricsCollection();
    this.startProcessing();
  }
  
  async ingest(data) {
    const bufferUtilization = this.buffer.length / this.bufferSize;
    
    // Handle backpressure
    if (bufferUtilization >= this.backpressureThreshold) {
      this.metrics.backpressureEvents++;
      this.emit('backpressure', { bufferUtilization, bufferSize: this.buffer.length });
      
      // Drop oldest data if buffer is full
      if (this.buffer.length >= this.bufferSize) {
        const dropped = this.buffer.shift();
        this.droppedCount++;
        this.emit('dataDropped', { dropped, droppedCount: this.droppedCount });
      }
    }
    
    // Add timestamp for processing latency tracking
    const item = {
      data,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    };
    
    this.buffer.push(item);
    this.emit('dataIngested', { item, bufferSize: this.buffer.length });
  }
  
  async startProcessing() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    while (this.isProcessing) {
      if (this.buffer.length === 0) {
        await this.delay(10); // Small delay when buffer is empty
        continue;
      }
      
      const batchSize = Math.min(this.batchSize, this.buffer.length);
      const batch = this.buffer.splice(0, batchSize);
      
      try {
        await this.processBatch(batch);
        this.processedCount += batch.length;
      } catch (error) {
        this.emit('processingError', { error, batch });
        // Re-queue failed items (with retry limit)
        for (const item of batch) {
          item.retryCount = (item.retryCount || 0) + 1;
          if (item.retryCount <= 3) {
            this.buffer.unshift(item);
          } else {
            this.droppedCount++;
            this.emit('itemFailed', { item, reason: 'Max retries exceeded' });
          }
        }
      }
      
      // Rate limiting
      const processingDelay = 1000 / (this.processingRate / this.batchSize);
      await this.delay(processingDelay);
    }
  }
  
  async processBatch(batch) {
    const startTime = Date.now();
    
    // Simulate processing with different strategies
    const results = await Promise.all(
      batch.map(async (item) => {
        try {
          // Your actual processing logic here
          const result = await this.processItem(item);
          
          const processingLatency = Date.now() - item.timestamp;
          this.emit('itemProcessed', { 
            item, 
            result, 
            latency: processingLatency 
          });
          
          return { item, result, success: true };
        } catch (error) {
          this.emit('itemError', { item, error });
          return { item, error, success: false };
        }
      })
    );
    
    const processingTime = Date.now() - startTime;
    this.emit('batchProcessed', { 
      batch, 
      results, 
      processingTime,
      throughput: batch.length / (processingTime / 1000)
    });
    
    return results;
  }
  
  async processItem(item) {
    // Implement your actual processing logic
    // This is just a simulation
    await this.delay(Math.random() * 10);
    
    if (Math.random() < 0.05) { // 5% failure rate
      throw new Error('Random processing error');
    }
    
    return {
      id: item.id,
      processed: true,
      processedAt: Date.now(),
      data: item.data
    };
  }
  
  startMetricsCollection() {
    setInterval(() => {
      const now = Date.now();
      const timeDelta = (now - this.lastProcessTime) / 1000;
      
      this.metrics = {
        ingestionRate: this.buffer.length / timeDelta,
        processingRate: this.processedCount / timeDelta,
        bufferUtilization: (this.buffer.length / this.bufferSize) * 100,
        backpressureEvents: this.metrics.backpressureEvents
      };
      
      this.emit('metrics', this.metrics);
      this.lastProcessTime = now;
    }, 5000);
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      bufferSize: this.buffer.length,
      processedCount: this.processedCount,
      droppedCount: this.droppedCount,
      uptime: Date.now() - this.startTime
    };
  }
  
  async stop() {
    this.isProcessing = false;
    
    // Process remaining items in buffer
    while (this.buffer.length > 0) {
      const batch = this.buffer.splice(0, this.batchSize);
      try {
        await this.processBatch(batch);
      } catch (error) {
        this.emit('shutdownError', { error, remainingItems: batch });
      }
    }
    
    this.emit('stopped');
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Challenge 19: Load Testing Framework
**Problem**: Create a comprehensive load testing framework.

```javascript
const http = require('http');
const https = require('https');
const { URL } = require('url');
const EventEmitter = require('events');

class LoadTester extends EventEmitter {
  constructor(options = {}) {
    super();
    this.baseURL = options.baseURL;
    this.maxConcurrency = options.maxConcurrency || 100;
    this.duration = options.duration || 60000;
    this.rampUpTime = options.rampUpTime || 10000;
    this.reportInterval = options.reportInterval || 5000;
    
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: [],
      errorCounts: new Map(),
      statusCodes: new Map(),
      throughput: 0,
      startTime: null,
      endTime: null
    };
    
    this.activeRequests = 0;
    this.isRunning = false;
  }
  
  async runLoadTest(scenarios) {
    this.isRunning = true;
    this.metrics.startTime = Date.now();
    
    console.log(`Starting load test with ${this.maxConcurrency} max concurrent users`);
    console.log(`Duration: ${this.duration}ms, Ramp-up: ${this.rampUpTime}ms`);
    
    // Start metrics reporting
    const metricsInterval = setInterval(() => {
      this.reportMetrics();
    }, this.reportInterval);
    
    // Start resource monitoring
    const resourceInterval = setInterval(() => {
      this.monitorResources();
    }, 1000);
    
    try {
      await this.executeLoadTest(scenarios);
    } finally {
      clearInterval(metricsInterval);
      clearInterval(resourceInterval);
      this.isRunning = false;
      this.metrics.endTime = Date.now();
      this.generateFinalReport();
    }
  }
  
  async executeLoadTest(scenarios) {
    const testDuration = this.duration;
    const rampUpDuration = this.rampUpTime;
    const startTime = Date.now();
    
    // Calculate ramp-up schedule
    const rampUpInterval = rampUpDuration / this.maxConcurrency;
    let currentConcurrency = 0;
    
    const workers = [];
    
    // Ramp-up phase
    const rampUpTimer = setInterval(() => {
      if (currentConcurrency < this.maxConcurrency && this.isRunning) {
        const worker = this.createWorker(scenarios);
        workers.push(worker);
        currentConcurrency++;
        
        console.log(`Ramped up to ${currentConcurrency} concurrent users`);
      } else {
        clearInterval(rampUpTimer);
        console.log('Ramp-up complete');
      }
    }, rampUpInterval);
    
    // Wait for test duration
    await new Promise(resolve => {
      setTimeout(() => {
        this.isRunning = false;
        clearInterval(rampUpTimer);
        resolve();
      }, testDuration);
    });
    
    // Wait for all active requests to complete
    console.log('Waiting for active requests to complete...');
    while (this.activeRequests > 0) {
      await this.delay(100);
    }
    
    console.log('Load test completed');
  }
  
  createWorker(scenarios) {
    const worker = async () => {
      while (this.isRunning) {
        try {
          // Select random scenario
          const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
          await this.executeScenario(scenario);
          
          // Think time between requests
          if (scenario.thinkTime) {
            await this.delay(scenario.thinkTime);
          }
        } catch (error) {
          // Worker-level error handling
          console.error('Worker error:', error.message);
        }
      }
    };
    
    worker();
    return worker;
  }
  
  async executeScenario(scenario) {
    this.activeRequests++;
    const startTime = Date.now();
    
    try {
      const response = await this.makeRequest(scenario);
      const responseTime = Date.now() - startTime;
      
      this.recordSuccess(response, responseTime);
      
      // Validate response if validator provided
      if (scenario.validator) {
        const isValid = await scenario.validator(response);
        if (!isValid) {
          this.recordError('Validation failed', response.statusCode);
        }
      }
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.recordError(error.message, error.statusCode || 0);
      this.metrics.responseTimes.push(responseTime);
    } finally {
      this.activeRequests--;
    }
  }
  
  async makeRequest(scenario) {
    return new Promise((resolve, reject) => {
      const url = new URL(scenario.path, this.baseURL);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: scenario.method || 'GET',
        headers: scenario.headers || {},
        timeout: scenario.timeout || 30000
      };
      
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            responseTime: Date.now()
          });
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      if (scenario.body) {
        req.write(JSON.stringify(scenario.body));
      }
      
      req.end();
    });
  }
  
  recordSuccess(response, responseTime) {
    this.metrics.totalRequests++;
    this.metrics.successfulRequests++;
    this.metrics.responseTimes.push(responseTime);
    
    const statusCode = response.statusCode;
    this.metrics.statusCodes.set(statusCode, (this.metrics.statusCodes.get(statusCode) || 0) + 1);
  }
  
  recordError(errorMessage, statusCode) {
    this.metrics.totalRequests++;
    this.metrics.failedRequests++;
    this.metrics.errorCounts.set(errorMessage, (this.metrics.errorCounts.get(errorMessage) || 0) + 1);
    
    if (statusCode) {
      this.metrics.statusCodes.set(statusCode, (this.metrics.statusCodes.get(statusCode) || 0) + 1);
    }
  }
  
  reportMetrics() {
    const elapsed = Date.now() - this.metrics.startTime;
    const throughput = (this.metrics.totalRequests / elapsed) * 1000; // requests per second
    
    const responseTimes = this.metrics.responseTimes;
    const sortedTimes = [...responseTimes].sort((a, b) => a - b);
    
    const report = {
      elapsed: elapsed,
      totalRequests: this.metrics.totalRequests,
      successRate: ((this.metrics.successfulRequests / this.metrics.totalRequests) * 100).toFixed(2) + '%',
      throughput: throughput.toFixed(2) + ' req/s',
      activeRequests: this.activeRequests,
      responseTime: {
        min: sortedTimes[0] || 0,
        max: sortedTimes[sortedTimes.length - 1] || 0,
        avg: responseTimes.length > 0 ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2) : 0,
        p50: sortedTimes[Math.floor(sortedTimes.length * 0.5)] || 0,
        p95: sortedTimes[Math.floor(sortedTimes.length * 0.95)] || 0,
        p99: sortedTimes[Math.floor(sortedTimes.length * 0.99)] || 0
      }
    };
    
    console.log('--- Load Test Metrics ---');
    console.log(JSON.stringify(report, null, 2));
    
    this.emit('metrics', report);
  }
  
  monitorResources() {
    const usage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    const resourceMetrics = {
      memory: {
        heapUsed: (usage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
        heapTotal: (usage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
        external: (usage.external / 1024 / 1024).toFixed(2) + ' MB'
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      activeRequests: this.activeRequests
    };
    
    this.emit('resources', resourceMetrics);
  }
  
  generateFinalReport() {
    const totalDuration = this.metrics.endTime - this.metrics.startTime;
    const avgThroughput = (this.metrics.totalRequests / totalDuration) * 1000;
    
    const responseTimes = this.metrics.responseTimes;
    const sortedTimes = [...responseTimes].sort((a, b) => a - b);
    
    const finalReport = {
      summary: {
        totalDuration: totalDuration + 'ms',
        totalRequests: this.metrics.totalRequests,
        successfulRequests: this.metrics.successfulRequests,
        failedRequests: this.metrics.failedRequests,
        successRate: ((this.metrics.successfulRequests / this.metrics.totalRequests) * 100).toFixed(2) + '%',
        avgThroughput: avgThroughput.toFixed(2) + ' req/s'
      },
      responseTime: {
        min: sortedTimes[0] || 0,
        max: sortedTimes[sortedTimes.length - 1] || 0,
        avg: responseTimes.length > 0 ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2) : 0,
        median: sortedTimes[Math.floor(sortedTimes.length * 0.5)] || 0,
        p95: sortedTimes[Math.floor(sortedTimes.length * 0.95)] || 0,
        p99: sortedTimes[Math.floor(sortedTimes.length * 0.99)] || 0
      },
      statusCodes: Object.fromEntries(this.metrics.statusCodes),
      errors: Object.fromEntries(this.metrics.errorCounts)
    };
    
    console.log('\n=== FINAL LOAD TEST REPORT ===');
    console.log(JSON.stringify(finalReport, null, 2));
    
    this.emit('finalReport', finalReport);
    return finalReport;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Challenge 20: Circuit Breaker Pattern
**Problem**: Implement a circuit breaker for resilient service calls.

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= 3) {
        this.state = 'CLOSED';
      }
    }
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
  
  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount
    };
  }
}
```

## Complete Solutions for Previous Challenges

### Challenge 3 Solution: Memory Leak Detection Fix

```javascript
class EventManager {
  constructor(maxCacheSize = 1000, cacheTTL = 300000) {
    this.listeners = new Map();
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.maxCacheSize = maxCacheSize;
    this.cacheTTL = cacheTTL;
    
    // Periodic cleanup
    this.cleanupInterval = setInterval(() => {
      this.cleanupCache();
    }, 60000);
  }
  
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      if (callbacks.length === 0) {
        this.listeners.delete(event);
      }
    }
  }
  
  processEvent(event, data) {
    const cacheKey = `${event}_${JSON.stringify(data)}`;
    const now = Date.now();
    
    // Check cache with TTL
    if (this.cache.has(cacheKey)) {
      const timestamp = this.cacheTimestamps.get(cacheKey);
      if (now - timestamp < this.cacheTTL) {
        return this.cache.get(cacheKey);
      } else {
        // Remove expired entry
        this.cache.delete(cacheKey);
        this.cacheTimestamps.delete(cacheKey);
      }
    }
    
    const result = this.expensiveProcessing(data);
    
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      this.cacheTimestamps.delete(oldestKey);
    }
    
    this.cache.set(cacheKey, result);
    this.cacheTimestamps.set(cacheKey, now);
    return result;
  }
  
  cleanupCache() {
    const now = Date.now();
    for (const [key, timestamp] of this.cacheTimestamps.entries()) {
      if (now - timestamp > this.cacheTTL) {
        this.cache.delete(key);
        this.cacheTimestamps.delete(key);
      }
    }
  }
  
  destroy() {
    clearInterval(this.cleanupInterval);
    this.listeners.clear();
    this.cache.clear();
    this.cacheTimestamps.clear();
  }
  
  expensiveProcessing(data) {
    // Simulate expensive operation
    return { processed: data, timestamp: Date.now() };
  }
}
```

### Challenge 4 Solution: Database Query Optimization

```javascript
async function getUsersWithPostsOptimized(userIds) {
  // Single query with JOIN
  const query = `
    SELECT u.*, p.id as post_id, p.title, p.content, p.created_at as post_created
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    WHERE u.id IN (${userIds.map(() => '?').join(',')})
    ORDER BY u.id, p.created_at DESC
  `;
  
  const results = await db.query(query, userIds);
  
  // Group results by user
  const usersMap = new Map();
  for (const row of results) {
    if (!usersMap.has(row.id)) {
      usersMap.set(row.id, {
        id: row.id,
        name: row.name,
        email: row.email,
        posts: []
      });
    }
    
    if (row.post_id) {
      usersMap.get(row.id).posts.push({
        id: row.post_id,
        title: row.title,
        content: row.content,
        created_at: row.post_created
      });
    }
  }
  
  return Array.from(usersMap.values());
}
```

### Challenge 5 Solution: LRU Cache Implementation

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // O(1) operations with insertion order
  }
  
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return -1;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

## Interview Tips and Best Practices

### Performance Optimization Principles

1. **Profile Before Optimizing**
   - Use tools like Node.js built-in profiler
   - Identify actual bottlenecks, not assumed ones
   - Measure memory usage and CPU utilization

2. **Optimize the Right Things**
   - Focus on hot paths and critical sections
   - Consider the 80/20 rule - 80% of time spent in 20% of code
   - Don't optimize prematurely

3. **Memory Management**
   - Understand garbage collection patterns
   - Use object pooling for frequently created objects
   - Implement proper cleanup and resource management
   - Monitor memory leaks in production

4. **Concurrency and Parallelism**
   - Use worker threads for CPU-intensive tasks
   - Implement proper backpressure handling
   - Consider async/await patterns carefully
   - Use semaphores and rate limiting appropriately

5. **Database Optimization**
   - Understand query execution plans
   - Use appropriate indexes
   - Implement connection pooling
   - Consider caching strategies

6. **Caching Strategies**
   - Implement multi-level caching
   - Use appropriate eviction policies
   - Handle cache invalidation properly
   - Monitor cache hit rates

7. **Testing and Monitoring**
   - Implement comprehensive benchmarking
   - Use load testing for realistic scenarios
   - Monitor performance in production
   - Set up alerting for performance degradation

These challenges and solutions provide a comprehensive foundation for discussing performance optimization in senior backend developer interviews, covering both theoretical understanding and practical implementation skills.