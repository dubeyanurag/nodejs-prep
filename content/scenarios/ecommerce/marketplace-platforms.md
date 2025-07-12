---
title: "E-commerce & Marketplace Platform Scenarios"
category: "scenarios"
subcategory: "ecommerce"
difficulty: "senior"
tags: ["ecommerce", "marketplace", "inventory", "recommendations", "search", "scaling", "flash-sales"]
description: "Real-world e-commerce and marketplace platform scenarios covering inventory management, recommendation engines, peak traffic handling, and search systems"
lastUpdated: "2025-01-10"
---

# E-commerce & Marketplace Platform Scenarios

## Overview

This document presents real-world scenarios from major e-commerce and marketplace platforms, focusing on the technical challenges that senior backend developers encounter when building scalable commerce systems.

## Case Study 1: Amazon - Inventory Management at Scale

### Scenario
Design an inventory management system that handles millions of products across multiple warehouses, with real-time availability updates and reservation mechanisms.

### Technical Challenges

#### Real-time Inventory Tracking
```javascript
// Distributed inventory service with event sourcing
class InventoryService {
  constructor(eventStore, cacheLayer) {
    this.eventStore = eventStore;
    this.cache = cacheLayer;
    this.reservations = new Map();
  }

  async checkAvailability(productId, quantity, warehouseId) {
    const cacheKey = `inventory:${productId}:${warehouseId}`;
    let available = await this.cache.get(cacheKey);
    
    if (available === null) {
      available = await this.calculateAvailableStock(productId, warehouseId);
      await this.cache.setex(cacheKey, 30, available); // 30-second cache
    }
    
    const reserved = this.getReservedQuantity(productId, warehouseId);
    return (available - reserved) >= quantity;
  }

  async reserveInventory(orderId, items, ttl = 900) { // 15-minute reservation
    const reservationId = `res_${orderId}_${Date.now()}`;
    const reservationData = {
      id: reservationId,
      orderId,
      items,
      expiresAt: Date.now() + (ttl * 1000),
      status: 'active'
    };

    // Atomic reservation across multiple items
    const pipeline = this.cache.pipeline();
    for (const item of items) {
      const key = `reservation:${item.productId}:${item.warehouseId}`;
      pipeline.zadd(key, reservationData.expiresAt, reservationId);
      pipeline.hset(`reservation_data:${reservationId}`, reservationData);
    }
    
    await pipeline.exec();
    
    // Schedule cleanup
    setTimeout(() => this.cleanupExpiredReservation(reservationId), ttl * 1000);
    
    return reservationId;
  }

  async calculateAvailableStock(productId, warehouseId) {
    // Event sourcing approach
    const events = await this.eventStore.getEvents(
      `inventory:${productId}:${warehouseId}`,
      { fromVersion: 0 }
    );
    
    let stock = 0;
    for (const event of events) {
      switch (event.type) {
        case 'StockReceived':
          stock += event.data.quantity;
          break;
        case 'StockSold':
          stock -= event.data.quantity;
          break;
        case 'StockAdjusted':
          stock = event.data.newQuantity;
          break;
      }
    }
    
    return Math.max(0, stock);
  }
}
```

#### Multi-warehouse Allocation
```javascript
class WarehouseAllocationService {
  constructor(inventoryService, shippingCalculator) {
    this.inventory = inventoryService;
    this.shipping = shippingCalculator;
  }

  async optimizeAllocation(order) {
    const { items, shippingAddress } = order;
    const warehouses = await this.getEligibleWarehouses(shippingAddress);
    
    // Find optimal allocation minimizing shipping cost and time
    const allocationOptions = await this.generateAllocationOptions(items, warehouses);
    
    return this.selectOptimalAllocation(allocationOptions, {
      prioritizeSpeed: order.isPrime,
      maxSplitShipments: 3
    });
  }

  async generateAllocationOptions(items, warehouses) {
    const options = [];
    
    // Single warehouse fulfillment (preferred)
    for (const warehouse of warehouses) {
      const canFulfill = await this.canFulfillFromSingleWarehouse(items, warehouse);
      if (canFulfill) {
        options.push({
          type: 'single',
          warehouses: [warehouse],
          cost: await this.shipping.calculateCost(items, warehouse.location),
          estimatedDelivery: await this.shipping.estimateDelivery(warehouse.location)
        });
      }
    }
    
    // Multi-warehouse fulfillment
    if (options.length === 0) {
      const multiWarehouseOptions = await this.generateMultiWarehouseOptions(items, warehouses);
      options.push(...multiWarehouseOptions);
    }
    
    return options;
  }
}
```

