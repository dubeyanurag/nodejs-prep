---
title: "Async/Await in Node.js"
category: "nodejs-core"
difficulty: "intermediate"
estimatedReadTime: 20
tags: ["async-await", "error-handling", "concurrency", "promises"]
lastUpdated: "2024-07-26"
---

# Async/Await in Node.js

## Introduction

Async/await provides a powerful and readable way to work with asynchronous operations in Node.js, building on top of Promises. It allows you to write asynchronous code that looks and behaves more like synchronous code, making it easier to understand and debug. For a deep dive into Promises, refer to our [JavaScript Promises guide](../javascript/promises.md).

## Basic Usage

```javascript
async function getUserData(userId) {
  try {
    const user = await fetchUserData(userId); // Assume fetchUserData returns a Promise
    console.log('User:', user);
    return user;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Calling async function
getUserData(1);
```

### Error Handling Patterns

```javascript
// Pattern 1: Try-Catch
async function handleUserRequest(userId) {
  try {
    const user = await fetchUserData(userId);
    const profile = await fetchUserProfile(user.id); // Assume fetchUserProfile returns a Promise
    const preferences = await fetchUserPreferences(user.id); // Assume fetchUserPreferences returns a Promise
    
    return { user, profile, preferences };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('User data unavailable');
  }
}

// Pattern 2: Promise.catch()
async function handleUserRequestAlt(userId) {
  const user = await fetchUserData(userId).catch(err => {
    console.error('User fetch failed:', err);
    return null;
  });
  
  if (!user) return null;
  
  const profile = await fetchUserProfile(user.id).catch(() => ({})); // Handle potential errors for profile
  return { user, profile };
}
```

## Advanced Patterns

### Concurrent Operations

```javascript
// Sequential (slower)
async function fetchUserDataSequential(userIds) {
  const users = [];
  for (const id of userIds) {
    const user = await fetchUserData(id);
    users.push(user);
  }
  return users;
}

// Concurrent (faster)
async function fetchUserDataConcurrent(userIds) {
  const promises = userIds.map(id => fetchUserData(id));
  return Promise.all(promises);
}

// With error handling for individual failures
async function fetchUserDataConcurrentSafe(userIds) {
  const promises = userIds.map(async (id) => {
    try {
      return await fetchUserData(id);
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      return null;
    }
  });
  
  const results = await Promise.all(promises);
  return results.filter(user => user !== null);
}
```

### Advanced Promise Combinators

#### `Promise.all()`

`Promise.all(iterable)` returns a single `Promise` that fulfills when all of the promises in the iterable argument have fulfilled, or rejects with the reason of the first promise that rejects. It's useful when you need all results to proceed.

```javascript
const p1 = Promise.resolve('Hello');
const p2 = new Promise(resolve => setTimeout(() => resolve('World'), 100));
const p3 = Promise.resolve('!');

Promise.all([p1, p2, p3])
  .then(values => console.log(values)) // ['Hello', 'World', '!']
  .catch(error => console.error(error));

const failingPromise = Promise.reject('Failed to load data');
Promise.all([p1, failingPromise, p3])
  .then(values => console.log(values))
  .catch(error => console.error(error)); // 'Failed to load data'
```

#### `Promise.allSettled()`

`Promise.allSettled(iterable)` returns a promise that fulfills after all of the given promises have either fulfilled or rejected, with an array of objects that each describes the outcome of each promise. This is useful when you want to know the outcome of every promise, regardless of success or failure.

```javascript
const p1 = Promise.resolve('Data A');
const p2 = Promise.reject('Error B');
const p3 = new Promise(resolve => setTimeout(() => resolve('Data C'), 50));

Promise.allSettled([p1, p2, p3])
  .then(results => {
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log(`Fulfilled: ${result.value}`);
      } else {
        console.error(`Rejected: ${result.reason}`);
      }
    });
  });
// Output:
// Fulfilled: Data A
// Rejected: Error B
// Fulfilled: Data C
```

