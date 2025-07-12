---
title: "Backend Algorithms - Coding Challenges"
description: "40+ coding problems specific to backend engineering including string processing, tree traversal, graph algorithms, distributed systems, and concurrent programming"
category: "coding-challenges"
tags: ["algorithms", "backend", "data-structures", "distributed-systems", "concurrency"]
difficulty: "intermediate-advanced"
---

# Backend Algorithms - Coding Challenges

## String Processing Challenges

### 1. Log Parser and Analyzer
**Problem**: Parse server logs and extract meaningful metrics.

```javascript
// Input: Array of log entries
const logs = [
  "2024-01-01 10:00:00 INFO User login successful user_id=123",
  "2024-01-01 10:01:00 ERROR Database connection failed",
  "2024-01-01 10:02:00 INFO User logout user_id=123"
];

// Expected output: Parsed log objects with metrics
function parseServerLogs(logs) {
  // Your implementation here
}
```

**Solution Approaches**:
1. **Regex-based parsing** - O(n*m) where n=logs, m=avg log length
2. **State machine parser** - O(n*m) but more maintainable
3. **Split-based parsing** - O(n*m) but faster for simple formats

**Complexity Analysis**: Time O(n*m), Space O(n)

### 2. URL Path Matcher
**Problem**: Implement a URL path matcher for REST API routing.

```javascript
// Match patterns like "/users/:id/posts/:postId"
function createPathMatcher(pattern) {
  // Return function that matches actual paths
}

const matcher = createPathMatcher("/users/:id/posts/:postId");
console.log(matcher("/users/123/posts/456")); // { id: "123", postId: "456" }
```

**Solution**: Trie-based pattern matching with parameter extraction
**Complexity**: Time O(m) for matching, Space O(p) where p=pattern length

### 3. Configuration File Parser
**Problem**: Parse nested configuration files with variable substitution.

```javascript
const config = `
server.port=${PORT:8080}
database.url=postgresql://localhost:5432/${DB_NAME}
cache.ttl=3600
`;

function parseConfig(configString, env = {}) {
  // Parse and substitute environment variables
}
```

**Multiple Approaches**:
1. **Recursive descent parser** - Most flexible
2. **Regex substitution** - Simple but limited
3. **Template engine approach** - Feature-rich

### 4. SQL Query Builder
**Problem**: Build SQL queries programmatically with proper escaping.

```javascript
class QueryBuilder {
  select(fields) { /* implementation */ }
  from(table) { /* implementation */ }
  where(conditions) { /* implementation */ }
  join(table, condition) { /* implementation */ }
  build() { /* return SQL string */ }
}

// Usage
const query = new QueryBuilder()
  .select(['name', 'email'])
  .from('users')
  .where({ active: true, role: 'admin' })
  .build();
```

**Complexity**: Time O(n) for building, Space O(n) for query storage

### 5. JSON Path Extractor
**Problem**: Extract values from JSON using JSONPath expressions.

```javascript
const data = {
  users: [
    { id: 1, profile: { name: "John", settings: { theme: "dark" } } },
    { id: 2, profile: { name: "Jane", settings: { theme: "light" } } }
  ]
};

function jsonPath(obj, path) {
  // Extract values using path like "$.users[*].profile.name"
}
```

**Solution**: Recursive descent with wildcard support
**Complexity**: Time O(n*d) where n=nodes, d=depth

## Tree Traversal Challenges

### 6. Directory Tree Processor
**Problem**: Process file system directory structures efficiently.

```javascript
class DirectoryNode {
  constructor(name, isFile = false) {
    this.name = name;
    this.isFile = isFile;
    this.children = [];
    this.size = 0;
  }
}

function calculateDirectorySizes(root) {
  // Calculate total size for each directory
}

function findLargestFiles(root, n = 10) {
  // Find n largest files in the tree
}
```

**Solutions**:
1. **Post-order traversal** for size calculation - O(n)
2. **Priority queue** for largest files - O(n log k)

### 7. Database Index B-Tree Operations
**Problem**: Implement B-tree operations for database indexing.

```javascript
class BTreeNode {
  constructor(degree) {
    this.keys = [];
    this.children = [];
    this.isLeaf = true;
    this.degree = degree;
  }
}

class BTree {
  insert(key, value) { /* implementation */ }
  search(key) { /* implementation */ }
  delete(key) { /* implementation */ }
  range(startKey, endKey) { /* range query */ }
}
```

