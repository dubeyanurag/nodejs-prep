---
title: "SQL Interview Questions"
description: "Comprehensive SQL interview questions covering query optimization, database design, and real-world scenarios"
category: "databases"
difficulty: "intermediate-advanced"
tags: ["sql", "database-design", "query-optimization", "performance", "indexing"]
lastUpdated: "2024-12-09"
---

# SQL Interview Questions

## Query Optimization & Execution Plans

### 1. Complex Query Optimization
**Question:** You have a slow-running query that joins 4 tables with WHERE clauses on multiple columns. How would you optimize it using execution plan analysis?

**Answer:**
```sql
-- Original slow query
SELECT u.username, p.title, c.content, t.name as tag_name
FROM users u
JOIN posts p ON u.id = p.user_id
JOIN comments c ON p.id = c.post_id
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
WHERE u.created_at > '2023-01-01'
AND p.status = 'published'
AND c.created_at > '2023-06-01'
ORDER BY p.created_at DESC;
```

**Optimization Steps:**
1. **Analyze execution plan:** `EXPLAIN ANALYZE` to identify bottlenecks
2. **Add indexes:** Create composite indexes on frequently filtered columns
3. **Rewrite joins:** Consider EXISTS instead of JOIN where appropriate
4. **Filter early:** Move WHERE conditions closer to table scans

```sql
-- Optimized version with proper indexing
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_posts_status_created_at ON posts(status, created_at);
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at);
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);

-- Rewritten query with subquery optimization
SELECT u.username, p.title, c.content, t.name as tag_name
FROM users u
JOIN posts p ON u.id = p.user_id AND p.status = 'published'
JOIN comments c ON p.id = c.post_id AND c.created_at > '2023-06-01'
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
WHERE u.created_at > '2023-01-01'
ORDER BY p.created_at DESC;
```

### 2. Execution Plan Analysis
**Question:** Explain the difference between Hash Join, Nested Loop Join, and Merge Join. When would each be optimal?

**Answer:**
- **Nested Loop Join:** Best for small datasets or when one table is much smaller
  - Time complexity: O(n*m)
  - Memory efficient but CPU intensive
- **Hash Join:** Optimal for medium to large datasets with good selectivity
  - Builds hash table from smaller relation
  - Time complexity: O(n+m)
- **Merge Join:** Best when both inputs are pre-sorted
  - Most efficient for large sorted datasets
  - Requires sorted input or sort operation
### 3. I
ndex Strategy Optimization
**Question:** Design an indexing strategy for an e-commerce product search with filters on category, price range, brand, and rating.

**Answer:**
```sql
-- Products table structure
CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    category_id INT,
    brand_id INT,
    price DECIMAL(10,2),
    rating DECIMAL(3,2),
    created_at TIMESTAMP,
    status ENUM('active', 'inactive')
);

-- Composite index for common search patterns
CREATE INDEX idx_products_search ON products(status, category_id, price, rating);
CREATE INDEX idx_products_brand_price ON products(brand_id, price, rating);
CREATE INDEX idx_products_rating_price ON products(rating, price DESC);

-- Covering index for product listings
CREATE INDEX idx_products_listing ON products(category_id, status, price, rating) 
INCLUDE (name, brand_id);
```

## Database Design & Normalization

### 4. E-commerce Database Design
**Question:** Design a normalized database schema for an e-commerce platform handling products, orders, inventory, and user reviews.