### Interview Questions
1. How would you handle inventory overbooking during high-traffic periods?
2. Design a system to prevent race conditions in inventory updates across multiple data centers.
3. How would you implement inventory forecasting for automatic reordering?

---

## Case Study 2: Netflix/Spotify - Recommendation Engine Architecture

### Scenario
Build a recommendation system that processes user behavior in real-time and serves personalized recommendations with sub-100ms latency.

### Technical Challenges

#### Real-time Feature Engineering
```javascript
class RecommendationEngine {
  constructor(featureStore, modelService, cacheLayer) {
    this.features = featureStore;
    this.models = modelService;
    this.cache = cacheLayer;
    this.userProfiles = new Map();
  }

  async getRecommendations(userId, context = {}) {
    const cacheKey = `recs:${userId}:${this.hashContext(context)}`;
    let recommendations = await this.cache.get(cacheKey);
    
    if (!recommendations) {
      const userFeatures = await this.buildUserFeatures(userId);
      const contextFeatures = this.buildContextFeatures(context);
      const candidateItems = await this.getCandidateItems(userId, userFeatures);
      
      recommendations = await this.rankCandidates(
        candidateItems,
        { ...userFeatures, ...contextFeatures }
      );
      
      await this.cache.setex(cacheKey, 300, recommendations); // 5-minute cache
    }
    
    // Log for model training
    this.logRecommendationServed(userId, recommendations, context);
    
    return recommendations;
  }

  async buildUserFeatures(userId) {
    const profile = await this.getUserProfile(userId);
    const recentActivity = await this.getRecentActivity(userId, 24); // Last 24 hours
    const preferences = await this.extractPreferences(userId);
    
    return {
      demographics: profile.demographics,
      behaviorVector: this.computeBehaviorVector(recentActivity),
      preferences: preferences,
      sessionContext: this.getSessionContext(userId),
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay()
    };
  }

  async getCandidateItems(userId, userFeatures) {
    // Multi-stage candidate generation
    const candidates = new Set();
    
    // Collaborative filtering candidates
    const similarUsers = await this.findSimilarUsers(userId, userFeatures);
    const collaborativeItems = await this.getItemsFromSimilarUsers(similarUsers);
    collaborativeItems.forEach(item => candidates.add(item));
    
    // Content-based candidates
    const contentBasedItems = await this.getContentBasedCandidates(userFeatures);
    contentBasedItems.forEach(item => candidates.add(item));
    
    // Trending/popular items
    const trendingItems = await this.getTrendingItems(userFeatures.preferences.categories);
    trendingItems.forEach(item => candidates.add(item));
    
    return Array.from(candidates);
  }

  async rankCandidates(candidates, features) {
    // Ensemble of ranking models
    const rankings = await Promise.all([
      this.models.collaborativeFiltering.predict(candidates, features),
      this.models.contentBased.predict(candidates, features),
      this.models.deepLearning.predict(candidates, features)
    ]);
    
    // Weighted ensemble
    const finalScores = candidates.map((candidate, idx) => ({
      item: candidate,
      score: (
        rankings[0][idx] * 0.4 +  // Collaborative filtering
        rankings[1][idx] * 0.3 +  // Content-based
        rankings[2][idx] * 0.3    // Deep learning
      )
    }));
    
    return finalScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
      .map(item => ({
        ...item.item,
        recommendationScore: item.score,
        explanation: this.generateExplanation(item.item, features)
      }));
  }
}
```

### Interview Questions
1. How would you handle the cold start problem for new users?
2. Design a system to detect and prevent filter bubbles in recommendations.
3. How would you implement real-time model updates without service interruption?

---

## Case Study 3: Shopify - Flash Sale Traffic Handling

### Scenario
Design a system that can handle 10x normal traffic during flash sales while maintaining sub-second response times and preventing overselling.

### Technical Challenges

