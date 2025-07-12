---
title: "NoSQL Database Interview Questions"
description: "Comprehensive MongoDB and Redis interview questions covering aggregation pipelines, caching strategies, and real-world scenarios"
category: "databases"
difficulty: "intermediate-advanced"
topics: ["mongodb", "redis", "nosql", "caching", "aggregation", "sharding"]
---

# NoSQL Database Interview Questions

## MongoDB Questions

### 1. Aggregation Pipeline Fundamentals

**Q: Explain the MongoDB aggregation pipeline and its key stages.**

**A:** The aggregation pipeline is a framework for data aggregation modeled on the concept of data processing pipelines. Documents enter a multi-stage pipeline that transforms them into aggregated results.

Key stages:
- `$match`: Filters documents (similar to WHERE clause)
- `$group`: Groups documents by specified fields
- `$project`: Reshapes documents, adds/removes fields
- `$sort`: Sorts documents
- `$limit`/`$skip`: Pagination
- `$lookup`: Left outer join with another collection
- `$unwind`: Deconstructs array fields
- `$addFields`: Adds new fields to documents

```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", totalAmount: { $sum: "$amount" } } },
  { $sort: { totalAmount: -1 } },
  { $limit: 10 }
])
```

### 2. Complex Aggregation Scenario - E-commerce Analytics

**Q: Design an aggregation pipeline for an e-commerce platform to find the top 5 customers by total purchase amount in the last 30 days, including their average order value.**

**A:**
```javascript
db.orders.aggregate([
  {
    $match: {
      orderDate: { 
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
      },
      status: "completed"
    }
  },
  {
    $group: {
      _id: "$customerId",
      totalAmount: { $sum: "$amount" },
      orderCount: { $sum: 1 },
      avgOrderValue: { $avg: "$amount" }
    }
  },
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "_id",
      as: "customerInfo"
    }
  },
  {
    $project: {
      customerId: "$_id",
      customerName: { $arrayElemAt: ["$customerInfo.name", 0] },
      totalAmount: 1,
      orderCount: 1,
      avgOrderValue: { $round: ["$avgOrderValue", 2] }
    }
  },
  { $sort: { totalAmount: -1 } },
  { $limit: 5 }
])
```

### 3. Gaming Industry Scenario - Player Analytics

**Q: For a gaming platform, create an aggregation to find players who have achieved specific milestones and their progression statistics.**

**A:**
```javascript
db.playerStats.aggregate([
  {
    $match: {
      level: { $gte: 50 },
      lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }
  },
  {
    $lookup: {
      from: "achievements",
      localField: "playerId",
      foreignField: "playerId",
      as: "achievements"
    }
  },
  {
    $addFields: {
      achievementCount: { $size: "$achievements" },
      rareAchievements: {
        $size: {
          $filter: {
            input: "$achievements",
            cond: { $eq: ["$$this.rarity", "legendary"] }
          }
        }
      }
    }
  },
  {
    $group: {
      _id: "$guild",
      avgLevel: { $avg: "$level" },
      totalPlayers: { $sum: 1 },
      topPlayer: { $max: "$level" },
      totalAchievements: { $sum: "$achievementCount" }
    }
  },
  { $sort: { avgLevel: -1 } }
])
```

### 4. Streaming Platform Analytics

**Q: Design an aggregation for a streaming platform to analyze viewing patterns and content performance.**

**A:**
```javascript
db.viewingSessions.aggregate([
  {
    $match: {
      startTime: { 
        $gte: new Date("2024-01-01"),
        $lt: new Date("2024-02-01")
      }
    }
  },
  {
    $addFields: {
      watchDuration: { $subtract: ["$endTime", "$startTime"] },
      completionRate: {
        $divide: [
          { $subtract: ["$endTime", "$startTime"] },
          "$contentDuration"
        ]
      }
    }
  },
  {
    $group: {
      _id: {
        contentId: "$contentId",
        genre: "$contentGenre"
      },
      totalViews: { $sum: 1 },
      avgWatchTime: { $avg: "$watchDuration" },
      avgCompletionRate: { $avg: "$completionRate" },
      uniqueViewers: { $addToSet: "$userId" }
    }
  },
  {
    $addFields: {
      uniqueViewerCount: { $size: "$uniqueViewers" }
    }
  },
  {
    $group: {
      _id: "$_id.genre",
      contentCount: { $sum: 1 },
      totalViews: { $sum: "$totalViews" },
      avgEngagement: { $avg: "$avgCompletionRate" },
      topContent: {
        $max: {
          contentId: "$_id.contentId",
          views: "$totalViews"
        }
      }
    }
  }
])
```

### 5. MongoDB Sharding Strategy

**Q: Explain MongoDB sharding and how you would design a sharding strategy for a social media platform.**

**A:** MongoDB sharding distributes data across multiple machines to support horizontal scaling.

**Key Components:**
- **Shard**: Each shard contains a subset of data
- **Config Servers**: Store metadata and configuration
- **Query Routers (mongos)**: Route queries to appropriate shards

**Sharding Strategy for Social Media:**

```javascript
// 1. Choose shard key - user_id for user data
sh.shardCollection("social.users", { "user_id": 1 })

// 2. For posts - compound shard key
sh.shardCollection("social.posts", { "user_id": 1, "created_at": 1 })

// 3. For messages - recipient-based sharding
sh.shardCollection("social.messages", { "recipient_id": 1, "timestamp": 1 })
```

**Considerations:**
- **Cardinality**: High number of unique values
- **Write Distribution**: Avoid hotspots
- **Query Patterns**: Align with common queries
- **Monotonic Keys**: Avoid for write-heavy collections

### 6. MongoDB Indexing Strategies