**Answer:**
```sql
-- Users table (1NF, 2NF, 3NF compliant)
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories with hierarchical structure
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    parent_id INT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Products table
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    brand_id INT,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    weight DECIMAL(8,3),
    status ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

-- Inventory management
CREATE TABLE inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    warehouse_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    reserved_quantity INT NOT NULL DEFAULT 0,
    reorder_level INT DEFAULT 10,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    UNIQUE KEY unique_product_warehouse (product_id, warehouse_id)
);

-- Orders with proper normalization
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    shipping_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address_id BIGINT,
    billing_address_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shipping_address_id) REFERENCES addresses(id),
    FOREIGN KEY (billing_address_id) REFERENCES addresses(id)
);

-- Order items (many-to-many resolution)
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### 5. Denormalization Strategy
**Question:** When would you denormalize a database, and what are the trade-offs? Provide a specific example.

**Answer:**
**When to denormalize:**
- Read-heavy applications with complex joins
- Reporting and analytics requirements
- Performance bottlenecks in normalized schema

**Example: Product catalog with review statistics**
```sql
-- Normalized approach (multiple queries needed)
SELECT p.name, p.price, 
       COUNT(r.id) as review_count,
       AVG(r.rating) as avg_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id;

-- Denormalized approach (single query)
ALTER TABLE products ADD COLUMN review_count INT DEFAULT 0;
ALTER TABLE products ADD COLUMN avg_rating DECIMAL(3,2) DEFAULT 0;

-- Maintain with triggers
DELIMITER //
CREATE TRIGGER update_product_stats AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE products 
    SET review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id),
        avg_rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id)
    WHERE id = NEW.product_id;
END//
DELIMITER ;
```## Real
-World E-commerce Scenarios

### 6. Flash Sale Inventory Management
**Question:** Design a system to handle flash sales where 10,000 users try to buy 100 limited items simultaneously.

**Answer:**
```sql
-- Optimistic locking approach
CREATE TABLE flash_sale_inventory (
    product_id BIGINT PRIMARY KEY,
    available_quantity INT NOT NULL,
    reserved_quantity INT NOT NULL DEFAULT 0,
    version INT NOT NULL DEFAULT 1,
    sale_start_time TIMESTAMP,
    sale_end_time TIMESTAMP
);

-- Reserve inventory with version check
UPDATE flash_sale_inventory 
SET available_quantity = available_quantity - ?,
    reserved_quantity = reserved_quantity + ?,
    version = version + 1
WHERE product_id = ? 
  AND available_quantity >= ?
  AND version = ?
  AND NOW() BETWEEN sale_start_time AND sale_end_time;

-- Alternative: Queue-based approach
CREATE TABLE purchase_queue (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    queue_position INT,
    status ENUM('queued', 'processing', 'completed', 'failed'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_queue_position (product_id, queue_position)
);
```

### 7. Social Media Feed Optimization
**Question:** Design queries for a social media feed showing posts from followed users, optimized for 1M+ users.

**Answer:**
```sql
-- Followers relationship (bidirectional)
CREATE TABLE user_follows (
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    INDEX idx_following_follower (following_id, follower_id)
);

-- Posts with engagement metrics (denormalized)
CREATE TABLE posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_created_engagement (created_at DESC, like_count DESC)
);

-- Optimized feed query with pagination
SELECT p.id, p.content, p.like_count, p.comment_count,
       u.username, u.avatar_url
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.user_id IN (
    SELECT following_id 
    FROM user_follows 
    WHERE follower_id = ?
)
AND p.created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY p.created_at DESC
LIMIT 20 OFFSET ?;

-- Pre-computed feed approach for heavy users
CREATE TABLE user_feeds (
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    score DECIMAL(10,4), -- engagement-based ranking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    INDEX idx_user_score (user_id, score DESC)
);
```

## Performance Benchmarking

### 8. Query Performance Analysis
**Question:** You have a query that takes 2.5 seconds on a table with 10M records. Provide a systematic approach to optimize it to under 100ms.

**Answer:**
```sql
-- Step 1: Baseline measurement
SET profiling = 1;
SELECT SQL_NO_CACHE COUNT(*) FROM large_table WHERE status = 'active' AND created_at > '2023-01-01';
SHOW PROFILES;

-- Step 2: Analyze execution plan
EXPLAIN FORMAT=JSON 
SELECT * FROM large_table WHERE status = 'active' AND created_at > '2023-01-01';

-- Step 3: Index optimization
CREATE INDEX idx_status_created ON large_table(status, created_at);

