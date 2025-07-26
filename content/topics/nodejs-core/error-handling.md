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

## Advanced Error Handling Patterns

### 1. Custom Error Classes

Creating custom error classes allows you to categorize and handle specific types of operational errors more effectively. This improves code readability and allows for more granular error management.

```javascript
// custom_errors.js
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational; // Differentiate operational from programmer errors
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, true);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends AppError {
  constructor(message = 'Invalid input data') {
    super(message, 400, true);
    this.name = 'ValidationError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, true);
    this.name = 'UnauthorizedError';
  }
}

// Usage Example
async function getUser(id) {
  if (!id) {
    throw new ValidationError('User ID is required');
  }
  // Simulate fetching user from DB
  const user = await database.findUserById(id); 
  if (!user) {
    throw new NotFoundError(`User with ID ${id} not found`);
  }
  return user;
}

// In an Express route
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    next(error); // Pass to centralized error handler
  }
});
```

### 2. Error Propagation in Microservices

In a microservices architecture, errors need to be propagated across service boundaries while maintaining context.

*   **Standardized Error Payloads**: Services should return consistent error structures (e.g., JSON with `code`, `message`, `details`).
*   **Correlation IDs**: Use unique request IDs (`X-Request-ID`) to trace requests across multiple services for easier debugging.
*   **Centralized Logging & Monitoring**: Aggregate logs from all services into a central system (e.g., ELK stack, Splunk) and use distributed tracing (e.g., OpenTelemetry, Jaeger) to visualize request flows and identify failing services.
*   **Circuit Breakers**: Prevent cascading failures by quickly failing requests to unhealthy services.
*   **Retries with Backoff**: Implement retry logic for transient errors, often with exponential backoff.

```javascript
// Example: Propagating errors with custom error class and correlation ID
const axios = require('axios'); // Assuming axios for HTTP requests
const { AppError } = require('./custom_errors');

async function callUserService(userId, requestId) {
  try {
    const response = await axios.get(`http://user-service/users/${userId}`, {
      headers: { 'X-Request-ID': requestId } // Propagate correlation ID
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Error from user-service
      throw new AppError(
        `User service error: ${error.response.data.message}`,
        error.response.status,
        true // Operational error from external service
      );
    } else if (error.request) {
      // No response received (e.g., network error, timeout)
      throw new AppError('User service is unreachable', 503, true);
    } else {
      // Other unexpected errors
      throw new AppError(`An unexpected error occurred: ${error.message}`, 500, false);
    }
  }
}

// In your main error handling middleware (Express example)
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    // Operational error - send specific response
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      requestId: req.requestId // Include correlation ID in response
    });
  }

  // Programmer error - log thoroughly and send generic response
  console.error('PROGRAMMER ERROR:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
    requestId: req.requestId
  });
});
```

### 3. Error Monitoring and Alerting Tools

Integrating with dedicated monitoring and alerting solutions is crucial for production systems.

*   **Application Performance Monitoring (APM)**: Tools like New Relic, Datadog, Dynatrace provide detailed insights into application performance, error rates, and distributed traces.
*   **Centralized Log Management**: Solutions like ELK Stack (Elasticsearch, Logstash, Kibana), Splunk, or Sumo Logic aggregate logs from all services, enabling searching, analysis, and alerting on error patterns.
*   **Error Tracking Tools**: Sentry, Rollbar, Bugsnag capture and group application errors, providing stack traces, context, and alerting capabilities.
*   **Cloud-Native Monitoring**: AWS CloudWatch, Azure Monitor, Google Cloud Operations (formerly Stackdriver) offer comprehensive monitoring, logging, and alerting for cloud-based applications.

## Interview Questions & Answers

### Question 1: How do you handle errors in asynchronous Node.js code?
**Difficulty**: Intermediate
**Category**: Error Handling

**Answer**: For Promise-based code, use `.catch()` or `try...catch` with `async/await`. For callback-based APIs, check for an `err` argument in the callback. For unhandled errors, `process.on('uncaughtException')` and `process.on('unhandledRejection')` can be used as a last resort for logging and graceful shutdown.

### Question 2: What is the difference between `uncaughtException` and `unhandledRejection`?
**Difficulty**: Advanced
**Category**: Error Handling

**Answer**:
*   `uncaughtException`: Emitted when a synchronous error is thrown and not caught by any `try...catch` block, causing the Node.js process to crash. This is a last resort mechanism for cleaning up resources before the process crashes.
*   `unhandledRejection`: Emitted when a Promise is rejected and no `.catch()` handler is provided to handle that rejection. In Node.js versions prior to 15, `unhandledRejection` would not crash the process by default, but since Node.js 15, unhandled promise rejections will terminate the Node.js process with a non-zero exit code. It's considered an anti-pattern as it indicates a potential bug or unhandled asynchronous error.

### Question 3: How would you implement a custom error class for an API, and what benefits does it provide?
**Difficulty**: Intermediate
**Category**: Custom Errors

**Answer**: Implementing custom error classes allows for more structured and predictable error handling, especially in API responses. It helps differentiate between various types of operational errors and provides specific information to the client.

**Benefits**:
*   **Clarity**: Clearly distinguishes different error scenarios (e.g., `NotFoundError`, `ValidationError`).
*   **Predictability**: Clients can rely on specific error types and status codes.
*   **Maintainability**: Centralizes error logic and reduces repetitive `if/else` checks.
*   **Debugging**: Custom properties can provide more context for logging and debugging.

**Example Custom Error (`ApiError.js`):**
```javascript
class ApiError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name; // Set name to class name
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true; // Mark as operational error
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', details = null) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', details = null) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', details = null) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Not Found', details = null) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  // ... other custom errors
};
```

**Usage in Express Middleware:**
```javascript
const { ApiError, NotFoundError, BadRequestError } = require('./ApiError'); // Assuming ApiError.js

