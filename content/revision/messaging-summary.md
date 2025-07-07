---
title: "Message Queues & Event Streaming - Revision Summary"
category: "revision"
difficulty: "advanced"
estimatedReadTime: 8
tags: ["messaging", "event-streaming", "kafka", "rabbitmq", "event-driven", "microservices", "revision"]
lastUpdated: "2024-01-15"
printFriendly: true
---

# Message Queues & Event Streaming - Revision Summary

## Message Queue Fundamentals

### Key Concepts
- **Producer**: Sends messages to queue
- **Consumer**: Receives and processes messages
- **Queue**: Buffer that stores messages
- **Broker**: Message routing and delivery system

### Message Patterns
- **Point-to-Point**: One producer, one consumer
- **Publish-Subscribe**: One producer, multiple consumers
- **Request-Reply**: Synchronous communication pattern
- **Message Routing**: Route messages based on content/headers

### RabbitMQ Implementation
```javascript
const amqp = require('amqplib');

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
  }

  // Simple Queue Pattern
  async sendToQueue(queueName, message) {
    await this.channel.assertQueue(queueName, { durable: true });
    this.channel.sendToQueue(
      queueName, 
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }

  async consumeFromQueue(queueName, callback) {
    await this.channel.assertQueue(queueName, { durable: true });
    this.channel.prefetch(1); // Process one message at a time
    
    this.channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await callback(content);
          this.channel.ack(msg);
        } catch (error) {
          console.error('Message processing failed:', error);
          this.channel.nack(msg, false, false); // Dead letter queue
        }
      }
    });
  }

  // Publish-Subscribe Pattern
  async publishToExchange(exchangeName, routingKey, message) {
    await this.channel.assertExchange(exchangeName, 'topic', { durable: true });
    this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }

  async subscribeToExchange(exchangeName, routingKey, callback) {
    await this.channel.assertExchange(exchangeName, 'topic', { durable: true });
    const q = await this.channel.assertQueue('', { exclusive: true });
    
    await this.channel.bindQueue(q.queue, exchangeName, routingKey);
    
    this.channel.consume(q.queue, async (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        await callback(content);
        this.channel.ack(msg);
      }
    });
  }
}

// Usage Example
const rabbitmq = new RabbitMQService();
await rabbitmq.connect();

// Order Processing Example
await rabbitmq.publishToExchange('orders', 'order.created', {
  orderId: '12345',
  customerId: 'user123',
  amount: 99.99,
  timestamp: new Date()
});

// Multiple services can subscribe
await rabbitmq.subscribeToExchange('orders', 'order.created', async (order) => {
  await emailService.sendOrderConfirmation(order);
});

await rabbitmq.subscribeToExchange('orders', 'order.created', async (order) => {
  await inventoryService.updateStock(order);
});
```

## Event Streaming with Apache Kafka

### Key Concepts
- **Topic**: Category of messages
- **Partition**: Ordered sequence within a topic
- **Offset**: Unique identifier for each message
- **Consumer Group**: Load balancing across consumers

### Kafka Implementation
```javascript
const kafka = require('kafkajs');

class KafkaService {
  constructor() {
    this.kafka = kafka({
      clientId: 'my-app',
      brokers: ['localhost:9092']
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'my-group' });
  }

  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  // Produce Messages
  async publishEvent(topic, key, value) {
    await this.producer.send({
      topic,
      messages: [{
        key,
        value: JSON.stringify(value),
        timestamp: Date.now(),
        headers: {
          'content-type': 'application/json',
          'source': 'user-service'
        }
      }]
    });
  }

  // Batch Publishing for High Throughput
  async publishBatch(topic, messages) {
    const kafkaMessages = messages.map(msg => ({
      key: msg.key,
      value: JSON.stringify(msg.value),
      timestamp: Date.now()
    }));

    await this.producer.sendBatch({
      topicMessages: [{
        topic,
        messages: kafkaMessages
      }]
    });
  }

  // Consume Messages
  async subscribeToTopic(topic, callback) {
    await this.consumer.subscribe({ topic, fromBeginning: false });
    
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = JSON.parse(message.value.toString());
          const key = message.key?.toString();
          
          await callback({
            topic,
            partition,
            offset: message.offset,
            key,
            value,
            timestamp: message.timestamp,
            headers: message.headers
          });
        } catch (error) {
          console.error('Message processing error:', error);
          // Implement dead letter topic logic
        }
      },
    });
  }

  // Exactly-Once Processing
  async processWithTransaction(topic, callback) {
    const transaction = await this.producer.transaction();
    
    try {
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          const value = JSON.parse(message.value.toString());
          
          // Process message
          const result = await callback(value);
          
          // Produce result within transaction
          await transaction.send({
            topic: 'processed-events',
            messages: [{
              value: JSON.stringify(result)
            }]
          });
        }
      });
      
      await transaction.commit();
    } catch (error) {
      await transaction.abort();
      throw error;
    }
  }
}

// Event-Driven Architecture Example
const kafka = new KafkaService();
await kafka.connect();

// User Registration Event
await kafka.publishEvent('user-events', 'user123', {
  eventType: 'USER_REGISTERED',
  userId: 'user123',
  email: 'user@example.com',
  timestamp: new Date()
});

// Multiple Services React to Event
await kafka.subscribeToTopic('user-events', async (message) => {
  const { eventType, userId, email } = message.value;
  
  switch (eventType) {
    case 'USER_REGISTERED':
      await emailService.sendWelcomeEmail(email);
      await analyticsService.trackUserRegistration(userId);
      break;
    case 'USER_UPDATED':
      await cacheService.invalidateUser(userId);
      break;
  }
});
```

