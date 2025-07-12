---
title: "System Design Coding Challenges"
description: "Coding problems that combine system design concepts with practical implementation"
category: "coding-challenges"
difficulty: "intermediate-advanced"
tags: ["system-design", "coding", "distributed-systems", "api-design", "database-design"]
---

# System Design Coding Challenges

## API Design & Implementation

### 1. RESTful User Management API
Design and implement a complete user management API with authentication.

**Requirements:**
- User registration, login, profile management
- JWT-based authentication
- Rate limiting per user
- Input validation and error handling
- Password hashing and security

```javascript
// Expected API endpoints
POST /api/users/register
POST /api/users/login
GET /api/users/profile
PUT /api/users/profile
DELETE /api/users/:id
```

**Implementation Focus:**
- Express.js route structure
- Middleware for authentication
- Database schema design
- Error handling patterns

### 2. E-commerce Product Catalog API
Build a scalable product catalog with search and filtering capabilities.

**Requirements:**
- Product CRUD operations
- Category management
- Search with filters (price, category, rating)
- Pagination and sorting
- Inventory tracking

```javascript
// Sample implementation structure
class ProductService {
  async createProduct(productData) {
    // Validate input
    // Check inventory constraints
    // Save to database
    // Update search index
  }
  
  async searchProducts(filters, pagination) {
    // Build query with filters
    // Apply pagination
    // Return formatted results
  }
}
```

### 3. Real-time Chat API
Design a chat system with multiple rooms and real-time messaging.

**Requirements:**
- WebSocket connections
- Room-based messaging
- Message persistence
- User presence tracking
- Message history pagination

**Key Components:**
```javascript
// WebSocket handler
class ChatHandler {
  handleConnection(socket) {
    // User authentication
    // Room joining logic
    // Message broadcasting
  }
  
  handleMessage(socket, message) {
    // Validate message
    // Store in database
    // Broadcast to room members
  }
}
```

## Database Schema Design

### 4. Social Media Database Schema
Design a database schema for a social media platform.

**Requirements:**
- Users, posts, comments, likes
- Friend relationships
- Privacy settings
- Content moderation
- Activity feeds

```sql
-- Sample schema structure
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  privacy_level VARCHAR(20) DEFAULT 'public',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Design indexes for performance
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
```

### 5. E-learning Platform Schema
Create a comprehensive schema for an online learning platform.

**Requirements:**
- Courses, lessons, quizzes, assignments
- Student enrollment and progress tracking
- Instructor management
- Payment and subscription handling
- Certificate generation

**Implementation Considerations:**
- Normalization vs denormalization trade-offs
- Indexing strategies for performance
- Data archival policies
- Audit trail requirements

### 6. Multi-tenant SaaS Database Design
Design a database architecture for a multi-tenant SaaS application.

**Requirements:**
- Tenant isolation strategies
- Shared vs separate schemas
- Data security and compliance
- Scalability considerations
- Backup and recovery per tenant

```javascript
// Tenant-aware query builder
class TenantQueryBuilder {
  constructor(tenantId) {
    this.tenantId = tenantId;
  }
  
  buildQuery(baseQuery) {
    return `${baseQuery} WHERE tenant_id = '${this.tenantId}'`;
  }
}
```

## Distributed System Components

### 7. Rate Limiter Implementation
Build a distributed rate limiter using Redis.

**Requirements:**
- Multiple rate limiting algorithms (token bucket, sliding window)
- Distributed across multiple servers
- Different limits per user/IP/API key
- Graceful degradation when Redis is unavailable

