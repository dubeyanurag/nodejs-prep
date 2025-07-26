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

## Interview Questions & Answers

### Question 1: Explain the different types of SQL JOINs and when to use each.
**Difficulty**: Intermediate
**Category**: SQL Queries

**Answer**: SQL JOINs combine rows from two or more tables based on a related column between them.

1.  **`INNER JOIN`**: Returns rows when there is a match in *both* tables.
    ```sql
    SELECT Orders.OrderID, Customers.CustomerName
    FROM Orders
    INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;
    ```
2.  **`LEFT JOIN` (or `LEFT OUTER JOIN`)**: Returns all rows from the left table, and the matching rows from the right table. If no match, NULLs are returned for the right table's columns.
    ```sql
    SELECT Customers.CustomerName, Orders.OrderID
    FROM Customers
    LEFT JOIN Orders ON Customers.CustomerID = Orders.CustomerID;
    ```
3.  **`RIGHT JOIN` (or `RIGHT OUTER JOIN`)**: Returns all rows from the right table, and the matching rows from the left table. If no match, NULLs are returned for the left table's columns.
    ```sql
    SELECT Orders.OrderID, Employees.LastName
    FROM Orders
    RIGHT JOIN Employees ON Orders.EmployeeID = Employees.EmployeeID;
    ```
4.  **`FULL JOIN` (or `FULL OUTER JOIN`)**: Returns rows when there is a match in one of the tables. Returns all rows from both tables, with NULLs for non-matching sides.
    ```sql
    SELECT CustomerName, OrderID
    FROM Customers
    FULL OUTER JOIN Orders ON Customers.CustomerID = Orders.CustomerID
    ORDER BY CustomerName;
    ```
5.  **`SELF JOIN`**: A table is joined to itself. Used to combine rows from the same table.
    ```sql
    SELECT A.EmployeeName AS Employee1, B.EmployeeName AS Employee2
    FROM Employees A, Employees B
    WHERE A.ManagerID = B.EmployeeID;
    ```

### Question 2: What is database normalization, and what are its benefits and drawbacks?
**Difficulty**: Intermediate
**Category**: Database Design

**Answer**: Database normalization is the process of organizing the columns and tables of a relational database to minimize data redundancy and improve data integrity. It typically involves breaking down large tables into smaller, related tables and defining relationships between them.

**Benefits**:
*   **Reduced Data Redundancy**: Stores data in only one place, saving storage space.
*   **Improved Data Integrity**: Ensures data consistency by eliminating duplicate data that could lead to inconsistencies.
*   **Better Data Maintainability**: Updates, insertions, and deletions are more efficient and less prone to errors.
*   **Simplified Queries**: Often leads to simpler and more focused queries, especially for transactional workloads.

**Drawbacks**:
*   **Increased Query Complexity**: Joins across multiple tables can make read queries more complex and potentially slower (e.g., for reporting or analytical queries).
*   **Increased Joins Overhead**: More joins mean more overhead for the database system.
*   **Performance Trade-offs**: While good for write performance, excessive normalization can sometimes negatively impact read performance.

### Question 3: Explain the purpose of indexes in SQL and discuss different types.
**Difficulty**: Intermediate
**Category**: Performance Optimization

**Answer**: Database indexes are special lookup tables that the database search engine can use to speed up data retrieval. They are similar to an index in a book, allowing the database to find data quickly without scanning every row.

**Purpose**:
*   **Faster Data Retrieval**: Significantly speeds up `SELECT` queries, especially with `WHERE` clauses, `JOIN` conditions, and `ORDER BY` clauses.
*   **Unique Constraints**: Enforce uniqueness on columns (e.g., primary keys, unique keys).

**Types**:
1.  **Clustered Index**: Determines the physical order of data in a table. A table can have only one clustered index (e.g., usually the primary key). Data is stored in the order of the clustered index.
2.  **Non-Clustered Index**: Does not determine the physical order of data. It stores a logical ordering of the data and pointers to the actual data rows. A table can have multiple non-clustered indexes.
3.  **Unique Index**: Ensures that all values in the indexed column(s) are unique.
4.  **Composite (Compound) Index**: An index on multiple columns. The order of columns in a composite index is crucial for query optimization.
5.  **Partial (Filtered) Index**: Indexes only a subset of rows in a table that satisfy a specified condition. Useful for optimizing queries on frequently queried subsets of data and reducing index size.
6.  **Full-Text Index**: Used for full-text searches on character-based data.
7.  **Functional (Expression) Index**: An index created on the result of a function or expression, rather than just a column value.