## Event Sourcing Pattern

### Key Concepts
- **Event Store**: Append-only log of events
- **Aggregate**: Business entity that generates events
- **Projection**: Read model built from events
- **Snapshot**: Point-in-time state for performance

### Event Sourcing Implementation
```javascript
class EventStore {
  constructor() {
    this.events = new Map(); // In production, use database
  }

  async appendEvents(streamId, events, expectedVersion) {
    const existingEvents = this.events.get(streamId) || [];
    
    if (existingEvents.length !== expectedVersion) {
      throw new Error('Concurrency conflict');
    }

    const newEvents = events.map((event, index) => ({
      ...event,
      streamId,
      version: expectedVersion + index + 1,
      timestamp: new Date(),
      eventId: generateUUID()
    }));

    this.events.set(streamId, [...existingEvents, ...newEvents]);
    
    // Publish events to message broker
    for (const event of newEvents) {
      await this.publishEvent(event);
    }

    return newEvents;
  }

  async getEvents(streamId, fromVersion = 0) {
    const events = this.events.get(streamId) || [];
    return events.filter(e => e.version > fromVersion);
  }

  async publishEvent(event) {
    await kafka.publishEvent('domain-events', event.streamId, event);
  }
}

// Aggregate Example
class BankAccount {
  constructor(accountId) {
    this.accountId = accountId;
    this.balance = 0;
    this.version = 0;
    this.uncommittedEvents = [];
  }

  static async fromHistory(eventStore, accountId) {
    const events = await eventStore.getEvents(accountId);
    const account = new BankAccount(accountId);
    
    events.forEach(event => account.apply(event));
    account.uncommittedEvents = [];
    
    return account;
  }

  deposit(amount) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    this.raiseEvent({
      type: 'MoneyDeposited',
      data: { amount }
    });
  }

  withdraw(amount) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    
    if (this.balance < amount) {
      throw new Error('Insufficient funds');
    }

    this.raiseEvent({
      type: 'MoneyWithdrawn',
      data: { amount }
    });
  }

  raiseEvent(event) {
    this.apply(event);
    this.uncommittedEvents.push(event);
  }

  apply(event) {
    switch (event.type) {
      case 'AccountOpened':
        this.balance = event.data.initialBalance || 0;
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

  async save(eventStore) {
    if (this.uncommittedEvents.length === 0) return;

    await eventStore.appendEvents(
      this.accountId,
      this.uncommittedEvents,
      this.version - this.uncommittedEvents.length
    );

    this.uncommittedEvents = [];
  }
}

// Usage
const eventStore = new EventStore();
const account = new BankAccount('account-123');

account.deposit(100);
account.withdraw(30);
await account.save(eventStore);
```

## CQRS (Command Query Responsibility Segregation)

### Implementation Pattern
```javascript
// Command Side (Write Model)
class CreateOrderCommand {
  constructor(customerId, items) {
    this.customerId = customerId;
    this.items = items;
  }
}

class OrderCommandHandler {
  constructor(orderRepository, eventBus) {
    this.orderRepository = orderRepository;
    this.eventBus = eventBus;
  }

  async handle(command) {
    const order = new Order(command.customerId, command.items);
    await this.orderRepository.save(order);
    
    await this.eventBus.publish('OrderCreated', {
      orderId: order.id,
      customerId: order.customerId,
      total: order.total
    });
  }
}

// Query Side (Read Model)
class OrderProjection {
  constructor(database) {
    this.db = database;
  }

  async handleOrderCreated(event) {
    await this.db.orders.insert({
      id: event.orderId,
      customerId: event.customerId,
      total: event.total,
      status: 'pending',
      createdAt: new Date()
    });
  }

  async handleOrderShipped(event) {
    await this.db.orders.update(
      { id: event.orderId },
      { status: 'shipped', shippedAt: new Date() }
    );
  }

  async getOrdersByCustomer(customerId) {
    return await this.db.orders.find({ customerId });
  }

  async getOrderSummary(orderId) {
    return await this.db.orders.findOne({ id: orderId });
  }
}

// Event Handler Registration
const eventBus = new EventBus();
const orderProjection = new OrderProjection(database);

eventBus.subscribe('OrderCreated', orderProjection.handleOrderCreated.bind(orderProjection));
eventBus.subscribe('OrderShipped', orderProjection.handleOrderShipped.bind(orderProjection));
```

