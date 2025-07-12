---
title: "Distributed Systems Interview Questions"
description: "Advanced interview questions covering consensus algorithms, distributed transactions, fault tolerance, and real-world system design scenarios"
category: "system-design"
topic: "distributed-systems"
difficulty: "advanced"
tags: ["distributed-systems", "consensus", "fault-tolerance", "microservices", "system-design"]
lastUpdated: "2024-12-09"
---

# Distributed Systems Interview Questions

## Consensus Algorithms & Distributed Coordination

### 1. Explain the CAP theorem and how it applies to distributed system design
**Answer:** The CAP theorem states that in a distributed system, you can only guarantee two of three properties: Consistency, Availability, and Partition tolerance. In practice, network partitions are inevitable, so you must choose between consistency and availability.

**Follow-up:** How would you design a system that prioritizes availability over consistency? What about the opposite?

### 2. Compare Raft and PBFT consensus algorithms
**Answer:** Raft is designed for crash-fault tolerance with leader election and log replication, while PBFT (Practical Byzantine Fault Tolerance) handles Byzantine failures including malicious nodes. Raft requires 2f+1 nodes to tolerate f failures, PBFT needs 3f+1.

**Follow-up:** When would you choose one over the other in a real system?

### 3. How does the Two-Phase Commit protocol work and what are its limitations?
**Answer:** 2PC involves a coordinator sending prepare messages, collecting votes, then sending commit/abort decisions. Limitations include blocking on coordinator failure and inability to handle network partitions gracefully.

**Follow-up:** How does Three-Phase Commit attempt to solve 2PC's problems?

### 4. Explain vector clocks and their use in distributed systems
**Answer:** Vector clocks track causality between events in distributed systems. Each process maintains a vector of logical timestamps, incrementing its own counter for events and updating from received messages.

**Follow-up:** How do vector clocks compare to Lamport timestamps?

### 5. What is the FLP impossibility result and its implications?
**Answer:** The FLP theorem proves that in an asynchronous network with even one faulty process, no deterministic consensus algorithm can guarantee termination. This explains why practical systems use timeouts and failure detectors.

**Follow-up:** How do real systems work around this theoretical limitation?

## Distributed Transactions & Data Consistency

### 6. Design a distributed transaction system for a multi-database e-commerce platform
**Scenario:** You need to handle orders that span inventory, payment, and shipping databases.

**Answer:** Implement saga pattern with compensating transactions, event sourcing for audit trails, and eventual consistency with careful ordering of operations.

**Follow-up:** How would you handle partial failures in this system?

### 7. Explain the difference between strong and eventual consistency
**Answer:** Strong consistency ensures all nodes see the same data simultaneously, while eventual consistency guarantees convergence given no new updates. Trade-offs involve latency, availability, and complexity.

**Follow-up:** Give examples of systems that use each approach and why.

### 8. How would you implement distributed locking?
**Answer:** Options include database-based locks, Redis with expiration, ZooKeeper ephemeral nodes, or consensus-based approaches. Each has trade-offs in performance, reliability, and complexity.

**Follow-up:** What happens when a lock holder crashes?

### 9. Design a distributed cache invalidation strategy
**Answer:** Approaches include TTL-based expiration, event-driven invalidation, version-based cache tags, or write-through/write-behind patterns with message queues.

**Follow-up:** How do you handle cache stampedes in a distributed environment?

### 10. Explain ACID properties in distributed systems
**Answer:** Atomicity across services requires distributed transactions or sagas. Consistency becomes eventual. Isolation needs distributed locking or optimistic concurrency. Durability requires replication.

**Follow-up:** How do NoSQL databases modify these guarantees?

## Fault Tolerance & System Resilience

### 11. Design a system that can handle cascading failures
**Answer:** Implement circuit breakers, bulkheads, timeouts, retries with exponential backoff, graceful degradation, and health checks. Use chaos engineering to test failure scenarios.

**Follow-up:** How do you prevent a single service failure from bringing down the entire system?

### 12. How would you handle network partitions in a distributed database?
**Answer:** Implement partition tolerance through data replication, conflict resolution strategies (last-write-wins, vector clocks), and read/write quorums. Consider split-brain prevention.

**Follow-up:** What's the difference between AP and CP systems in this context?