#### `Promise.race()`

`Promise.race(iterable)` returns a promise that fulfills or rejects as soon as one of the promises in the iterable fulfills or rejects, with the value or reason from that promise. It's useful for time-sensitive operations or competitive scenarios.

```javascript
const fetchPrimary = new Promise(resolve => setTimeout(() => resolve('Data from Primary'), 500));
const fetchFallback = new Promise(resolve => setTimeout(() => resolve('Data from Fallback'), 100));
const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('Operation timed out'), 300));

Promise.race([fetchPrimary, fetchFallback, timeoutPromise])
  .then(value => console.log(value)) // 'Data from Fallback' (if it resolves first)
  .catch(error => console.error(error)); // 'Operation timed out' (if timeout wins)
```

#### `Promise.any()`

`Promise.any(iterable)` returns a single promise that fulfills as soon as one of the promises in the iterable fulfills, with the value of that promise. If all of the promises in the iterable reject, then the returned promise is rejected with an `AggregateError`. It's useful when you need any one of multiple asynchronous operations to succeed.

```javascript
const pFail1 = Promise.reject('Error 1');
const pFail2 = Promise.reject('Error 2');
const pSuccess = new Promise(resolve => setTimeout(() => resolve('First success!'), 100));

Promise.any([pFail1, pFail2, pSuccess])
  .then(value => console.log(value)) // 'First success!'
  .catch(error => console.error(error)); // Will only catch if all fail

const pAllFail1 = Promise.reject('Error A');
const pAllFail2 = Promise.reject('Error B');

Promise.any([pAllFail1, pAllFail2])
  .then(value => console.log(value))
  .catch(error => console.error(error.errors)); // ['Error A', 'Error B']
```

### Async Iterators and Generators

Async iterators and generators (`async function*` and `for await...of`) allow you to iterate over asynchronous data streams, making it easier to work with paginated API responses or real-time event streams.

```javascript
async function* fetchPaginatedData(url) {
  let nextPage = url;
  while (nextPage) {
    const response = await fetch(nextPage);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    yield* data.items; // Yield individual items
    nextPage = data.nextPageUrl; // Assume API provides next page URL
  }
}

// Example usage
async function processAllData() {
  for await (const item of fetchPaginatedData('https://api.example.com/items?page=1')) {
    console.log('Processing item:', item);
    // Simulate async processing of each item
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  console.log('Finished processing all paginated data.');
}

// processAllData();
```

### Real-World Examples

### Database Operations

```javascript
const mysql = require('mysql2/promise'); // Using mysql2/promise for async/await support

class UserService {
  constructor(dbConfig) {
    this.pool = mysql.createPool(dbConfig);
  }

  async createUser(userData) {
    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Insert user
      const [userResult] = await connection.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [userData.name, userData.email]
      );
      
      const userId = userResult.insertId;
      
      // Insert user profile
      await connection.execute(
        'INSERT INTO user_profiles (user_id, bio, avatar) VALUES (?, ?, ?)',
        [userId, userData.bio, userData.avatar]
      );
      
      await connection.commit();
      return userId;
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getUserWithProfile(userId) {
    const [users] = await this.pool.execute(`
      SELECT u.*, p.bio, p.avatar 
      FROM users u 
      LEFT JOIN user_profiles p ON u.id = p.user_id 
      WHERE u.id = ?
    `, [userId]);
    
    return users[0] || null;
  }
}
```

### API Integration