#### Traffic Surge Management
```javascript
class FlashSaleManager {
  constructor(rateLimiter, queueService, inventoryService) {
    this.rateLimiter = rateLimiter;
    this.queue = queueService;
    this.inventory = inventoryService;
    this.saleConfigs = new Map();
  }

  async handleFlashSaleRequest(saleId, userId, productId, quantity) {
    // Rate limiting per user and globally
    const userKey = `user:${userId}`;
    const globalKey = `sale:${saleId}`;
    
    const [userAllowed, globalAllowed] = await Promise.all([
      this.rateLimiter.isAllowed(userKey, 5, 60), // 5 requests per minute per user
      this.rateLimiter.isAllowed(globalKey, 1000, 1) // 1000 requests per second globally
    ]);
    
    if (!userAllowed) {
      throw new Error('User rate limit exceeded');
    }
    
    if (!globalAllowed) {
      // Queue the request instead of rejecting
      return await this.queueRequest(saleId, userId, productId, quantity);
    }
    
    return await this.processFlashSaleOrder(saleId, userId, productId, quantity);
  }

  async processFlashSaleOrder(saleId, userId, productId, quantity) {
    const saleConfig = await this.getSaleConfig(saleId);
    
    // Check sale validity
    if (!this.isSaleActive(saleConfig)) {
      throw new Error('Sale is not active');
    }
    
    // Atomic inventory check and reservation
    const reservationId = await this.inventory.atomicReserve(
      productId,
      quantity,
      saleConfig.warehouseId,
      { ttl: 300, context: `flash_sale:${saleId}` }
    );
    
    if (!reservationId) {
      throw new Error('Product out of stock');
    }
    
    // Create order with reservation
    const order = await this.createFlashSaleOrder({
      saleId,
      userId,
      productId,
      quantity,
      reservationId,
      price: saleConfig.salePrice
    });
    
    // Async processing
    this.processOrderAsync(order);
    
    return {
      orderId: order.id,
      status: 'confirmed',
      reservationId,
      expiresAt: Date.now() + 300000 // 5 minutes to complete payment
    };
  }

  async queueRequest(saleId, userId, productId, quantity) {
    const queuePosition = await this.queue.enqueue(`flash_sale:${saleId}`, {
      userId,
      productId,
      quantity,
      timestamp: Date.now()
    });
    
    return {
      status: 'queued',
      position: queuePosition,
      estimatedWaitTime: queuePosition * 100 // 100ms per position
    };
  }
}
```

### Interview Questions
1. How would you implement a fair queuing system for flash sales?
2. Design a system to prevent bots from dominating flash sale purchases.
3. How would you handle payment processing failures during high-traffic periods?

---

## Case Study 4: Etsy - Search and Discovery System

### Scenario
Build a search system that handles complex queries across millions of unique handmade products with personalized ranking and faceted search.

### Technical Challenges

#### Elasticsearch-based Search Architecture
```javascript
class ProductSearchService {
  constructor(elasticsearchClient, personalizationService) {
    this.es = elasticsearchClient;
    this.personalization = personalizationService;
  }

  async search(query, filters = {}, userId = null) {
    const searchQuery = await this.buildSearchQuery(query, filters, userId);
    
    const response = await this.es.search({
      index: 'products',
      body: searchQuery,
      size: filters.limit || 24,
      from: filters.offset || 0
    });
    
    const results = await this.processSearchResults(response, userId);
    
    // Log search for analytics and personalization
    this.logSearch(query, filters, userId, results);
    
    return {
      products: results,
      totalCount: response.hits.total.value,
      facets: this.extractFacets(response.aggregations),
      suggestions: await this.getSearchSuggestions(query)
    };
  }

  async buildSearchQuery(query, filters, userId) {
    const baseQuery = {
      query: {
        bool: {
          must: [],
          filter: [],
          should: [],
          must_not: []
        }
      },
      aggs: this.buildAggregations(),
      sort: []
    };

    // Text search
    if (query) {
      baseQuery.query.bool.must.push({
        multi_match: {
          query: query,
          fields: [
            'title^3',
            'description^2',
            'tags^2',
            'category',
            'materials',
            'shop_name'
          ],
          type: 'best_fields',
          fuzziness: 'AUTO'
        }
      });
    }

    // Filters
    if (filters.category) {
      baseQuery.query.bool.filter.push({
        term: { 'category.keyword': filters.category }
      });
    }

    if (filters.priceRange) {
      baseQuery.query.bool.filter.push({
        range: {
          price: {
            gte: filters.priceRange.min,
            lte: filters.priceRange.max
          }
        }
      });
    }

    if (filters.location) {
      baseQuery.query.bool.filter.push({
        geo_distance: {
          distance: filters.location.radius || '50km',
          'shop_location': {
            lat: filters.location.lat,
            lon: filters.location.lon
          }
        }
      });
    }

    // Personalization boost
    if (userId) {
      const personalizedBoosts = await this.personalization.getSearchBoosts(userId);
      baseQuery.query.bool.should.push(...personalizedBoosts);
    }

    // Sorting
    baseQuery.sort = this.buildSortCriteria(filters.sort, userId);

    return baseQuery;
  }
}
```