**Complexity**: 
- Insert/Search/Delete: O(log n)
- Range queries: O(log n + k) where k=results

### 8. Dependency Resolution Tree
**Problem**: Resolve package dependencies and detect circular dependencies.

```javascript
const packages = {
  'express': ['body-parser', 'cookie-parser'],
  'body-parser': ['bytes', 'type-is'],
  'cookie-parser': ['cookie'],
  'bytes': [],
  'type-is': ['mime-types'],
  'cookie': [],
  'mime-types': []
};

function resolveDependencies(packages, target) {
  // Return resolved dependency order
}

function detectCircularDependencies(packages) {
  // Detect and return circular dependencies
}
```

**Solutions**:
1. **Topological sort** for resolution - O(V + E)
2. **DFS with colors** for cycle detection - O(V + E)

### 9. Configuration Inheritance Tree
**Problem**: Implement configuration inheritance with override resolution.

```javascript
class ConfigNode {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.parent = null;
    this.children = [];
  }
}

function resolveConfig(node) {
  // Resolve configuration with inheritance
}
```

**Solution**: Bottom-up traversal with merge strategy
**Complexity**: Time O(n*k) where k=avg config size

### 10. API Route Tree
**Problem**: Build and search API route trees for fast matching.

```javascript
class RouteNode {
  constructor() {
    this.handlers = new Map(); // HTTP method -> handler
    this.children = new Map();
    this.paramChild = null;
    this.wildcardChild = null;
  }
}

class Router {
  addRoute(method, path, handler) { /* implementation */ }
  findRoute(method, path) { /* implementation */ }
}
```

**Complexity**: Time O(m) for lookup where m=path segments

## Graph Algorithm Challenges

### 11. Service Dependency Graph
**Problem**: Model and analyze microservice dependencies.

```javascript
class ServiceGraph {
  constructor() {
    this.services = new Map();
    this.dependencies = new Map();
  }
  
  addService(name, metadata) { /* implementation */ }
  addDependency(from, to, type) { /* implementation */ }
  findCriticalPath() { /* longest path analysis */ }
  detectBottlenecks() { /* identify high-degree nodes */ }
  calculateImpactRadius(service) { /* affected services */ }
}
```

**Algorithms Used**:
1. **Longest path** for critical path - O(V + E)
2. **BFS/DFS** for impact analysis - O(V + E)

### 12. Load Balancer Graph
**Problem**: Implement load balancing algorithms with server health.

```javascript
class LoadBalancer {
  constructor() {
    this.servers = [];
    this.healthGraph = new Map();
  }
  
  addServer(server) { /* implementation */ }
  updateHealth(serverId, health) { /* implementation */ }
  getNextServer(algorithm = 'round-robin') { /* implementation */ }
  rebalance() { /* redistribute load */ }
}
```

**Algorithms**:
1. **Round-robin** - O(1)
2. **Weighted round-robin** - O(1)
3. **Least connections** - O(n)
4. **Consistent hashing** - O(log n)

### 13. Database Replication Graph
**Problem**: Model database replication topology and failover.

```javascript
class ReplicationGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }
  
  addDatabase(id, role, config) { /* implementation */ }
  addReplication(master, slave, config) { /* implementation */ }
  findFailoverCandidates(failedNode) { /* implementation */ }
  calculateReplicationLag() { /* implementation */ }
}
```

**Solution**: Graph traversal with weighted edges
**Complexity**: Time O(V + E) for failover analysis

### 14. Network Topology Analyzer
**Problem**: Analyze network connectivity and find optimal paths.

```javascript
class NetworkGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }
  
  addNode(id, metadata) { /* implementation */ }
  addConnection(from, to, latency, bandwidth) { /* implementation */ }
  findShortestPath(source, destination) { /* Dijkstra */ }
  findAllPaths(source, destination) { /* All paths */ }
  detectNetworkPartitions() { /* Connected components */ }
}
```

**Algorithms**:
1. **Dijkstra's algorithm** - O((V + E) log V)
2. **Floyd-Warshall** - O(V³) for all pairs
3. **Union-Find** - O(E α(V)) for partitions

### 15. Cache Invalidation Graph
**Problem**: Model cache dependencies and invalidation cascades.