```javascript
const axios = require('axios');

class PaymentService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.payment-provider.com';
  }

  async processPayment(paymentData) {
    try {
      // Assume validatePayment, createPaymentIntent, executePayment, sendPaymentConfirmation return Promises
      await this.validatePayment(paymentData);
      const intent = await this.createPaymentIntent(paymentData);
      const result = await this.executePayment(intent.id, paymentData);
      await this.sendPaymentConfirmation(result);
      
      return result;
      
    } catch (error) {
      console.error('Payment processing failed:', error);
      
      // Attempt to cancel/refund if payment was partially processed
      if (error.paymentId) {
        await this.cancelPayment(error.paymentId).catch(console.error);
      }
      
      throw error;
    }
  }

  async createPaymentIntent(paymentData) {
    const response = await axios.post(`${this.baseURL}/intents`, {
      amount: paymentData.amount,
      currency: paymentData.currency,
      customer_id: paymentData.customerId
    }, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
      timeout: 10000
    });
    
    return response.data;
  }

  async executePayment(intentId, paymentData) {
    const response = await axios.post(`${this.baseURL}/intents/${intentId}/confirm`, {
      payment_method: paymentData.paymentMethod
    }, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
      timeout: 15000
    });
    
    return response.data;
  }
}
```

## Performance Optimization

### Batching Operations

```javascript
class BatchProcessor {
  constructor(batchSize = 10, delayMs = 100) {
    this.batchSize = batchSize;
    this.delayMs = delayMs;
    this.queue = [];
    this.processing = false;
  }

  async add(item) {
    return new Promise((resolve, reject) => {
      this.queue.push({ item, resolve, reject });
      this.processBatch();
    });
  }

  async processBatch() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);
      
      try {
        const results = await this.processBatchItems(
          batch.map(b => b.item)
        );
        
        batch.forEach((b, index) => {
          b.resolve(results[index]);
        });
        
      } catch (error) {
        batch.forEach(b => b.reject(error));
      }
      
      // Small delay between batches
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delayMs));
      }
    }
    
    this.processing = false;
  }

  async processBatchItems(items) {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    return `Processed: ${item}`;
  }

  async processItem(item) {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    return `Processed: ${item}`;
  }
}
```

## Common Pitfalls

### 1. Forgetting to Handle Rejections

```javascript
// ❌ Unhandled promise rejection
async function badExample() {
  fetchUserData(1); // Promise not awaited or handled
}

// ✅ Proper handling
async function goodExample() {
  try {
    await fetchUserData(1);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 2. Sequential vs Concurrent Execution

```javascript
// ❌ Unnecessary sequential execution
async function slowFetch() {
  const user1 = await fetchUserData(1);
  const user2 = await fetchUserData(2);
  const user3 = await fetchUserData(3);
  return [user1, user2, user3];
}

// ✅ Concurrent execution
async function fastFetch() {
  const [user1, user2, user3] = await Promise.all([
    fetchUserData(1),
    fetchUserData(2),
    fetchUserData(3)
  ]);
  return [user1, user2, user3];
}
```

## Key Takeaways

1.  **Async/await** makes asynchronous code look and behave more like synchronous code.
2.  **Error handling** is crucial – always use `try-catch` with `async/await`.
3.  **Concurrency** can significantly improve performance when operations are independent.
4.  `async/await` is built on Promises; understanding Promises is key to mastering `async/await`.

## Next Steps

-   Learn about [Error Handling Strategies](./error-handling.md)
-   Explore [Stream Processing](./streams.md)
-   Study [Testing Async Code](./testing-async.md)
-   Delve deeper into [JavaScript Promises](../javascript/promises.md)

## Interview Questions & Answers

### Question 1: What is the event loop's role in executing Promises and `async/await`?
**Difficulty**: Intermediate
**Category**: Event Loop

**Answer**: The Event Loop is crucial for Promises and `async/await`. When a Promise is resolved or rejected, its `.then()` or `.catch()` callbacks are placed into the **microtask queue**. The Event Loop prioritizes the microtask queue, executing all microtasks after the current script finishes and before moving to the next macrotask (like `setTimeout` or `setImmediate`). `async/await` functions, being syntactic sugar over Promises, also rely on this microtask queue mechanism for their execution flow. This ensures that `await`ed operations are handled efficiently without blocking the main thread.

### Question 2: When would you use `Promise.allSettled()` instead of `Promise.all()`?
**Difficulty**: Intermediate
**Category**: Promise Combinators

**Answer**:
*   **`Promise.all()`**: Use when you need *all* promises to succeed. If any promise in the iterable rejects, `Promise.all()` immediately rejects with the reason of the first rejected promise, and the results of other promises are ignored.
*   **`Promise.allSettled()`**: Use when you need to know the outcome of *every* promise, regardless of whether it succeeded or failed. It waits for all promises to settle (either fulfill or reject) and returns an array of objects describing each promise's outcome (status and value/reason). This is useful for scenarios like fetching data from multiple independent APIs where you want to display partial results or log all failures without stopping execution.

### Question 3: How do you handle errors in `async/await` functions?
**Difficulty**: Junior
**Category**: Error Handling

**Answer**: The primary way to handle errors in `async/await` functions is using `try...catch` blocks, similar to synchronous code. Any `await`ed Promise that rejects will throw an error that can be caught by the `catch` block.

```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    // You can re-throw the error, return a default value, or handle it otherwise
    throw new Error('Data retrieval failed');
  }
}