### Interview Questions
1. How would you implement search result personalization without compromising privacy?
2. Design a system to handle search queries in multiple languages.
3. How would you optimize search performance for long-tail queries?

---

## Case Study 5: Uber Eats - Dynamic Pricing and Delivery Optimization

### Scenario
Build a system that dynamically adjusts delivery fees based on demand, supply, and external factors while optimizing delivery routes in real-time.

### Technical Challenges

#### Dynamic Pricing Engine
```javascript
class DynamicPricingEngine {
  constructor(demandPredictor, supplyTracker, weatherService) {
    this.demandPredictor = demandPredictor;
    this.supplyTracker = supplyTracker;
    this.weatherService = weatherService;
    this.pricingModels = new Map();
  }

  async calculateDeliveryFee(restaurantId, customerLocation, orderValue) {
    const context = await this.buildPricingContext(restaurantId, customerLocation);
    const basePrice = await this.getBaseDeliveryFee(restaurantId, customerLocation);
    
    const multipliers = await this.calculatePricingMultipliers(context);
    const finalPrice = this.applyMultipliers(basePrice, multipliers);
    
    // Apply business rules
    const adjustedPrice = this.applyBusinessRules(finalPrice, orderValue, context);
    
    return {
      basePrice,
      finalPrice: adjustedPrice,
      multipliers,
      explanation: this.generatePriceExplanation(multipliers)
    };
  }

  async buildPricingContext(restaurantId, customerLocation) {
    const [demand, supply, weather, events] = await Promise.all([
      this.demandPredictor.getCurrentDemand(customerLocation),
      this.supplyTracker.getAvailableDrivers(customerLocation),
      this.weatherService.getCurrentConditions(customerLocation),
      this.getLocalEvents(customerLocation)
    ]);

    return {
      demand: demand.level,
      supply: supply.count,
      demandSupplyRatio: demand.level / Math.max(supply.count, 1),
      weather: weather.conditions,
      isRushHour: this.isRushHour(),
      hasLocalEvents: events.length > 0,
      restaurantBusyness: await this.getRestaurantBusyness(restaurantId)
    };
  }

  async calculatePricingMultipliers(context) {
    const multipliers = {
      demand: 1.0,
      supply: 1.0,
      weather: 1.0,
      time: 1.0,
      events: 1.0
    };

    // Demand-supply multiplier
    if (context.demandSupplyRatio > 2) {
      multipliers.demand = Math.min(2.0, 1 + (context.demandSupplyRatio - 2) * 0.2);
    }

    // Weather multiplier
    if (context.weather.includes('rain') || context.weather.includes('snow')) {
      multipliers.weather = 1.3;
    }

    // Time-based multiplier
    if (context.isRushHour) {
      multipliers.time = 1.2;
    }

    // Event multiplier
    if (context.hasLocalEvents) {
      multipliers.events = 1.15;
    }

    return multipliers;
  }
}
```

### Interview Questions
1. How would you handle surge pricing during natural disasters or emergencies?
2. Design a system to predict delivery demand 2 hours in advance.
3. How would you optimize driver allocation across multiple cities?

---

## Case Study 6: Airbnb - Search Ranking and Availability Management

### Scenario
Design a search system that ranks millions of properties based on relevance, quality, and personalization while managing real-time availability across different time zones.

### Technical Challenges

