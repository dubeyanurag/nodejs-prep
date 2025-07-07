---
title: "Database Optimization and Design"
category: "databases"
difficulty: "advanced"
estimatedTime: "45 minutes"
tags: ["database", "optimization", "performance", "indexing", "scaling", "architecture"]
description: "Comprehensive guide to database performance tuning, optimization strategies, and scalable database design patterns for senior backend engineers."
---

# Database Optimization and Design

## Overview

Database optimization is a critical skill for senior backend engineers, involving systematic approaches to improve database performance, scalability, and reliability. This comprehensive guide covers advanced optimization techniques, design patterns, and real-world scaling strategies used in production systems.

## Core Optimization Concepts

### Database Performance Fundamentals

Database performance optimization involves multiple layers:

1. **Query Optimization**: Improving SQL query execution
2. **Index Strategy**: Strategic use of database indexes
3. **Schema Design**: Optimal table structure and relationships
4. **Connection Management**: Efficient database connection handling
5. **Caching Strategies**: Reducing database load through caching
6. **Hardware Optimization**: Storage, memory, and CPU considerations

### Performance Metrics and Monitoring

Key metrics to monitor:

```sql
-- Query execution time analysis
EXPLAIN ANALYZE SELECT * FROM orders 
WHERE customer_id = 12345 AND order_date >= '2024-01-01';

-- Index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Indexing Strategies

### Index Types and Use Cases

#### B-Tree Indexes (Default)
```sql
-- Standard B-tree index for equality and range queries
CREATE INDEX idx_customer_email ON customers(email);
CREATE INDEX idx_order_date ON orders(order_date);

-- Composite indexes for multi-column queries
CREATE INDEX idx_order_customer_date ON orders(customer_id, order_date);
```

#### Hash Indexes
```sql
-- Hash indexes for equality comparisons only
CREATE INDEX CONCURRENTLY idx_product_sku_hash 
ON products USING HASH(sku);
```

#### Partial Indexes
```sql
-- Index only active records to save space
CREATE INDEX idx_active_users ON users(email) 
WHERE status = 'active';

-- Index for specific conditions
CREATE INDEX idx_recent_orders ON orders(customer_id) 
WHERE order_date >= CURRENT_DATE - INTERVAL '30 days';
```

#### Expression Indexes
```sql
-- Index on computed values
CREATE INDEX idx_customer_lower_email 
ON customers(LOWER(email));

-- Index on JSON fields
CREATE INDEX idx_product_metadata 
ON products USING GIN((metadata->>'category'));
```

### Index Optimization Strategies

#### Composite Index Column Order
```sql
-- Optimal order: most selective column first
-- Good: high selectivity on customer_id
CREATE INDEX idx_orders_optimal 
ON orders(customer_id, status, order_date);

-- Poor: low selectivity on status first
CREATE INDEX idx_orders_suboptimal 
ON orders(status, customer_id, order_date);
```

#### Covering Indexes
```sql
-- Include frequently accessed columns
CREATE INDEX idx_orders_covering 
ON orders(customer_id, order_date) 
INCLUDE (total_amount, status);
```

## Query Optimization Techniques

### Query Analysis and Optimization

#### Execution Plan Analysis
```sql
-- Analyze query execution plan
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT c.name, COUNT(o.id) as order_count
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE c.created_at >= '2024-01-01'
GROUP BY c.id, c.name
HAVING COUNT(o.id) > 5;
```

#### Query Rewriting Strategies
```sql
-- Original inefficient query
SELECT * FROM products 
WHERE category_id IN (
    SELECT id FROM categories 
    WHERE name LIKE '%electronics%'
);

-- Optimized with JOIN
SELECT p.* FROM products p
INNER JOIN categories c ON p.category_id = c.id
WHERE c.name LIKE '%electronics%';

-- Further optimized with specific columns
SELECT p.id, p.name, p.price FROM products p
INNER JOIN categories c ON p.category_id = c.id
WHERE c.name LIKE '%electronics%';
```

### Advanced Query Patterns

#### Window Functions for Analytics
```sql
-- Efficient ranking without subqueries
SELECT 
    customer_id,
    order_date,
    total_amount,
    ROW_NUMBER() OVER (
        PARTITION BY customer_id 
        ORDER BY order_date DESC
    ) as order_rank
FROM orders
WHERE order_date >= '2024-01-01';
```

#### Common Table Expressions (CTEs)
```sql
-- Recursive CTE for hierarchical data
WITH RECURSIVE category_hierarchy AS (
    -- Base case
    SELECT id, name, parent_id, 0 as level
    FROM categories 
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case
    SELECT c.id, c.name, c.parent_id, ch.level + 1
    FROM categories c
    INNER JOIN category_hierarchy ch ON c.parent_id = ch.id
)
SELECT * FROM category_hierarchy ORDER BY level, name;
```

## Connection Pooling and Management

### Connection Pool Configuration

#### Node.js with PostgreSQL
```javascript
const { Pool } = require('pg');

// Optimized connection pool configuration
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    
    // Connection pool settings
    min: 5,                    // Minimum connections
    max: 20,                   // Maximum connections
    idleTimeoutMillis: 30000,  // Close idle connections after 30s
    connectionTimeoutMillis: 2000, // Timeout for new connections
    
    // Query timeout
    query_timeout: 10000,
    
    // SSL configuration for production
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

