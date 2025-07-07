---
title: "System Design - Revision Summary"
category: "revision"
difficulty: "advanced"
estimatedReadTime: 15
tags: ["system-design", "scalability", "microservices", "load-balancing", "caching", "distributed-systems", "revision"]
lastUpdated: "2024-01-15"
printFriendly: true
---

# System Design - Revision Summary

## Scalability Patterns

### Key Concepts
- **Horizontal Scaling**: Add more servers (scale out)
- **Vertical Scaling**: Add more power to existing servers (scale up)
- **Load Distribution**: Spread requests across multiple instances
- **Stateless Design**: No server-side session state

### Load Balancing Strategies
```nginx
# Nginx Load Balancer Configuration
upstream backend {
    least_conn;  # or ip_hash, round_robin
    server backend1.example.com:8080 weight=3;
    server backend2.example.com:8080 weight=2;
    server backend3.example.com:8080 backup;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Auto-Scaling Pattern
```javascript
// AWS Auto Scaling Logic
const autoScaleConfig = {
  minInstances: 2,
  maxInstances: 10,
  targetCPUUtilization: 70,
  scaleUpCooldown: 300,   // 5 minutes
  scaleDownCooldown: 600, // 10 minutes
  
  scaleUp: (currentInstances, cpuUtilization) => {
    if (cpuUtilization > 80 && currentInstances < maxInstances) {
      return Math.min(currentInstances * 2, maxInstances);
    }
    return currentInstances;
  }
};
```

## Microservices Architecture

### Key Principles
- **Single Responsibility**: One service, one business capability
- **Decentralized**: Independent deployment and scaling
- **Fault Isolation**: Failure in one service doesn't cascade
- **Technology Diversity**: Different services can use different tech stacks

### Service Communication Patterns
```javascript
// Synchronous Communication (REST API)
const userService = {
  async getUser(userId) {
    const response = await fetch(`http://user-service/users/${userId}`);
    return response.json();
  }
};

// Asynchronous Communication (Message Queue)
const eventBus = require('./eventBus');

// Publisher
const orderService = {
  async createOrder(orderData) {
    const order = await Order.create(orderData);
    eventBus.publish('order.created', { orderId: order.id, userId: order.userId });
    return order;
  }
};

// Subscriber
eventBus.subscribe('order.created', async (event) => {
  await emailService.sendOrderConfirmation(event.userId, event.orderId);
  await inventoryService.updateStock(event.orderId);
});
```

### Circuit Breaker Pattern
```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

## Caching Strategies

### Cache Patterns
- **Cache-Aside**: Application manages cache
- **Write-Through**: Write to cache and database simultaneously
- **Write-Behind**: Write to cache first, database later
- **Refresh-Ahead**: Proactively refresh cache before expiration

### Multi-Level Caching
```javascript
// L1: Application Cache (in-memory)
const NodeCache = require('node-cache');
const appCache = new NodeCache({ stdTTL: 300 }); // 5 minutes

// L2: Distributed Cache (Redis)
const redis = require('redis').createClient();

// L3: CDN Cache (CloudFront, CloudFlare)
const getCachedData = async (key) => {
  // L1 Cache
  let data = appCache.get(key);
  if (data) return data;

  // L2 Cache
  data = await redis.get(key);
  if (data) {
    appCache.set(key, JSON.parse(data));
    return JSON.parse(data);
  }

  // Database
  data = await database.find(key);
  if (data) {
    appCache.set(key, data);
    await redis.setex(key, 3600, JSON.stringify(data));
  }
  
  return data;
};
```

### Cache Invalidation Strategies
```javascript
// Time-based Expiration
await redis.setex('user:123', 3600, userData); // 1 hour TTL

// Event-based Invalidation
eventBus.subscribe('user.updated', async (event) => {
  await redis.del(`user:${event.userId}`);
  appCache.del(`user:${event.userId}`);
});

// Cache Tags for Group Invalidation
const cacheWithTags = {
  async set(key, value, tags = []) {
    await redis.setex(key, 3600, JSON.stringify(value));
    for (const tag of tags) {
      await redis.sadd(`tag:${tag}`, key);
    }
  },
  
  async invalidateTag(tag) {
    const keys = await redis.smembers(`tag:${tag}`);
    if (keys.length > 0) {
      await redis.del(...keys);
      await redis.del(`tag:${tag}`);
    }
  }
};
```

## Distributed Systems