### 13. Explain the concept of "jittered exponential backoff"
**Answer:** Exponential backoff increases retry delays exponentially, while jitter adds randomness to prevent thundering herd problems when many clients retry simultaneously.

**Follow-up:** How do you determine optimal backoff parameters?

### 14. Design a health check system for microservices
**Answer:** Implement shallow and deep health checks, dependency health propagation, circuit breaker integration, and health check aggregation with proper timeouts and failure thresholds.

**Follow-up:** How do you avoid health check storms?

### 15. How do you implement graceful degradation in distributed systems?
**Answer:** Design fallback mechanisms, feature flags, service prioritization, load shedding, and cached responses. Implement bulkhead patterns to isolate failures.

**Follow-up:** Give an example of graceful degradation in a real system.

## Real-World System Design Scenarios

### 16. Design Netflix's content delivery and recommendation system
**Key Components:**
- Global CDN with edge caching
- Microservices for user profiles, recommendations, content metadata
- Event-driven architecture for viewing analytics
- A/B testing framework for recommendations
- Chaos engineering for resilience testing

**Follow-up:** How do you handle peak traffic during popular show releases?

### 17. Design Uber's real-time matching system
**Key Components:**
- Geospatial indexing for driver/rider locations
- Real-time matching algorithm with supply/demand balancing
- Event sourcing for trip state management
- Distributed caching for hot locations
- Surge pricing algorithm

**Follow-up:** How do you ensure consistency between rider and driver views?

### 18. Design Twitter's timeline generation system
**Key Components:**
- Fan-out strategies (push vs pull models)
- Timeline caching with Redis clusters
- Celebrity user handling (hybrid approach)
- Real-time updates with WebSockets
- Content ranking algorithms

**Follow-up:** How do you handle timeline generation for users with millions of followers?

### 19. Design a distributed chat system like WhatsApp
**Key Components:**
- Message routing and delivery guarantees
- End-to-end encryption key management
- Presence and typing indicators
- Message ordering and deduplication
- Offline message storage and sync

**Follow-up:** How do you ensure message ordering in group chats?

### 20. Design Amazon's order processing system
**Key Components:**
- Inventory management with eventual consistency
- Payment processing with saga patterns
- Order state machine with event sourcing
- Warehouse management system integration
- Fraud detection pipeline

**Follow-up:** How do you handle inventory overselling during flash sales?

## Microservices Communication & Service Mesh

### 21. Compare synchronous vs asynchronous communication in microservices
**Answer:** Synchronous (REST, gRPC) provides immediate responses but creates tight coupling. Asynchronous (message queues, events) enables loose coupling but adds complexity in error handling and debugging.

**Follow-up:** When would you choose each approach?

### 22. Explain the role of a service mesh in microservices architecture
**Answer:** Service mesh provides service-to-service communication infrastructure including load balancing, service discovery, encryption, observability, and traffic management without changing application code.

**Follow-up:** Compare Istio, Linkerd, and Consul Connect.

### 23. How do you implement distributed tracing across microservices?
**Answer:** Use correlation IDs, implement trace context propagation, leverage tools like Jaeger or Zipkin, and ensure proper instrumentation across all services and communication channels.

**Follow-up:** How do you handle trace sampling in high-throughput systems?

### 24. Design an event-driven architecture for an e-commerce platform
**Answer:** Implement event sourcing, CQRS patterns, event streaming with Kafka, saga orchestration, and proper event schema evolution strategies.

**Follow-up:** How do you handle event ordering and duplicate processing?

### 25. Explain the Strangler Fig pattern for microservices migration
**Answer:** Gradually replace monolithic functionality by routing traffic to new microservices while maintaining the existing system, eventually "strangling" the old system.

**Follow-up:** What are the challenges in implementing this pattern?

## Network Partitions & System Failures

### 26. How do you detect and handle split-brain scenarios?
**Answer:** Implement quorum-based decisions, use external arbitrators, implement fencing mechanisms, and design systems to fail-safe rather than fail-open.

**Follow-up:** Give an example of split-brain in a database cluster.

### 27. Design a system that can operate during network partitions
**Answer:** Implement local caching, offline-first design, conflict resolution strategies, and eventual consistency with proper reconciliation mechanisms.

