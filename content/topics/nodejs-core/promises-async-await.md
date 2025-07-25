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
