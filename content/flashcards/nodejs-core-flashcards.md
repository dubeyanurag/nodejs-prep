---
title: "Node.js Core Concepts Flashcards"
category: "nodejs-core"
difficulty: "intermediate"
tags: ["flashcards", "event-loop", "async", "promises"]
lastUpdated: "2024-01-15"
---

# Node.js Core Concepts Flashcards

## Event Loop Fundamentals

### Card 1
**Question**: What are the six phases of the Node.js Event Loop?

**Answer**: 
1. **Timer Phase** - Executes `setTimeout()` and `setInterval()` callbacks
2. **Pending Callbacks Phase** - Executes I/O callbacks deferred to the next loop iteration
3. **Idle, Prepare Phase** - Only used internally
4. **Poll Phase** - Fetches new I/O events; executes I/O related callbacks
5. **Check Phase** - Executes `setImmediate()` callbacks
6. **Close Callbacks Phase** - Executes close callbacks (e.g., `socket.on('close', ...)`)

**Code Example**:
```javascript
console.log('Start');
setTimeout(() => console.log('Timer'), 0);
setImmediate(() => console.log('Immediate'));
process.nextTick(() => console.log('NextTick'));
console.log('End');
// Output: Start, End, NextTick, Timer, Immediate
```

### Card 2
**Question**: What's the difference between `process.nextTick()` and `setImmediate()`?

**Answer**: 
- **`process.nextTick()`**: Executes before the Event Loop continues to the next phase (highest priority)
- **`setImmediate()`**: Executes in the Check phase of the Event Loop

**Key Point**: `process.nextTick()` has higher priority and can potentially starve the Event Loop if used recursively.

**Code Example**:
```javascript
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
// Output: nextTick, setImmediate
```

### Card 3
**Question**: How do you prevent blocking the Event Loop?

**Answer**: 
1. **Use Worker Threads** for CPU-intensive tasks
2. **Break large operations** into smaller chunks
3. **Use asynchronous I/O** operations
4. **Implement proper error handling**
5. **Use `setImmediate()` or `process.nextTick()`** to yield control

**Code Example**:
```javascript
// ❌ Blocking
function processArray(arr) {
  return arr.map(item => heavyComputation(item));
}

// ✅ Non-blocking
async function processArrayAsync(arr, chunkSize = 1000) {
  const results = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    results.push(...chunk.map(item => heavyComputation(item)));
    await new Promise(resolve => setImmediate(resolve));
  }
  return results;
}
```

## Promises and Async/Await

### Card 4
**Question**: What are the three states of a Promise?

**Answer**: 
1. **Pending**: Initial state, neither fulfilled nor rejected
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

**Key Point**: Once a Promise is settled (fulfilled or rejected), it cannot change state.

### Card 5
**Question**: What's the difference between `Promise.all()` and `Promise.allSettled()`?

**Answer**: 
- **`Promise.all()`**: Fails fast - if any promise rejects, the entire operation rejects
- **`Promise.allSettled()`**: Waits for all promises to settle, returns results for both fulfilled and rejected promises

**Code Example**:
```javascript
// Promise.all - fails if any promise rejects
const results1 = await Promise.all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3) // If this fails, entire operation fails
]);

// Promise.allSettled - gets all results
const results2 = await Promise.allSettled([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
]);
// results2 = [
//   { status: 'fulfilled', value: user1 },
//   { status: 'fulfilled', value: user2 },
//   { status: 'rejected', reason: error }
// ]
```

### Card 6
**Question**: How do you handle errors in async/await?

**Answer**: 
Use **try-catch blocks** for async/await error handling:

**Code Example**:
```javascript
async function fetchUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const profile = await fetchProfile(user.id);
    return { user, profile };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('User data unavailable');
  }
}

// Alternative: Promise.catch()
const user = await fetchUser(userId).catch(err => {
  console.error('User fetch failed:', err);
  return null;
});
```

## Express.js Fundamentals

### Card 7
**Question**: What is Express.js middleware and how does it work?

**Answer**: 
Middleware functions execute during the request-response cycle. They have access to:
- **req** (request object)
- **res** (response object)  
- **next** (next middleware function)

**Code Example**:
```javascript
// Middleware function
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  // Verify token and add user to request
  req.user = verifyToken(token);
  next(); // Continue to next middleware
};

app.use(authMiddleware); // Apply to all routes
app.get('/protected', authMiddleware, handler); // Apply to specific route
```

### Card 8
**Question**: How do you implement error handling in Express.js?

**Answer**: 
Use **error-handling middleware** with four parameters: `(err, req, res, next)`

