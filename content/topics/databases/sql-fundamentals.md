---
title: "SQL Fundamentals and Advanced Queries"
category: "databases"
difficulty: "intermediate"
estimatedReadTime: 30
tags: ["sql", "mysql", "postgresql", "queries", "optimization"]
lastUpdated: "2024-01-15"
---

# SQL Fundamentals and Advanced Queries

## Introduction

SQL (Structured Query Language) is the standard language for managing relational databases. For senior backend engineers, mastering SQL is essential for designing efficient data access patterns and optimizing application performance.

## Core Concepts

### Database Design Principles

#### Normalization

```sql
-- First Normal Form (1NF) - Atomic values
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- Second Normal Form (2NF) - No partial dependencies
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    order_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Third Normal Form (3NF) - No transitive dependencies
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    category_id INT,
    price DECIMAL(10,2),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE categories (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    description TEXT
);
```

### Advanced Query Patterns

#### Window Functions

```sql
-- Ranking and analytics
SELECT 
    user_id,
    order_date,
    total_amount,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_date DESC) as order_rank,
    RANK() OVER (ORDER BY total_amount DESC) as amount_rank,
    LAG(total_amount) OVER (PARTITION BY user_id ORDER BY order_date) as prev_order_amount,
    SUM(total_amount) OVER (PARTITION BY user_id) as user_total_spent,
    AVG(total_amount) OVER (
        PARTITION BY user_id 
        ORDER BY order_date 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as moving_avg
FROM orders
WHERE order_date >= '2024-01-01';
```

#### Common Table Expressions (CTEs)

```sql
-- Recursive CTE for hierarchical data
WITH RECURSIVE employee_hierarchy AS (
    -- Base case: top-level managers
    SELECT 
        id, 
        name, 
        manager_id, 
        1 as level,
        CAST(name AS VARCHAR(1000)) as path
    FROM employees 
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case: employees with managers
    SELECT 
        e.id, 
        e.name, 
        e.manager_id, 
        eh.level + 1,
        CONCAT(eh.path, ' -> ', e.name)
    FROM employees e
    INNER JOIN employee_hierarchy eh ON e.manager_id = eh.id
)
SELECT * FROM employee_hierarchy ORDER BY level, name;

-- Complex analytics with multiple CTEs
WITH monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', order_date) as month,
        SUM(total_amount) as total_sales,
        COUNT(*) as order_count,
        COUNT(DISTINCT user_id) as unique_customers
    FROM orders
    WHERE order_date >= '2023-01-01'
    GROUP BY DATE_TRUNC('month', order_date)
),
sales_growth AS (
    SELECT 
        month,
        total_sales,
        LAG(total_sales) OVER (ORDER BY month) as prev_month_sales,
        (total_sales - LAG(total_sales) OVER (ORDER BY month)) / 
        LAG(total_sales) OVER (ORDER BY month) * 100 as growth_rate
    FROM monthly_sales
)
SELECT 
    month,
    total_sales,
    prev_month_sales,
    ROUND(growth_rate, 2) as growth_percentage
FROM sales_growth
WHERE prev_month_sales IS NOT NULL
ORDER BY month;
```

## Performance Optimization

### Indexing Strategies

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index
CREATE INDEX idx_orders_user_date ON orders(user_id, order_date);

-- Partial index (PostgreSQL)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Functional index
CREATE INDEX idx_users_lower_email ON users(LOWER(email));

-- Covering index (includes additional columns)
CREATE INDEX idx_orders_covering ON orders(user_id, order_date) 
INCLUDE (total_amount, status);
```

### Query Optimization Techniques

```sql
-- Use EXISTS instead of IN for better performance
-- ❌ Slower with large datasets
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders WHERE total_amount > 1000);

-- ✅ Faster alternative
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.id AND o.total_amount > 1000
);

-- Optimize JOIN operations
-- ❌ Inefficient join
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;

-- ✅ More efficient with proper indexing
SELECT u.name, COALESCE(order_stats.order_count, 0) as order_count
FROM users u
LEFT JOIN (
    SELECT user_id, COUNT(*) as order_count
    FROM orders
    GROUP BY user_id
) order_stats ON u.id = order_stats.user_id;
```

### Analyzing Query Performance

```sql
-- PostgreSQL
EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.name, o.total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.order_date >= '2024-01-01'
ORDER BY o.total_amount DESC
LIMIT 10;