```javascript
class DistributedRateLimiter {
  constructor(redisClient, algorithm = 'sliding-window') {
    this.redis = redisClient;
    this.algorithm = algorithm;
  }
  
  async isAllowed(key, limit, windowSize) {
    switch(this.algorithm) {
      case 'token-bucket':
        return this.tokenBucket(key, limit, windowSize);
      case 'sliding-window':
        return this.slidingWindow(key, limit, windowSize);
    }
  }
  
  async slidingWindow(key, limit, windowSize) {
    const now = Date.now();
    const pipeline = this.redis.pipeline();
    
    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, now - windowSize);
    // Count current requests
    pipeline.zcard(key);
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    // Set expiration
    pipeline.expire(key, Math.ceil(windowSize / 1000));
    
    const results = await pipeline.exec();
    const currentCount = results[1][1];
    
    return currentCount < limit;
  }
}
```

### 8. Load Balancer Implementation
Create a simple load balancer with health checking.

**Requirements:**
- Multiple load balancing algorithms (round-robin, least connections)
- Health check mechanism
- Automatic failover
- Connection pooling
- Metrics collection

```javascript
class LoadBalancer {
  constructor(servers, algorithm = 'round-robin') {
    this.servers = servers.map(server => ({
      ...server,
      healthy: true,
      connections: 0,
      lastHealthCheck: Date.now()
    }));
    this.algorithm = algorithm;
    this.currentIndex = 0;
  }
  
  async getServer() {
    const healthyServers = this.servers.filter(s => s.healthy);
    
    if (healthyServers.length === 0) {
      throw new Error('No healthy servers available');
    }
    
    switch(this.algorithm) {
      case 'round-robin':
        return this.roundRobin(healthyServers);
      case 'least-connections':
        return this.leastConnections(healthyServers);
    }
  }
  
  async healthCheck() {
    for (const server of this.servers) {
      try {
        const response = await fetch(`${server.url}/health`);
        server.healthy = response.ok;
      } catch (error) {
        server.healthy = false;
      }
      server.lastHealthCheck = Date.now();
    }
  }
}
```

### 9. Distributed Cache Implementation
Build a distributed caching system with consistent hashing.

**Requirements:**
- Consistent hashing for key distribution
- Replication for fault tolerance
- Cache invalidation strategies
- Memory management and eviction policies
- Monitoring and metrics

```javascript
class DistributedCache {
  constructor(nodes, replicationFactor = 2) {
    this.nodes = nodes;
    this.replicationFactor = replicationFactor;
    this.hashRing = this.buildHashRing();
  }
  
  buildHashRing() {
    const ring = new Map();
    const virtualNodes = 150; // Virtual nodes per physical node
    
    for (const node of this.nodes) {
      for (let i = 0; i < virtualNodes; i++) {
        const hash = this.hash(`${node.id}:${i}`);
        ring.set(hash, node);
      }
    }
    
    return new Map([...ring.entries()].sort());
  }
  
  async set(key, value, ttl = 3600) {
    const nodes = this.getNodesForKey(key);
    const promises = nodes.map(node => 
      this.setOnNode(node, key, value, ttl)
    );
    
    // Wait for majority write
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    if (successful < Math.ceil(this.replicationFactor / 2)) {
      throw new Error('Failed to achieve write quorum');
    }
  }
}
```

## Real-world System Problems

### 10. URL Shortener Service
Design and implement a URL shortening service like bit.ly.

**Requirements:**
- Unique short URL generation
- Custom aliases support
- Click tracking and analytics
- Expiration handling
- Rate limiting

```javascript
class URLShortener {
  constructor(database, cache) {
    this.db = database;
    this.cache = cache;
    this.baseUrl = 'https://short.ly/';
  }
  
  async shortenUrl(originalUrl, customAlias = null, userId = null) {
    // Validate URL
    if (!this.isValidUrl(originalUrl)) {
      throw new Error('Invalid URL');
    }
    
    // Check if URL already exists
    const existing = await this.findExistingUrl(originalUrl, userId);
    if (existing) return existing;
    
    // Generate short code
    const shortCode = customAlias || this.generateShortCode();
    
    // Check availability
    if (await this.isCodeTaken(shortCode)) {
      throw new Error('Short code already taken');
    }
    
    // Save to database
    const urlRecord = await this.saveUrl({
      originalUrl,
      shortCode,
      userId,
      createdAt: new Date(),
      clickCount: 0
    });
    
    return `${this.baseUrl}${shortCode}`;
  }
  
  generateShortCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
```