**Q: Design indexing strategies for a high-traffic e-commerce application.**

**A:**
```javascript
// Compound index for product search
db.products.createIndex({ 
  "category": 1, 
  "price": 1, 
  "rating": -1 
})

// Text index for search functionality
db.products.createIndex({ 
  "name": "text", 
  "description": "text" 
})

// Sparse index for optional fields
db.products.createIndex({ 
  "discountCode": 1 
}, { sparse: true })

// TTL index for temporary data
db.sessions.createIndex({ 
  "createdAt": 1 
}, { expireAfterSeconds: 3600 })

// Partial index for specific conditions
db.orders.createIndex(
  { "customerId": 1, "status": 1 },
  { partialFilterExpression: { "status": "pending" } }
)
```

## Redis Questions

### 7. Redis Caching Strategies

**Q: Compare different Redis caching patterns and when to use each.**

**A:**

**1. Cache-Aside (Lazy Loading):**
```javascript
async function getUser(userId) {
  // Try cache first
  let user = await redis.get(`user:${userId}`);
  if (user) {
    return JSON.parse(user);
  }
  
  // Cache miss - fetch from database
  user = await db.users.findById(userId);
  
  // Store in cache
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  return user;
}
```

**2. Write-Through:**
```javascript
async function updateUser(userId, userData) {
  // Update database
  const user = await db.users.update(userId, userData);
  
  // Update cache immediately
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
  return user;
}
```

**3. Write-Behind (Write-Back):**
```javascript
async function updateUserAsync(userId, userData) {
  // Update cache immediately
  await redis.setex(`user:${userId}`, 3600, JSON.stringify(userData));
  
  // Queue database update
  await queue.add('updateUser', { userId, userData });
}
```

### 8. Redis Data Structures for Gaming

**Q: Design Redis data structures for a real-time multiplayer game leaderboard system.**

**A:**
```javascript
// Global leaderboard using Sorted Sets
await redis.zadd('global:leaderboard', score, playerId);

// Get top 10 players
const topPlayers = await redis.zrevrange('global:leaderboard', 0, 9, 'WITHSCORES');

// Get player rank
const rank = await redis.zrevrank('global:leaderboard', playerId);

// Weekly leaderboards with expiration
const weekKey = `weekly:leaderboard:${getWeekNumber()}`;
await redis.zadd(weekKey, score, playerId);
await redis.expire(weekKey, 604800); // 7 days

// Player statistics using Hashes
await redis.hmset(`player:${playerId}:stats`, {
  'kills': 150,
  'deaths': 45,
  'wins': 23,
  'losses': 12,
  'kdr': (150/45).toFixed(2)
});

// Active players using Sets
await redis.sadd('active:players', playerId);
await redis.expire(`active:players`, 300); // 5 minutes

// Match history using Lists
await redis.lpush(`player:${playerId}:matches`, JSON.stringify(matchData));
await redis.ltrim(`player:${playerId}:matches`, 0, 99); // Keep last 100 matches
```

### 9. Redis Pub/Sub for Real-time Features

**Q: Implement a Redis Pub/Sub system for a chat application with presence indicators.**

**A:**
```javascript
// Publisher - User joins channel
class ChatService {
  async joinChannel(userId, channelId) {
    // Add user to channel members
    await redis.sadd(`channel:${channelId}:members`, userId);
    
    // Set user presence
    await redis.setex(`user:${userId}:presence`, 30, 'online');
    
    // Publish join event
    await redis.publish(`channel:${channelId}`, JSON.stringify({
      type: 'user_joined',
      userId,
      timestamp: Date.now()
    }));
  }

  async sendMessage(userId, channelId, message) {
    const messageData = {
      type: 'message',
      userId,
      channelId,
      message,
      timestamp: Date.now()
    };
    
    // Store message in sorted set for history
    await redis.zadd(
      `channel:${channelId}:messages`, 
      Date.now(), 
      JSON.stringify(messageData)
    );
    
    // Publish to subscribers
    await redis.publish(`channel:${channelId}`, JSON.stringify(messageData));
  }
}

// Subscriber
redis.subscribe('channel:123');
redis.on('message', (channel, message) => {
  const data = JSON.parse(message);
  
  switch(data.type) {
    case 'user_joined':
      updateUserList(data.userId);
      break;
    case 'message':
      displayMessage(data);
      break;
  }
});
```

### 10. Redis Clustering and High Availability

**Q: Design a Redis cluster setup for a high-traffic streaming platform.**

**A:**
```javascript
// Redis Cluster Configuration
const Redis = require('ioredis');

const cluster = new Redis.Cluster([
  { host: '127.0.0.1', port: 7000 },
  { host: '127.0.0.1', port: 7001 },
  { host: '127.0.0.1', port: 7002 },
  { host: '127.0.0.1', port: 7003 },
  { host: '127.0.0.1', port: 7004 },
  { host: '127.0.0.1', port: 7005 }
], {
  redisOptions: {
    password: 'your-password'
  },
  enableOfflineQueue: false,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3
});

// Streaming platform cache patterns
class StreamingCache {
  // Content metadata with hash tags for cluster distribution
  async cacheContentMetadata(contentId, metadata) {
    const key = `content:{${contentId}}:metadata`;
    await cluster.hmset(key, metadata);
    await cluster.expire(key, 3600);
  }
  
  // User viewing history
  async addToViewingHistory(userId, contentId) {
    const key = `user:{${userId}}:history`;
    await cluster.lpush(key, contentId);
    await cluster.ltrim(key, 0, 99); // Keep last 100
  }
  
  // Popular content ranking
  async incrementViewCount(contentId) {
    await cluster.zincrby('popular:content', 1, contentId);
  }
}
```