## Saga Pattern for Distributed Transactions

### Choreography-based Saga
```javascript
class OrderSaga {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.eventBus.subscribe('OrderCreated', this.handleOrderCreated.bind(this));
    this.eventBus.subscribe('PaymentProcessed', this.handlePaymentProcessed.bind(this));
    this.eventBus.subscribe('PaymentFailed', this.handlePaymentFailed.bind(this));
    this.eventBus.subscribe('InventoryReserved', this.handleInventoryReserved.bind(this));
    this.eventBus.subscribe('InventoryReservationFailed', this.handleInventoryReservationFailed.bind(this));
  }

  async handleOrderCreated(event) {
    // Step 1: Process Payment
    await this.eventBus.publish('ProcessPayment', {
      orderId: event.orderId,
      customerId: event.customerId,
      amount: event.total
    });
  }

  async handlePaymentProcessed(event) {
    // Step 2: Reserve Inventory
    await this.eventBus.publish('ReserveInventory', {
      orderId: event.orderId,
      items: event.items
    });
  }

  async handleInventoryReserved(event) {
    // Step 3: Complete Order
    await this.eventBus.publish('CompleteOrder', {
      orderId: event.orderId
    });
  }

  // Compensation Actions
  async handlePaymentFailed(event) {
    await this.eventBus.publish('CancelOrder', {
      orderId: event.orderId,
      reason: 'Payment failed'
    });
  }

  async handleInventoryReservationFailed(event) {
    // Compensate: Refund payment
    await this.eventBus.publish('RefundPayment', {
      orderId: event.orderId,
      amount: event.amount
    });
    
    await this.eventBus.publish('CancelOrder', {
      orderId: event.orderId,
      reason: 'Inventory unavailable'
    });
  }
}
```

## Quick Reference Cheat Sheet

| Pattern | Use Case | Pros | Cons |
|---------|----------|------|------|
| Message Queue | Async processing | Decoupling, reliability | Complexity, latency |
| Event Streaming | Real-time data | High throughput, replay | Storage overhead |
| Event Sourcing | Audit trail | Complete history | Query complexity |
| CQRS | Read/write separation | Optimized models | Eventual consistency |
| Saga | Distributed transactions | Fault tolerance | Complex coordination |

## Message Broker Comparison

| Feature | RabbitMQ | Apache Kafka | Redis Streams |
|---------|----------|--------------|---------------|
| **Type** | Message Broker | Event Streaming | In-memory Stream |
| **Throughput** | Medium | Very High | High |
| **Persistence** | Optional | Always | Optional |
| **Ordering** | Per Queue | Per Partition | Per Stream |
| **Delivery** | At-most-once, At-least-once | At-least-once, Exactly-once | At-least-once |
| **Use Case** | Task queues | Event streaming | Real-time analytics |

## Performance Considerations

### Kafka Optimization
```javascript
// Producer Configuration
const producer = kafka.producer({
  maxInFlightRequests: 1,
  idempotent: true,
  transactionTimeout: 30000,
  // Batching for throughput
  batchSize: 16384,
  lingerMs: 10,
  // Compression
  compression: 'gzip'
});

// Consumer Configuration
const consumer = kafka.consumer({
  groupId: 'my-group',
  // Fetch optimization
  minBytes: 1024,
  maxBytes: 1048576,
  maxWaitTimeInMs: 500,
  // Commit strategy
  autoCommit: false,
  autoCommitInterval: 5000
});
```

## Common Interview Questions

1. **Message Queue vs Event Streaming**: When to use each approach
2. **Event Sourcing**: Benefits, challenges, and implementation
3. **CQRS**: Separation of concerns and consistency models
4. **Saga Pattern**: Distributed transaction management
5. **Kafka Architecture**: Topics, partitions, and consumer groups
6. **Message Delivery Guarantees**: At-most-once, at-least-once, exactly-once
7. **Event-Driven Architecture**: Design patterns and best practices
8. **Backpressure**: Handling slow consumers and system overload

## Best Practices

- **Idempotency**: Design message handlers to be idempotent
- **Dead Letter Queues**: Handle failed message processing
- **Message Versioning**: Plan for schema evolution
- **Monitoring**: Track message throughput, latency, and errors
- **Partitioning**: Use appropriate partition keys for load distribution
- **Retention**: Configure appropriate message retention policies
- **Security**: Implement authentication and encryption
- **Testing**: Use test containers for integration testing