### 11. Event-Driven Notification System
Build a scalable notification system supporting multiple channels.

**Requirements:**
- Multiple notification types (email, SMS, push, in-app)
- Template management
- Delivery tracking and retries
- User preferences and opt-outs
- Rate limiting per channel

```javascript
class NotificationSystem {
  constructor() {
    this.channels = new Map();
    this.templates = new Map();
    this.queue = new EventEmitter();
  }
  
  registerChannel(name, handler) {
    this.channels.set(name, handler);
  }
  
  async sendNotification(notification) {
    const { userId, type, channels, data, priority = 'normal' } = notification;
    
    // Get user preferences
    const userPrefs = await this.getUserPreferences(userId);
    
    // Filter channels based on preferences
    const allowedChannels = channels.filter(channel => 
      userPrefs.channels.includes(channel)
    );
    
    // Process each channel
    for (const channel of allowedChannels) {
      const handler = this.channels.get(channel);
      if (handler) {
        await this.queueNotification({
          channel,
          handler,
          userId,
          type,
          data,
          priority,
          attempts: 0,
          maxAttempts: 3
        });
      }
    }
  }
  
  async queueNotification(notification) {
    // Add to priority queue
    this.queue.emit('notification', notification);
  }
}
```

### 12. File Upload and Processing Service
Create a service for handling large file uploads with processing.

**Requirements:**
- Chunked upload support
- Multiple storage backends (local, S3, GCS)
- File processing pipeline (resize, compress, scan)
- Progress tracking
- Cleanup of failed uploads

```javascript
class FileUploadService {
  constructor(storage, processor) {
    this.storage = storage;
    this.processor = processor;
    this.uploads = new Map(); // Track active uploads
  }
  
  async initiateUpload(fileInfo, userId) {
    const uploadId = this.generateUploadId();
    const upload = {
      id: uploadId,
      fileName: fileInfo.name,
      fileSize: fileInfo.size,
      mimeType: fileInfo.type,
      userId,
      chunks: [],
      status: 'initiated',
      createdAt: new Date()
    };
    
    this.uploads.set(uploadId, upload);
    
    // Calculate chunk info
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks
    const totalChunks = Math.ceil(fileInfo.size / chunkSize);
    
    return {
      uploadId,
      chunkSize,
      totalChunks,
      uploadUrl: `/api/upload/${uploadId}`
    };
  }
  
  async uploadChunk(uploadId, chunkIndex, chunkData) {
    const upload = this.uploads.get(uploadId);
    if (!upload) {
      throw new Error('Upload not found');
    }
    
    // Validate chunk
    if (upload.chunks[chunkIndex]) {
      throw new Error('Chunk already uploaded');
    }
    
    // Store chunk
    const chunkPath = await this.storage.saveChunk(
      uploadId, 
      chunkIndex, 
      chunkData
    );
    
    upload.chunks[chunkIndex] = {
      path: chunkPath,
      size: chunkData.length,
      uploadedAt: new Date()
    };
    
    // Check if upload is complete
    if (this.isUploadComplete(upload)) {
      await this.finalizeUpload(upload);
    }
    
    return {
      chunkIndex,
      uploaded: true,
      progress: this.calculateProgress(upload)
    };
  }
}
```

## Microservices Architecture

### 13. Service Discovery Implementation
Build a service discovery mechanism for microservices.

**Requirements:**
- Service registration and deregistration
- Health checking
- Load balancing integration
- Service metadata management
- Event-driven updates