**Code Example**:
```javascript
// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

// Async wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json(user);
}));

app.use(errorHandler);
```

### Card 9
**Question**: What are the different types of middleware in Express.js?

**Answer**: 
1. **Application-level**: `app.use(middleware)`
2. **Router-level**: `router.use(middleware)`
3. **Error-handling**: `app.use((err, req, res, next) => {})`
4. **Built-in**: `express.json()`, `express.static()`
5. **Third-party**: `cors()`, `helmet()`, `morgan()`

**Code Example**:
```javascript
// Application-level
app.use(express.json());

// Router-level
const router = express.Router();
router.use(authMiddleware);

// Error-handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Third-party
app.use(cors());
app.use(helmet());
```

## System Design Concepts

### Card 10
**Question**: What is the Circuit Breaker pattern and when do you use it?

**Answer**: 
Circuit Breaker prevents cascading failures by monitoring service calls and "opening" when failure threshold is reached.

**States**:
- **Closed**: Normal operation
- **Open**: Failing fast, not calling service
- **Half-Open**: Testing if service recovered

**Code Example**:
```javascript
class CircuitBreaker {
  constructor(failureThreshold = 5, recoveryTimeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.recoveryTimeout = recoveryTimeout;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.recoveryTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}
```

### Card 11
**Question**: What is the Saga pattern in microservices?

**Answer**: 
Saga pattern manages distributed transactions through a sequence of local transactions, each with a compensating action for rollback.

**Types**:
- **Orchestration**: Central coordinator manages the saga
- **Choreography**: Services coordinate through events

**Code Example**:
```javascript
class OrderSaga {
  async execute(orderData) {
    const compensations = [];
    
    try {
      // Step 1: Create order
      const order = await this.orderService.create(orderData);
      compensations.push(() => this.orderService.cancel(order.id));
      
      // Step 2: Reserve inventory
      const reservation = await this.inventoryService.reserve(order.items);
      compensations.push(() => this.inventoryService.release(reservation.id));
      
      // Step 3: Process payment
      const payment = await this.paymentService.charge(order.total);
      compensations.push(() => this.paymentService.refund(payment.id));
      
      return { success: true, orderId: order.id };
    } catch (error) {
      // Execute compensations in reverse order
      for (let i = compensations.length - 1; i >= 0; i--) {
        await compensations[i]();
      }
      throw error;
    }
  }
}
```

### Card 12
**Question**: What is CQRS and when should you use it?

**Answer**: 
**CQRS (Command Query Responsibility Segregation)** separates read and write operations using different models.

**Benefits**:
- Optimized read/write models
- Independent scaling
- Better performance
- Simplified complex domains

**When to use**:
- Complex business logic
- Different read/write patterns
- High-performance requirements
- Event sourcing

**Code Example**:
```javascript
// Command Side (Write)
class OrderCommandHandler {
  async createOrder(command) {
    const order = new Order(command);
    await this.orderRepository.save(order);
    
    // Publish event
    await this.eventBus.publish('OrderCreated', {
      orderId: order.id,
      customerId: order.customerId,
      total: order.total
    });
  }
}

// Query Side (Read)
class OrderQueryHandler {
  async getOrdersByCustomer(customerId) {
    return this.readDatabase.orders.find({ customerId });
  }
  
  async getOrderStatistics(customerId) {
    return this.readDatabase.orderStats.findOne({ customerId });
  }
}
```

## Performance and Optimization

### Card 13
**Question**: How do you implement caching in Node.js applications?

**Answer**: 
Multiple caching strategies:
1. **In-Memory**: Simple object or Map
2. **Redis**: Distributed caching
3. **HTTP Caching**: Headers and CDN
4. **Application-level**: Middleware caching

**Code Example**:
```javascript
// Redis caching middleware
const cacheMiddleware = (keyGenerator, ttl = 300) => {
  return async (req, res, next) => {
    const key = keyGenerator(req);
    const cached = await redis.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // Override res.json to cache response
    const originalJson = res.json;
    res.json = function(data) {
      redis.setex(key, ttl, JSON.stringify(data));
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Usage
app.get('/api/users', 
  cacheMiddleware(req => `users:${JSON.stringify(req.query)}`, 600),
  getUsersController
);
```

### Card 14
**Question**: What are the key strategies for scaling Node.js applications?

**Answer**: 
1. **Horizontal Scaling**: Multiple instances with load balancer
2. **Vertical Scaling**: More CPU/memory per instance
3. **Clustering**: Use all CPU cores with cluster module
4. **Microservices**: Split into smaller services
5. **Caching**: Reduce database load
6. **Database Optimization**: Indexes, connection pooling