```javascript
class CacheGraph {
  constructor() {
    this.caches = new Map();
    this.dependencies = new Map();
  }
  
  addCache(key, value, dependencies = []) { /* implementation */ }
  invalidate(key) { /* cascade invalidation */ }
  findInvalidationOrder(keys) { /* topological sort */ }
  detectInvalidationCycles() { /* cycle detection */ }
}
```

**Solution**: Topological sort with cycle detection
**Complexity**: Time O(V + E) for invalidation

## Distributed Algorithm Challenges

### 16. Distributed Lock Manager
**Problem**: Implement distributed locking with deadlock detection.

```javascript
class DistributedLockManager {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.locks = new Map();
    this.waitGraph = new Map();
  }
  
  async acquireLock(resource, timeout) { /* implementation */ }
  async releaseLock(resource) { /* implementation */ }
  detectDeadlock() { /* cycle detection in wait graph */ }
  resolveDeadlock() { /* victim selection and rollback */ }
}
```

**Algorithms**:
1. **Wait-for graph** - O(V + E) for deadlock detection
2. **Timeout-based** - Simple but may cause livelocks
3. **Timestamp ordering** - Prevents deadlocks

### 17. Consensus Algorithm (Raft)
**Problem**: Implement basic Raft consensus for distributed systems.

```javascript
class RaftNode {
  constructor(id, peers) {
    this.id = id;
    this.peers = peers;
    this.state = 'follower';
    this.currentTerm = 0;
    this.log = [];
    this.commitIndex = 0;
  }
  
  startElection() { /* implementation */ }
  handleVoteRequest(request) { /* implementation */ }
  handleAppendEntries(request) { /* implementation */ }
  replicateLog(entry) { /* implementation */ }
}
```

**Complexity**: O(n) messages per consensus round

### 18. Distributed Hash Table
**Problem**: Implement consistent hashing for distributed storage.

```javascript
class ConsistentHashRing {
  constructor(replicas = 3) {
    this.replicas = replicas;
    this.ring = new Map();
    this.nodes = new Set();
  }
  
  addNode(node) { /* implementation */ }
  removeNode(node) { /* implementation */ }
  getNode(key) { /* find responsible node */ }
  getNodes(key, count) { /* get multiple replicas */ }
  rebalance() { /* redistribute keys */ }
}
```

**Complexity**: 
- Add/Remove: O(R log N) where R=replicas, N=nodes
- Lookup: O(log N)

### 19. Event Sourcing Store
**Problem**: Implement event sourcing with snapshotting.

```javascript
class EventStore {
  constructor() {
    this.events = [];
    this.snapshots = new Map();
    this.projections = new Map();
  }
  
  appendEvent(streamId, event) { /* implementation */ }
  getEvents(streamId, fromVersion) { /* implementation */ }
  createSnapshot(streamId, version, state) { /* implementation */ }
  rebuildProjection(projectionName) { /* implementation */ }
}
```

**Optimization**: Snapshotting reduces replay time from O(n) to O(k)

### 20. Distributed Rate Limiter
**Problem**: Implement rate limiting across multiple nodes.

```javascript
class DistributedRateLimiter {
  constructor(algorithm = 'sliding-window') {
    this.algorithm = algorithm;
    this.windows = new Map();
    this.nodes = new Set();
  }
  
  async isAllowed(key, limit, window) { /* implementation */ }
  syncWithPeers() { /* synchronize counters */ }
  handleNodeFailure(nodeId) { /* redistribute load */ }
}
```

**Algorithms**:
1. **Token bucket** - Smooth rate limiting
2. **Sliding window** - Precise but memory intensive
3. **Fixed window** - Simple but bursty

## Concurrent Programming Challenges

### 21. Thread Pool Manager
**Problem**: Implement a configurable thread pool with work stealing.

```javascript
class ThreadPool {
  constructor(size, queueSize = Infinity) {
    this.size = size;
    this.workers = [];
    this.queue = [];
    this.running = false;
  }
  
  submit(task) { /* implementation */ }
  shutdown(graceful = true) { /* implementation */ }
  resize(newSize) { /* dynamic resizing */ }
  getStats() { /* pool statistics */ }
}
```

**Work Stealing**: Each worker has local queue, steals from others when idle
**Complexity**: O(1) for local operations, O(n) for stealing

### 22. Producer-Consumer with Backpressure
**Problem**: Implement producer-consumer pattern with flow control.