```javascript
class ServiceRegistry {
  constructor(storage) {
    this.storage = storage; // Redis or etcd
    this.services = new Map();
    this.healthCheckInterval = 30000; // 30 seconds
  }
  
  async registerService(serviceInfo) {
    const { name, version, host, port, healthCheckUrl, metadata } = serviceInfo;
    
    const serviceId = `${name}-${version}-${host}-${port}`;
    const service = {
      id: serviceId,
      name,
      version,
      host,
      port,
      healthCheckUrl,
      metadata,
      status: 'healthy',
      lastSeen: Date.now(),
      registeredAt: Date.now()
    };
    
    // Store in registry
    await this.storage.hset('services', serviceId, JSON.stringify(service));
    this.services.set(serviceId, service);
    
    // Start health checking
    this.startHealthCheck(service);
    
    return serviceId;
  }
  
  async discoverServices(serviceName, version = null) {
    const allServices = await this.getAllServices();
    
    return allServices.filter(service => {
      if (service.name !== serviceName) return false;
      if (version && service.version !== version) return false;
      if (service.status !== 'healthy') return false;
      return true;
    });
  }
  
  async startHealthCheck(service) {
    const checkHealth = async () => {
      try {
        const response = await fetch(service.healthCheckUrl, {
          timeout: 5000
        });
        
        if (response.ok) {
          service.status = 'healthy';
          service.lastSeen = Date.now();
        } else {
          service.status = 'unhealthy';
        }
      } catch (error) {
        service.status = 'unhealthy';
      }
      
      // Update in storage
      await this.storage.hset('services', service.id, JSON.stringify(service));
    };
    
    // Initial check
    await checkHealth();
    
    // Schedule periodic checks
    setInterval(checkHealth, this.healthCheckInterval);
  }
}
```

### 14. API Gateway Implementation
Create a basic API gateway with routing and middleware support.

**Requirements:**
- Request routing based on paths
- Authentication and authorization
- Rate limiting
- Request/response transformation
- Circuit breaker pattern
- Logging and monitoring

```javascript
class APIGateway {
  constructor() {
    this.routes = new Map();
    this.middleware = [];
    this.circuitBreakers = new Map();
  }
  
  addRoute(pattern, target, options = {}) {
    this.routes.set(pattern, {
      target,
      options,
      middleware: options.middleware || []
    });
  }
  
  use(middleware) {
    this.middleware.push(middleware);
  }
  
  async handleRequest(req, res) {
    try {
      // Apply global middleware
      for (const middleware of this.middleware) {
        await middleware(req, res);
      }
      
      // Find matching route
      const route = this.findRoute(req.path);
      if (!route) {
        return res.status(404).json({ error: 'Route not found' });
      }
      
      // Apply route-specific middleware
      for (const middleware of route.middleware) {
        await middleware(req, res);
      }
      
      // Check circuit breaker
      const circuitBreaker = this.getCircuitBreaker(route.target);
      if (circuitBreaker.isOpen()) {
        return res.status(503).json({ error: 'Service unavailable' });
      }
      
      // Forward request
      const response = await this.forwardRequest(req, route.target);
      
      // Record success
      circuitBreaker.recordSuccess();
      
      // Send response
      res.status(response.status).json(response.data);
      
    } catch (error) {
      // Record failure
      const route = this.findRoute(req.path);
      if (route) {
        const circuitBreaker = this.getCircuitBreaker(route.target);
        circuitBreaker.recordFailure();
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```

## Data Processing & Analytics

### 15. Real-time Analytics Pipeline
Build a system for processing and analyzing real-time events.

**Requirements:**
- Event ingestion from multiple sources
- Stream processing with windowing
- Real-time aggregations
- Alert generation
- Data persistence for historical analysis