### Question 4: How can you optimize a slow SQL query? Walk through a general process.
**Difficulty**: Senior
**Category**: Performance Optimization

**Answer**: Optimizing a slow SQL query is a systematic process:

1.  **Identify the Slow Query**: Use database monitoring tools, slow query logs, or APM (Application Performance Monitoring) to find queries that are consistently slow or consume significant resources.
2.  **Analyze the Execution Plan (`EXPLAIN`)**: Use `EXPLAIN` (or `EXPLAIN ANALYZE` in PostgreSQL) to understand how the database executes the query. Look for:
    *   **Full Table Scans**: Indicates missing or unused indexes.
    *   **Inefficient Joins**: Nested loops on large tables, or large intermediate result sets.
    *   **Temporary Tables/Files**: Indicates sorting or grouping operations that exceed memory limits.
    *   **High Cost Operations**: Identify the most expensive parts of the query.
3.  **Indexing Strategy**:
    *   Ensure indexes exist on columns used in `WHERE` clauses, `JOIN` conditions, `ORDER BY`, and `GROUP BY`.
    *   Consider composite indexes with proper column order (equality first, then sort, then range).
    *   Use covering indexes if possible (all queried columns are in the index).
    *   Add partial/functional indexes for specific use cases.
4.  **Query Rewriting**:
    *   Avoid `SELECT *`; select only necessary columns.
    *   Replace `IN` with `EXISTS` or `JOIN` for subqueries, especially with large result sets.
    *   Optimize `OR` conditions (sometimes `UNION ALL` or multiple `WHERE` clauses can be better).
    *   Break down complex queries into smaller, more manageable CTEs.
    *   Avoid functions on indexed columns in `WHERE` clauses (e.g., `WHERE YEAR(date_column) = 2024` prevents index use).
5.  **Database Configuration Tuning**: Adjust database parameters like `shared_buffers`, `work_mem`, `effective_cache_size` (for PostgreSQL) or `innodb_buffer_pool_size` (for MySQL).
6.  **Data Partitioning/Sharding**: For extremely large tables, consider partitioning (splitting a table into smaller logical pieces) or sharding (distributing data across multiple physical databases).
7.  **Application-Level Caching**: Implement application-level caching (e.g., Redis, Memcached) to reduce database hits for frequently accessed data.
8.  **Regular Maintenance**: Ensure statistics are up-to-date (`ANALYZE` command), and rebuild/reindex tables/indexes regularly if they suffer from bloat.
9.  **Hardware & Infrastructure**: Consider upgrading hardware (CPU, RAM, SSDs) or optimizing network latency if database performance is consistently bottlenecked by resources.

### Question 5: What are SQL Window Functions, and provide an example of their use.
**Difficulty**: Advanced
**Category**: SQL Queries

**Answer**: SQL Window Functions perform calculations across a set of table rows that are related to the current row. Unlike aggregate functions (like `SUM()`, `AVG()`) which group rows into a single output row, window functions return a value for *each row* in the result set. They operate on a "window" of rows defined by an `OVER()` clause.

**Common Window Functions**:
*   **Ranking Functions**: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `NTILE()`
*   **Analytic Functions**: `LAG()`, `LEAD()`, `FIRST_VALUE()`, `LAST_VALUE()`
*   **Aggregate Functions used as Window Functions**: `SUM() OVER()`, `AVG() OVER()`, `COUNT() OVER()`

**Example Use Case: Calculating Running Total and Daily Average Sales**
Consider a table `sales` with `sale_date` and `amount`.

```sql
SELECT
    sale_date,
    amount,
    -- Calculate a running total of sales for each day
    SUM(amount) OVER (ORDER BY sale_date) AS running_total_sales,
    -- Calculate the 7-day moving average of sales
    AVG(amount) OVER (
        ORDER BY sale_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS seven_day_moving_average
FROM sales
ORDER BY sale_date;
```
In this example:
*   `SUM(amount) OVER (ORDER BY sale_date)` calculates the cumulative sum of `amount` ordered by `sale_date`.
*   `AVG(amount) OVER (ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)` calculates the average `amount` for the current row and the 6 preceding rows, effectively a 7-day moving average.

### Question 6: Describe Common Table Expressions (CTEs) and when they are useful.
**Difficulty**: Intermediate
**Category**: SQL Queries

**Answer**: A Common Table Expression (CTE) is a temporary, named result set that you can reference within a `SELECT`, `INSERT`, `UPDATE`, or `DELETE` statement. It's defined using the `WITH` clause and exists only for the duration of the query.