### 11. Redis Memory Optimization

**Q: How would you optimize Redis memory usage for a large-scale application?**

**A:**

**1. Data Structure Optimization:**
```javascript
// Use Hashes for objects instead of JSON strings
// Bad
await redis.set('user:123', JSON.stringify({name: 'John', age: 30}));

// Good
await redis.hmset('user:123', 'name', 'John', 'age', 30);

// Use appropriate data types
// For small lists, use ziplist encoding
redis.config('set', 'hash-max-ziplist-entries', 512);
redis.config('set', 'hash-max-ziplist-value', 64);
```

**2. Key Expiration Strategies:**
```javascript
// Set appropriate TTL
await redis.setex('session:abc123', 1800, sessionData); // 30 minutes

// Use EXPIRE for existing keys
await redis.expire('temp:data', 300); // 5 minutes

// Implement key eviction policies
redis.config('set', 'maxmemory-policy', 'allkeys-lru');
```

**3. Memory Monitoring:**
```javascript
// Monitor memory usage
const memoryInfo = await redis.memory('usage', 'user:123');
const stats = await redis.info('memory');

// Implement memory alerts
if (stats.used_memory > threshold) {
  // Trigger cleanup or scaling
}
```

### 12. NoSQL Scaling Patterns

**Q: Compare horizontal scaling approaches for MongoDB vs Redis.**

**A:**

**MongoDB Horizontal Scaling:**
```javascript
// Sharding configuration
sh.enableSharding("ecommerce")
sh.shardCollection("ecommerce.products", {"category": 1, "_id": 1})

// Read scaling with replica sets
const client = new MongoClient(uri, {
  readPreference: 'secondaryPreferred',
  readConcern: { level: 'majority' }
});
```

**Redis Horizontal Scaling:**
```javascript
// Redis Cluster for automatic sharding
const cluster = new Redis.Cluster(nodes, {
  scaleReads: 'slave', // Read from replicas
  maxRedirections: 16
});

// Manual sharding with consistent hashing
class RedisSharding {
  constructor(nodes) {
    this.nodes = nodes;
    this.ring = new ConsistentHashing(nodes);
  }
  
  getNode(key) {
    return this.ring.get(key);
  }
  
  async set(key, value) {
    const node = this.getNode(key);
    return await node.set(key, value);
  }
}
```

### 13. Data Consistency Patterns

**Q: How do you handle data consistency between MongoDB and Redis in a microservices architecture?**

**A:**
```javascript
// Event-driven consistency
class OrderService {
  async createOrder(orderData) {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Create order in MongoDB
        const order = await Order.create([orderData], { session });
        
        // Publish event for cache invalidation
        await eventBus.publish('order.created', {
          orderId: order[0]._id,
          customerId: order[0].customerId
        });
      });
    } finally {
      await session.endSession();
    }
  }
}

// Cache invalidation handler
eventBus.subscribe('order.created', async (event) => {
  // Invalidate customer cache
  await redis.del(`customer:${event.customerId}:orders`);
  
  // Update order count
  await redis.hincrby(`customer:${event.customerId}:stats`, 'orderCount', 1);
});

// Saga pattern for distributed transactions
class OrderSaga {
  async execute(orderData) {
    const sagaId = generateId();
    
    try {
      // Step 1: Reserve inventory
      await this.reserveInventory(sagaId, orderData.items);
      
      // Step 2: Process payment
      await this.processPayment(sagaId, orderData.payment);
      
      // Step 3: Create order
      await this.createOrder(sagaId, orderData);
      
      // Step 4: Update cache
      await this.updateCache(sagaId, orderData);
      
    } catch (error) {
      // Compensate in reverse order
      await this.compensate(sagaId, error);
    }
  }
}
```

### 14. Performance Optimization Scenarios

**Q: Design a caching strategy for a social media feed that handles millions of users.**

**A:**
```javascript
class SocialFeedCache {
  // Pre-compute feeds for active users
  async precomputeFeed(userId) {
    const followingIds = await this.getFollowing(userId);
    
    // Get recent posts from followed users
    const posts = await Post.aggregate([
      { $match: { 
        authorId: { $in: followingIds },
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }},
      { $sort: { createdAt: -1 } },
      { $limit: 100 }
    ]);
    
    // Cache the feed
    await redis.setex(
      `feed:${userId}`, 
      1800, // 30 minutes
      JSON.stringify(posts)
    );
  }
  
  // Lazy loading with pagination
  async getFeed(userId, page = 0, limit = 20) {
    const cacheKey = `feed:${userId}:${page}`;
    
    let feed = await redis.get(cacheKey);
    if (feed) {
      return JSON.parse(feed);
    }
    
    // Generate feed on demand
    feed = await this.generateFeed(userId, page, limit);
    
    // Cache with shorter TTL for paginated results
    await redis.setex(cacheKey, 300, JSON.stringify(feed));
    
    return feed;
  }
  
  // Invalidate cache when new post is created
  async invalidateFeeds(authorId) {
    const followers = await this.getFollowers(authorId);
    
    // Use pipeline for batch operations
    const pipeline = redis.pipeline();
    
    followers.forEach(followerId => {
      pipeline.del(`feed:${followerId}`);
      // Also clear paginated caches
      for (let page = 0; page < 5; page++) {
        pipeline.del(`feed:${followerId}:${page}`);
      }
    });
    
    await pipeline.exec();
  }
}
```

### 15. Advanced MongoDB Aggregation

**Q: Create an aggregation pipeline to analyze user engagement patterns across different content types.**