```javascript
class AnalyticsPipeline {
  constructor(eventStore, alertManager) {
    this.eventStore = eventStore;
    this.alertManager = alertManager;
    this.processors = new Map();
    this.windows = new Map();
  }
  
  addProcessor(name, processor) {
    this.processors.set(name, processor);
  }
  
  async processEvent(event) {
    // Validate event
    if (!this.isValidEvent(event)) {
      throw new Error('Invalid event format');
    }
    
    // Store raw event
    await this.eventStore.store(event);
    
    // Process through all processors
    for (const [name, processor] of this.processors) {
      try {
        await processor.process(event);
      } catch (error) {
        console.error(`Processor ${name} failed:`, error);
      }
    }
    
    // Update time windows
    await this.updateWindows(event);
    
    // Check for alerts
    await this.checkAlerts(event);
  }
  
  async updateWindows(event) {
    const timestamp = event.timestamp;
    const windowSizes = [60, 300, 3600]; // 1min, 5min, 1hour
    
    for (const windowSize of windowSizes) {
      const windowKey = this.getWindowKey(event.type, windowSize, timestamp);
      
      if (!this.windows.has(windowKey)) {
        this.windows.set(windowKey, {
          count: 0,
          sum: 0,
          min: Infinity,
          max: -Infinity,
          events: []
        });
      }
      
      const window = this.windows.get(windowKey);
      window.count++;
      
      if (event.value !== undefined) {
        window.sum += event.value;
        window.min = Math.min(window.min, event.value);
        window.max = Math.max(window.max, event.value);
      }
      
      window.events.push(event);
      
      // Clean old events
      const cutoff = timestamp - (windowSize * 1000);
      window.events = window.events.filter(e => e.timestamp > cutoff);
    }
  }
}
```

### 16. Data Synchronization Service
Create a service for synchronizing data between multiple databases.

**Requirements:**
- Change data capture (CDC)
- Conflict resolution strategies
- Retry mechanisms for failed syncs
- Data transformation during sync
- Monitoring and alerting

```javascript
class DataSyncService {
  constructor(sources, targets, conflictResolver) {
    this.sources = sources;
    this.targets = targets;
    this.conflictResolver = conflictResolver;
    this.syncLog = new Map();
  }
  
  async startSync() {
    for (const source of this.sources) {
      // Set up change stream
      const changeStream = await source.watchChanges();
      
      changeStream.on('change', async (change) => {
        await this.processChange(source, change);
      });
    }
  }
  
  async processChange(source, change) {
    const { operationType, documentKey, fullDocument } = change;
    
    try {
      // Transform data if needed
      const transformedData = await this.transformData(
        source.name, 
        fullDocument
      );
      
      // Apply to all targets
      for (const target of this.targets) {
        if (target.name === source.name) continue; // Skip self
        
        await this.applyChange(target, {
          operationType,
          documentKey,
          data: transformedData,
          sourceTimestamp: change.clusterTime
        });
      }
      
      // Log successful sync
      this.logSync(source.name, documentKey, 'success');
      
    } catch (error) {
      // Log failed sync
      this.logSync(source.name, documentKey, 'failed', error);
      
      // Schedule retry
      await this.scheduleRetry(source, change);
    }
  }
  
  async applyChange(target, change) {
    const { operationType, documentKey, data, sourceTimestamp } = change;
    
    // Check for conflicts
    const existingDoc = await target.findById(documentKey._id);
    
    if (existingDoc && this.hasConflict(existingDoc, data, sourceTimestamp)) {
      // Resolve conflict
      const resolvedData = await this.conflictResolver.resolve(
        existingDoc, 
        data, 
        sourceTimestamp
      );
      
      await target.update(documentKey._id, resolvedData);
    } else {
      // Apply change directly
      switch (operationType) {
        case 'insert':
          await target.insert(data);
          break;
        case 'update':
          await target.update(documentKey._id, data);
          break;
        case 'delete':
          await target.delete(documentKey._id);
          break;
      }
    }
  }
}
```

## Security & Authentication

### 17. OAuth 2.0 Authorization Server
Implement a complete OAuth 2.0 authorization server.

**Requirements:**
- Authorization code flow
- Client credentials flow
- Token refresh mechanism
- Scope-based access control
- PKCE support for mobile apps

