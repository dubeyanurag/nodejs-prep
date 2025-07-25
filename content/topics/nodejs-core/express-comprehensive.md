---
title: "Express.js: Comprehensive Guide"
category: "nodejs-core"
difficulty: "intermediate"
estimatedReadTime: 35
tags: ["express", "web-framework", "routing", "middleware", "api", "nodejs"]
lastUpdated: "2024-07-26"
---

# Express.js: Comprehensive Guide

## Introduction

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of building robust APIs and web servers.

## Getting Started

### Installation

```bash
npm install express
```

### Basic Server Setup

```javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
```

## Routing

Routing determines how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

### Route Methods

Express supports all HTTP methods: `get()`, `post()`, `put()`, `delete()`, `patch()`, `options()`, `head()`.

```javascript
// GET method route
app.get('/users', (req, res) => {
  res.send('GET request to the homepage');
});

// POST method route
app.post('/users', (req, res) => {
  res.send('POST request to the homepage');
});
```

### Route Paths

Route paths can be strings, string patterns, or regular expressions.

```javascript
// Matches /abcd and /abbcd and /abbbcd, etc.
app.get('/ab+cd', (req, res) => {
  res.send('Route matching /ab+cd');
});

// Matches /flights/LAX-SFO
app.get('/flights/:from-:to', (req, res) => {
  res.send(`Flight from ${req.params.from} to ${req.params.to}`);
});
```

### Route Parameters (`req.params`)

Route parameters are named URL segments that are used to capture the values specified at their position in the URL.

```javascript
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params); // { "userId": "...", "bookId": "..." }
});
```

### Query Parameters (`req.query`)

Query parameters are appended to the URL after a question mark (`?`) and are typically used for filtering, sorting, or pagination.

```javascript
// URL: /search?q=nodejs&sort=desc
app.get('/search', (req, res) => {
  console.log(req.query); // { q: 'nodejs', sort: 'desc' }
  res.send(`Search query: ${req.query.q}, Sort order: ${req.query.sort}`);
});
```

### Request Body (`req.body`)

For POST, PUT, or PATCH requests, the data sent in the request body can be accessed via `req.body`. You'll need middleware like `express.json()` or `express.urlencoded()` to parse the body.

```javascript
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.post('/api/data', (req, res) => {
  console.log(req.body); // { name: 'Alice', age: 30 }
  res.send('Data received!');
});
```

## Middleware

Middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the `next` middleware function in the application’s request-response cycle.

### Application-level Middleware

Applied to all routes or specific paths.

```javascript
// Logger middleware
app.use((req, res, next) => {
  console.log('Time:', Date.now(), 'Method:', req.method, 'URL:', req.url);
  next(); // Pass control to the next middleware function
});

// Middleware for a specific path
app.use('/admin', (req, res, next) => {
  console.log('Accessing the admin section...');
  next();
});
```

### Router-level Middleware

Bound to an instance of `express.Router()`.

```javascript
const router = express.Router();

router.use((req, res, next) => {
  console.log('Router-level middleware');
  next();
});

router.get('/', (req, res) => {
  res.send('Router homepage');
});

app.use('/dashboard', router);
```

### Error-handling Middleware

Always takes four arguments: `(err, req, res, next)`.

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### Built-in Middleware

*   `express.static`: Serves static assets.
*   `express.json`: Parses incoming requests with JSON payloads.
*   `express.urlencoded`: Parses incoming requests with URL-encoded payloads.

## Handling Requests and Responses

### Request Object (`req`)

The `req` object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, etc.

*   `req.params`: Route parameters.
*   `req.query`: Query string parameters.
*   `req.body`: Request body (requires body-parsing middleware).
*   `req.headers`: Request headers.
*   `req.method`: HTTP method.
*   `req.url`: Request URL.

### Response Object (`res`)

The `res` object represents the HTTP response that an Express app sends when it gets an HTTP request.

*   `res.send([body])`: Sends various types of HTTP responses.
*   `res.json([body])`: Sends a JSON response.
*   `res.status(code)`: Sets the HTTP status for the response.
*   `res.render(view, [locals], [callback])`: Renders a view template.
*   `res.redirect([status,] path)`: Redirects a request.
*   `res.sendFile(path, [options], [callback])`: Transfers the file at the given path.

## Interview Questions & Answers

### Question 1: What is middleware in Express.js?
**Difficulty**: Intermediate
**Category**: Express.js

**Answer**: Middleware functions in Express.js are functions that execute during the request-response cycle. They have access to the request object, response object, and the `next()` function. They can perform tasks like logging, authentication, parsing request bodies, and handling errors.

### Question 2: How do you handle different HTTP methods and route parameters in Express.js?
**Difficulty**: Intermediate
**Category**: Express.js

**Answer**: Express.js provides methods like `app.get()`, `app.post()`, `app.put()`, etc., to handle different HTTP methods. Route parameters are defined using a colon (`:`) in the path (e.g., `/users/:id`) and are accessed via `req.params`. Query parameters are accessed via `req.query`.