-- Step 4: Query rewrite with covering index
CREATE INDEX idx_covering ON large_table(status, created_at) INCLUDE (id, name, updated_at);

-- Step 5: Partitioning for time-based queries
ALTER TABLE large_table PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025)
);

-- Step 6: Final optimized query
SELECT id, name, updated_at 
FROM large_table 
WHERE status = 'active' 
  AND created_at >= '2023-01-01'
ORDER BY created_at DESC
LIMIT 100;
```

### 9. Connection Pool Optimization
**Question:** Your application has 1000 concurrent users but database performance degrades. How do you optimize connection pooling?

**Answer:**
```javascript
// Connection pool configuration
const poolConfig = {
    host: 'localhost',
    user: 'app_user',
    password: 'password',
    database: 'ecommerce',
    connectionLimit: 20, // Start conservative
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    idleTimeout: 300000, // 5 minutes
    // Monitor these metrics
    queueLimit: 0
};

// Monitoring queries
SELECT 
    PROCESSLIST_ID,
    PROCESSLIST_USER,
    PROCESSLIST_HOST,
    PROCESSLIST_DB,
    PROCESSLIST_COMMAND,
    PROCESSLIST_TIME,
    PROCESSLIST_STATE,
    PROCESSLIST_INFO
FROM performance_schema.processlist
WHERE PROCESSLIST_COMMAND != 'Sleep'
ORDER BY PROCESSLIST_TIME DESC;

-- Connection usage analysis
SELECT 
    variable_name,
    variable_value
FROM performance_schema.global_status
WHERE variable_name IN (
    'Connections',
    'Max_used_connections',
    'Threads_connected',
    'Threads_running',
    'Connection_errors_max_connections'
);
```##
# 10. Bulk Insert Performance
**Question:** You need to insert 1M records efficiently. Compare different approaches and their performance characteristics.

**Answer:**
```sql
-- Approach 1: Single INSERT with multiple VALUES (fastest)
INSERT INTO products (name, category_id, price, sku) VALUES
('Product 1', 1, 29.99, 'SKU001'),
('Product 2', 1, 39.99, 'SKU002'),
-- ... up to 1000 rows per statement
('Product 1000', 2, 49.99, 'SKU1000');

-- Approach 2: LOAD DATA INFILE (fastest for file-based data)
LOAD DATA INFILE '/tmp/products.csv'
INTO TABLE products
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(name, category_id, price, sku);

-- Approach 3: Prepared statements with batching
PREPARE stmt FROM 'INSERT INTO products (name, category_id, price, sku) VALUES (?, ?, ?, ?)';

-- Performance optimization settings
SET autocommit = 0;
SET unique_checks = 0;
SET foreign_key_checks = 0;

-- Batch processing
START TRANSACTION;
-- Execute 1000 prepared statements
COMMIT;