// Connection health monitoring
pool.on('connect', (client) => {
    console.log('New client connected');
});

pool.on('error', (err, client) => {
    console.error('Database pool error:', err);
});
```

#### Connection Pool Monitoring
```javascript
// Monitor pool health
const getPoolStats = () => {
    return {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount
    };
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing database pool...');
    await pool.end();
    process.exit(0);
});
```

### Transaction Management

#### Optimized Transaction Patterns
```javascript
// Transaction with proper error handling
const transferFunds = async (fromAccountId, toAccountId, amount) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Check source account balance
        const balanceResult = await client.query(
            'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE',
            [fromAccountId]
        );
        
        if (balanceResult.rows[0].balance < amount) {
            throw new Error('Insufficient funds');
        }
        
        // Debit source account
        await client.query(
            'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
            [amount, fromAccountId]
        );
        
        // Credit destination account
        await client.query(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
            [amount, toAccountId]
        );
        
        // Log transaction
        await client.query(
            'INSERT INTO transactions (from_account, to_account, amount, created_at) VALUES ($1, $2, $3, NOW())',
            [fromAccountId, toAccountId, amount]
        );
        
        await client.query('COMMIT');
        return { success: true };
        
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
```

## Database Scaling Strategies

### Vertical Scaling (Scale Up)

#### Hardware Optimization
```sql
-- Memory configuration for PostgreSQL
-- postgresql.conf optimizations

-- Shared buffers (25% of total RAM)
shared_buffers = '2GB'

-- Work memory for sorting/hashing
work_mem = '256MB'

-- Maintenance work memory
maintenance_work_mem = '512MB'

-- Effective cache size (75% of total RAM)
effective_cache_size = '6GB'

-- WAL configuration for performance
wal_buffers = '64MB'
checkpoint_completion_target = 0.9
```

### Horizontal Scaling (Scale Out)

#### Read Replicas
```javascript
// Master-slave configuration
const masterPool = new Pool({
    host: 'master-db.example.com',
    // ... other config
});

const replicaPools = [
    new Pool({ host: 'replica1-db.example.com' }),
    new Pool({ host: 'replica2-db.example.com' }),
    new Pool({ host: 'replica3-db.example.com' })
];

// Read/write splitting
const executeQuery = async (query, params, isWrite = false) => {
    if (isWrite) {
        return await masterPool.query(query, params);
    }
    
    // Load balance across read replicas
    const replicaIndex = Math.floor(Math.random() * replicaPools.length);
    return await replicaPools[replicaIndex].query(query, params);
};
```

#### Database Sharding
```javascript
// Horizontal sharding by customer ID
const getShardForCustomer = (customerId) => {
    return customerId % 4; // 4 shards
};

const shardPools = {
    0: new Pool({ host: 'shard0-db.example.com' }),
    1: new Pool({ host: 'shard1-db.example.com' }),
    2: new Pool({ host: 'shard2-db.example.com' }),
    3: new Pool({ host: 'shard3-db.example.com' })
};

const getCustomerOrders = async (customerId) => {
    const shardId = getShardForCustomer(customerId);
    const pool = shardPools[shardId];
    
    return await pool.query(
        'SELECT * FROM orders WHERE customer_id = $1',
        [customerId]
    );
};
```

## Caching Strategies

### Multi-Level Caching Architecture

#### Application-Level Caching
```javascript
const NodeCache = require('node-cache');
const Redis = require('redis');

// In-memory cache (L1)
const memoryCache = new NodeCache({ 
    stdTTL: 300,  // 5 minutes
    checkperiod: 60 
});

// Redis cache (L2)
const redisClient = Redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    retry_strategy: (options) => {
        return Math.min(options.attempt * 100, 3000);
    }
});

// Multi-level cache implementation
const getCachedData = async (key, fetchFunction) => {
    // Check L1 cache (memory)
    let data = memoryCache.get(key);
    if (data) {
        return data;
    }
    
    // Check L2 cache (Redis)
    try {
        const redisData = await redisClient.get(key);
        if (redisData) {
            data = JSON.parse(redisData);
            // Populate L1 cache
            memoryCache.set(key, data);
            return data;
        }
    } catch (error) {
        console.error('Redis error:', error);
    }
    
    // Fetch from database
    data = await fetchFunction();
    
    // Populate both cache levels
    memoryCache.set(key, data);
    try {
        await redisClient.setex(key, 3600, JSON.stringify(data));
    } catch (error) {
        console.error('Redis set error:', error);
    }
    
    return data;
};
```

#### Query Result Caching
```javascript
// Intelligent query caching
const getCachedQuery = async (sql, params, ttl = 300) => {
    const cacheKey = `query:${crypto
        .createHash('md5')
        .update(sql + JSON.stringify(params))
        .digest('hex')}`;
    
    return await getCachedData(cacheKey, async () => {
        return await pool.query(sql, params);
    });
};