```javascript
class OAuth2Server {
  constructor(clientStore, tokenStore, userStore) {
    this.clients = clientStore;
    this.tokens = tokenStore;
    this.users = userStore;
  }
  
  async authorize(req, res) {
    const {
      client_id,
      redirect_uri,
      response_type,
      scope,
      state,
      code_challenge,
      code_challenge_method
    } = req.query;
    
    // Validate client
    const client = await this.clients.findById(client_id);
    if (!client) {
      return res.status(400).json({ error: 'invalid_client' });
    }
    
    // Validate redirect URI
    if (!client.redirectUris.includes(redirect_uri)) {
      return res.status(400).json({ error: 'invalid_redirect_uri' });
    }
    
    // Generate authorization code
    const authCode = this.generateAuthCode();
    
    // Store authorization code with PKCE challenge
    await this.tokens.storeAuthCode(authCode, {
      clientId: client_id,
      redirectUri: redirect_uri,
      scope,
      codeChallenge: code_challenge,
      codeChallengeMethod: code_challenge_method,
      expiresAt: Date.now() + 600000 // 10 minutes
    });
    
    // Redirect with authorization code
    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.set('code', authCode);
    if (state) redirectUrl.searchParams.set('state', state);
    
    res.redirect(redirectUrl.toString());
  }
  
  async token(req, res) {
    const {
      grant_type,
      code,
      redirect_uri,
      client_id,
      client_secret,
      code_verifier
    } = req.body;
    
    if (grant_type === 'authorization_code') {
      return this.handleAuthorizationCodeGrant(req, res);
    } else if (grant_type === 'client_credentials') {
      return this.handleClientCredentialsGrant(req, res);
    } else if (grant_type === 'refresh_token') {
      return this.handleRefreshTokenGrant(req, res);
    }
    
    res.status(400).json({ error: 'unsupported_grant_type' });
  }
}
```

### 18. Multi-Factor Authentication System
Build a comprehensive MFA system supporting multiple factors.

**Requirements:**
- TOTP (Time-based One-Time Password)
- SMS-based verification
- Email-based verification
- Backup codes
- Device trust management

```javascript
class MFASystem {
  constructor(userStore, smsProvider, emailProvider) {
    this.users = userStore;
    this.sms = smsProvider;
    this.email = emailProvider;
  }
  
  async setupTOTP(userId) {
    const user = await this.users.findById(userId);
    if (!user) throw new Error('User not found');
    
    // Generate secret
    const secret = this.generateTOTPSecret();
    
    // Generate QR code data
    const qrData = this.generateQRCode(user.email, secret);
    
    // Store secret (not yet activated)
    await this.users.updateMFASettings(userId, {
      totpSecret: secret,
      totpActivated: false
    });
    
    return {
      secret,
      qrCode: qrData,
      backupCodes: this.generateBackupCodes()
    };
  }
  
  async verifyTOTP(userId, token) {
    const user = await this.users.findById(userId);
    const secret = user.mfaSettings?.totpSecret;
    
    if (!secret) {
      throw new Error('TOTP not set up');
    }
    
    // Verify token with time window tolerance
    const isValid = this.verifyTOTPToken(secret, token);
    
    if (isValid && !user.mfaSettings.totpActivated) {
      // Activate TOTP on first successful verification
      await this.users.updateMFASettings(userId, {
        totpActivated: true
      });
    }
    
    return isValid;
  }
  
  async sendSMSCode(userId, phoneNumber) {
    const code = this.generateSMSCode();
    const expiresAt = Date.now() + 300000; // 5 minutes
    
    // Store code
    await this.users.updateMFASettings(userId, {
      smsCode: code,
      smsCodeExpiresAt: expiresAt,
      smsPhoneNumber: phoneNumber
    });
    
    // Send SMS
    await this.sms.send(phoneNumber, `Your verification code is: ${code}`);
    
    return { sent: true, expiresIn: 300 };
  }
  
  async verifySMSCode(userId, code) {
    const user = await this.users.findById(userId);
    const storedCode = user.mfaSettings?.smsCode;
    const expiresAt = user.mfaSettings?.smsCodeExpiresAt;
    
    if (!storedCode || Date.now() > expiresAt) {
      return false;
    }
    
    const isValid = storedCode === code;
    
    if (isValid) {
      // Clear used code
      await this.users.updateMFASettings(userId, {
        smsCode: null,
        smsCodeExpiresAt: null
      });
    }
    
    return isValid;
  }
}
```