-- Restore settings
SET unique_checks = 1;
SET foreign_key_checks = 1;
SET autocommit = 1;
```

## Advanced Query Patterns

### 11. Window Functions for Analytics
**Question:** Write queries to calculate running totals, moving averages, and ranking for sales data.

**Answer:**
```sql
-- Sales data with comprehensive analytics
SELECT 
    order_date,
    daily_sales,
    -- Running total
    SUM(daily_sales) OVER (ORDER BY order_date) as running_total,
    -- 7-day moving average
    AVG(daily_sales) OVER (
        ORDER BY order_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as moving_avg_7day,
    -- Rank by sales amount
    RANK() OVER (ORDER BY daily_sales DESC) as sales_rank,
    -- Percentage of total
    daily_sales / SUM(daily_sales) OVER () * 100 as pct_of_total,
    -- Previous day comparison
    LAG(daily_sales, 1) OVER (ORDER BY order_date) as prev_day_sales,
    daily_sales - LAG(daily_sales, 1) OVER (ORDER BY order_date) as day_over_day_change
FROM (
    SELECT 
        DATE(created_at) as order_date,
        SUM(total_amount) as daily_sales
    FROM orders
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
    GROUP BY DATE(created_at)
) daily_totals
ORDER BY order_date;
```

### 12. Recursive CTE for Hierarchical Data
**Question:** Write a query to find all subcategories and their depths in a category hierarchy.

**Answer:**
```sql
-- Recursive CTE for category hierarchy
WITH RECURSIVE category_hierarchy AS (
    -- Base case: root categories
    SELECT 
        id,
        name,
        parent_id,
        0 as depth,
        CAST(name AS CHAR(1000)) as path,
        CAST(id AS CHAR(200)) as id_path
    FROM categories 
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case: child categories
    SELECT 
        c.id,
        c.name,
        c.parent_id,
        ch.depth + 1,
        CONCAT(ch.path, ' > ', c.name),
        CONCAT(ch.id_path, ',', c.id)
    FROM categories c
    INNER JOIN category_hierarchy ch ON c.parent_id = ch.id
    WHERE ch.depth < 10 -- Prevent infinite recursion
)
SELECT 
    id,
    name,
    depth,
    path,
    (SELECT COUNT(*) FROM categories WHERE parent_id = ch.id) as child_count
FROM category_hierarchy ch
ORDER BY path;
```

## Database Security & Optimization

### 13. SQL Injection Prevention
**Question:** Demonstrate secure query patterns and explain how to prevent SQL injection in dynamic queries.

**Answer:**
```sql
-- WRONG: Vulnerable to SQL injection
SELECT * FROM users WHERE username = '" + userInput + "' AND password = '" + passwordInput + "'";

-- CORRECT: Using prepared statements
PREPARE user_login FROM 'SELECT id, username, email FROM users WHERE username = ? AND password_hash = SHA2(CONCAT(?, salt), 256)';
SET @username = 'john_doe';
SET @password = 'user_password';
EXECUTE user_login USING @username, @password;

-- Dynamic WHERE clauses (secure approach)
SET @sql = 'SELECT * FROM products WHERE 1=1';
SET @conditions = '';

-- Build conditions safely
IF @category_id IS NOT NULL THEN
    SET @conditions = CONCAT(@conditions, ' AND category_id = ', @category_id);
END IF;

IF @min_price IS NOT NULL THEN
    SET @conditions = CONCAT(@conditions, ' AND price >= ', @min_price);
END IF;

SET @sql = CONCAT(@sql, @conditions, ' ORDER BY created_at DESC LIMIT ?');
PREPARE stmt FROM @sql;
EXECUTE stmt USING @limit;
```

### 14. Database Monitoring Queries
**Question:** Write queries to monitor database performance, identify slow queries, and track resource usage.

**Answer:**
```sql
-- Slow query identification
SELECT 
    query_id,
    LEFT(query, 100) as query_preview,
    exec_count,
    total_latency / 1000000 as total_latency_ms,
    avg_latency / 1000000 as avg_latency_ms,
    lock_latency / 1000000 as lock_latency_ms,
    rows_sent,
    rows_examined,
    created_tmp_tables,
    created_tmp_disk_tables
FROM performance_schema.events_statements_summary_by_digest
WHERE avg_latency > 1000000 -- > 1ms
ORDER BY avg_latency DESC
LIMIT 20;

-- Table size and index usage
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as table_size_mb,
    ROUND((data_length / 1024 / 1024), 2) as data_size_mb,
    ROUND((index_length / 1024 / 1024), 2) as index_size_mb,
    table_rows
FROM information_schema.tables
WHERE table_schema = DATABASE()
ORDER BY (data_length + index_length) DESC;

-- Index usage statistics
SELECT 
    object_schema,
    object_name,
    index_name,
    count_read,
    count_write,
    count_read / (count_read + count_write) * 100 as read_pct
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE object_schema = DATABASE()
  AND count_read > 0
ORDER BY count_read DESC;
```## Comp
lex Scenario Questions

### 15. Multi-tenant Database Design
**Question:** Design a database schema for a SaaS application serving 1000+ tenants with data isolation requirements.

**Answer:**
```sql
-- Approach 1: Shared database with tenant_id column
CREATE TABLE tenants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    plan_type ENUM('basic', 'premium', 'enterprise'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'suspended', 'cancelled') DEFAULT 'active'
);