**A:**
```javascript
db.userInteractions.aggregate([
  {
    $match: {
      timestamp: { 
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
      }
    }
  },
  {
    $lookup: {
      from: "content",
      localField: "contentId",
      foreignField: "_id",
      as: "contentInfo"
    }
  },
  {
    $unwind: "$contentInfo"
  },
  {
    $addFields: {
      engagementScore: {
        $switch: {
          branches: [
            { case: { $eq: ["$action", "view"] }, then: 1 },
            { case: { $eq: ["$action", "like"] }, then: 3 },
            { case: { $eq: ["$action", "share"] }, then: 5 },
            { case: { $eq: ["$action", "comment"] }, then: 7 }
          ],
          default: 0
        }
      },
      timeOfDay: { $hour: "$timestamp" },
      dayOfWeek: { $dayOfWeek: "$timestamp" }
    }
  },
  {
    $group: {
      _id: {
        userId: "$userId",
        contentType: "$contentInfo.type",
        timeSlot: {
          $switch: {
            branches: [
              { case: { $lt: ["$timeOfDay", 6] }, then: "night" },
              { case: { $lt: ["$timeOfDay", 12] }, then: "morning" },
              { case: { $lt: ["$timeOfDay", 18] }, then: "afternoon" },
              { case: { $lt: ["$timeOfDay", 24] }, then: "evening" }
            ]
          }
        }
      },
      totalEngagement: { $sum: "$engagementScore" },
      interactionCount: { $sum: 1 },
      avgEngagement: { $avg: "$engagementScore" },
      preferredDays: { $addToSet: "$dayOfWeek" }
    }
  },
  {
    $group: {
      _id: "$_id.userId",
      contentPreferences: {
        $push: {
          type: "$_id.contentType",
          timeSlot: "$_id.timeSlot",
          engagement: "$totalEngagement"
        }
      },
      totalEngagement: { $sum: "$totalEngagement" },
      mostActiveTimeSlot: {
        $max: {
          timeSlot: "$_id.timeSlot",
          engagement: "$totalEngagement"
        }
      }
    }
  },
  {
    $addFields: {
      topContentType: {
        $arrayElemAt: [
          {
            $map: {
              input: { $slice: [
                { $sortArray: { 
                  input: "$contentPreferences", 
                  sortBy: { engagement: -1 } 
                }}, 
                1 
              ]},
              as: "pref",
              in: "$$pref.type"
            }
          },
          0
        ]
      }
    }
  }
])
```

This comprehensive set of NoSQL interview questions covers MongoDB aggregation pipelines, Redis caching strategies, real-world scenarios from streaming and gaming industries, and advanced scaling patterns. Each question includes practical code examples and detailed explanations suitable for senior backend developers.
##
# 16. Redis Streams for Event Processing

**Q: Implement a Redis Streams solution for processing user activity events in a gaming platform.**

**A:**
```javascript
class GameEventProcessor {
  async publishEvent(streamKey, eventData) {
    // Add event to stream
    const messageId = await redis.xadd(
      streamKey,
      '*', // Auto-generate ID
      'event', JSON.stringify(eventData),
      'timestamp', Date.now(),
      'playerId', eventData.playerId
    );
    return messageId;
  }

  async createConsumerGroup(streamKey, groupName) {
    try {
      await redis.xgroup('CREATE', streamKey, groupName, '0', 'MKSTREAM');
    } catch (error) {
      if (!error.message.includes('BUSYGROUP')) {
        throw error;
      }
    }
  }

  async processEvents(streamKey, groupName, consumerName) {
    while (true) {
      try {
        // Read new messages
        const messages = await redis.xreadgroup(
          'GROUP', groupName, consumerName,
          'COUNT', 10,
          'BLOCK', 1000,
          'STREAMS', streamKey, '>'
        );

        if (messages && messages.length > 0) {
          for (const [stream, streamMessages] of messages) {
            for (const [messageId, fields] of streamMessages) {
              await this.handleEvent(messageId, fields);
              
              // Acknowledge message
              await redis.xack(streamKey, groupName, messageId);
            }
          }
        }
      } catch (error) {
        console.error('Error processing events:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  async handleEvent(messageId, fields) {
    const eventData = JSON.parse(fields[1]); // fields[1] is the event data
    
    switch (eventData.type) {
      case 'player_kill':
        await this.updateKillStats(eventData);
        break;
      case 'level_up':
        await this.updateLevelStats(eventData);
        break;
      case 'achievement_unlocked':
        await this.processAchievement(eventData);
        break;
    }
  }
}
```

### 17. MongoDB Change Streams

**Q: Implement MongoDB Change Streams to maintain real-time cache synchronization.**

**A:**
```javascript
class CacheSyncService {
  constructor() {
    this.redis = new Redis();
    this.mongodb = new MongoClient(uri);
  }

  async startChangeStreamWatcher() {
    const db = this.mongodb.db('ecommerce');
    
    // Watch specific collections
    const productChangeStream = db.collection('products').watch([
      { $match: { 'fullDocument.category': { $exists: true } } }
    ]);

    const orderChangeStream = db.collection('orders').watch([
      { $match: { operationType: { $in: ['insert', 'update'] } } }
    ]);

    // Handle product changes
    productChangeStream.on('change', async (change) => {
      await this.handleProductChange(change);
    });

    // Handle order changes
    orderChangeStream.on('change', async (change) => {
      await this.handleOrderChange(change);
    });
  }

  async handleProductChange(change) {
    const { operationType, documentKey, fullDocument } = change;
    
    switch (operationType) {
      case 'insert':
      case 'update':
        // Update product cache
        await this.redis.setex(
          `product:${documentKey._id}`,
          3600,
          JSON.stringify(fullDocument)
        );
        
        // Invalidate category cache
        await this.redis.del(`category:${fullDocument.category}:products`);
        break;
        
      case 'delete':
        // Remove from cache
        await this.redis.del(`product:${documentKey._id}`);
        break;
    }
  }

  async handleOrderChange(change) {
    const { operationType, fullDocument } = change;
    
    if (operationType === 'insert') {
      // Update customer order count
      await this.redis.hincrby(
        `customer:${fullDocument.customerId}:stats`,
        'orderCount',
        1
      );
      
      // Invalidate customer cache
      await this.redis.del(`customer:${fullDocument.customerId}:orders`);
    }
  }
}
```

