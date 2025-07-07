import { CheatSheet, PerformanceBenchmark } from '@/types/content';

export const cheatSheets: CheatSheet[] = [
  {
    id: 'nodejs-performance',
    title: 'Node.js Performance Optimization',
    category: 'Node.js',
    description: 'Essential techniques and patterns for optimizing Node.js applications',
    difficulty: 'advanced',
    estimatedReadTime: 8,
    lastUpdated: new Date('2024-01-15'),
    tags: ['performance', 'optimization', 'memory', 'cpu'],
    sections: [
      {
        id: 'memory-management',
        title: 'Memory Management',
        type: 'list',
        priority: 'high',
        content: {
          list: {
            ordered: false,
            items: [
              {
                title: 'Avoid Memory Leaks',
                description: 'Common patterns that cause memory leaks in Node.js',
                code: '// Bad: Global variables\nlet cache = {};\n\n// Good: Use WeakMap\nconst cache = new WeakMap();',
                notes: ['Use WeakMap for object references', 'Clear timers and intervals', 'Remove event listeners']
              },
              {
                title: 'Stream Processing',
                description: 'Use streams for large data processing',
                code: 'const fs = require("fs");\nconst stream = fs.createReadStream("large-file.txt");\nstream.pipe(process.stdout);',
                example: 'Processing 1GB+ files without loading into memory'
              },
              {
                title: 'Buffer Management',
                description: 'Efficient buffer handling for binary data',
                code: '// Allocate buffer efficiently\nconst buf = Buffer.allocUnsafe(1024);\nbuf.fill(0); // Initialize to prevent data leaks',
                notes: ['Use Buffer.allocUnsafe() for performance', 'Always initialize buffers', 'Prefer Buffer.from() for strings']
              }
            ]
          }
        }
      },
      {
        id: 'performance-metrics',
        title: 'Key Performance Metrics',
        type: 'table',
        priority: 'high',
        content: {
          table: {
            headers: ['Metric', 'Good', 'Acceptable', 'Poor', 'Tool'],
            sortable: true,
            searchable: true,
            rows: [
              ['Response Time', '< 100ms', '100-300ms', '> 300ms', 'clinic.js'],
              ['Memory Usage', '< 512MB', '512MB-1GB', '> 1GB', 'heapdump'],
              ['CPU Usage', '< 70%', '70-85%', '> 85%', 'perf_hooks'],
              ['Event Loop Lag', '< 10ms', '10-50ms', '> 50ms', '@nodejs/clinic'],
              ['Garbage Collection', '< 5ms', '5-20ms', '> 20ms', '--trace-gc'],
              ['File Descriptors', '< 1000', '1000-5000', '> 5000', 'lsof']
            ]
          }
        }
      },
      {
        id: 'optimization-techniques',
        title: 'Optimization Techniques',
        type: 'code',
        priority: 'high',
        content: {
          code: {
            language: 'javascript',
            copyable: true,
            description: 'Common optimization patterns for Node.js applications',
            snippet: `// 1. Use clustering for CPU-intensive tasks
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker process
  require('./app.js');
}

// 2. Implement connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 3. Use async/await properly
async function processData(items) {
  // Bad: Sequential processing
  // for (const item of items) {
  //   await processItem(item);
  // }
  
  // Good: Parallel processing with concurrency limit
  const results = await Promise.all(
    items.map(item => processItem(item))
  );
  return results;
}`
          }
        }
      }
    ]
  },
  {
    id: 'database-optimization',
    title: 'Database Query Optimization',
    category: 'Databases',
    description: 'SQL and NoSQL query optimization techniques and best practices',
    difficulty: 'advanced',
    estimatedReadTime: 12,
    lastUpdated: new Date('2024-01-20'),
    tags: ['sql', 'nosql', 'indexing', 'performance'],
    sections: [
      {
        id: 'sql-optimization',
        title: 'SQL Query Optimization',
        type: 'comparison',
        priority: 'high',
        content: {
          comparison: {
            criteria: ['Performance', 'Memory Usage', 'Complexity', 'Maintainability'],
            items: [
              {
                name: 'SELECT *',
                values: { 
                  'Performance': 'Poor', 
                  'Memory Usage': 'High', 
                  'Complexity': 'Low',
                  'Maintainability': 'Poor'
                },
                useCase: 'Never use in production - always specify columns'
              },
              {
                name: 'Indexed Columns',
                values: { 
                  'Performance': 'Excellent', 
                  'Memory Usage': 'Low', 
                  'Complexity': 'Medium',
                  'Maintainability': 'Good'
                },
                useCase: 'WHERE, JOIN, ORDER BY clauses'
              },
              {
                name: 'Subqueries',
                values: { 
                  'Performance': 'Variable', 
                  'Memory Usage': 'Medium', 
                  'Complexity': 'High',
                  'Maintainability': 'Medium'
                },
                useCase: 'Complex filtering logic, consider JOINs instead'
              },
              {
                name: 'CTEs (Common Table Expressions)',
                values: { 
                  'Performance': 'Good', 
                  'Memory Usage': 'Medium', 
                  'Complexity': 'Medium',
                  'Maintainability': 'Excellent'
                },
                useCase: 'Complex queries, recursive operations'
              }
            ]
          }
        }
      },
      {
        id: 'indexing-strategies',
        title: 'Indexing Strategies',
        type: 'code',
        priority: 'high',
        content: {
          code: {
            language: 'sql',
            copyable: true,
            description: 'Common indexing patterns for optimal query performance',
            snippet: `-- Composite index for multi-column queries
CREATE INDEX idx_user_status_created 
ON users (status, created_at);

-- Partial index for filtered queries
CREATE INDEX idx_active_users 
ON users (email) 
WHERE status = 'active';

-- Covering index to avoid table lookups
CREATE INDEX idx_user_profile_covering 
ON users (id) 
INCLUDE (name, email, status);

-- Functional index for computed values
CREATE INDEX idx_user_email_lower 
ON users (LOWER(email));

-- Hash index for equality lookups (PostgreSQL)
CREATE INDEX idx_user_id_hash 
ON users USING HASH (id);`
          }
        }
      },
      {
        id: 'nosql-patterns',
        title: 'NoSQL Optimization Patterns',
        type: 'list',
        priority: 'medium',
        content: {
          list: {
            ordered: true,
            items: [
              {
                title: 'Document Structure Design',
                description: 'Optimize document structure for query patterns',
                code: '// Bad: Deeply nested arrays\n{\n  "user": {\n    "posts": [/* 1000s of posts */]\n  }\n}\n\n// Good: Reference pattern\n{\n  "user": { "id": "123" },\n  "posts": { "userId": "123" }\n}',
                notes: ['Avoid large arrays in documents', 'Use references for one-to-many relationships', 'Denormalize frequently accessed data']
              },
              {
                title: 'Compound Indexes',
                description: 'Create indexes that support multiple query patterns',
                code: '// MongoDB compound index\ndb.users.createIndex({ "status": 1, "created_at": -1 })\n\n// Supports queries on:\n// - status only\n// - status + created_at\n// But NOT created_at only',
                example: 'Index prefix rule applies to compound indexes'
              }
            ]
          }
        }
      }
    ]
  },
  {
    id: 'system-design-patterns',
    title: 'System Design Patterns',
    category: 'System Design',
    description: 'Common architectural patterns for scalable distributed systems',
    difficulty: 'expert',
    estimatedReadTime: 15,
    lastUpdated: new Date('2024-01-25'),
    tags: ['architecture', 'scalability', 'patterns', 'microservices'],
    sections: [
      {
        id: 'scalability-patterns',
        title: 'Scalability Decision Tree',
        type: 'flowchart',
        priority: 'high',
        content: {
          flowchart: {
            description: 'Decision tree for choosing scalability patterns based on system requirements',
            mermaidCode: `graph TD
    A[High Load?] -->|Yes| B[Read Heavy?]
    A -->|No| C[Single Instance]
    B -->|Yes| D[Read Replicas]
    B -->|No| E[Write Heavy?]
    E -->|Yes| F[Sharding]
    E -->|No| G[Load Balancer]
    D --> H[Caching Layer]
    F --> I[Event Sourcing]
    G --> J[Auto Scaling]
    H --> K[CDN for Static Content]
    I --> L[CQRS Pattern]
    J --> M[Circuit Breaker]`
          }
        }
      },
      {
        id: 'caching-strategies',
        title: 'Caching Strategies',
        type: 'comparison',
        priority: 'high',
        content: {
          comparison: {
            criteria: ['Consistency', 'Performance', 'Complexity', 'Use Case'],
            items: [
              {
                name: 'Cache-Aside',
                values: {
                  'Consistency': 'Good',
                  'Performance': 'Good',
                  'Complexity': 'Low',
                  'Use Case': 'Read-heavy workloads'
                },
                useCase: 'Application manages cache explicitly'
              },
              {
                name: 'Write-Through',
                values: {
                  'Consistency': 'Excellent',
                  'Performance': 'Medium',
                  'Complexity': 'Medium',
                  'Use Case': 'Strong consistency required'
                },
                useCase: 'Cache updated synchronously with database'
              },
              {
                name: 'Write-Behind',
                values: {
                  'Consistency': 'Medium',
                  'Performance': 'Excellent',
                  'Complexity': 'High',
                  'Use Case': 'Write-heavy workloads'
                },
                useCase: 'Cache updated asynchronously'
              },
              {
                name: 'Refresh-Ahead',
                values: {
                  'Consistency': 'Good',
                  'Performance': 'Excellent',
                  'Complexity': 'High',
                  'Use Case': 'Predictable access patterns'
                },
                useCase: 'Cache refreshed before expiration'
              }
            ]
          }
        }
      }
    ]
  },
  {
    id: 'docker-commands',
    title: 'Docker Commands Reference',
    category: 'DevOps',
    description: 'Essential Docker commands for development and deployment',
    difficulty: 'intermediate',
    estimatedReadTime: 6,
    lastUpdated: new Date('2024-01-10'),
    tags: ['docker', 'containers', 'deployment'],
    sections: [
      {
        id: 'common-commands',
        title: 'Most Used Commands',
        type: 'table',
        priority: 'high',
        content: {
          table: {
            headers: ['Command', 'Description', 'Example', 'Options'],
            sortable: false,
            searchable: true,
            rows: [
              ['docker build', 'Build image from Dockerfile', 'docker build -t myapp .', '-t (tag), --no-cache, -f (dockerfile)'],
              ['docker run', 'Run container from image', 'docker run -p 3000:3000 myapp', '-p (port), -d (detached), -v (volume)'],
              ['docker ps', 'List running containers', 'docker ps -a', '-a (all), -q (quiet), --format'],
              ['docker logs', 'View container logs', 'docker logs container_id', '-f (follow), --tail, --since'],
              ['docker exec', 'Execute command in container', 'docker exec -it container_id bash', '-i (interactive), -t (tty)'],
              ['docker-compose up', 'Start multi-container app', 'docker-compose up -d', '-d (detached), --build, --scale'],
              ['docker system prune', 'Clean up unused resources', 'docker system prune -a', '-a (all), --volumes, --force']
            ]
          }
        }
      },
      {
        id: 'dockerfile-best-practices',
        title: 'Dockerfile Best Practices',
        type: 'code',
        priority: 'high',
        content: {
          code: {
            language: 'dockerfile',
            copyable: true,
            description: 'Optimized Dockerfile for Node.js applications',
            snippet: `# Multi-stage build for smaller images
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "dist/index.js"]`
          }
        }
      }
    ]
  },
  {
    id: 'javascript-patterns',
    title: 'JavaScript Design Patterns',
    category: 'JavaScript',
    description: 'Common design patterns and best practices in modern JavaScript',
    difficulty: 'intermediate',
    estimatedReadTime: 10,
    lastUpdated: new Date('2024-01-12'),
    tags: ['javascript', 'patterns', 'es6', 'async'],
    sections: [
      {
        id: 'async-patterns',
        title: 'Async/Await Patterns',
        type: 'list',
        priority: 'high',
        content: {
          list: {
            ordered: false,
            items: [
              {
                title: 'Error Handling',
                description: 'Proper error handling with async/await',
                code: '// Good: Specific error handling\ntry {\n  const result = await apiCall();\n  return result;\n} catch (error) {\n  if (error.code === "NETWORK_ERROR") {\n    // Handle network errors\n  }\n  throw error; // Re-throw if not handled\n}',
                notes: ['Always handle specific error types', 'Use try-catch blocks', 'Re-throw unhandled errors']
              },
              {
                title: 'Parallel Execution',
                description: 'Execute multiple async operations in parallel',
                code: '// Sequential (slow)\nconst user = await getUser(id);\nconst posts = await getPosts(id);\n\n// Parallel (fast)\nconst [user, posts] = await Promise.all([\n  getUser(id),\n  getPosts(id)\n]);',
                example: 'Use Promise.all() for independent operations'
              },
              {
                title: 'Controlled Concurrency',
                description: 'Limit concurrent operations to prevent overwhelming systems',
                code: 'async function processWithLimit(items, limit, processor) {\n  const results = [];\n  for (let i = 0; i < items.length; i += limit) {\n    const batch = items.slice(i, i + limit);\n    const batchResults = await Promise.all(\n      batch.map(processor)\n    );\n    results.push(...batchResults);\n  }\n  return results;\n}',
                notes: ['Prevent system overload', 'Process in batches', 'Useful for API rate limiting']
              }
            ]
          }
        }
      }
    ]
  }
];