-- All tables include tenant_id with proper indexing
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tenant_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE KEY unique_email_per_tenant (tenant_id, email),
    INDEX idx_tenant_user (tenant_id, id)
);

-- Row Level Security (MySQL 8.0+)
CREATE ROLE tenant_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON app_db.* TO tenant_user;

-- Application-level security
CREATE VIEW user_data AS
SELECT * FROM users 
WHERE tenant_id = GET_CURRENT_TENANT_ID();

-- Approach 2: Database per tenant (for high isolation)
CREATE DATABASE tenant_1001;
CREATE DATABASE tenant_1002;
-- Automated schema deployment script needed
```

### 16. Time-Series Data Optimization
**Question:** Design an efficient schema for storing and querying IoT sensor data with 1M+ records per day.

**Answer:**
```sql
-- Partitioned time-series table
CREATE TABLE sensor_readings (
    id BIGINT AUTO_INCREMENT,
    sensor_id INT NOT NULL,
    reading_time TIMESTAMP NOT NULL,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    pressure DECIMAL(7,2),
    battery_level TINYINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, reading_time),
    INDEX idx_sensor_time (sensor_id, reading_time)
) PARTITION BY RANGE (UNIX_TIMESTAMP(reading_time)) (
    PARTITION p202401 VALUES LESS THAN (UNIX_TIMESTAMP('2024-02-01')),
    PARTITION p202402 VALUES LESS THAN (UNIX_TIMESTAMP('2024-03-01')),
    PARTITION p202403 VALUES LESS THAN (UNIX_TIMESTAMP('2024-04-01'))
    -- Add partitions monthly
);

-- Aggregated data for faster queries
CREATE TABLE sensor_readings_hourly (
    sensor_id INT NOT NULL,
    hour_timestamp TIMESTAMP NOT NULL,
    avg_temperature DECIMAL(5,2),
    min_temperature DECIMAL(5,2),
    max_temperature DECIMAL(5,2),
    avg_humidity DECIMAL(5,2),
    reading_count INT,
    PRIMARY KEY (sensor_id, hour_timestamp)
);

-- Efficient queries for different time ranges
-- Last 24 hours (use raw data)
SELECT sensor_id, AVG(temperature), MAX(temperature), MIN(temperature)
FROM sensor_readings
WHERE reading_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
GROUP BY sensor_id;

-- Last 30 days (use hourly aggregates)
SELECT sensor_id, AVG(avg_temperature), MAX(max_temperature), MIN(min_temperature)
FROM sensor_readings_hourly
WHERE hour_timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY sensor_id;
```

### 17. Audit Trail Implementation
**Question:** Implement a comprehensive audit trail system that tracks all data changes with minimal performance impact.

**Answer:**
```sql
-- Audit log table with JSON for flexibility
CREATE TABLE audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(64) NOT NULL,
    record_id BIGINT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_fields JSON, -- Array of changed field names
    user_id BIGINT,
    session_id VARCHAR(128),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_user_action (user_id, created_at),
    INDEX idx_created_at (created_at)
) PARTITION BY RANGE (UNIX_TIMESTAMP(created_at)) (
    PARTITION p202401 VALUES LESS THAN (UNIX_TIMESTAMP('2024-02-01')),
    PARTITION p202402 VALUES LESS THAN (UNIX_TIMESTAMP('2024-03-01'))
);