-- MySQL
EXPLAIN FORMAT=JSON
SELECT u.name, o.total_amount
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.order_date >= '2024-01-01'
ORDER BY o.total_amount DESC
LIMIT 10;
```

## Advanced Patterns

### Data Warehousing Queries

```sql
-- Star schema query with fact and dimension tables
SELECT 
    d.year,
    d.quarter,
    p.category,
    c.region,
    SUM(f.sales_amount) as total_sales,
    SUM(f.quantity) as total_quantity,
    AVG(f.unit_price) as avg_unit_price,
    COUNT(DISTINCT f.customer_id) as unique_customers
FROM sales_fact f
JOIN date_dimension d ON f.date_key = d.date_key
JOIN product_dimension p ON f.product_key = p.product_key
JOIN customer_dimension c ON f.customer_key = c.customer_key
WHERE d.year = 2024
GROUP BY ROLLUP(d.year, d.quarter, p.category, c.region)
ORDER BY d.year, d.quarter, p.category, c.region;
```

### Time Series Analysis

```sql
-- Generate time series with gaps filled
WITH date_series AS (
    SELECT generate_series(
        '2024-01-01'::date,
        '2024-12-31'::date,
        '1 day'::interval
    )::date as date
),
daily_sales AS (
    SELECT 
        DATE(order_date) as date,
        SUM(total_amount) as sales
    FROM orders
    WHERE order_date >= '2024-01-01'
    GROUP BY DATE(order_date)
)
SELECT 
    ds.date,
    COALESCE(daily_sales.sales, 0) as sales,
    AVG(COALESCE(daily_sales.sales, 0)) OVER (
        ORDER BY ds.date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as seven_day_avg
FROM date_series ds
LEFT JOIN daily_sales ON ds.date = daily_sales.date
ORDER BY ds.date;
```

## Real-World Examples

### E-commerce Analytics

```sql
-- Customer segmentation based on RFM analysis
WITH customer_metrics AS (
    SELECT 
        user_id,
        MAX(order_date) as last_order_date,
        COUNT(*) as frequency,
        SUM(total_amount) as monetary_value,
        CURRENT_DATE - MAX(order_date) as recency_days
    FROM orders
    WHERE order_date >= CURRENT_DATE - INTERVAL '2 years'
    GROUP BY user_id
),
rfm_scores AS (
    SELECT 
        user_id,
        NTILE(5) OVER (ORDER BY recency_days DESC) as recency_score,
        NTILE(5) OVER (ORDER BY frequency) as frequency_score,
        NTILE(5) OVER (ORDER BY monetary_value) as monetary_score
    FROM customer_metrics
),
customer_segments AS (
    SELECT 
        user_id,
        recency_score,
        frequency_score,
        monetary_score,
        CASE 
            WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 
            THEN 'Champions'
            WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score >= 3 
            THEN 'Loyal Customers'
            WHEN recency_score >= 3 AND frequency_score <= 2 
            THEN 'Potential Loyalists'
            WHEN recency_score <= 2 AND frequency_score >= 3 
            THEN 'At Risk'
            WHEN recency_score <= 2 AND frequency_score <= 2 
            THEN 'Lost Customers'
            ELSE 'Others'
        END as segment
    FROM rfm_scores
)
SELECT 
    segment,
    COUNT(*) as customer_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM customer_segments
GROUP BY segment
ORDER BY customer_count DESC;
```

### Inventory Management

```sql
-- Stock level monitoring with reorder alerts
WITH current_stock AS (
    SELECT 
        product_id,
        SUM(CASE WHEN transaction_type = 'IN' THEN quantity ELSE -quantity END) as current_quantity
    FROM inventory_transactions
    GROUP BY product_id
),
sales_velocity AS (
    SELECT 
        oi.product_id,
        AVG(oi.quantity) as avg_daily_sales
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY oi.product_id
),
reorder_analysis AS (
    SELECT 
        p.id,
        p.name,
        p.reorder_point,
        p.reorder_quantity,
        cs.current_quantity,
        sv.avg_daily_sales,
        CASE 
            WHEN cs.current_quantity IS NULL THEN 0
            ELSE cs.current_quantity
        END as stock_level,
        CASE 
            WHEN sv.avg_daily_sales > 0 
            THEN cs.current_quantity / sv.avg_daily_sales
            ELSE NULL
        END as days_of_stock
    FROM products p
    LEFT JOIN current_stock cs ON p.id = cs.product_id
    LEFT JOIN sales_velocity sv ON p.id = sv.product_id
)
SELECT 
    name,
    stock_level,
    reorder_point,
    ROUND(days_of_stock, 1) as days_remaining,
    CASE 
        WHEN stock_level <= reorder_point THEN 'REORDER NOW'
        WHEN days_of_stock <= 7 THEN 'LOW STOCK'
        ELSE 'OK'
    END as status
FROM reorder_analysis
WHERE stock_level <= reorder_point OR days_of_stock <= 7
ORDER BY days_of_stock ASC NULLS LAST;
```

## Database-Specific Features

### PostgreSQL Advanced Features

```sql
-- JSON operations
SELECT 
    id,
    metadata->>'name' as product_name,
    metadata->'attributes'->>'color' as color,
    jsonb_array_length(metadata->'tags') as tag_count
FROM products
WHERE metadata @> '{"category": "electronics"}';

-- Array operations
SELECT 
    user_id,
    array_agg(DISTINCT category ORDER BY category) as purchased_categories,
    array_length(array_agg(DISTINCT category), 1) as category_count
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
GROUP BY user_id;

-- Full-text search
SELECT 
    id,
    title,
    ts_rank(to_tsvector('english', title || ' ' || description), 
            plainto_tsquery('english', 'database performance')) as rank
FROM articles
WHERE to_tsvector('english', title || ' ' || description) 
      @@ plainto_tsquery('english', 'database performance')
ORDER BY rank DESC;
```

### MySQL Specific Features

```sql
-- JSON functions
SELECT 
    id,
    JSON_EXTRACT(metadata, '$.name') as product_name,
    JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.attributes.color')) as color,
    JSON_LENGTH(JSON_EXTRACT(metadata, '$.tags')) as tag_count
FROM products
WHERE JSON_CONTAINS(metadata, '{"category": "electronics"}');

-- Generated columns
ALTER TABLE orders 
ADD COLUMN order_year INT AS (YEAR(order_date)) STORED,
ADD INDEX idx_order_year (order_year);
```

## Common Pitfalls and Best Practices

### 1. N+1 Query Problem

```sql
-- ❌ N+1 problem in application code
-- SELECT * FROM users;
-- For each user: SELECT * FROM orders WHERE user_id = ?

-- ✅ Single query solution
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(o.id) as order_count,
    COALESCE(SUM(o.total_amount), 0) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name, u.email;
```

### 2. Inefficient Pagination

```sql
-- ❌ OFFSET becomes slow with large datasets
SELECT * FROM orders 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 10000;

-- ✅ Cursor-based pagination
SELECT * FROM orders 
WHERE created_at < '2024-01-15 10:30:00'
ORDER BY created_at DESC 
LIMIT 20;
```

### 3. Unnecessary Data Transfer

```sql
-- ❌ Selecting unnecessary columns
SELECT * FROM users u
JOIN user_profiles p ON u.id = p.user_id
WHERE u.active = true;

-- ✅ Select only needed columns
SELECT u.id, u.name, u.email, p.bio
FROM users u
JOIN user_profiles p ON u.id = p.user_id
WHERE u.active = true;
```

## Key Takeaways

1. **Normalization** is crucial for data integrity but may require denormalization for performance
2. **Indexing strategy** should align with query patterns and access frequency
3. **Window functions** provide powerful analytics capabilities without complex subqueries
4. **CTEs** improve query readability and enable recursive operations
5. **Query optimization** requires understanding execution plans and database internals
6. **Database-specific features** can provide significant performance and functionality benefits

## Next Steps

- Learn about [Database Indexing Strategies](./indexing-strategies.md)
- Explore [NoSQL Databases](./nosql-fundamentals.md)
- Study [Database Performance Tuning](./performance-tuning.md)