```javascript
class BackpressureQueue {
  constructor(capacity, strategy = 'block') {
    this.capacity = capacity;
    this.strategy = strategy; // 'block', 'drop', 'overflow'
    this.queue = [];
    this.producers = [];
    this.consumers = [];
  }
  
  async produce(item) { /* implementation */ }
  async consume() { /* implementation */ }
  handleBackpressure() { /* apply strategy */ }
}
```

**Strategies**:
1. **Blocking** - Producer waits
2. **Dropping** - Drop oldest/newest items
3. **Overflow** - Expand queue temporarily

### 23. Read-Write Lock
**Problem**: Implement reader-writer locks with fairness.

```javascript
class ReadWriteLock {
  constructor(fair = true) {
    this.fair = fair;
    this.readers = 0;
    this.writers = 0;
    this.waitingReaders = [];
    this.waitingWriters = [];
  }
  
  async acquireReadLock() { /* implementation */ }
  async acquireWriteLock() { /* implementation */ }
  releaseReadLock() { /* implementation */ }
  releaseWriteLock() { /* implementation */ }
}
```

**Fairness**: Prevent writer starvation by queuing requests

### 24. Async Task Scheduler
**Problem**: Schedule and execute async tasks with dependencies.

```javascript
class TaskScheduler {
  constructor(concurrency = 10) {
    this.concurrency = concurrency;
    this.running = new Set();
    this.pending = new Map();
    this.dependencies = new Map();
  }
  
  schedule(taskId, task, dependencies = []) { /* implementation */ }
  cancel(taskId) { /* implementation */ }
  pause() { /* pause execution */ }
  resume() { /* resume execution */ }
}
```

**Algorithm**: Topological sort with concurrent execution
**Complexity**: O(V + E) for dependency resolution

### 25. Connection Pool
**Problem**: Implement database connection pooling with health checks.

```javascript
class ConnectionPool {
  constructor(factory, options = {}) {
    this.factory = factory;
    this.minSize = options.minSize || 5;
    this.maxSize = options.maxSize || 20;
    this.available = [];
    this.busy = new Set();
    this.waiting = [];
  }
  
  async acquire(timeout = 5000) { /* implementation */ }
  release(connection) { /* implementation */ }
  healthCheck() { /* validate connections */ }
  drain() { /* close all connections */ }
}
```

**Features**:
- Connection validation
- Automatic retry
- Graceful degradation
- Metrics collection

## Advanced Backend Challenges

### 26. Database Query Optimizer
**Problem**: Optimize SQL query execution plans.

```javascript
class QueryOptimizer {
  constructor(statistics) {
    this.statistics = statistics;
    this.rules = [];
  }
  
  optimize(query) { /* implementation */ }
  estimateCost(plan) { /* cost estimation */ }
  generatePlans(query) { /* plan generation */ }
  selectBestPlan(plans) { /* plan selection */ }
}
```

**Techniques**:
1. **Rule-based optimization** - Apply transformation rules
2. **Cost-based optimization** - Choose lowest cost plan
3. **Heuristic optimization** - Use domain knowledge

### 27. Memory Cache with LRU and TTL
**Problem**: Implement multi-level cache with eviction policies.

```javascript
class AdvancedCache {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 1000;
    this.defaultTTL = options.defaultTTL || 3600;
    this.evictionPolicy = options.evictionPolicy || 'lru';
    this.storage = new Map();
    this.accessOrder = [];
    this.expirationTimes = new Map();
  }
  
  set(key, value, ttl) { /* implementation */ }
  get(key) { /* implementation */ }
  evict() { /* apply eviction policy */ }
  cleanup() { /* remove expired items */ }
}
```

**Eviction Policies**:
1. **LRU** - Least Recently Used
2. **LFU** - Least Frequently Used
3. **FIFO** - First In, First Out
4. **Random** - Random eviction

### 28. Message Queue System
**Problem**: Implement reliable message queuing with persistence.

```javascript
class MessageQueue {
  constructor(name, options = {}) {
    this.name = name;
    this.persistent = options.persistent || false;
    this.maxRetries = options.maxRetries || 3;
    this.messages = [];
    this.deadLetterQueue = [];
    this.subscribers = new Set();
  }
  
  publish(message, priority = 0) { /* implementation */ }
  subscribe(handler) { /* implementation */ }
  acknowledge(messageId) { /* implementation */ }
  retry(messageId) { /* implementation */ }
}
```