### 18. NoSQL Transaction Patterns

**Q: Implement a distributed transaction pattern across MongoDB and Redis for an e-commerce checkout process.**

**A:**
```javascript
class CheckoutService {
  async processCheckout(customerId, cartItems, paymentInfo) {
    const session = await mongoose.startSession();
    const sagaId = generateUUID();
    
    try {
      await session.withTransaction(async () => {
        // Step 1: Validate and reserve inventory
        await this.reserveInventory(cartItems, sagaId, session);
        
        // Step 2: Create order in MongoDB
        const order = await this.createOrder(customerId, cartItems, session);
        
        // Step 3: Process payment (external service)
        const paymentResult = await this.processPayment(paymentInfo, order.total);
        
        if (!paymentResult.success) {
          throw new Error('Payment failed');
        }
        
        // Step 4: Update Redis cache
        await this.updateCustomerCache(customerId, order);
        
        // Step 5: Clear cart
        await this.clearCart(customerId);
        
        return order;
      });
    } catch (error) {
      // Compensating actions
      await this.compensateTransaction(sagaId, error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async reserveInventory(cartItems, sagaId, session) {
    for (const item of cartItems) {
      const product = await Product.findById(item.productId).session(session);
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      
      // Reserve inventory
      await Product.updateOne(
        { _id: item.productId },
        { 
          $inc: { stock: -item.quantity },
          $push: { reservations: { sagaId, quantity: item.quantity } }
        },
        { session }
      );
    }
  }

  async compensateTransaction(sagaId, error) {
    // Release reserved inventory
    await Product.updateMany(
      { 'reservations.sagaId': sagaId },
      {
        $pull: { reservations: { sagaId } },
        $inc: { stock: { $sum: '$reservations.quantity' } }
      }
    );
    
    // Log compensation
    console.error(`Transaction ${sagaId} compensated due to:`, error.message);
  }
}
```

### 19. Redis Geo-spatial Operations

**Q: Design a location-based service using Redis geo-spatial features for a food delivery platform.**

**A:**
```javascript
class LocationService {
  // Add restaurant locations
  async addRestaurant(restaurantId, latitude, longitude, metadata) {
    // Add to geo index
    await redis.geoadd(
      'restaurants:locations',
      longitude, latitude, restaurantId
    );
    
    // Store restaurant metadata
    await redis.hmset(`restaurant:${restaurantId}`, {
      name: metadata.name,
      cuisine: metadata.cuisine,
      rating: metadata.rating,
      deliveryTime: metadata.avgDeliveryTime
    });
  }

  // Find nearby restaurants
  async findNearbyRestaurants(userLat, userLon, radiusKm = 5) {
    const restaurants = await redis.georadius(
      'restaurants:locations',
      userLon, userLat, radiusKm, 'km',
      'WITHDIST', 'WITHCOORD', 'ASC'
    );

    const results = [];
    for (const [restaurantId, distance, [lon, lat]] of restaurants) {
      const metadata = await redis.hgetall(`restaurant:${restaurantId}`);
      
      results.push({
        id: restaurantId,
        distance: parseFloat(distance),
        coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
        ...metadata
      });
    }

    return results;
  }

  // Track delivery driver locations
  async updateDriverLocation(driverId, latitude, longitude) {
    await redis.geoadd(
      'drivers:locations',
      longitude, latitude, driverId
    );
    
    // Set expiration for driver location
    await redis.expire('drivers:locations', 300); // 5 minutes
  }

  // Find nearest available driver
  async findNearestDriver(restaurantLat, restaurantLon) {
    const drivers = await redis.georadius(
      'drivers:locations',
      restaurantLon, restaurantLat, 10, 'km',
      'WITHDIST', 'ASC', 'COUNT', 5
    );

    // Filter available drivers
    const availableDrivers = [];
    for (const [driverId, distance] of drivers) {
      const isAvailable = await redis.get(`driver:${driverId}:available`);
      if (isAvailable === 'true') {
        availableDrivers.push({
          driverId,
          distance: parseFloat(distance)
        });
      }
    }

    return availableDrivers[0] || null;
  }
}
```

### 20. MongoDB Text Search and Indexing

**Q: Implement advanced text search functionality for a content management system.**