**Syntax**:
```sql
WITH cte_name (column1, column2, ...) AS (
    -- CTE query definition
    SELECT column1, column2 FROM table_name WHERE condition
)
-- Main query that references the CTE
SELECT * FROM cte_name WHERE another_condition;
```

**When they are useful**:
1.  **Readability**: Break down complex, multi-step queries into logical, readable units.
2.  **Recursion**: Enable recursive queries (recursive CTEs) for hierarchical or graph-like data (e.g., organizational charts, bill of materials).
3.  **Modularity**: Reuse the same subquery multiple times within a single larger query, avoiding repetition.
4.  **Simplifying Complex Joins/Subqueries**: Make deeply nested subqueries or complex joins easier to manage.
5.  **Avoiding Repeated Calculations**: Define a complex calculation once in a CTE and reuse its result.

**Example Use Case: Hierarchical Data (Organizational Chart)**
```sql
WITH RECURSIVE EmployeePaths (EmployeeID, EmployeeName, ManagerID, Level, Path) AS (
    -- Base case: Employees who are managers (no manager_id)
    SELECT EmployeeID, EmployeeName, ManagerID, 1, CAST(EmployeeName AS VARCHAR(MAX))
    FROM Employees
    WHERE ManagerID IS NULL

    UNION ALL

    -- Recursive case: Employees reporting to managers
    SELECT e.EmployeeID, e.EmployeeName, e.ManagerID, ep.Level + 1,
           ep.Path + ' -> ' + e.EmployeeName
    FROM Employees e
    INNER JOIN EmployeePaths ep ON e.ManagerID = ep.EmployeeID
)
SELECT EmployeeID, EmployeeName, ManagerID, Level, Path
FROM EmployeePaths
ORDER BY Level, EmployeeName;
```

### Question 7: What are the best practices for transaction management in SQL?
**Difficulty**: Senior
**Category**: Transaction Management

**Answer**: Transaction management ensures data integrity and consistency in a multi-user environment.

**Best Practices**:
1.  **Use Transactions**: Always wrap a series of related database operations that must succeed or fail as a single unit within a transaction (`BEGIN/START TRANSACTION`, `COMMIT`, `ROLLBACK`).
2.  **Keep Transactions Short**: Long-running transactions hold locks for extended periods, reducing concurrency and increasing the risk of deadlocks.
3.  **Use Appropriate Isolation Levels**: Choose the lowest isolation level that meets your application's consistency requirements to maximize concurrency. `READ COMMITTED` is often a good default, `SERIALIZABLE` offers highest consistency but lowest concurrency.
4.  **Error Handling**: Implement robust error handling with `TRY...CATCH` blocks (or equivalent) to ensure `ROLLBACK` happens on error.
5.  **Consistent Lock Ordering**: When accessing multiple resources within a transaction, always acquire locks in a consistent order (e.g., always by primary key ascending) to minimize deadlocks.
6.  **Avoid User Input During Transactions**: Don't wait for user input or external API calls inside an active transaction.
7.  **Monitor for Deadlocks**: Implement monitoring and alerting for deadlocks. Implement retry logic with exponential backoff on the application side when deadlocks occur.
8.  **`FOR UPDATE` / Pessimistic Locking**: Use explicit row-level locks (`SELECT ... FOR UPDATE` in PostgreSQL/MySQL) for critical sections where you need to prevent concurrent modifications.
9.  **Optimistic Locking**: For less contentious scenarios, use optimistic locking (e.g., a version column) to detect conflicts at commit time, reducing lock contention.

**Example (Node.js with `pg` and explicit transaction):**
```javascript
const { Pool } = require('pg');
const pool = new Pool(/* ...db config... */);

async function transferFunds(fromAccountId, toAccountId, amount) {
  const client = await pool.connect(); // Acquire a client from the pool
  try {
    await client.query('BEGIN'); // Start transaction

    // Check balance and lock rows (pessimistic locking)
    const resFrom = await client.query(
      'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE',
      [fromAccountId]
    );

    if (resFrom.rows[0].balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Perform debit and credit
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromAccountId]
    );
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toAccountId]
    );

    await client.query('COMMIT'); // Commit transaction
    return { success: true, message: 'Funds transferred successfully' };
  } catch (e) {
    await client.query('ROLLBACK'); // Rollback on error
    throw new Error(`Transaction failed: ${e.message}`);
  } finally {
    client.release(); // Release client back to the pool
  }
}
```