export const performanceBenchmarks: PerformanceBenchmark[] = [
  {
    id: 'database-read-performance',
    category: 'Databases',
    operation: 'Read Query Performance (1M records)',
    context: 'Single table SELECT with WHERE clause on indexed column, tested on AWS RDS instances',
    lastUpdated: new Date('2024-01-15'),
    source: 'Internal benchmarks on AWS RDS m5.large',
    metrics: [
      {
        technology: 'PostgreSQL',
        value: 45,
        unit: 'ms',
        conditions: ['m5.large instance', '1000 IOPS', 'btree index', '16GB RAM'],
        notes: 'Excellent for complex queries and ACID compliance'
      },
      {
        technology: 'MySQL',
        value: 52,
        unit: 'ms',
        conditions: ['m5.large instance', '1000 IOPS', 'btree index', '16GB RAM'],
        notes: 'Good general performance, wide ecosystem support'
      },
      {
        technology: 'MongoDB',
        value: 38,
        unit: 'ms',
        conditions: ['m5.large instance', '1000 IOPS', 'compound index', '16GB RAM'],
        notes: 'Fast for simple queries, flexible schema'
      },
      {
        technology: 'Redis',
        value: 2,
        unit: 'ms',
        conditions: ['r5.large instance', 'in-memory', 'hash index', '16GB RAM'],
        notes: 'Fastest but memory-limited, best for caching'
      },
      {
        technology: 'Elasticsearch',
        value: 28,
        unit: 'ms',
        conditions: ['m5.large instance', '1000 IOPS', 'inverted index', '16GB RAM'],
        notes: 'Optimized for search and analytics workloads'
      }
    ]
  },
  {
    id: 'web-framework-throughput',
    category: 'Node.js',
    operation: 'HTTP Request Throughput',
    context: 'Simple JSON API endpoint with 1KB response, no database calls',
    lastUpdated: new Date('2024-01-20'),
    source: 'Benchmark suite on AWS c5.xlarge',
    metrics: [
      {
        technology: 'Fastify',
        value: 45000,
        unit: 'req/sec',
        conditions: ['4 CPU cores', '8GB RAM', 'Node.js 18', 'Keep-alive enabled'],
        notes: 'Fastest Node.js framework with built-in validation'
      },
      {
        technology: 'Express.js',
        value: 28000,
        unit: 'req/sec',
        conditions: ['4 CPU cores', '8GB RAM', 'Node.js 18', 'Keep-alive enabled'],
        notes: 'Most popular framework, extensive middleware ecosystem'
      },
      {
        technology: 'Koa.js',
        value: 32000,
        unit: 'req/sec',
        conditions: ['4 CPU cores', '8GB RAM', 'Node.js 18', 'Keep-alive enabled'],
        notes: 'Modern async/await support, lightweight core'
      },
      {
        technology: 'Hapi.js',
        value: 22000,
        unit: 'req/sec',
        conditions: ['4 CPU cores', '8GB RAM', 'Node.js 18', 'Keep-alive enabled'],
        notes: 'Feature-rich but slower, built-in validation and caching'
      },
      {
        technology: 'NestJS',
        value: 25000,
        unit: 'req/sec',
        conditions: ['4 CPU cores', '8GB RAM', 'Node.js 18', 'Express adapter'],
        notes: 'TypeScript-first, enterprise-ready with decorators'
      }
    ]
  },
  {
    id: 'container-startup-time',
    category: 'DevOps',
    operation: 'Container Startup Time',
    context: 'Node.js application with 50MB image size, including application initialization',
    lastUpdated: new Date('2024-01-18'),
    source: 'Docker Desktop on MacBook Pro M1',
    metrics: [
      {
        technology: 'Docker (Alpine)',
        value: 1.2,
        unit: 'seconds',
        conditions: ['Alpine Linux base', 'Multi-stage build', 'SSD storage', 'No volume mounts'],
        notes: 'Smallest image size, fastest startup'
      },
      {
        technology: 'Docker (Ubuntu)',
        value: 2.8,
        unit: 'seconds',
        conditions: ['Ubuntu 20.04 base', 'Standard build', 'SSD storage', 'No volume mounts'],
        notes: 'Larger image but more familiar environment'
      },
      {
        technology: 'Podman',
        value: 1.5,
        unit: 'seconds',
        conditions: ['Alpine Linux base', 'Rootless mode', 'SSD storage', 'No volume mounts'],
        notes: 'Daemonless container engine, good security'
      },
      {
        technology: 'containerd',
        value: 0.9,
        unit: 'seconds',
        conditions: ['Alpine Linux base', 'Direct runtime', 'SSD storage', 'No volume mounts'],
        notes: 'Fastest startup, used by Kubernetes'
      }
    ]
  },
  {
    id: 'caching-performance',
    category: 'System Design',
    operation: 'Cache Hit Performance (10K operations)',
    context: 'Key-value lookups with 1KB values, measured average response time',
    lastUpdated: new Date('2024-01-22'),
    source: 'AWS ElastiCache and local benchmarks',
    metrics: [
      {
        technology: 'Redis (Memory)',
        value: 0.1,
        unit: 'ms',
        conditions: ['Local instance', 'In-memory', 'Single-threaded', '8GB RAM'],
        notes: 'Fastest for simple key-value operations'
      },
      {
        technology: 'Redis (Network)',
        value: 1.2,
        unit: 'ms',
        conditions: ['AWS ElastiCache', 'Same AZ', 'r6g.large', 'Network latency'],
        notes: 'Network overhead but still very fast'
      },
      {
        technology: 'Memcached',
        value: 0.8,
        unit: 'ms',
        conditions: ['AWS ElastiCache', 'Same AZ', 'cache.r6g.large', 'Multi-threaded'],
        notes: 'Good for simple caching, multi-threaded'
      },
      {
        technology: 'Application Cache',
        value: 0.05,
        unit: 'ms',
        conditions: ['Node.js Map', 'In-process', 'No serialization', 'Limited by RAM'],
        notes: 'Fastest but limited to single process'
      },
      {
        technology: 'Database Query Cache',
        value: 15,
        unit: 'ms',
        conditions: ['PostgreSQL', 'Query cache hit', 'SSD storage', 'Shared buffers'],
        notes: 'Slower but includes complex query results'
      }
    ]
  },
  {
    id: 'message-queue-throughput',
    category: 'System Design',
    operation: 'Message Queue Throughput',
    context: 'Publishing 1KB messages with acknowledgment, single producer/consumer',
    lastUpdated: new Date('2024-01-25'),
    source: 'AWS managed services and self-hosted',
    metrics: [
      {
        technology: 'Apache Kafka',
        value: 100000,
        unit: 'msg/sec',
        conditions: ['3 brokers', 'Replication factor 3', 'Batch size 16KB', 'Async acks'],
        notes: 'Highest throughput, best for streaming'
      },
      {
        technology: 'RabbitMQ',
        value: 25000,
        unit: 'msg/sec',
        conditions: ['3 nodes cluster', 'Persistent messages', 'Publisher confirms', 'SSD storage'],
        notes: 'Good balance of features and performance'
      },
      {
        technology: 'Amazon SQS',
        value: 3000,
        unit: 'msg/sec',
        conditions: ['Standard queue', 'Batch operations', 'Long polling', 'Managed service'],
        notes: 'Fully managed, good for decoupling services'
      },
      {
        technology: 'Redis Pub/Sub',
        value: 50000,
        unit: 'msg/sec',
        conditions: ['Single instance', 'Fire-and-forget', 'No persistence', 'In-memory'],
        notes: 'Very fast but no message persistence'
      },
      {
        technology: 'Amazon Kinesis',
        value: 10000,
        unit: 'msg/sec',
        conditions: ['10 shards', 'Batch operations', 'Real-time processing', 'Managed service'],
        notes: 'Good for real-time analytics and streaming'
      }
    ]
  }
];

export function getCheatSheetsByCategory(category?: string): CheatSheet[] {
  if (!category) return cheatSheets;
  return cheatSheets.filter(sheet => sheet.category === category);
}

export function getBenchmarksByCategory(category?: string): PerformanceBenchmark[] {
  if (!category) return performanceBenchmarks;
  return performanceBenchmarks.filter(benchmark => benchmark.category === category);
}

export function getCheatSheetCategories(): string[] {
  return Array.from(new Set(cheatSheets.map(sheet => sheet.category))).sort();
}

export function getBenchmarkCategories(): string[] {
  return Array.from(new Set(performanceBenchmarks.map(benchmark => benchmark.category))).sort();
}