## Performance & Monitoring

### 19. Application Performance Monitoring (APM)
Create a basic APM system for tracking application performance.

**Requirements:**
- Request tracing
- Performance metrics collection
- Error tracking and aggregation
- Custom metrics support
- Dashboard data aggregation

```javascript
class APMSystem {
  constructor(storage, alertManager) {
    this.storage = storage;
    this.alerts = alertManager;
    this.traces = new Map();
    this.metrics = new Map();
  }
  
  startTrace(traceId, operation) {
    const trace = {
      id: traceId,
      operation,
      startTime: Date.now(),
      spans: [],
      metadata: {}
    };
    
    this.traces.set(traceId, trace);
    return trace;
  }
  
  addSpan(traceId, spanName, startTime = Date.now()) {
    const trace = this.traces.get(traceId);
    if (!trace) return null;
    
    const span = {
      name: spanName,
      startTime,
      endTime: null,
      duration: null,
      tags: {},
      logs: []
    };
    
    trace.spans.push(span);
    return span;
  }
  
  finishSpan(traceId, spanName, endTime = Date.now()) {
    const trace = this.traces.get(traceId);
    if (!trace) return;
    
    const span = trace.spans.find(s => s.name === spanName && !s.endTime);
    if (span) {
      span.endTime = endTime;
      span.duration = endTime - span.startTime;
    }
  }
  
  async finishTrace(traceId, endTime = Date.now()) {
    const trace = this.traces.get(traceId);
    if (!trace) return;
    
    trace.endTime = endTime;
    trace.duration = endTime - trace.startTime;
    
    // Store trace
    await this.storage.storeTrace(trace);
    
    // Update metrics
    await this.updateMetrics(trace);
    
    // Check for alerts
    await this.checkPerformanceAlerts(trace);
    
    // Clean up
    this.traces.delete(traceId);
  }
  
  async recordMetric(name, value, tags = {}) {
    const timestamp = Date.now();
    const metric = {
      name,
      value,
      tags,
      timestamp
    };
    
    // Store metric
    await this.storage.storeMetric(metric);
    
    // Update aggregations
    await this.updateAggregations(metric);
  }
  
  async getMetrics(name, startTime, endTime, aggregation = 'avg') {
    return this.storage.getMetrics(name, startTime, endTime, aggregation);
  }
}
```

### 20. Database Connection Pool Manager
Implement a sophisticated database connection pool with monitoring.

**Requirements:**
- Connection lifecycle management
- Pool size optimization
- Connection health checking
- Metrics and monitoring
- Graceful shutdown handling