// Usage example
const getPopularProducts = async (limit = 10) => {
    return await getCachedQuery(
        `SELECT p.*, COUNT(oi.product_id) as order_count
         FROM products p
         JOIN order_items oi ON p.id = oi.product_id
         WHERE p.status = 'active'
         GROUP BY p.id
         ORDER BY order_count DESC
         LIMIT $1`,
        [limit],
        1800 // 30 minutes TTL
    );
};
```

## Database Design Patterns

### Denormalization Strategies

#### Calculated Fields
```sql
-- Add denormalized fields for performance
ALTER TABLE customers ADD COLUMN total_orders INTEGER DEFAULT 0;
ALTER TABLE customers ADD COLUMN total_spent DECIMAL(10,2) DEFAULT 0;

-- Trigger to maintain denormalized data
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE customers 
        SET total_orders = total_orders + 1,
            total_spent = total_spent + NEW.total_amount
        WHERE id = NEW.customer_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE customers 
        SET total_orders = total_orders - 1,
            total_spent = total_spent - OLD.total_amount
        WHERE id = OLD.customer_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_stats
    AFTER INSERT OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_customer_stats();
```

#### Materialized Views
```sql
-- Create materialized view for complex aggregations
CREATE MATERIALIZED VIEW monthly_sales_summary AS
SELECT 
    DATE_TRUNC('month', order_date) as month,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value,
    COUNT(DISTINCT customer_id) as unique_customers
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '2 years'
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;

-- Create index on materialized view
CREATE INDEX idx_monthly_sales_month ON monthly_sales_summary(month);

-- Refresh strategy
CREATE OR REPLACE FUNCTION refresh_monthly_sales()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales_summary;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh (using pg_cron extension)
SELECT cron.schedule('refresh-monthly-sales', '0 2 * * *', 'SELECT refresh_monthly_sales();');
```

### Partitioning Strategies

#### Time-Based Partitioning
```sql
-- Create partitioned table
CREATE TABLE orders_partitioned (
    id SERIAL,
    customer_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2),
    status VARCHAR(20)
) PARTITION BY RANGE (order_date);

-- Create partitions
CREATE TABLE orders_2024_q1 PARTITION OF orders_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders_partitioned
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- Automatic partition creation function
CREATE OR REPLACE FUNCTION create_monthly_partition(table_name text, start_date date)
RETURNS void AS $$
DECLARE
    partition_name text;
    end_date date;
BEGIN
    partition_name := table_name || '_' || to_char(start_date, 'YYYY_MM');
    end_date := start_date + interval '1 month';
    
    EXECUTE format('CREATE TABLE %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
                   partition_name, table_name, start_date, end_date);
    
    EXECUTE format('CREATE INDEX idx_%s_customer_id ON %I (customer_id)',
                   partition_name, partition_name);
END;
$$ LANGUAGE plpgsql;
```

## Real-World Case Studies

### Case Study 1: E-commerce Platform Scaling

#### Problem
An e-commerce platform experiencing:
- 10M+ products in catalog
- 100K+ daily orders
- Query response times > 5 seconds
- Database CPU utilization > 90%

#### Solution Implementation
```sql
-- 1. Optimized product search with full-text search
CREATE INDEX idx_products_search ON products 
USING GIN(to_tsvector('english', name || ' ' || description));

-- 2. Partitioned orders table by date
CREATE TABLE orders_partitioned (
    id BIGSERIAL,
    customer_id INTEGER NOT NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- other columns
) PARTITION BY RANGE (order_date);

-- 3. Optimized inventory tracking
CREATE TABLE inventory_snapshots (
    product_id INTEGER,
    snapshot_date DATE,
    quantity INTEGER,
    reserved_quantity INTEGER,
    PRIMARY KEY (product_id, snapshot_date)
);
```

#### Results
- Query response time reduced from 5s to 200ms
- Database CPU utilization reduced to 40%
- Supported 5x traffic growth without hardware changes

### Case Study 2: Financial Services Data Warehouse

#### Problem
Financial services company with:
- 500GB+ transaction data
- Complex regulatory reporting requirements
- Batch processing taking 12+ hours
- Real-time fraud detection needs

#### Solution Architecture
```javascript
// Hybrid OLTP/OLAP architecture
const oltp_pool = new Pool({
    host: 'transactional-db.internal',
    max: 50,
    // Optimized for writes
});

const olap_pool = new Pool({
    host: 'analytics-db.internal',
    max: 20,
    // Optimized for reads
});

// Real-time data pipeline
const processTransaction = async (transaction) => {
    // 1. Write to OLTP system
    await oltp_pool.query(
        'INSERT INTO transactions (account_id, amount, type, created_at) VALUES ($1, $2, $3, $4)',
        [transaction.account_id, transaction.amount, transaction.type, new Date()]
    );
    
    // 2. Async processing for analytics
    await publishToQueue('transaction-analytics', transaction);
    
    // 3. Real-time fraud check
    const fraudScore = await checkFraudScore(transaction);
    if (fraudScore > 0.8) {
        await flagForReview(transaction);
    }
};
```

#### Optimization Techniques
```sql
-- Columnar storage for analytics
CREATE TABLE transaction_analytics (
    transaction_id BIGINT,
    account_id INTEGER,
    amount DECIMAL(15,2),
    transaction_date DATE,
    category VARCHAR(50),
    merchant_id INTEGER
) WITH (orientation = column);