### CAP Theorem
- **Consistency**: All nodes see the same data simultaneously
- **Availability**: System remains operational
- **Partition Tolerance**: System continues despite network failures
- **Trade-off**: Can only guarantee 2 out of 3

### Consensus Algorithms
```javascript
// Raft Consensus Implementation (Simplified)
class RaftNode {
  constructor(id, peers) {
    this.id = id;
    this.peers = peers;
    this.state = 'FOLLOWER'; // FOLLOWER, CANDIDATE, LEADER
    this.currentTerm = 0;
    this.votedFor = null;
    this.log = [];
  }

  startElection() {
    this.state = 'CANDIDATE';
    this.currentTerm++;
    this.votedFor = this.id;
    
    const votes = 1; // Vote for self
    this.peers.forEach(peer => {
      peer.requestVote(this.currentTerm, this.id)
        .then(granted => {
          if (granted) votes++;
          if (votes > this.peers.length / 2) {
            this.becomeLeader();
          }
        });
    });
  }

  becomeLeader() {
    this.state = 'LEADER';
    this.sendHeartbeats();
  }
}
```

### Event Sourcing Pattern
```javascript
// Event Store
class EventStore {
  constructor() {
    this.events = [];
  }

  append(streamId, events) {
    events.forEach(event => {
      this.events.push({
        streamId,
        eventId: generateId(),
        eventType: event.type,
        data: event.data,
        timestamp: new Date()
      });
    });
  }

  getEvents(streamId) {
    return this.events.filter(e => e.streamId === streamId);
  }
}

// Aggregate Root
class BankAccount {
  constructor(accountId) {
    this.accountId = accountId;
    this.balance = 0;
    this.version = 0;
  }

  static fromHistory(events) {
    const account = new BankAccount(events[0].streamId);
    events.forEach(event => account.apply(event));
    return account;
  }

  apply(event) {
    switch (event.eventType) {
      case 'AccountOpened':
        this.balance = event.data.initialBalance;
        break;
      case 'MoneyDeposited':
        this.balance += event.data.amount;
        break;
      case 'MoneyWithdrawn':
        this.balance -= event.data.amount;
        break;
    }
    this.version++;
  }
}
```

## Quick Reference Cheat Sheet

| Pattern | Use Case | Pros | Cons |
|---------|----------|------|------|
| Load Balancer | Distribute traffic | High availability, scalability | Single point of failure |
| Circuit Breaker | Prevent cascade failures | Fault tolerance | Complexity |
| Cache-Aside | Read-heavy workloads | Simple, flexible | Cache inconsistency |
| Event Sourcing | Audit trail, replay | Complete history | Storage overhead |
| CQRS | Read/write separation | Optimized queries | Complexity |
| Saga Pattern | Distributed transactions | Fault tolerance | Complex coordination |

## System Design Interview Framework

### 1. Requirements Clarification
- Functional requirements (what the system does)
- Non-functional requirements (scale, performance, availability)
- Constraints and assumptions

### 2. Capacity Estimation
```
Daily Active Users: 10M
Requests per second: 10M / (24 * 3600) = ~116 RPS
Peak traffic (3x): ~350 RPS
Storage: 100 bytes per user * 10M = 1GB
Bandwidth: 350 RPS * 1KB = 350 KB/s
```

### 3. High-Level Design
```
[Client] → [Load Balancer] → [API Gateway] → [Microservices]
                                          ↓
[Cache Layer] ← [Database] ← [Message Queue]
```

### 4. Detailed Design
- Database schema
- API design
- Caching strategy
- Monitoring and logging

## Common Interview Questions

1. **Design a URL Shortener**: Like bit.ly or tinyurl
2. **Design a Chat System**: Real-time messaging with presence
3. **Design a News Feed**: Social media timeline
4. **Design a Video Streaming Service**: Like YouTube or Netflix
5. **Design a Ride-Sharing Service**: Like Uber or Lyft
6. **Design a Search Engine**: Web crawling and indexing
7. **Design a Distributed Cache**: Like Redis or Memcached
8. **Design a Rate Limiter**: API throttling system

## Performance Benchmarks

- **Response Time**: < 200ms for API calls
- **Throughput**: Handle 10K+ requests per second
- **Availability**: 99.9% uptime (8.76 hours downtime/year)
- **Scalability**: Linear scaling with added resources
- **Cache Hit Ratio**: > 90% for frequently accessed data
- **Database Connections**: Pool size = CPU cores * 2-4