```javascript
class ConnectionPool {
  constructor(config) {
    this.config = {
      min: 5,
      max: 20,
      acquireTimeout: 30000,
      idleTimeout: 300000,
      ...config
    };
    
    this.connections = [];
    this.available = [];
    this.pending = [];
    this.metrics = {
      created: 0,
      destroyed: 0,
      acquired: 0,
      released: 0,
      timeouts: 0
    };
  }
  
  async initialize() {
    // Create minimum connections
    for (let i = 0; i < this.config.min; i++) {
      const connection = await this.createConnection();
      this.connections.push(connection);
      this.available.push(connection);
    }
    
    // Start maintenance tasks
    this.startMaintenanceTasks();
  }
  
  async acquire() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.metrics.timeouts++;
        reject(new Error('Connection acquire timeout'));
      }, this.config.acquireTimeout);
      
      const request = { resolve, reject, timeout };
      
      // Try to get available connection
      if (this.available.length > 0) {
        const connection = this.available.pop();
        clearTimeout(timeout);
        this.metrics.acquired++;
        resolve(connection);
        return;
      }
      
      // Try to create new connection
      if (this.connections.length < this.config.max) {
        this.createConnection()
          .then(connection => {
            this.connections.push(connection);
            clearTimeout(timeout);
            this.metrics.created++;
            this.metrics.acquired++;
            resolve(connection);
          })
          .catch(error => {
            clearTimeout(timeout);
            reject(error);
          });
        return;
      }
      
      // Queue the request
      this.pending.push(request);
    });
  }
  
  release(connection) {
    // Check if connection is healthy
    if (!this.isConnectionHealthy(connection)) {
      this.destroyConnection(connection);
      return;
    }
    
    // Reset connection state
    this.resetConnection(connection);
    
    // Serve pending request or return to pool
    if (this.pending.length > 0) {
      const request = this.pending.shift();
      clearTimeout(request.timeout);
      this.metrics.acquired++;
      request.resolve(connection);
    } else {
      connection.lastUsed = Date.now();
      this.available.push(connection);
    }
    
    this.metrics.released++;
  }
  
  startMaintenanceTasks() {
    // Clean idle connections
    setInterval(() => {
      this.cleanIdleConnections();
    }, 60000); // Every minute
    
    // Health check
    setInterval(() => {
      this.healthCheck();
    }, 30000); // Every 30 seconds
  }
}
```

## Additional Challenges

### 21. Event Sourcing Implementation
Build an event sourcing system with snapshots and replay capabilities.

### 22. CQRS (Command Query Responsibility Segregation)
Implement CQRS pattern with separate read and write models.

### 23. Saga Pattern for Distributed Transactions
Create a saga orchestrator for managing distributed transactions.

### 24. Content Delivery Network (CDN) Edge Server
Build a basic CDN edge server with caching and origin failover.

### 25. Message Queue with Dead Letter Queue
Implement a message queue system with retry logic and dead letter handling.

### 26. Distributed Lock Manager
Create a distributed locking mechanism using Redis or etcd.

### 27. Time Series Database
Build a simple time series database optimized for metrics storage.

### 28. GraphQL Federation Gateway
Implement a GraphQL federation gateway that combines multiple schemas.

### 29. Webhook Delivery System
Create a reliable webhook delivery system with retries and failure handling.

### 30. Multi-Region Data Replication
Design a system for replicating data across multiple geographic regions.

### 31. Container Orchestration Scheduler
Build a basic container scheduler similar to Kubernetes.

### 32. Distributed Configuration Management
Create a system for managing configuration across multiple services.

### 33. Real-time Collaboration Engine
Build a real-time collaboration system like Google Docs.

### 34. Blockchain-based Audit Log
Implement an immutable audit log using blockchain concepts.

### 35. Machine Learning Model Serving
Create a system for serving ML models with A/B testing capabilities.

## Implementation Guidelines

### Code Quality Standards
- Use TypeScript for type safety
- Implement comprehensive error handling
- Add logging and monitoring
- Write unit and integration tests
- Follow SOLID principles
- Use design patterns appropriately

### Performance Considerations
- Implement caching strategies
- Use connection pooling
- Add rate limiting
- Optimize database queries
- Consider memory usage
- Plan for horizontal scaling

### Security Best Practices
- Input validation and sanitization
- Authentication and authorization
- Secure communication (HTTPS/TLS)
- SQL injection prevention
- XSS protection
- Rate limiting and DDoS protection

### Testing Strategies
- Unit tests for business logic
- Integration tests for APIs
- Load testing for performance
- Security testing for vulnerabilities
- End-to-end testing for user flows
- Chaos engineering for resilience

Each challenge should be approached with production-ready code quality, including proper error handling, logging, monitoring, and testing strategies.