-- Bitmap indexes for categorical data
CREATE INDEX idx_transaction_category_bitmap 
ON transaction_analytics USING BITMAP (category);

-- Aggregate tables for reporting
CREATE TABLE daily_account_summary AS
SELECT 
    account_id,
    transaction_date,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_credits,
    SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_debits
FROM transactions
GROUP BY account_id, transaction_date;
```

### Case Study 3: Social Media Platform

#### Problem
Social media platform challenges:
- 50M+ users with complex relationships
- Real-time feed generation
- Graph traversal queries
- High write volume (posts, likes, comments)

#### Graph Database Integration
```javascript
// Hybrid approach: PostgreSQL + Neo4j
const neo4j = require('neo4j-driver');

const neo4jDriver = neo4j.driver(
    'bolt://graph-db.internal:7687',
    neo4j.auth.basic('neo4j', process.env.NEO4J_PASSWORD)
);

// User relationship management in graph DB
const getFollowRecommendations = async (userId, limit = 10) => {
    const session = neo4jDriver.session();
    
    try {
        const result = await session.run(`
            MATCH (user:User {id: $userId})-[:FOLLOWS]->(friend:User)
            MATCH (friend)-[:FOLLOWS]->(recommendation:User)
            WHERE NOT (user)-[:FOLLOWS]->(recommendation)
            AND recommendation.id <> $userId
            RETURN recommendation.id as userId, 
                   COUNT(*) as mutualFriends
            ORDER BY mutualFriends DESC
            LIMIT $limit
        `, { userId, limit });
        
        return result.records.map(record => ({
            userId: record.get('userId'),
            mutualFriends: record.get('mutualFriends').toNumber()
        }));
    } finally {
        await session.close();
    }
};

// Feed generation with caching
const generateUserFeed = async (userId, page = 1, limit = 20) => {
    const cacheKey = `feed:${userId}:${page}`;
    
    return await getCachedData(cacheKey, async () => {
        // Get user's following list from graph DB
        const following = await getUserFollowing(userId);
        
        // Get recent posts from PostgreSQL
        const posts = await pool.query(`
            SELECT p.*, u.username, u.avatar_url,
                   COUNT(l.id) as like_count,
                   COUNT(c.id) as comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE p.user_id = ANY($1)
            AND p.created_at >= NOW() - INTERVAL '7 days'
            GROUP BY p.id, u.id
            ORDER BY p.created_at DESC
            LIMIT $2 OFFSET $3
        `, [following, limit, (page - 1) * limit]);
        
        return posts.rows;
    }, 300); // 5 minute cache
};
```

## Performance Monitoring and Alerting

### Database Metrics Collection

#### PostgreSQL Monitoring
```sql
-- Create monitoring views
CREATE VIEW db_performance_metrics AS
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables;

-- Query performance tracking
CREATE TABLE query_performance_log (
    id SERIAL PRIMARY KEY,
    query_hash VARCHAR(32),
    query_text TEXT,
    execution_time_ms INTEGER,
    rows_returned INTEGER,
    executed_at TIMESTAMP DEFAULT NOW()
);
```

#### Application-Level Monitoring
```javascript
// Query performance middleware
const monitorQuery = (originalQuery) => {
    return async function(text, params) {
        const startTime = Date.now();
        
        try {
            const result = await originalQuery.call(this, text, params);
            const executionTime = Date.now() - startTime;
            
            // Log slow queries
            if (executionTime > 1000) {
                console.warn('Slow query detected:', {
                    query: text,
                    params,
                    executionTime,
                    rowCount: result.rowCount
                });
                
                // Send to monitoring system
                await logSlowQuery(text, params, executionTime);
            }
            
            return result;
        } catch (error) {
            const executionTime = Date.now() - startTime;
            console.error('Query error:', {
                query: text,
                params,
                executionTime,
                error: error.message
            });
            throw error;
        }
    };
};

// Apply monitoring to pool
pool.query = monitorQuery(pool.query.bind(pool));
```

### Automated Performance Tuning

#### Index Recommendation System
```sql
-- Find missing indexes
WITH missing_indexes AS (
    SELECT 
        schemaname,
        tablename,
        seq_scan,
        seq_tup_read,
        idx_scan,
        CASE 
            WHEN seq_scan > 0 THEN seq_tup_read / seq_scan 
            ELSE 0 
        END as avg_seq_read
    FROM pg_stat_user_tables
    WHERE seq_scan > 100
    AND seq_tup_read > 10000
)
SELECT 
    schemaname,
    tablename,
    'Consider adding index' as recommendation,
    seq_scan as sequential_scans,
    avg_seq_read as avg_rows_per_scan