**Features**:
- Message persistence
- Dead letter queues
- Priority queuing
- Retry mechanisms

### 29. API Gateway Router
**Problem**: Implement API gateway with routing and middleware.

```javascript
class APIGateway {
  constructor() {
    this.routes = new Map();
    this.middleware = [];
    this.rateLimiters = new Map();
    this.circuitBreakers = new Map();
  }
  
  addRoute(pattern, target, options = {}) { /* implementation */ }
  addMiddleware(middleware) { /* implementation */ }
  route(request) { /* implementation */ }
  handleFailure(target, error) { /* circuit breaker logic */ }
}
```

**Middleware Types**:
- Authentication
- Rate limiting
- Request/response transformation
- Logging and metrics

### 30. Distributed Transaction Manager
**Problem**: Implement two-phase commit protocol.

```javascript
class TransactionManager {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.transactions = new Map();
    this.participants = new Set();
  }
  
  async beginTransaction(participants) { /* implementation */ }
  async prepare(transactionId) { /* phase 1 */ }
  async commit(transactionId) { /* phase 2 */ }
  async abort(transactionId) { /* rollback */ }
  handleTimeout(transactionId) { /* timeout handling */ }
}
```

**Phases**:
1. **Prepare phase** - All participants vote
2. **Commit phase** - Coordinator decides based on votes

## Performance and Optimization Challenges

### 31. Database Index Analyzer
**Problem**: Analyze and suggest database indexes.

```javascript
class IndexAnalyzer {
  constructor(schema, queries) {
    this.schema = schema;
    this.queries = queries;
    this.statistics = new Map();
  }
  
  analyzeQueries() { /* implementation */ }
  suggestIndexes() { /* implementation */ }
  estimateImpact(index) { /* implementation */ }
  detectRedundantIndexes() { /* implementation */ }
}
```

**Analysis Techniques**:
- Query frequency analysis
- Selectivity estimation
- Index usage patterns
- Cost-benefit analysis

### 32. Memory Profiler
**Problem**: Implement memory usage profiling and leak detection.

```javascript
class MemoryProfiler {
  constructor() {
    this.snapshots = [];
    this.allocations = new Map();
    this.leakThreshold = 1000;
  }
  
  takeSnapshot() { /* implementation */ }
  compareSnapshots(snap1, snap2) { /* implementation */ }
  detectLeaks() { /* implementation */ }
  generateReport() { /* implementation */ }
}
```

**Leak Detection**:
- Growth pattern analysis
- Reference counting
- Garbage collection monitoring

### 33. Load Testing Framework
**Problem**: Create framework for load testing backend services.

```javascript
class LoadTester {
  constructor(options = {}) {
    this.concurrency = options.concurrency || 10;
    this.duration = options.duration || 60;
    this.rampUp = options.rampUp || 10;
    this.metrics = new Map();
  }
  
  addScenario(name, scenario) { /* implementation */ }
  run() { /* implementation */ }
  collectMetrics() { /* implementation */ }
  generateReport() { /* implementation */ }
}
```

**Metrics Collected**:
- Response times (p50, p95, p99)
- Throughput (RPS)
- Error rates
- Resource utilization

### 34. Circuit Breaker Pattern
**Problem**: Implement circuit breaker for service resilience.

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;
    this.state = 'CLOSED';
    this.failures = 0;
    this.lastFailureTime = null;
  }
  
  async call(operation) { /* implementation */ }
  onSuccess() { /* implementation */ }
  onFailure() { /* implementation */ }
  canAttemptReset() { /* implementation */ }
}
```

**States**:
1. **CLOSED** - Normal operation
2. **OPEN** - Failing fast
3. **HALF_OPEN** - Testing recovery

### 35. Bulk Data Processor
**Problem**: Process large datasets efficiently with streaming.

```javascript
class BulkProcessor {
  constructor(options = {}) {
    this.batchSize = options.batchSize || 1000;
    this.concurrency = options.concurrency || 5;
    this.retryAttempts = options.retryAttempts || 3;
    this.processor = options.processor;
  }
  