// Another pattern: using .catch() with async/await
async function processUser(userId) {
  const user = await fetchUser(userId).catch(err => {
    console.error('Failed to fetch user:', err.message);
    return null; // Return null if user fetch fails
  });

  if (!user) {
    return 'User not found or fetch failed.';
  }
  // Continue processing with user data
  return `Processed user: ${user.name}`;
}
```

### Question 4: Explain `microtask queue` and `macrotask queue` in relation to promises.
**Difficulty**: Advanced
**Category**: Event Loop

**Answer**: Both microtasks and macrotasks are queues managed by the Event Loop, but they have different priorities:
*   **Macrotask Queue (Task Queue)**: Contains tasks like `setTimeout`, `setInterval`, `setImmediate`, I/O operations, and UI rendering. The Event Loop processes one macrotask per cycle.
*   **Microtask Queue**: Contains tasks like resolved/rejected Promises (`.then()`, `.catch()`, `.finally()`), `process.nextTick()`, and `queueMicrotask()`. The Event Loop completely empties the microtask queue *after* each macrotask (or after the current script's synchronous execution) and *before* starting the next macrotask.

This means microtasks have higher priority. If a macrotask finishes and creates microtasks, those microtasks will execute immediately before the next macrotask can even start. This explains why a `Promise.resolve().then(...)` will execute before a `setTimeout(..., 0)`.

### Question 5: Can you mix callbacks with Promises and `async/await`? Provide an example.
**Difficulty**: Advanced
**Category**: Interoperability

**Answer**: Yes, you can mix callbacks with Promises and `async/await`, especially when dealing with older Node.js APIs or third-party libraries that still use callbacks. The key is to "promisify" the callback-based functions using `util.promisify` (Node.js built-in) or by manually wrapping them in a `new Promise()`.

**Example**:
```javascript
const util = require('util');
const fs = require('fs');

// Promisify a callback-based function
const readFilePromise = util.promisify(fs.readFile);

async function readAndProcessFile(filePath) {
  try {
    // Use promisified function with async/await
    const data = await readFilePromise(filePath, 'utf8');
    console.log('File content:', data.substring(0, 50) + '...');

    // Simulate further async operation
    const processedData = await new Promise(resolve => {
      setTimeout(() => resolve(data.toUpperCase()), 100);
    });

    console.log('Processed data (first 50 chars):', processedData.substring(0, 50) + '...');
    return processedData;

  } catch (error) {
    console.error('Error reading or processing file:', error.message);
    throw error;
  }
}

// Example usage
// Create a dummy file for testing:
// fs.writeFileSync('my_file.txt', 'This is some sample content for the file.');
// readAndProcessFile('my_file.txt');
// readAndProcessFile('nonexistent_file.txt');
```