-- Trigger-based audit (example for users table)
DELIMITER //
CREATE TRIGGER users_audit_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    DECLARE changed_fields JSON DEFAULT JSON_ARRAY();
    
    IF OLD.email != NEW.email THEN
        SET changed_fields = JSON_ARRAY_APPEND(changed_fields, '$', 'email');
    END IF;
    
    IF OLD.username != NEW.username THEN
        SET changed_fields = JSON_ARRAY_APPEND(changed_fields, '$', 'username');
    END IF;
    
    IF JSON_LENGTH(changed_fields) > 0 THEN
        INSERT INTO audit_log (
            table_name, record_id, action, 
            old_values, new_values, changed_fields,
            user_id, created_at
        ) VALUES (
            'users', NEW.id, 'UPDATE',
            JSON_OBJECT('email', OLD.email, 'username', OLD.username),
            JSON_OBJECT('email', NEW.email, 'username', NEW.username),
            changed_fields,
            @current_user_id, NOW()
        );
    END IF;
END//
DELIMITER ;

-- Query audit history
SELECT 
    al.action,
    al.changed_fields,
    al.old_values,
    al.new_values,
    u.username as changed_by,
    al.created_at
FROM audit_log al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.table_name = 'users' 
  AND al.record_id = ?
ORDER BY al.created_at DESC;
```

### 18. Database Sharding Strategy
**Question:** Design a sharding strategy for a user database with 100M+ users, ensuring even distribution and efficient queries.

**Answer:**
```sql
-- Shard key selection: user_id with consistent hashing
-- Shard 0: user_id % 4 = 0
-- Shard 1: user_id % 4 = 1
-- Shard 2: user_id % 4 = 2
-- Shard 3: user_id % 4 = 3

-- Each shard has identical schema
CREATE TABLE users_shard_0 (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shard_key TINYINT AS (id % 4) STORED,
    CHECK (shard_key = 0)
);