  async process(dataStream) { /* implementation */ }
  createBatches(data) { /* implementation */ }
  processBatch(batch) { /* implementation */ }
  handleErrors(batch, error) { /* implementation */ }
}
```

**Optimization Techniques**:
- Streaming processing
- Batch optimization
- Parallel processing
- Error recovery

## System Integration Challenges

### 36. Event Bus System
**Problem**: Implement publish-subscribe event bus.

```javascript
class EventBus {
  constructor() {
    this.subscribers = new Map();
    this.middleware = [];
    this.deadLetterQueue = [];
  }
  
  subscribe(event, handler, options = {}) { /* implementation */ }
  publish(event, data) { /* implementation */ }
  unsubscribe(event, handler) { /* implementation */ }
  addMiddleware(middleware) { /* implementation */ }
}
```

**Features**:
- Wildcard subscriptions
- Event filtering
- Async/sync handling
- Error handling

### 37. Service Registry
**Problem**: Implement service discovery and health monitoring.

```javascript
class ServiceRegistry {
  constructor() {
    this.services = new Map();
    this.healthChecks = new Map();
    this.watchers = new Set();
  }
  
  register(service, metadata) { /* implementation */ }
  deregister(serviceId) { /* implementation */ }
  discover(serviceName) { /* implementation */ }
  healthCheck(serviceId) { /* implementation */ }
  watch(callback) { /* implementation */ }
}
```

**Health Check Types**:
- HTTP endpoint checks
- TCP connection checks
- Custom health checks
- Dependency checks

### 38. Configuration Manager
**Problem**: Manage distributed configuration with hot reloading.

```javascript
class ConfigManager {
  constructor(sources = []) {
    this.sources = sources;
    this.config = new Map();
    this.watchers = new Set();
    this.cache = new Map();
  }
  
  load() { /* implementation */ }
  get(key, defaultValue) { /* implementation */ }
  set(key, value) { /* implementation */ }
  watch(key, callback) { /* implementation */ }
  reload() { /* hot reload */ }
}
```

**Configuration Sources**:
- Environment variables
- Configuration files
- Remote configuration services
- Command line arguments

### 39. Workflow Engine
**Problem**: Implement workflow execution engine.

```javascript
class WorkflowEngine {
  constructor() {
    this.workflows = new Map();
    this.instances = new Map();
    this.executors = new Map();
  }
  
  defineWorkflow(definition) { /* implementation */ }
  startWorkflow(workflowId, input) { /* implementation */ }
  executeStep(instanceId, stepId) { /* implementation */ }
  handleError(instanceId, error) { /* implementation */ }
}
```

**Workflow Features**:
- Sequential and parallel execution
- Conditional branching
- Error handling and retry
- State persistence

### 40. Monitoring and Alerting System
**Problem**: Implement comprehensive monitoring with alerting.

```javascript
class MonitoringSystem {
  constructor() {
    this.metrics = new Map();
    this.alerts = new Map();
    this.thresholds = new Map();
    this.notifiers = [];
  }
  
  recordMetric(name, value, tags = {}) { /* implementation */ }
  defineAlert(name, condition, actions) { /* implementation */ }
  checkAlerts() { /* implementation */ }
  sendNotification(alert, value) { /* implementation */ }
}
```

**Monitoring Types**:
- System metrics (CPU, memory, disk)
- Application metrics (response time, throughput)
- Business metrics (user activity, revenue)
- Custom metrics

## Complexity Analysis Summary

### Time Complexities by Category:

**String Processing**: O(n*m) typical, O(n) optimal with preprocessing
**Tree Operations**: O(log n) for balanced trees, O(n) worst case
**Graph Algorithms**: O(V + E) for traversal, O(V²) for all-pairs problems
**Distributed Systems**: O(n) messages per operation typically
**Concurrent Programming**: O(1) for well-designed locks, O(n) for coordination

### Space Complexities:
- Most algorithms: O(n) for input storage
- Tree structures: O(h) for recursion stack
- Graph algorithms: O(V) for visited tracking
- Caching solutions: O(k) where k is cache size

### Optimization Strategies:
1. **Preprocessing** - Build indexes, sort data
2. **Caching** - Memoization, result caching
3. **Lazy evaluation** - Compute only when needed
4. **Batch processing** - Reduce per-item overhead
5. **Parallel processing** - Utilize multiple cores
6. **Approximation** - Trade accuracy for speed when acceptable

These challenges cover the essential algorithms and data structures that backend engineers encounter in real-world scenarios, from basic string processing to complex distributed systems coordination.