FROM missing_indexes
WHERE avg_seq_read > 1000
ORDER BY seq_scan DESC;
```

## Interview Questions and Answers

### Question 1: Database Indexing Strategy
**Q: How would you design an indexing strategy for a table with 100 million rows that needs to support both OLTP and OLAP workloads?**

**A: Comprehensive Indexing Strategy:**

1. **Analyze Query Patterns**
   - OLTP: Point lookups, range scans, frequent updates
   - OLAP: Aggregations, full table scans, complex joins

2. **Primary Index Design**
   ```sql
   -- Clustered index on frequently accessed columns
   CREATE INDEX idx_orders_customer_date_clustered 
   ON orders(customer_id, order_date) 
   WITH (FILLFACTOR = 90);
   ```

3. **Covering Indexes for OLTP**
   ```sql
   -- Include frequently accessed columns
   CREATE INDEX idx_orders_oltp_covering 
   ON orders(customer_id, status) 
   INCLUDE (total_amount, created_at);
   ```

4. **Partial Indexes for Specific Conditions**
   ```sql
   -- Index only active/recent data
   CREATE INDEX idx_orders_recent_active 
   ON orders(customer_id, order_date) 
   WHERE status IN ('pending', 'processing') 
   AND order_date >= CURRENT_DATE - INTERVAL '90 days';
   ```

5. **Columnstore Indexes for OLAP**
   ```sql
   -- For analytical queries
   CREATE COLUMNSTORE INDEX idx_orders_analytics 
   ON orders(order_date, customer_id, total_amount, status);
   ```

**Trade-offs:**
- Storage overhead vs. query performance
- Write performance impact vs. read optimization
- Maintenance overhead vs. query speed

### Question 2: Database Sharding Strategy
**Q: Design a sharding strategy for a multi-tenant SaaS application with 10,000+ tenants and varying data sizes.**

**A: Multi-Tenant Sharding Design:**

1. **Sharding Key Selection**
   ```javascript
   // Tenant-based sharding with consistent hashing
   const getShardForTenant = (tenantId) => {
       const hash = crypto.createHash('sha256')
           .update(tenantId.toString())
           .digest('hex');
       return parseInt(hash.substring(0, 8), 16) % SHARD_COUNT;
   };
   ```

2. **Shard Distribution Strategy**
   ```javascript
   // Weighted sharding for different tenant sizes
   const SHARD_WEIGHTS = {
       'enterprise': 4,  // Large tenants get dedicated resources
       'business': 2,    // Medium tenants share resources
       'starter': 1      // Small tenants are densely packed
   };
   
   const getShardForTenant = (tenantId, tenantTier) => {
       const weight = SHARD_WEIGHTS[tenantTier];
       const hash = crypto.createHash('sha256')
           .update(`${tenantId}:${weight}`)
           .digest('hex');
       return parseInt(hash.substring(0, 8), 16) % (SHARD_COUNT * weight);
   };
   ```

3. **Cross-Shard Query Handling**
   ```javascript
   // Federated query execution
   const executeAcrossShards = async (query, params, tenantIds) => {
       const shardQueries = new Map();
       
       // Group tenants by shard
       tenantIds.forEach(tenantId => {
           const shardId = getShardForTenant(tenantId);
           if (!shardQueries.has(shardId)) {
               shardQueries.set(shardId, []);
           }
           shardQueries.get(shardId).push(tenantId);
       });
       
       // Execute queries in parallel
       const promises = Array.from(shardQueries.entries()).map(
           ([shardId, tenants]) => {
               return shardPools[shardId].query(query, [...params, tenants]);
           }
       );
       
       const results = await Promise.all(promises);
       return results.flatMap(result => result.rows);
   };
   ```

4. **Shard Rebalancing**
   ```javascript
   // Gradual data migration for rebalancing
   const rebalanceShard = async (fromShard, toShard, tenantId) => {
       const migrationId = uuidv4();
       
       try {
           // 1. Start migration tracking
           await logMigrationStart(migrationId, tenantId, fromShard, toShard);
           
           // 2. Copy data to new shard
           await copyTenantData(tenantId, fromShard, toShard);
           
           // 3. Switch routing (atomic operation)
           await updateShardRouting(tenantId, toShard);
           
           // 4. Verify data integrity
           await verifyMigration(tenantId, fromShard, toShard);
           
           // 5. Clean up old data
           await cleanupOldData(tenantId, fromShard);
           
           await logMigrationComplete(migrationId);
       } catch (error) {
           await rollbackMigration(migrationId, tenantId, fromShard);
           throw error;
       }
   };
   ```

### Question 3: Query Optimization Process
**Q: Walk through your process for optimizing a slow-running query that's causing performance issues in production.**

**A: Systematic Query Optimization Process:**

1. **Identify and Analyze the Problem**
   ```sql
   -- Get query execution plan
   EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
   SELECT c.name, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent
   FROM customers c
   LEFT JOIN orders o ON c.id = o.customer_id
   WHERE c.created_at >= '2023-01-01'
   AND o.status IN ('completed', 'shipped')
   GROUP BY c.id, c.name
   HAVING COUNT(o.id) > 10
   ORDER BY total_spent DESC
   LIMIT 100;
   ```

2. **Analyze Execution Plan Issues**
   ```javascript
   // Common performance bottlenecks to look for:
   const analyzeExecutionPlan = (plan) => {
       const issues = [];
       
       // Sequential scans on large tables
       if (plan.includes('Seq Scan') && plan.cost > 10000) {
           issues.push('Sequential scan detected - consider adding index');
       }
       
       // Nested loop joins with high cost
       if (plan.includes('Nested Loop') && plan.cost > 50000) {
           issues.push('Expensive nested loop - consider hash join');
       }
       
       // High buffer usage
       if (plan.shared_hit_blocks > 100000) {
           issues.push('High buffer usage - optimize data access');
       }
       
       return issues;
   };
   ```

3. **Apply Optimization Techniques**
   ```sql
   -- Original slow query optimization steps:
   
   -- Step 1: Add appropriate indexes
   CREATE INDEX CONCURRENTLY idx_customers_created_at 
   ON customers(created_at) WHERE created_at >= '2023-01-01';
   
   CREATE INDEX CONCURRENTLY idx_orders_customer_status 
   ON orders(customer_id, status) 
   WHERE status IN ('completed', 'shipped');
   
   -- Step 2: Rewrite query for better performance
   WITH customer_orders AS (
       SELECT 
           c.id,
           c.name,
           COUNT(o.id) as order_count,
           SUM(o.total_amount) as total_spent
       FROM customers c
       INNER JOIN orders o ON c.id = o.customer_id
       WHERE c.created_at >= '2023-01-01'
       AND o.status IN ('completed', 'shipped')
       GROUP BY c.id, c.name
       HAVING COUNT(o.id) > 10
   )
   SELECT * FROM customer_orders
   ORDER BY total_spent DESC
   LIMIT 100;
   ```

4. **Monitor and Validate Improvements**
   ```javascript
   // Performance comparison
   const benchmarkQuery = async (query, params, iterations = 5) => {
       const times = [];
       
       for (let i = 0; i < iterations; i++) {
           const start = Date.now();
           await pool.query(query, params);
           times.push(Date.now() - start);
       }
       
       return {
           avg: times.reduce((a, b) => a + b) / times.length,
           min: Math.min(...times),
           max: Math.max(...times),
           median: times.sort()[Math.floor(times.length / 2)]
       };
   };
   ```

### Question 4: Connection Pool Optimization
**Q: How would you optimize database connection pooling for a Node.js application handling 10,000+ concurrent users?**

**A: Advanced Connection Pool Strategy:**

1. **Multi-Pool Architecture**
   ```javascript
   // Separate pools for different workload types
   const createOptimizedPools = () => {
       // OLTP pool - optimized for fast transactions
       const oltpPool = new Pool({
           host: process.env.OLTP_DB_HOST,
           min: 10,
           max: 50,
           idleTimeoutMillis: 10000,
           connectionTimeoutMillis: 1000,
           acquireTimeoutMillis: 2000
       });
       
       // OLAP pool - optimized for analytical queries
       const olapPool = new Pool({
           host: process.env.OLAP_DB_HOST,
           min: 5,
           max: 20,
           idleTimeoutMillis: 30000,
           connectionTimeoutMillis: 5000,
           acquireTimeoutMillis: 10000
       });
       
       // Read replica pool - for read-only queries
       const readPool = new Pool({
           host: process.env.READ_REPLICA_HOST,
           min: 15,
           max: 100,
           idleTimeoutMillis: 15000,
           connectionTimeoutMillis: 2000
       });
       
       return { oltpPool, olapPool, readPool };
   };
   ```

2. **Intelligent Query Routing**
   ```javascript
   class DatabaseRouter {
       constructor(pools) {
           this.pools = pools;
           this.queryStats = new Map();
       }
       
       async executeQuery(sql, params, options = {}) {
           const queryType = this.analyzeQuery(sql);
           const pool = this.selectPool(queryType, options);
           
           const startTime = Date.now();
           try {
               const result = await pool.query(sql, params);
               this.recordQueryStats(sql, Date.now() - startTime, true);
               return result;
           } catch (error) {
               this.recordQueryStats(sql, Date.now() - startTime, false);
               throw error;
           }
       }
       
       analyzeQuery(sql) {
           const upperSql = sql.toUpperCase().trim();
           
           if (upperSql.startsWith('SELECT') && !upperSql.includes('FOR UPDATE')) {
               if (this.isAnalyticalQuery(sql)) {
                   return 'OLAP';
               }
               return 'READ';
           }
           
           return 'OLTP';
       }
       
       isAnalyticalQuery(sql) {
           const analyticalKeywords = [
               'GROUP BY', 'HAVING', 'WINDOW', 'PARTITION BY',
               'SUM(', 'COUNT(', 'AVG(', 'MAX(', 'MIN(',
               'WITH RECURSIVE'
           ];
           
           return analyticalKeywords.some(keyword => 
               sql.toUpperCase().includes(keyword)
           );
       }
       
       selectPool(queryType, options) {
           if (options.forcePool) {
               return this.pools[options.forcePool];
           }
           
           switch (queryType) {
               case 'OLAP':
                   return this.pools.olapPool;
               case 'READ':
                   return this.pools.readPool;
               default:
                   return this.pools.oltpPool;
           }
       }
   }
   ```

3. **Connection Pool Monitoring and Auto-scaling**
   ```javascript
   class PoolMonitor {
       constructor(pools) {
           this.pools = pools;
           this.metrics = {
               totalConnections: 0,
               activeConnections: 0,
               waitingRequests: 0,
               avgResponseTime: 0
           };
           
           this.startMonitoring();
       }
       
       startMonitoring() {
           setInterval(() => {
               this.collectMetrics();
               this.adjustPoolSizes();
           }, 30000); // Every 30 seconds
       }
       
       collectMetrics() {
           Object.values(this.pools).forEach(pool => {
               this.metrics.totalConnections += pool.totalCount;
               this.metrics.activeConnections += (pool.totalCount - pool.idleCount);
               this.metrics.waitingRequests += pool.waitingCount;
           });
       }
       
       adjustPoolSizes() {
           Object.entries(this.pools).forEach(([name, pool]) => {
               const utilization = (pool.totalCount - pool.idleCount) / pool.totalCount;
               const waitingRatio = pool.waitingCount / pool.totalCount;
               
               // Scale up if high utilization and waiting requests
               if (utilization > 0.8 && waitingRatio > 0.1 && pool.totalCount < pool.max) {
                   console.log(`Scaling up ${name} pool`);
                   // Increase pool size gradually
               }
               
               // Scale down if low utilization
               if (utilization < 0.3 && pool.totalCount > pool.min) {
                   console.log(`Scaling down ${name} pool`);
                   // Decrease pool size gradually
               }
           });
       }
   }
   ```

4. **Circuit Breaker Pattern**
   ```javascript
   class DatabaseCircuitBreaker {
       constructor(pool, options = {}) {
           this.pool = pool;
           this.failureThreshold = options.failureThreshold || 5;
           this.resetTimeout = options.resetTimeout || 60000;
           this.monitoringPeriod = options.monitoringPeriod || 10000;
           
           this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
           this.failureCount = 0;
           this.lastFailureTime = null;
           this.successCount = 0;
       }
       
       async executeQuery(sql, params) {
           if (this.state === 'OPEN') {
               if (Date.now() - this.lastFailureTime > this.resetTimeout) {
                   this.state = 'HALF_OPEN';
                   this.successCount = 0;
               } else {
                   throw new Error('Circuit breaker is OPEN');
               }
           }
           
           try {
               const result = await this.pool.query(sql, params);
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
   }
   ```

### Question 5: Database Migration Strategy
**Q: Design a zero-downtime database migration strategy for a production system with 1TB+ of data.**

**A: Zero-Downtime Migration Strategy:**

1. **Migration Planning and Preparation**
   ```javascript
   // Migration plan structure
   const migrationPlan = {
       phases: [
           {
               name: 'preparation',
               steps: ['backup', 'validation', 'rollback_plan'],
               estimatedTime: '2 hours'
           },
           {
               name: 'schema_migration',
               steps: ['add_columns', 'create_indexes', 'update_constraints'],
               estimatedTime: '4 hours'
           },
           {
               name: 'data_migration',
               steps: ['bulk_copy', 'incremental_sync', 'validation'],
               estimatedTime: '12 hours'
           },
           {
               name: 'cutover',
               steps: ['final_sync', 'switch_traffic', 'verify'],
               estimatedTime: '30 minutes'
           }
       ],
       rollbackPlan: {
           triggers: ['data_corruption', 'performance_degradation', 'application_errors'],
           steps: ['switch_back', 'restore_backup', 'notify_team']
       }
   };
   ```

2. **Dual-Write Strategy**
   ```javascript
   // Write to both old and new systems during migration
   class DualWriteManager {
       constructor(oldDb, newDb) {
           this.oldDb = oldDb;
           this.newDb = newDb;
           this.writeMode = 'OLD_ONLY'; // OLD_ONLY, DUAL_WRITE, NEW_ONLY
           this.errorThreshold = 0.01; // 1% error rate threshold
       }
       
       async writeData(operation, data) {
           switch (this.writeMode) {
               case 'OLD_ONLY':
                   return await this.oldDb.execute(operation, data);
                   
               case 'DUAL_WRITE':
                   return await this.dualWrite(operation, data);
                   
               case 'NEW_ONLY':
                   return await this.newDb.execute(operation, data);
           }
       }
       
       async dualWrite(operation, data) {
           const promises = [
               this.oldDb.execute(operation, data),
               this.newDb.execute(operation, data).catch(error => {
                   // Log new DB errors but don't fail the operation
                   console.error('New DB write failed:', error);
                   this.recordError('new_db_write', error);
                   return null;
               })
           ];
           
           const [oldResult, newResult] = await Promise.all(promises);
           
           // Validate consistency
           if (newResult && !this.validateConsistency(oldResult, newResult)) {
               this.recordError('consistency_check', {
                   old: oldResult,
                   new: newResult
               });
           }
           
           return oldResult; // Return old DB result during migration
       }
   }
   ```

3. **Incremental Data Migration**
   ```javascript
   // Batch processing for large data migration
   class IncrementalMigrator {
       constructor(sourceDb, targetDb, options = {}) {
           this.sourceDb = sourceDb;
           this.targetDb = targetDb;
           this.batchSize = options.batchSize || 10000;
           this.parallelWorkers = options.parallelWorkers || 4;
           this.checkpointInterval = options.checkpointInterval || 100000;
       }
       
       async migrateTable(tableName, whereClause = '1=1') {
           const totalRows = await this.getTotalRows(tableName, whereClause);
           const batches = Math.ceil(totalRows / this.batchSize);
           
           console.log(`Migrating ${totalRows} rows in ${batches} batches`);
           
           // Create worker pool
           const workers = [];
           for (let i = 0; i < this.parallelWorkers; i++) {
               workers.push(this.createWorker(i));
           }
           
           // Distribute batches among workers
           const batchQueue = [];
           for (let i = 0; i < batches; i++) {
               batchQueue.push({
                   tableName,
                   offset: i * this.batchSize,
                   limit: this.batchSize,
                   whereClause
               });
           }
           
           // Process batches
           await this.processBatches(workers, batchQueue);
           
           // Cleanup workers
           await Promise.all(workers.map(worker => worker.cleanup()));
       }
       
       async createWorker(workerId) {
           return {
               id: workerId,
               processed: 0,
               errors: 0,
               
               async processBatch(batch) {
                   try {
                       const data = await this.sourceDb.query(`
                           SELECT * FROM ${batch.tableName}
                           WHERE ${batch.whereClause}
                           ORDER BY id
                           LIMIT ${batch.limit} OFFSET ${batch.offset}
                       `);
                       
                       if (data.rows.length > 0) {
                           await this.targetDb.bulkInsert(batch.tableName, data.rows);
                       }
                       
                       this.processed += data.rows.length;
                       
                       // Checkpoint progress
                       if (this.processed % this.checkpointInterval === 0) {
                           await this.saveCheckpoint(batch.tableName, this.processed);
                       }
                       
                   } catch (error) {
                       this.errors++;
                       console.error(`Worker ${workerId} batch error:`, error);
                       throw error;
                   }
               },
               
               async cleanup() {
                   console.log(`Worker ${workerId} processed ${this.processed} rows with ${this.errors} errors`);
               }
           };
       }
   }
   ```

4. **Data Validation and Consistency Checks**
   ```javascript
   // Comprehensive data validation
   class MigrationValidator {
       constructor(sourceDb, targetDb) {
           this.sourceDb = sourceDb;
           this.targetDb = targetDb;
       }
       
       async validateMigration(tableName) {
           const validations = [
               this.validateRowCount(tableName),
               this.validateDataIntegrity(tableName),
               this.validateConstraints(tableName),
               this.validateIndexes(tableName)
           ];
           
           const results = await Promise.all(validations);
           
           return {
               tableName,
               isValid: results.every(r => r.isValid),
               details: results
           };
       }
       
       async validateRowCount(tableName) {
           const [sourceCount, targetCount] = await Promise.all([
               this.sourceDb.query(`SELECT COUNT(*) as count FROM ${tableName}`),
               this.targetDb.query(`SELECT COUNT(*) as count FROM ${tableName}`)
           ]);
           
           const isValid = sourceCount.rows[0].count === targetCount.rows[0].count;
           
           return {
               check: 'row_count',
               isValid,
               source: sourceCount.rows[0].count,
               target: targetCount.rows[0].count
           };
       }
       
       async validateDataIntegrity(tableName) {
           // Sample-based data comparison
           const sampleSize = 1000;
           const randomSample = await this.sourceDb.query(`
               SELECT * FROM ${tableName}
               ORDER BY RANDOM()
               LIMIT ${sampleSize}
           `);
           
           let matchCount = 0;
           for (const row of randomSample.rows) {
               const targetRow = await this.targetDb.query(
                   `SELECT * FROM ${tableName} WHERE id = $1`,
                   [row.id]
               );
               
               if (this.compareRows(row, targetRow.rows[0])) {
                   matchCount++;
               }
           }
           
           const accuracy = matchCount / sampleSize;
           
           return {
               check: 'data_integrity',
               isValid: accuracy >= 0.999, // 99.9% accuracy threshold
               accuracy,
               sampleSize
           };
       }
   }
   ```

5. **Rollback Strategy**
   ```javascript
   // Automated rollback mechanism
   class MigrationRollback {
       constructor(migrationId, sourceDb, targetDb) {
           this.migrationId = migrationId;
           this.sourceDb = sourceDb;
           this.targetDb = targetDb;
           this.rollbackSteps = [];
       }
       
       async executeRollback(reason) {
           console.log(`Initiating rollback for migration ${this.migrationId}: ${reason}`);
           
           try {
               // 1. Stop all migration processes
               await this.stopMigrationProcesses();
               
               // 2. Switch traffic back to source
               await this.switchTrafficToSource();
               
               // 3. Execute rollback steps in reverse order
               for (let i = this.rollbackSteps.length - 1; i >= 0; i--) {
                   await this.executeRollbackStep(this.rollbackSteps[i]);
               }
               
               // 4. Verify system health
               await this.verifySystemHealth();
               
               // 5. Notify team
               await this.notifyRollbackComplete(reason);
               
           } catch (error) {
               console.error('Rollback failed:', error);
               await this.escalateRollbackFailure(error);
           }
       }
       
       async addRollbackStep(step) {
           this.rollbackSteps.push({
               ...step,
               timestamp: new Date(),
               executed: false
           });
       }
   }
   ```