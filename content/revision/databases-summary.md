---
title: "Database Systems - Revision Summary"
category: "revision"
difficulty: "advanced"
estimatedReadTime: 12
tags: ["sql", "nosql", "database-design", "optimization", "mongodb", "postgresql", "revision"]
lastUpdated: "2024-01-15"
printFriendly: true
---

# Database Systems - Revision Summary

## SQL Databases (MySQL, PostgreSQL)

### Key Concepts
- **ACID Properties**: Atomicity, Consistency, Isolation, Durability
- **Normalization**: 1NF, 2NF, 3NF to reduce redundancy
- **Indexing**: B-tree, Hash, Bitmap indexes for query optimization
- **Transactions**: BEGIN, COMMIT, ROLLBACK with isolation levels

### Essential SQL Patterns
```sql
-- Complex Query with Window Functions
SELECT 
  customer_id,
  order_date,
  total_amount,
  ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) as order_rank,
  SUM(total_amount) OVER (PARTITION BY customer_id) as customer_total
FROM orders
WHERE order_date >= '2024-01-01';

-- Optimized Index Creation
CREATE INDEX CONCURRENTLY idx_orders_customer_date 
ON orders (customer_id, order_date DESC) 
WHERE status = 'completed';

-- Efficient Pagination
SELECT * FROM products 
WHERE id > :last_id 
ORDER BY id 
LIMIT 20;
```

### Interview Points
- **Q**: Difference between INNER JOIN and LEFT JOIN?
- **A**: INNER returns only matching rows, LEFT returns all left table rows plus matches
- **Q**: How to optimize slow queries?
- **A**: Add indexes, analyze execution plan, rewrite query, consider denormalization

## NoSQL Databases (MongoDB, Redis)

### Key Concepts
- **Document Store**: MongoDB - flexible schema, JSON-like documents
- **Key-Value Store**: Redis - in-memory, high performance caching
- **CAP Theorem**: Consistency, Availability, Partition tolerance (pick 2)
- **Eventual Consistency**: Data will be consistent eventually

### MongoDB Patterns
```javascript
// Aggregation Pipeline
db.orders.aggregate([
  { $match: { status: "completed", date: { $gte: new Date("2024-01-01") } } },
  { $group: { 
      _id: "$customerId", 
      totalSpent: { $sum: "$amount" },
      orderCount: { $sum: 1 }
  }},
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
]);

// Efficient Indexing
db.products.createIndex({ "category": 1, "price": -1 });
db.users.createIndex({ "email": 1 }, { unique: true });

// Schema Design Pattern
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  profile: {
    name: "John Doe",
    email: "john@example.com"
  },
  orders: [  // Embedded for 1-to-few relationships
    { orderId: ObjectId("..."), amount: 100, date: ISODate("...") }
  ]
}
```

### Redis Patterns
```javascript
// Caching Strategy
const getUser = async (userId) => {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  
  const user = await db.users.findById(userId);
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  return user;
};

// Rate Limiting
const isRateLimited = async (userId) => {
  const key = `rate_limit:${userId}`;
  const current = await redis.incr(key);
  if (current === 1) await redis.expire(key, 60);
  return current > 100; // 100 requests per minute
};
```

## Database Design & Optimization

### Normalization vs Denormalization
```sql
-- Normalized (3NF)
CREATE TABLE customers (id, name, email);
CREATE TABLE orders (id, customer_id, date, total);
CREATE TABLE order_items (order_id, product_id, quantity, price);

-- Denormalized for Read Performance
CREATE TABLE order_summary (
  order_id,
  customer_name,    -- Denormalized
  customer_email,   -- Denormalized
  order_date,
  total_amount,
  item_count        -- Calculated field
);
```

### Indexing Strategies
```sql
-- Composite Index for Multiple Conditions
CREATE INDEX idx_user_activity ON user_logs (user_id, action_type, created_at);

-- Partial Index for Specific Conditions
CREATE INDEX idx_active_users ON users (email) WHERE status = 'active';

-- Covering Index (includes all needed columns)
CREATE INDEX idx_order_summary ON orders (customer_id) INCLUDE (order_date, total_amount);
```

### Interview Points
- **Q**: When to use SQL vs NoSQL?
- **A**: SQL for ACID compliance, complex queries; NoSQL for scalability, flexible schema
- **Q**: How to handle database scaling?
- **A**: Read replicas, sharding, caching, connection pooling

## Performance Optimization

### Query Optimization Techniques
```sql
-- Use EXPLAIN to analyze query plans
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM orders o 
JOIN customers c ON o.customer_id = c.id 
WHERE o.order_date >= '2024-01-01';

-- Optimize with proper indexing
CREATE INDEX idx_orders_date ON orders (order_date);
CREATE INDEX idx_customers_id ON customers (id);
```

### Connection Pooling
```javascript
// PostgreSQL Connection Pool
const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  database: 'myapp',
  user: 'user',
  password: 'password',
  max: 20,          // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// MongoDB Connection Pool
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

## Quick Reference Cheat Sheet

| Database Type | Use Case | Key Features | Example |
|---------------|----------|--------------|---------|
| PostgreSQL | Complex queries, ACID | JSONB, Full-text search | `SELECT * FROM users WHERE data @> '{"age": 25}'` |
| MySQL | Web applications | Fast reads, replication | `SELECT * FROM products ORDER BY created_at LIMIT 10` |
| MongoDB | Flexible schema | Document store, aggregation | `db.users.find({age: {$gte: 18}})` |
| Redis | Caching, sessions | In-memory, pub/sub | `SET user:123 "data" EX 3600` |

## SQL Quick Reference

```sql
-- Window Functions
SELECT name, salary, 
       RANK() OVER (ORDER BY salary DESC) as salary_rank
FROM employees;

-- Common Table Expressions (CTE)
WITH monthly_sales AS (
  SELECT EXTRACT(MONTH FROM order_date) as month, SUM(total) as sales
  FROM orders GROUP BY EXTRACT(MONTH FROM order_date)
)
SELECT * FROM monthly_sales WHERE sales > 10000;

-- Recursive CTE (for hierarchical data)
WITH RECURSIVE employee_hierarchy AS (
  SELECT id, name, manager_id, 1 as level FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, eh.level + 1
  FROM employees e JOIN employee_hierarchy eh ON e.manager_id = eh.id
)
SELECT * FROM employee_hierarchy;
```

## NoSQL Quick Reference

```javascript
// MongoDB Aggregation Operators
$match    // Filter documents
$group    // Group by field and calculate
$sort     // Sort results
$project  // Select specific fields
$lookup   // Join with another collection
$unwind   // Deconstruct array field

// Redis Data Types
STRING    // SET key value
HASH      // HSET user:1 name "John"
LIST      // LPUSH queue "task1"
SET       // SADD tags "nodejs"
ZSET      // ZADD leaderboard 100 "player1"
```

## Common Interview Questions

1. **ACID vs BASE**: Explain properties and when to use each
2. **Indexing**: Types of indexes and when to use them
3. **Normalization**: Benefits and drawbacks of different normal forms
4. **Scaling**: Horizontal vs vertical scaling strategies
5. **CAP Theorem**: Trade-offs in distributed systems
6. **Query Optimization**: How to identify and fix slow queries
7. **Transactions**: Isolation levels and their implications
8. **Sharding**: Strategies and challenges

## Performance Benchmarks

- **Query Response Time**: < 100ms for simple queries
- **Index Usage**: > 95% of queries should use indexes
- **Connection Pool**: 10-20 connections per CPU core
- **Cache Hit Ratio**: > 90% for frequently accessed data
- **Replication Lag**: < 1 second for read replicas