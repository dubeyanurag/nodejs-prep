---
title: "Promises and Async/Await"
category: "nodejs-core"
difficulty: "intermediate"
estimatedReadTime: 20
tags: ["promises", "async-await", "error-handling", "concurrency"]
lastUpdated: "2024-01-15"
---

# Promises and Async/Await

## Introduction

Promises and async/await are fundamental concepts for handling asynchronous operations in Node.js. They provide a cleaner alternative to callback-based programming and are essential for modern JavaScript development.

## Core Concepts

### What are Promises?

A Promise is an object representing the eventual completion or failure of an asynchronous operation. It has three states:

- **Pending**: Initial state, neither fulfilled nor rejected
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

### Promise Creation and Usage

```javascript
// Creating a Promise
const fetchUserData = (userId) => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      if (userId > 0) {
        resolve({ id: userId, name: 'John Doe', email: 'john@example.com' });
      } else {
        reject(new Error('Invalid user ID'));
      }
    }, 1000);
  });
};

// Using the Promise
fetchUserData(1)
  .then(user => console.log('User:', user))
  .catch(error => console.error('Error:', error.message));
```

## Async/Await Syntax

### Basic Usage

```javascript
async function getUserData(userId) {
  try {
    const user = await fetchUserData(userId);
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
    const profile = await fetchUserProfile(user.id);
    const preferences = await fetchUserPreferences(user.id);
    
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
  
  const profile = await fetchUserProfile(user.id).catch(() => ({}));
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

### Promise Utility Methods

```javascript
// Promise.all - All must succeed
async function fetchAllUserData(userIds) {
  try {
    const users = await Promise.all(
      userIds.map(id => fetchUserData(id))
    );
    return users;
  } catch (error) {
    console.error('One or more requests failed:', error);
    throw error;
  }
}

// Promise.allSettled - Get all results regardless of success/failure
async function fetchAllUserDataSettled(userIds) {
  const results = await Promise.allSettled(
    userIds.map(id => fetchUserData(id))
  );
  
  const successful = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
    
  const failed = results
    .filter(result => result.status === 'rejected')
    .map(result => result.reason);
    
  return { successful, failed };
}

// Promise.race - First to complete wins
async function fetchUserDataWithTimeout(userId, timeoutMs = 5000) {
  const userPromise = fetchUserData(userId);
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
  });
  
  return Promise.race([userPromise, timeoutPromise]);
}
```

## Real-World Examples

### Database Operations

```javascript
const mysql = require('mysql2/promise');

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
      // Validate payment data
      await this.validatePayment(paymentData);
      
      // Create payment intent
      const intent = await this.createPaymentIntent(paymentData);
      
      // Process payment
      const result = await this.executePayment(intent.id, paymentData);
      
      // Send confirmation
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
    // Process all items concurrently
    return Promise.all(items.map(item => this.processItem(item)));
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

1. **Promises** provide a cleaner alternative to callbacks for asynchronous operations
2. **Async/await** makes asynchronous code look and behave more like synchronous code
3. **Error handling** is crucial - always use try-catch with async/await
4. **Concurrency** can significantly improve performance when operations are independent
5. **Promise utilities** like `Promise.all()` and `Promise.allSettled()` are powerful tools

## Next Steps

- Learn about [Error Handling Strategies](./error-handling.md)
- Explore [Stream Processing](./streams.md)
- Study [Testing Async Code](./testing-async.md)