#### Property Ranking Algorithm
```javascript
class PropertyRankingService {
  constructor(searchService, qualityScorer, personalizationEngine) {
    this.search = searchService;
    this.quality = qualityScorer;
    this.personalization = personalizationEngine;
  }

  async rankProperties(searchCriteria, userId) {
    const candidates = await this.search.findCandidateProperties(searchCriteria);
    
    const rankedProperties = await Promise.all(
      candidates.map(async (property) => {
        const scores = await this.calculatePropertyScores(property, searchCriteria, userId);
        return {
          ...property,
          rankingScore: this.combineScores(scores),
          scoreBreakdown: scores
        };
      })
    );

    return rankedProperties
      .sort((a, b) => b.rankingScore - a.rankingScore)
      .slice(0, searchCriteria.limit || 50);
  }

  async calculatePropertyScores(property, searchCriteria, userId) {
    const [
      qualityScore,
      relevanceScore,
      personalizationScore,
      pricingScore,
      availabilityScore
    ] = await Promise.all([
      this.quality.calculateQualityScore(property),
      this.calculateRelevanceScore(property, searchCriteria),
      this.personalization.getPersonalizationScore(property, userId),
      this.calculatePricingScore(property, searchCriteria),
      this.calculateAvailabilityScore(property, searchCriteria)
    ]);

    return {
      quality: qualityScore,
      relevance: relevanceScore,
      personalization: personalizationScore,
      pricing: pricingScore,
      availability: availabilityScore
    };
  }

  combineScores(scores) {
    // Weighted combination of different scoring factors
    return (
      scores.quality * 0.25 +
      scores.relevance * 0.25 +
      scores.personalization * 0.20 +
      scores.pricing * 0.15 +
      scores.availability * 0.15
    );
  }
}
```

### Interview Questions
1. How would you handle overbooking scenarios in a distributed system?
2. Design a system to detect and prevent fraudulent property listings.
3. How would you implement dynamic pricing based on local events and seasonality?

---

## Common Architecture Patterns

### Event-Driven Architecture
```javascript
class EventDrivenEcommerceSystem {
  constructor(eventBus, eventStore) {
    this.eventBus = eventBus;
    this.eventStore = eventStore;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.eventBus.subscribe('OrderCreated', this.handleOrderCreated.bind(this));
    this.eventBus.subscribe('PaymentProcessed', this.handlePaymentProcessed.bind(this));
    this.eventBus.subscribe('InventoryUpdated', this.handleInventoryUpdated.bind(this));
    this.eventBus.subscribe('UserBehaviorTracked', this.handleUserBehavior.bind(this));
  }

  async handleOrderCreated(event) {
    // Multiple services react to order creation
    await Promise.all([
      this.reserveInventory(event.data),
      this.initializePaymentProcess(event.data),
      this.updateRecommendations(event.data.userId),
      this.notifyFulfillmentCenter(event.data)
    ]);
  }

  async handlePaymentProcessed(event) {
    if (event.data.status === 'success') {
      await this.confirmInventoryReservation(event.data.orderId);
      await this.triggerFulfillment(event.data.orderId);
    } else {
      await this.releaseInventoryReservation(event.data.orderId);
      await this.notifyCustomerOfFailure(event.data);
    }
  }
}
```

## Performance Optimization Strategies

### Database Optimization
- **Read Replicas**: Separate read and write operations
- **Sharding**: Distribute data across multiple databases
- **Caching**: Multi-layer caching strategy (Redis, CDN, Application)
- **Connection Pooling**: Efficient database connection management

### Search Optimization
- **Elasticsearch Clusters**: Distributed search with proper indexing
- **Search Result Caching**: Cache popular search queries
- **Faceted Search**: Pre-computed aggregations for filters
- **Auto-complete**: Optimized suggestion systems

### Traffic Management
- **Load Balancing**: Distribute traffic across multiple servers
- **Rate Limiting**: Prevent abuse and ensure fair usage
- **Circuit Breakers**: Prevent cascade failures
- **Queue Systems**: Handle traffic spikes gracefully

## Key Takeaways

1. **Scalability**: Design systems that can handle 10x traffic growth
2. **Reliability**: Implement proper error handling and fallback mechanisms
3. **Performance**: Optimize for sub-second response times
4. **Personalization**: Balance personalization with system performance
5. **Real-time Processing**: Handle real-time updates without blocking operations
6. **Data Consistency**: Manage consistency in distributed systems
7. **Monitoring**: Implement comprehensive monitoring and alerting

These scenarios represent real-world challenges that senior backend developers face when building large-scale e-commerce and marketplace platforms. Understanding these patterns and solutions is crucial for technical interviews and actual system design work.