**A:**
```javascript
class ContentSearchService {
  // Create text indexes
  async setupTextIndexes() {
    // Compound text index with weights
    await db.articles.createIndex({
      title: 'text',
      content: 'text',
      tags: 'text',
      author: 'text'
    }, {
      weights: {
        title: 10,
        content: 5,
        tags: 8,
        author: 2
      },
      name: 'article_text_index'
    });

    // Language-specific text index
    await db.articles.createIndex({
      'title': 'text',
      'content': 'text'
    }, {
      default_language: 'english',
      language_override: 'language'
    });
  }

  // Advanced text search with filters
  async searchArticles(query, filters = {}) {
    const pipeline = [
      {
        $match: {
          $text: { $search: query },
          ...filters
        }
      },
      {
        $addFields: {
          score: { $meta: 'textScore' }
        }
      },
      {
        $sort: { score: { $meta: 'textScore' } }
      },
      {
        $lookup: {
          from: 'authors',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      {
        $project: {
          title: 1,
          excerpt: { $substr: ['$content', 0, 200] },
          author: { $arrayElemAt: ['$authorInfo.name', 0] },
          publishDate: 1,
          tags: 1,
          score: 1
        }
      }
    ];

    return await db.articles.aggregate(pipeline).toArray();
  }

  // Faceted search with aggregation
  async facetedSearch(query) {
    const results = await db.articles.aggregate([
      {
        $match: {
          $text: { $search: query }
        }
      },
      {
        $facet: {
          articles: [
            { $addFields: { score: { $meta: 'textScore' } } },
            { $sort: { score: { $meta: 'textScore' } } },
            { $limit: 20 }
          ],
          categories: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          authors: [
            { $group: { _id: '$authorId', count: { $sum: 1 } } },
            { $lookup: {
              from: 'authors',
              localField: '_id',
              foreignField: '_id',
              as: 'authorInfo'
            }},
            { $sort: { count: -1 } }
          ],
          dateRange: [
            {
              $group: {
                _id: null,
                minDate: { $min: '$publishDate' },
                maxDate: { $max: '$publishDate' }
              }
            }
          ]
        }
      }
    ]).toArray();

    return results[0];
  }
}
```

### 21. Redis Rate Limiting Patterns

**Q: Implement different rate limiting strategies using Redis for an API gateway.**

**A:**
```javascript
class RateLimiter {
  // Token bucket algorithm
  async tokenBucket(key, capacity, refillRate, tokens = 1) {
    const now = Date.now();
    const bucketKey = `bucket:${key}`;
    
    const pipeline = redis.pipeline();
    pipeline.hmget(bucketKey, 'tokens', 'lastRefill');
    pipeline.expire(bucketKey, 3600);
    
    const [[, result]] = await pipeline.exec();
    const [currentTokens, lastRefill] = result || [capacity, now];
    
    // Calculate tokens to add based on time elapsed
    const timePassed = (now - parseInt(lastRefill)) / 1000;
    const tokensToAdd = Math.floor(timePassed * refillRate);
    const newTokens = Math.min(capacity, parseInt(currentTokens) + tokensToAdd);
    
    if (newTokens >= tokens) {
      // Allow request
      await redis.hmset(bucketKey, {
        tokens: newTokens - tokens,
        lastRefill: now
      });
      return { allowed: true, remaining: newTokens - tokens };
    } else {
      // Deny request
      await redis.hmset(bucketKey, {
        tokens: newTokens,
        lastRefill: now
      });
      return { allowed: false, remaining: newTokens };
    }
  }

  // Sliding window log
  async slidingWindowLog(key, limit, windowMs) {
    const now = Date.now();
    const windowStart = now - windowMs;
    const requestKey = `requests:${key}`;
    
    const pipeline = redis.pipeline();
    
    // Remove old requests
    pipeline.zremrangebyscore(requestKey, 0, windowStart);
    
    // Count current requests
    pipeline.zcard(requestKey);
    
    // Add current request
    pipeline.zadd(requestKey, now, `${now}-${Math.random()}`);
    
    // Set expiration
    pipeline.expire(requestKey, Math.ceil(windowMs / 1000));
    
    const results = await pipeline.exec();
    const requestCount = results[1][1];
    
    if (requestCount < limit) {
      return { allowed: true, remaining: limit - requestCount - 1 };
    } else {
      // Remove the request we just added
      await redis.zremrangebyrank(requestKey, -1, -1);
      return { allowed: false, remaining: 0 };
    }
  }

  // Fixed window counter
  async fixedWindow(key, limit, windowMs) {
    const now = Date.now();
    const window = Math.floor(now / windowMs);
    const counterKey = `counter:${key}:${window}`;
    
    const current = await redis.incr(counterKey);
    
    if (current === 1) {
      await redis.expire(counterKey, Math.ceil(windowMs / 1000));
    }
    
    if (current <= limit) {
      return { allowed: true, remaining: limit - current };
    } else {
      return { allowed: false, remaining: 0 };
    }
  }
}
```

### 22. MongoDB Aggregation for Analytics

**Q: Create an aggregation pipeline for a streaming platform to generate comprehensive analytics reports.**