// Route handler example
app.get('/users/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    const user = await findUserInDatabase(userId); // Some async operation
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }
    res.json(user);
  } catch (error) {
    // Pass to centralized error handling middleware
    next(error);
  }
});

// Centralized Error Handling Middleware (at the end of your app.js)
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    // Operational error: send specific response
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errorCode: err.errorCode,
      details: err.details,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  }

  // Programmer error or unexpected error: log and send generic response
  console.error('UNEXPECTED ERROR:', err.stack); // Log full stack trace for debugging
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    errorCode: 'SERVER_ERROR',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
});
```

### Question 4: How do you ensure graceful shutdown in a Node.js application to prevent data loss or corrupted states?
**Difficulty**: Advanced
**Category**: Operational Error Handling

**Answer**: Graceful shutdown ensures that an application closes down cleanly, completing ongoing tasks and releasing resources before terminating. This prevents data corruption, ensures data integrity, and provides a better user experience.

**Key Steps**:
1.  **Stop accepting new requests**: For web servers, call `server.close()` to stop listening for new connections.
2.  **Complete existing requests**: Allow existing requests to finish processing. Track active connections and wait for them to close.
3.  **Close external connections**: Close database connections, message queue consumers/producers, file handles, and other external resources.
4.  **Handle long-running tasks**: If there are long-running background tasks, ensure they complete or are properly interrupted and can resume later.
5.  **Set a timeout**: Implement a timeout for the entire graceful shutdown process. If the application doesn't shut down within this period, force a termination to prevent indefinite hangs.

**Example (Node.js/Express with database/message queue):**
```javascript
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

// Simulate database connection and message queue client
const database = {
  isConnected: true,
  disconnect: async () => {
    console.log('Disconnecting from database...');
    return new Promise(resolve => setTimeout(() => {
      database.isConnected = false;
      console.log('Database disconnected.');
      resolve();
    }, 1000));
  }
};

const messageQueue = {
  isConnected: true,
  close: async () => {
    console.log('Closing message queue connection...');
    return new Promise(resolve => setTimeout(() => {
      messageQueue.isConnected = false;
      console.log('Message queue closed.');
      resolve();
    }, 800));
  }
};

let connections = new Set(); // Track active HTTP connections

server.on('connection', connection => {
  connections.add(connection);
  connection.on('close', () => connections.delete(connection));
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Graceful shutdown function
const gracefulShutdown = async () => {
  console.log('\nStarting graceful shutdown...');

  // 1. Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed. Waiting for active connections to drain...');

    // 2. Wait for active connections to drain
    // Or force close after a short delay if connections persist
    const timeout = setTimeout(() => {
      console.warn('Forcing close of remaining connections.');
      for (const conn of connections) {
        conn.destroy(); // Forcefully destroy connection
      }
    }, 5000); // 5-second timeout for active connections

    // Wait for all connections to close
    await new Promise(resolve => {
      if (connections.size === 0) {
        clearTimeout(timeout);
        resolve();
      } else {
        const checkConnections = setInterval(() => {
          if (connections.size === 0) {
            clearTimeout(timeout);
            clearInterval(checkConnections);
            resolve();
          }
        }, 100);
      }
    });

    // 3. Close external resources
    await database.disconnect();
    await messageQueue.close();

    console.log('All resources closed. Process exiting.');
    process.exit(0); // Exit cleanly
  });

  // Set a maximum timeout for the entire shutdown process
  setTimeout(() => {
    console.error('Graceful shutdown timeout exceeded. Forcing process exit.');
    process.exit(1); // Exit with failure code
  }, 10000); // 10-second total shutdown timeout
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown); // Ctrl+C
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message, err.stack);
  gracefulShutdown(); // Attempt graceful shutdown on unhandled errors
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown(); // Attempt graceful shutdown on unhandled promise rejections
});
```