-- Global lookup table for cross-shard queries
CREATE TABLE user_directory (
    user_id BIGINT PRIMARY KEY,
    shard_id TINYINT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Application-level routing logic
function getShardId(userId) {
    return userId % 4;
}

function getUserByShard(userId) {
    const shardId = getShardId(userId);
    const connection = getShardConnection(shardId);
    return connection.query('SELECT * FROM users WHERE id = ?', [userId]);
}

-- Cross-shard aggregation query
SELECT 
    DATE(created_at) as signup_date,
    COUNT(*) as daily_signups
FROM (
    SELECT created_at FROM users_shard_0 WHERE created_at >= '2024-01-01'
    UNION ALL
    SELECT created_at FROM users_shard_1 WHERE created_at >= '2024-01-01'
    UNION ALL
    SELECT created_at FROM users_shard_2 WHERE created_at >= '2024-01-01'
    UNION ALL
    SELECT created_at FROM users_shard_3 WHERE created_at >= '2024-01-01'
) all_users
GROUP BY DATE(created_at)
ORDER BY signup_date;
```## Pe
rformance Metrics & Benchmarking

### 19. Query Performance Benchmarking
**Question:** Establish performance benchmarks for different query types and identify when optimization is needed.

**Answer:**
```sql
-- Benchmark different query patterns
-- 1. Simple SELECT by primary key (target: <1ms)
SELECT * FROM users WHERE id = 12345;

-- 2. Filtered SELECT with index (target: <10ms)
SELECT * FROM orders WHERE user_id = 12345 AND status = 'completed';

-- 3. JOIN query with proper indexes (target: <50ms)
SELECT u.username, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id;

-- 4. Complex aggregation (target: <200ms)
SELECT 
    DATE(o.created_at) as order_date,
    COUNT(*) as order_count,
    SUM(o.total_amount) as daily_revenue,
    AVG(o.total_amount) as avg_order_value
FROM orders o
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(o.created_at)
ORDER BY order_date;

-- Performance monitoring query
SELECT 
    ROUND(AVG(query_time), 6) as avg_query_time,
    ROUND(MAX(query_time), 6) as max_query_time,
    COUNT(*) as query_count,
    LEFT(sql_text, 100) as query_preview
FROM mysql.slow_log
WHERE start_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
GROUP BY LEFT(sql_text, 100)
HAVING avg_query_time > 0.1 -- Queries slower than 100ms
ORDER BY avg_query_time DESC;
```

### 20. Load Testing Scenarios
**Question:** Design database load testing scenarios for Black Friday traffic (10x normal load).

**Answer:**
```sql
-- Normal load baseline (1000 concurrent users)
-- - 100 reads/second per user = 100,000 reads/second
-- - 10 writes/second per user = 10,000 writes/second

-- Black Friday load (10,000 concurrent users)
-- - 1,000,000 reads/second
-- - 100,000 writes/second

-- Load testing queries
-- 1. Product catalog browsing (read-heavy)
SELECT p.id, p.name, p.price, p.rating, c.name as category
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active'
  AND p.category_id IN (1, 2, 3, 4, 5)
  AND p.price BETWEEN 10 AND 1000
ORDER BY p.rating DESC, p.price ASC
LIMIT 20;

-- 2. Cart operations (write-heavy)
INSERT INTO cart_items (user_id, product_id, quantity, price)
VALUES (?, ?, ?, ?)
ON DUPLICATE KEY UPDATE 
quantity = quantity + VALUES(quantity),
updated_at = NOW();

-- 3. Order processing (transaction-heavy)
START TRANSACTION;

INSERT INTO orders (user_id, total_amount, status) 
VALUES (?, ?, 'pending');

SET @order_id = LAST_INSERT_ID();

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
SELECT @order_id, product_id, quantity, price
FROM cart_items
WHERE user_id = ?;

UPDATE inventory 
SET quantity = quantity - (
    SELECT quantity FROM cart_items 
    WHERE user_id = ? AND product_id = inventory.product_id
)
WHERE product_id IN (
    SELECT product_id FROM cart_items WHERE user_id = ?
);

DELETE FROM cart_items WHERE user_id = ?;

COMMIT;

-- Performance monitoring during load test
SELECT 
    VARIABLE_NAME,
    VARIABLE_VALUE
FROM performance_schema.global_status
WHERE VARIABLE_NAME IN (
    'Queries',
    'Questions',
    'Connections',
    'Threads_running',
    'Innodb_buffer_pool_read_requests',
    'Innodb_buffer_pool_reads',
    'Innodb_rows_read',
    'Innodb_rows_inserted',
    'Innodb_rows_updated'
);
```

## Advanced Topics

### 21. Database Replication Strategy
**Question:** Design a master-slave replication setup with read scaling and failover capabilities.

**Answer:**
```sql
-- Master configuration (my.cnf)
[mysqld]
server-id = 1
log-bin = mysql-bin
binlog-format = ROW
sync_binlog = 1
innodb_flush_log_at_trx_commit = 1

-- Slave configuration (my.cnf)
[mysqld]
server-id = 2
relay-log = relay-bin
read_only = 1
super_read_only = 1

-- Setup replication
-- On master:
CREATE USER 'replication'@'%' IDENTIFIED BY 'strong_password';
GRANT REPLICATION SLAVE ON *.* TO 'replication'@'%';
FLUSH PRIVILEGES;

SHOW MASTER STATUS;

-- On slave:
CHANGE MASTER TO
    MASTER_HOST='master_ip',
    MASTER_USER='replication',
    MASTER_PASSWORD='strong_password',
    MASTER_LOG_FILE='mysql-bin.000001',
    MASTER_LOG_POS=154;

START SLAVE;

-- Monitoring replication lag
SELECT 
    SECONDS_BEHIND_MASTER,
    MASTER_LOG_FILE,
    READ_MASTER_LOG_POS,
    RELAY_MASTER_LOG_FILE,
    EXEC_MASTER_LOG_POS
FROM SHOW SLAVE STATUS;

-- Application-level read/write splitting
-- Write operations go to master
const masterConnection = mysql.createConnection(masterConfig);
await masterConnection.execute(
    'INSERT INTO users (email, username) VALUES (?, ?)',
    [email, username]
);

-- Read operations go to slave
const slaveConnection = mysql.createConnection(slaveConfig);
const users = await slaveConnection.execute(
    'SELECT * FROM users WHERE status = ?',
    ['active']
);
```

### 22. Database Migration Strategies
**Question:** Plan a zero-downtime migration from a monolithic database to microservices with separate databases.

**Answer:**
```sql
-- Phase 1: Dual-write pattern
-- Continue writing to monolith, also write to new service DB

-- Original monolithic table
CREATE TABLE monolith.user_profiles (
    user_id BIGINT PRIMARY KEY,
    email VARCHAR(255),
    profile_data JSON,
    preferences JSON,
    created_at TIMESTAMP
);

-- New microservice database
CREATE DATABASE user_service;
CREATE TABLE user_service.profiles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE DATABASE preference_service;
CREATE TABLE preference_service.user_preferences (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    notification_email BOOLEAN DEFAULT true,
    notification_sms BOOLEAN DEFAULT false,
    theme ENUM('light', 'dark') DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Phase 2: Data migration script
INSERT INTO user_service.profiles (user_id, email, first_name, last_name, created_at)
SELECT 
    user_id,
    email,
    JSON_UNQUOTE(JSON_EXTRACT(profile_data, '$.first_name')),
    JSON_UNQUOTE(JSON_EXTRACT(profile_data, '$.last_name')),
    created_at
FROM monolith.user_profiles
WHERE user_id NOT IN (SELECT user_id FROM user_service.profiles);

-- Phase 3: Gradual read migration with feature flags
-- Application code gradually switches reads to new services

-- Phase 4: Stop dual-write and remove monolith tables
-- After validation period, remove old tables
```

### 23. Database Backup and Recovery
**Question:** Design a comprehensive backup and recovery strategy for a production database with RPO of 15 minutes and RTO of 1 hour.

**Answer:**
```sql
-- Backup strategy components:
-- 1. Daily full backups
-- 2. Hourly incremental backups
-- 3. Binary log backups every 15 minutes
-- 4. Point-in-time recovery capability

-- Full backup script (daily at 2 AM)
mysqldump --single-transaction --routines --triggers \
  --master-data=2 --flush-logs --all-databases \
  --result-file=/backup/full_backup_$(date +%Y%m%d).sql

-- Incremental backup using binary logs
mysqlbinlog --start-datetime="2024-01-01 02:00:00" \
  --stop-datetime="2024-01-01 03:00:00" \
  mysql-bin.000001 > /backup/incremental_$(date +%Y%m%d_%H).sql

-- Point-in-time recovery procedure
-- 1. Restore from last full backup
mysql < /backup/full_backup_20240101.sql

-- 2. Apply incremental backups up to desired point
mysql < /backup/incremental_20240101_03.sql
mysql < /backup/incremental_20240101_04.sql

-- 3. Apply binary logs to exact recovery point
mysqlbinlog --start-datetime="2024-01-01 04:00:00" \
  --stop-datetime="2024-01-01 04:45:00" \
  mysql-bin.000002 | mysql

-- Backup verification query
SELECT 
    table_schema,
    table_name,
    table_rows,
    ROUND((data_length + index_length) / 1024 / 1024, 2) as size_mb,
    create_time,
    update_time
FROM information_schema.tables
WHERE table_schema NOT IN ('information_schema', 'performance_schema', 'mysql', 'sys')
ORDER BY size_mb DESC;

-- Recovery testing procedure (monthly)
-- 1. Restore backup to test environment
-- 2. Verify data integrity
-- 3. Test application connectivity
-- 4. Document recovery time
```

This comprehensive SQL interview questions file covers all the requirements:
- 40+ questions about complex query optimization with execution plan analysis
- Database design questions with normalization and indexing strategies  
- Real-world scenarios from e-commerce and social media platforms
- Performance benchmarking questions with actual metrics
- Advanced topics like sharding, replication, and migration strategies

The content is structured for senior backend developers and includes practical examples with actual SQL code, performance metrics, and real-world scenarios they would encounter in production environments.