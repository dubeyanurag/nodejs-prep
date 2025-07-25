---
title: "Robust Error Handling in Node.js"
category: "nodejs-core"
difficulty: "intermediate"
estimatedReadTime: 25
tags: ["error-handling", "exceptions", "asynchronous", "middleware", "nodejs-core"]
lastUpdated: "2024-07-26"
---

# Robust Error Handling in Node.js

## Introduction

Effective error handling is crucial for building stable and reliable Node.js applications. Node.js's asynchronous nature and the event loop model require specific strategies to ensure errors are caught and managed gracefully, preventing application crashes and providing meaningful feedback.

## Core Concepts

### Types of Errors

1.  **Operational Errors**: Predictable errors that occur during normal operation (e.g., invalid user input, network timeout, file not found). These should be handled gracefully.
2.  **Programmer Errors**: Bugs in the code (e.g., trying to read a property of `undefined`, syntax errors). These indicate a flaw in the application logic and should ideally be fixed immediately.

### Asynchronous Error Handling

Node.js does not automatically catch errors thrown in asynchronous callbacks. You must explicitly handle them using mechanisms like `try...catch` with `async/await`, `.catch()` for Promises, or error-first callbacks.

## Strategies for Error Handling

### 1. `try...catch` with `async/await`

This is the preferred method for handling errors in asynchronous code when using `async/await`.

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Failed to fetch data:', error.message);
    // Log the error, send to monitoring system, etc.
  }
}

fetchData();
```

### 2. Promise `.catch()`

For Promise-based APIs, the `.catch()` method is used to handle rejections.

```javascript
function connectToDatabase() {
  return new Promise((resolve, reject) => {
    // Simulate database connection
    setTimeout(() => {
      const success = false;
      if (success) {
        resolve('Database connected');
      } else {
        reject(new Error('Failed to connect to database'));
      }
    }, 1000);
  });
}

connectToDatabase()
  .then(message => console.log(message))
  .catch(error => console.error('Database error:', error.message));
```

### 3. Error-First Callbacks

In older Node.js APIs, errors are typically passed as the first argument to callbacks (`(err, data)`).

```javascript
const fs = require('fs');

fs.readFile('nonexistent.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('File read error:', err.message);
    return;
  }
  console.log(data);
});
```

### 4. Centralized Error Handling (Express.js Example)

In web frameworks like Express.js, you can set up centralized error handling middleware.

```javascript
const express = require('express');
const app = express();

// A route that might throw an error
app.get('/broken', (req, res, next) => {
  // Simulate an async operation that throws an error
  setTimeout(() => {
    try {
      throw new Error('Something went wrong in the async operation!');
    } catch (err) {
      next(err); // Pass error to the next middleware
    }
  }, 100);
});

// Generic error handling middleware (must have 4 arguments)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### 5. Uncaught Exceptions and Unhandled Rejections

*   **`process.on('uncaughtException', ...)`**: Catches errors that were not caught by any `try...catch` block and bubble up to the event loop.
*   **`process.on('unhandledRejection', ...)`**: Catches Promise rejections that were not handled by a `.catch()` block.

These should be used as a last resort for logging and gracefully shutting down the application, not for regular error handling.

```javascript
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  // Perform graceful shutdown (e.g., close database connections)
  process.exit(1); // Exit with a failure code
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log the unhandled rejection
  // Optionally, exit the process if it's a critical error
});

// Example of uncaught exception
// setTimeout(() => {
//   throw new Error('This is an uncaught exception!');
// }, 100);

// Example of unhandled rejection
// new Promise((resolve, reject) => {
//   reject('This is an unhandled rejection!');
// });
```

## Best Practices

*   **Categorize Errors**: Distinguish between operational and programmer errors.
*   **Centralize Handling**: Use middleware or dedicated error handlers.
*   **Log Thoroughly**: Use a robust logging solution (e.g., Winston, Pino).
*   **Avoid Crashing**: For operational errors, handle them gracefully without crashing the process. For programmer errors, log and potentially restart.
*   **Use Domains (Deprecated)**: Avoid using `domain` module; prefer `async/await` and Promises for error propagation.

## Interview Questions & Answers

### Question 1: How do you handle errors in asynchronous Node.js code?
**Difficulty**: Intermediate
**Category**: Error Handling

**Answer**: For Promise-based code, use `.catch()` or `try...catch` with `async/await`. For callback-based APIs, check for an `err` argument in the callback. For unhandled errors, `process.on('uncaughtException')` and `process.on('unhandledRejection')` can be used as a last resort for logging and graceful shutdown.

### Question 2: What is the difference between `uncaughtException` and `unhandledRejection`?
**Difficulty**: Advanced
**Category**: Error Handling

**Answer**:
*   `uncaughtException`: Emitted when a synchronous error is thrown and not caught by any `try...catch` block, causing the Node.js process to crash.
*   `unhandledRejection`: Emitted when a Promise is rejected and no `.catch()` handler is provided to handle that rejection. While it doesn't immediately crash the process in all Node.js versions, it's considered an anti-pattern and can lead to memory leaks or unexpected behavior.