**Code Example**:
```javascript
// Clustering
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart worker
  });
} else {
  // Worker process
  const app = require('./app');
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
```

### Card 15
**Question**: How do you monitor Node.js application performance?

**Answer**: 
Key metrics and tools:
1. **Event Loop Lag**: `process.hrtime()`
2. **Memory Usage**: `process.memoryUsage()`
3. **CPU Usage**: `process.cpuUsage()`
4. **HTTP Metrics**: Response time, throughput
5. **Tools**: New Relic, DataDog, Prometheus

**Code Example**:
```javascript
// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  const start = process.hrtime.bigint();
  
  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1000000; // ms
    const memUsage = process.memoryUsage();
    
    console.log({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      memory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`
      }
    });
  });
  
  next();
};

// Event loop lag monitoring
setInterval(() => {
  const start = process.hrtime();
  setImmediate(() => {
    const lag = process.hrtime(start);
    const lagMs = lag[0] * 1000 + lag[1] * 1e-6;
    if (lagMs > 10) { // Alert if lag > 10ms
      console.warn(`Event loop lag: ${lagMs.toFixed(2)}ms`);
    }
  });
}, 5000);
```

## Security Best Practices

### Card 16
**Question**: What are the essential security practices for Node.js applications?

**Answer**: 
1. **Input Validation**: Validate all user inputs
2. **Authentication**: JWT, OAuth, session management
3. **Authorization**: Role-based access control
4. **HTTPS**: Encrypt data in transit
5. **Rate Limiting**: Prevent abuse
6. **Security Headers**: Helmet.js
7. **Dependency Scanning**: npm audit

**Code Example**:
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Input validation
const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
```

### Card 17
**Question**: How do you implement JWT authentication in Node.js?

**Answer**: 
JWT (JSON Web Token) provides stateless authentication with three parts: Header, Payload, Signature.

**Code Example**:
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

## Testing Strategies

### Card 18
**Question**: What are the different types of testing in Node.js applications?

**Answer**: 
1. **Unit Tests**: Test individual functions/modules
2. **Integration Tests**: Test component interactions
3. **End-to-End Tests**: Test complete user workflows
4. **API Tests**: Test HTTP endpoints
5. **Performance Tests**: Load and stress testing

**Code Example**:
```javascript
// Unit test with Jest
describe('UserService', () => {
  test('should create user with valid data', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    const user = await UserService.createUser(userData);
    
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John');
    expect(user.email).toBe('john@example.com');
  });
});

// Integration test
describe('User API', () => {
  test('POST /users should create user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John');
  });
});

// Mock external dependencies
jest.mock('../services/EmailService', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true)
}));
```

### Card 19
**Question**: How do you test asynchronous code in Node.js?

**Answer**: 
Use async/await, Promises, or done callbacks for testing async operations.

**Code Example**:
```javascript
// Testing with async/await
test('should fetch user data', async () => {
  const user = await fetchUser(1);
  expect(user).toHaveProperty('name');
});

// Testing Promise rejection
test('should handle user not found', async () => {
  await expect(fetchUser(999)).rejects.toThrow('User not found');
});

// Testing with done callback
test('should call callback with user data', (done) => {
  fetchUserCallback(1, (err, user) => {
    expect(err).toBeNull();
    expect(user).toHaveProperty('name');
    done();
  });
});

// Testing with setTimeout
test('should execute after delay', (done) => {
  setTimeout(() => {
    expect(true).toBe(true);
    done();
  }, 100);
});

// Mock timers
jest.useFakeTimers();
test('should execute scheduled task', () => {
  const callback = jest.fn();
  setTimeout(callback, 1000);
  
  jest.advanceTimersByTime(1000);
  expect(callback).toHaveBeenCalled();
});
```

### Card 20
**Question**: How do you implement database testing in Node.js?

**Answer**: 
Use test databases, transactions, or in-memory databases for isolated testing.

**Code Example**:
```javascript
// Test database setup
beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URL);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clean database before each test
  await User.deleteMany({});
  await Order.deleteMany({});
});

// Transaction-based testing
describe('Order Service', () => {
  test('should create order with transaction', async () => {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        const user = await User.create([{ name: 'John' }], { session });
        const order = await Order.create([{
          userId: user[0]._id,
          total: 100
        }], { session });
        
        expect(order[0]).toHaveProperty('_id');
      });
    } finally {
      await session.endSession();
    }
  });
});

// In-memory database (MongoDB Memory Server)
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```