**A:**
```javascript
// Daily active users and engagement metrics
const dailyAnalytics = await db.userSessions.aggregate([
  {
    $match: {
      startTime: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $addFields: {
      date: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$startTime'
        }
      },
      sessionDuration: {
        $subtract: ['$endTime', '$startTime']
      }
    }
  },
  {
    $group: {
      _id: '$date',
      dailyActiveUsers: { $addToSet: '$userId' },
      totalSessions: { $sum: 1 },
      avgSessionDuration: { $avg: '$sessionDuration' },
      totalWatchTime: { $sum: '$sessionDuration' },
      uniqueContent: { $addToSet: '$contentId' }
    }
  },
  {
    $addFields: {
      dauCount: { $size: '$dailyActiveUsers' },
      uniqueContentCount: { $size: '$uniqueContent' }
    }
  },
  {
    $project: {
      date: '$_id',
      dauCount: 1,
      totalSessions: 1,
      avgSessionDuration: { $divide: ['$avgSessionDuration', 60000] }, // Convert to minutes
      totalWatchHours: { $divide: ['$totalWatchTime', 3600000] }, // Convert to hours
      uniqueContentCount: 1,
      sessionsPerUser: { $divide: ['$totalSessions', '$dauCount'] }
    }
  },
  { $sort: { date: 1 } }
]);

// Content performance analytics
const contentAnalytics = await db.viewingSessions.aggregate([
  {
    $match: {
      startTime: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $lookup: {
      from: 'content',
      localField: 'contentId',
      foreignField: '_id',
      as: 'contentInfo'
    }
  },
  {
    $unwind: '$contentInfo'
  },
  {
    $addFields: {
      watchPercentage: {
        $multiply: [
          { $divide: [
            { $subtract: ['$endTime', '$startTime'] },
            '$contentInfo.duration'
          ]},
          100
        ]
      },
      isCompleted: {
        $gte: [
          { $divide: [
            { $subtract: ['$endTime', '$startTime'] },
            '$contentInfo.duration'
          ]},
          0.9
        ]
      }
    }
  },
  {
    $group: {
      _id: {
        contentId: '$contentId',
        title: '$contentInfo.title',
        genre: '$contentInfo.genre',
        releaseDate: '$contentInfo.releaseDate'
      },
      totalViews: { $sum: 1 },
      uniqueViewers: { $addToSet: '$userId' },
      avgWatchPercentage: { $avg: '$watchPercentage' },
      completionRate: {
        $avg: { $cond: ['$isCompleted', 1, 0] }
      },
      totalWatchTime: {
        $sum: { $subtract: ['$endTime', '$startTime'] }
      }
    }
  },
  {
    $addFields: {
      uniqueViewerCount: { $size: '$uniqueViewers' },
      avgWatchTimeMinutes: { $divide: ['$totalWatchTime', 60000] }
    }
  },
  {
    $sort: { totalViews: -1 }
  },
  { $limit: 50 }
]);
```

### 23. Redis Lua Scripting

**Q: Write Lua scripts for atomic operations in a gaming leaderboard system.**

**A:**
```javascript
class GameLeaderboard {
  constructor() {
    // Lua script for atomic leaderboard update
    this.updateScoreScript = `
      local leaderboard = KEYS[1]
      local playerId = ARGV[1]
      local newScore = tonumber(ARGV[2])
      local maxEntries = tonumber(ARGV[3])
      
      -- Get current score
      local currentScore = redis.call('ZSCORE', leaderboard, playerId)
      
      -- Only update if new score is higher
      if not currentScore or newScore > tonumber(currentScore) then
        -- Add/update player score
        redis.call('ZADD', leaderboard, newScore, playerId)
        
        -- Trim leaderboard to max entries
        local count = redis.call('ZCARD', leaderboard)
        if count > maxEntries then
          redis.call('ZREMRANGEBYRANK', leaderboard, 0, count - maxEntries - 1)
        end
        
        -- Get player's new rank
        local rank = redis.call('ZREVRANK', leaderboard, playerId)
        return {newScore, rank + 1, 'updated'}
      else
        local rank = redis.call('ZREVRANK', leaderboard, playerId)
        return {currentScore, rank + 1, 'unchanged'}
      end
    `;

    // Lua script for tournament bracket advancement
    this.advanceTournamentScript = `
      local matchKey = KEYS[1]
      local nextMatchKey = KEYS[2]
      local winnerId = ARGV[1]
      local loserId = ARGV[2]
      local nextPosition = ARGV[3]
      
      -- Record match result
      redis.call('HMSET', matchKey, 
        'winner', winnerId,
        'loser', loserId,
        'completed', 'true',
        'completedAt', ARGV[4]
      )
      
      -- Advance winner to next round
      if nextMatchKey ~= '' then
        redis.call('HSET', nextMatchKey, 'player' .. nextPosition, winnerId)
      end
      
      -- Update player statistics
      redis.call('HINCRBY', 'player:' .. winnerId .. ':stats', 'wins', 1)
      redis.call('HINCRBY', 'player:' .. loserId .. ':stats', 'losses', 1)
      
      return 'OK'
    `;
  }

  async updatePlayerScore(leaderboardKey, playerId, score, maxEntries = 1000) {
    const result = await redis.eval(
      this.updateScoreScript,
      1,
      leaderboardKey,
      playerId,
      score,
      maxEntries
    );

    return {
      score: result[0],
      rank: result[1],
      status: result[2]
    };
  }

  async advanceInTournament(matchKey, nextMatchKey, winnerId, loserId, nextPosition) {
    return await redis.eval(
      this.advanceTournamentScript,
      2,
      matchKey,
      nextMatchKey || '',
      winnerId,
      loserId,
      nextPosition,
      Date.now()
    );
  }
}
```

### 24. MongoDB GridFS for File Storage

**Q: Implement a file storage system using MongoDB GridFS for a content management platform.**