**Follow-up:** How do you handle conflicting updates during partition healing?

### 28. Explain the concept of "partial failures" in distributed systems
**Answer:** Partial failures occur when some components fail while others continue operating, creating inconsistent system states that are harder to detect and handle than complete failures.

**Follow-up:** How do you design systems to handle partial failures gracefully?

### 29. How do you implement leader election in a distributed system?
**Answer:** Use consensus algorithms like Raft, implement heartbeat mechanisms, handle split-vote scenarios, and ensure proper failover with minimal downtime.

**Follow-up:** What happens when the leader becomes a slow follower?

### 30. Design a distributed system that can handle correlated failures
**Answer:** Implement geographic distribution, avoid single points of failure, use diverse technology stacks, implement proper monitoring and alerting, and design for cascading failure prevention.

**Follow-up:** How do you test for correlated failure scenarios?

## Advanced Distributed Systems Concepts

### 31. Explain the concept of "exactly-once" delivery in distributed systems
**Answer:** True exactly-once delivery is impossible in distributed systems. Instead, implement idempotent operations and at-least-once delivery with deduplication mechanisms.

**Follow-up:** How do you implement idempotency in a payment processing system?

### 32. How do you implement distributed rate limiting?
**Answer:** Use sliding window algorithms, distributed counters with Redis, token bucket implementations, or consensus-based approaches for strict limits.

**Follow-up:** How do you handle rate limiting across multiple data centers?

### 33. Design a distributed configuration management system
**Answer:** Implement hierarchical configuration, version control, gradual rollouts, configuration validation, and real-time updates with proper fallback mechanisms.

**Follow-up:** How do you ensure configuration consistency across services?

### 34. Explain the trade-offs between microservices and monoliths
**Answer:** Microservices provide scalability, technology diversity, and team autonomy but add complexity in communication, data consistency, and operational overhead.

**Follow-up:** When would you recommend staying with a monolith?

### 35. How do you implement distributed caching with cache coherence?
**Answer:** Use cache invalidation strategies, implement cache hierarchies, use consistent hashing for distribution, and handle cache warming and stampede prevention.

**Follow-up:** How do you handle cache coherence in a multi-region setup?

### 36. Design a distributed logging and monitoring system
**Answer:** Implement log aggregation, distributed tracing, metrics collection, alerting systems, and proper data retention policies with efficient querying capabilities.

**Follow-up:** How do you handle log correlation across microservices?

### 37. Explain the concept of "eventual consistency" with practical examples
**Answer:** Systems converge to consistent state given no new updates. Examples include DNS propagation, social media feeds, and distributed databases like Cassandra.

**Follow-up:** How do you handle business logic that requires strong consistency?

### 38. How do you implement distributed deadlock detection and prevention?
**Answer:** Use timeout-based detection, implement wait-for graphs, use ordered resource acquisition, or design lock-free algorithms where possible.

**Follow-up:** What are the trade-offs between prevention and detection approaches?

## Performance & Scalability Questions

### 39. How do you scale a system from 1,000 to 1 million concurrent users?
**Answer:** Implement horizontal scaling, caching layers, database sharding, CDN usage, load balancing, and asynchronous processing with proper monitoring.

**Follow-up:** What bottlenecks would you expect at each scale milestone?

### 40. Design a system for handling 1 million requests per second
**Answer:** Use load balancers, implement caching at multiple layers, use database read replicas, implement proper connection pooling, and consider event-driven architectures.

**Follow-up:** How do you maintain data consistency at this scale?

---

## Study Tips

1. **Practice System Design:** Work through complete system designs including failure scenarios
2. **Understand Trade-offs:** Every distributed system decision involves trade-offs
3. **Real-world Examples:** Study how major companies solve distributed systems problems
4. **Hands-on Experience:** Build small distributed systems to understand practical challenges
5. **Stay Updated:** Distributed systems is an evolving field with new patterns and tools

## Additional Resources

- "Designing Data-Intensive Applications" by Martin Kleppmann
- "Distributed Systems: Concepts and Design" by Coulouris et al.
- Papers: Raft, PBFT, Dynamo, BigTable, MapReduce
- Practice platforms: System design interviews, distributed systems courses