**A:**
```javascript
const { GridFSBucket } = require('mongodb');

class FileStorageService {
  constructor(db) {
    this.bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  }

  // Upload file with metadata
  async uploadFile(fileStream, filename, metadata = {}) {
    return new Promise((resolve, reject) => {
      const uploadStream = this.bucket.openUploadStream(filename, {
        metadata: {
          ...metadata,
          uploadDate: new Date(),
          contentType: metadata.contentType || 'application/octet-stream'
        }
      });

      uploadStream.on('error', reject);
      uploadStream.on('finish', (file) => {
        resolve({
          fileId: file._id,
          filename: file.filename,
          length: file.length,
          uploadDate: file.uploadDate
        });
      });

      fileStream.pipe(uploadStream);
    });
  }

  // Download file
  async downloadFile(fileId, res) {
    try {
      const downloadStream = this.bucket.openDownloadStream(fileId);
      
      downloadStream.on('error', (error) => {
        res.status(404).json({ error: 'File not found' });
      });

      // Get file info for headers
      const files = await this.bucket.find({ _id: fileId }).toArray();
      if (files.length > 0) {
        const file = files[0];
        res.set({
          'Content-Type': file.metadata.contentType,
          'Content-Length': file.length,
          'Content-Disposition': `attachment; filename="${file.filename}"`
        });
      }

      downloadStream.pipe(res);
    } catch (error) {
      res.status(500).json({ error: 'Download failed' });
    }
  }

  // List files with pagination
  async listFiles(page = 1, limit = 20, filter = {}) {
    const skip = (page - 1) * limit;
    
    const files = await this.bucket
      .find(filter)
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.bucket.find(filter).count();

    return {
      files: files.map(file => ({
        id: file._id,
        filename: file.filename,
        length: file.length,
        uploadDate: file.uploadDate,
        metadata: file.metadata
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Delete file
  async deleteFile(fileId) {
    try {
      await this.bucket.delete(fileId);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Create thumbnail for images
  async createThumbnail(fileId, width = 200, height = 200) {
    const sharp = require('sharp');
    
    const downloadStream = this.bucket.openDownloadStream(fileId);
    const chunks = [];
    
    return new Promise((resolve, reject) => {
      downloadStream.on('data', chunk => chunks.push(chunk));
      downloadStream.on('error', reject);
      downloadStream.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const thumbnail = await sharp(buffer)
            .resize(width, height, { fit: 'cover' })
            .jpeg({ quality: 80 })
            .toBuffer();

          // Upload thumbnail
          const thumbnailStream = require('stream').Readable.from(thumbnail);
          const result = await this.uploadFile(
            thumbnailStream,
            `thumb_${width}x${height}_${fileId}`,
            { 
              contentType: 'image/jpeg',
              originalFileId: fileId,
              type: 'thumbnail',
              dimensions: { width, height }
            }
          );

          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}
```

### 25. Advanced Redis Patterns for Microservices

**Q: Design Redis patterns for inter-service communication in a microservices architecture.**

**A:**
```javascript
class MicroserviceMessaging {
  // Request-Response pattern with timeout
  async requestResponse(service, method, data, timeout = 5000) {
    const requestId = generateUUID();
    const requestKey = `request:${service}:${requestId}`;
    const responseKey = `response:${requestId}`;
    
    // Send request
    await redis.lpush(`queue:${service}`, JSON.stringify({
      id: requestId,
      method,
      data,
      timestamp: Date.now(),
      replyTo: responseKey
    }));

    // Wait for response with timeout
    const response = await redis.brpop(responseKey, timeout / 1000);
    
    if (!response) {
      throw new Error(`Request timeout for ${service}.${method}`);
    }

    return JSON.parse(response[1]);
  }

  // Service worker pattern
  async startServiceWorker(serviceName, handlers) {
    const queueKey = `queue:${serviceName}`;
    
    while (true) {
      try {
        const request = await redis.brpop(queueKey, 10);
        
        if (request) {
          const requestData = JSON.parse(request[1]);
          const { id, method, data, replyTo } = requestData;
          
          try {
            // Process request
            const handler = handlers[method];
            if (!handler) {
              throw new Error(`Unknown method: ${method}`);
            }
            
            const result = await handler(data);
            
            // Send response
            if (replyTo) {
              await redis.lpush(replyTo, JSON.stringify({
                success: true,
                data: result,
                requestId: id
              }));
              await redis.expire(replyTo, 60); // Cleanup after 1 minute
            }
          } catch (error) {
            // Send error response
            if (replyTo) {
              await redis.lpush(replyTo, JSON.stringify({
                success: false,
                error: error.message,
                requestId: id
              }));
            }
          }
        }
      } catch (error) {
        console.error(`Service worker error:`, error);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // Event sourcing pattern
  async publishEvent(eventType, data, aggregateId) {
    const event = {
      id: generateUUID(),
      type: eventType,
      data,
      aggregateId,
      timestamp: Date.now(),
      version: await this.getNextVersion(aggregateId)
    };

    // Store event
    await redis.lpush(`events:${aggregateId}`, JSON.stringify(event));
    
    // Publish to subscribers
    await redis.publish(`events:${eventType}`, JSON.stringify(event));
    
    return event;
  }

  async getEventHistory(aggregateId, fromVersion = 0) {
    const events = await redis.lrange(`events:${aggregateId}`, 0, -1);
    
    return events
      .map(event => JSON.parse(event))
      .filter(event => event.version >= fromVersion)
      .sort((a, b) => a.version - b.version);
  }

  // Circuit breaker pattern
  async callWithCircuitBreaker(serviceKey, operation, fallback) {
    const circuitKey = `circuit:${serviceKey}`;
    const state = await redis.hgetall(circuitKey);
    
    const failureThreshold = 5;
    const timeout = 60000; // 1 minute
    const failures = parseInt(state.failures || 0);
    const lastFailure = parseInt(state.lastFailure || 0);
    
    // Check if circuit is open
    if (failures >= failureThreshold) {
      if (Date.now() - lastFailure < timeout) {
        // Circuit is open, use fallback
        return fallback ? await fallback() : null;
      } else {
        // Try to close circuit (half-open state)
        await redis.hset(circuitKey, 'failures', 0);
      }
    }
    
    try {
      const result = await operation();
      
      // Success - reset failure count
      await redis.del(circuitKey);
      
      return result;
    } catch (error) {
      // Failure - increment counter
      await redis.hmset(circuitKey, {
        failures: failures + 1,
        lastFailure: Date.now()
      });
      
      throw error;
    }
  }
}
```

This completes the comprehensive NoSQL interview questions document with 25+ detailed questions covering MongoDB aggregation pipelines, Redis caching strategies, real-world scenarios from streaming and gaming industries, and advanced NoSQL scaling patterns. Each question includes practical implementations and detailed explanations suitable for senior backend developers.