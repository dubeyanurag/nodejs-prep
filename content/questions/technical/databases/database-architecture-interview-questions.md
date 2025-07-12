---
title: "Database Architecture Interview Questions"
category: "databases"
subcategory: "architecture"
difficulty: "advanced"
estimatedReadTime: 45
questionCount: 35
lastUpdated: "2025-01-08"
tags: ["database-architecture", "ACID", "CAP-theorem", "consistency", "scaling", "security", "compliance"]
companies: ["Google", "Amazon", "Microsoft", "Meta", "Netflix", "Uber", "Airbnb"]
frequency: "very-common"
---

# Database Architecture Interview Questions

## Quick Read (10-15 minutes)

### Executive Summary
Database architecture questions test your understanding of designing data systems at scale, including ACID properties, consistency models, CAP theorem trade-offs, and compliance requirements. These questions are crucial for senior backend roles where you'll design systems handling millions of users and petabytes of data.

### Key Points
- **ACID Properties**: Atomicity, Consistency, Isolation, Durability fundamentals
- **CAP Theorem**: Consistency, Availability, Partition tolerance trade-offs
- **Consistency Models**: Strong, eventual, weak consistency patterns
- **Scaling Strategies**: Horizontal vs vertical scaling, sharding, replication
- **Security & Compliance**: GDPR, HIPAA, PCI DSS requirements
- **Migration Patterns**: Zero-downtime migrations, data synchronization

### TL;DR
Master ACID properties and CAP theorem trade-offs. Understand when to choose consistency vs availability. Know scaling patterns (sharding, replication) and compliance requirements (GDPR, HIPAA). Practice designing systems for Netflix, Uber, and financial services scale.

## Comprehensive Interview Questions (35+ Questions)

### ACID Properties & Transaction Management

### Q1: Explain ACID properties and how they apply in distributed systems
**Difficulty:** Senior | **Companies:** Google, Amazon, Meta | **Frequency:** Very Common

#### Quick Answer (30 seconds)
ACID ensures database reliability: Atomicity (all-or-nothing), Consistency (valid state), Isolation (concurrent safety), Durability (permanent storage). In distributed systems, maintaining ACID across nodes requires coordination protocols like 2PC.

#### Detailed Answer (3-5 minutes)
ACID properties form the foundation of reliable database systems:

**Atomicity**: Transactions are all-or-nothing. Either all operations succeed or all fail, leaving no partial state.

**Consistency**: Database moves from one valid state to another, maintaining all constraints and rules.

**Isolation**: Concurrent transactions don't interfere with each other, appearing to execute sequentially.

**Durability**: Committed changes survive system failures through persistent storage.

In distributed systems, ACID becomes challenging:
- **Cross-node atomicity** requires distributed consensus (2PC, 3PC)
- **Consistency** may be relaxed for availability (eventual consistency)
- **Isolation levels** must balance performance with correctness
- **Durability** requires replication across multiple nodes

#### Code Example
```sql
-- Traditional ACID transaction
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- Distributed transaction with compensation
BEGIN DISTRIBUTED TRANSACTION;
  -- Node A: Debit account
  PREPARE debit_account(user_id=1, amount=100);
  -- Node B: Credit account  
  PREPARE credit_account(user_id=2, amount=100);
  
  IF all_nodes_prepared THEN
    COMMIT ALL;
  ELSE
    ROLLBACK ALL;
  END IF;
END TRANSACTION;
```

#### Real-World Context
Financial systems like Stripe use distributed ACID to ensure payment consistency across multiple services while maintaining high availability for global transactions.

#### Common Mistakes
- Assuming ACID works the same in distributed systems
- Not understanding isolation level trade-offs
- Ignoring compensation patterns for distributed failures

#### Follow-up Questions
1. How would you implement distributed transactions without 2PC?
2. What are the trade-offs between different isolation levels?
3. How do you handle partial failures in distributed ACID systems?

#### Related Topics
- Two-phase commit protocol
- Saga pattern
- Event sourcing
### Q2: C
ompare different isolation levels and their use cases
**Difficulty:** Senior | **Companies:** Amazon, Microsoft, Uber | **Frequency:** Common

#### Quick Answer (30 seconds)
Isolation levels balance consistency and performance: Read Uncommitted (dirty reads), Read Committed (no dirty reads), Repeatable Read (consistent reads), Serializable (full isolation). Choose based on consistency requirements vs performance needs.

#### Detailed Answer (3-5 minutes)
Isolation levels define how transactions interact:

**Read Uncommitted (Level 0)**
- Allows dirty reads of uncommitted data
- Highest performance, lowest consistency
- Use case: Analytics on non-critical data

**Read Committed (Level 1)**
- Prevents dirty reads, allows non-repeatable reads
- Default for most databases
- Use case: Most web applications

**Repeatable Read (Level 2)**
- Prevents dirty and non-repeatable reads
- May still have phantom reads
- Use case: Financial reporting

**Serializable (Level 3)**
- Full isolation, transactions appear sequential
- Highest consistency, lowest performance
- Use case: Critical financial transactions

#### Code Example
```sql
-- Read Committed (default)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN;
SELECT balance FROM accounts WHERE id = 1; -- 100
-- Another transaction updates balance to 200
SELECT balance FROM accounts WHERE id = 1; -- 200 (non-repeatable read)
COMMIT;

-- Repeatable Read
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
SELECT balance FROM accounts WHERE id = 1; -- 100
-- Another transaction updates balance to 200
SELECT balance FROM accounts WHERE id = 1; -- 100 (consistent read)
COMMIT;
```

#### Real-World Context
E-commerce platforms use Read Committed for product browsing but Serializable for payment processing to prevent double-spending.

#### Common Mistakes
- Using Serializable everywhere (performance killer)
- Not understanding phantom read implications
- Ignoring deadlock potential with higher isolation levels

#### Follow-up Questions
1. How do you handle deadlocks in high isolation levels?
2. What's the performance impact of each isolation level?
3. How do NoSQL databases handle isolation?

### CAP Theorem & Consistency Models

### Q3: Explain CAP theorem and its practical implications
**Difficulty:** Senior | **Companies:** Google, Netflix, Amazon | **Frequency:** Very Common

#### Quick Answer (30 seconds)
CAP theorem states you can only guarantee 2 of 3: Consistency (all nodes see same data), Availability (system remains operational), Partition tolerance (works despite network failures). In practice, partition tolerance is required, so choose CP or AP.

#### Detailed Answer (3-5 minutes)
CAP theorem, proven by Eric Brewer, states distributed systems can only provide two of three guarantees:

**Consistency (C)**: All nodes return the same data simultaneously
**Availability (A)**: System remains operational and responsive
**Partition Tolerance (P)**: System continues despite network failures

In reality, network partitions are inevitable, so the choice is between CP and AP:

**CP Systems (Consistency + Partition Tolerance)**
- Sacrifice availability during partitions
- Examples: MongoDB (with strong consistency), HBase
- Use case: Financial systems, inventory management

**AP Systems (Availability + Partition Tolerance)**
- Sacrifice consistency for availability
- Examples: Cassandra, DynamoDB, CouchDB
- Use case: Social media, content delivery, analytics

**CA Systems (Consistency + Availability)**
- Only possible without network partitions
- Examples: Traditional RDBMS in single-node setup
- Not practical for distributed systems

#### Code Example
```javascript
// CP System - MongoDB with strong consistency
const result = await db.collection('accounts')
  .findOneAndUpdate(
    { _id: accountId },
    { $inc: { balance: -amount } },
    { 
      writeConcern: { w: 'majority', j: true },
      readConcern: { level: 'majority' }
    }
  );

// AP System - Cassandra with eventual consistency
const result = await client.execute(
  'UPDATE accounts SET balance = balance - ? WHERE id = ?',
  [amount, accountId],
  { consistency: cassandra.types.consistencies.one }
);
```

#### Real-World Context
Netflix chooses AP for viewing history (eventual consistency acceptable) but CP for billing (strong consistency required).

#### Common Mistakes
- Thinking you can have all three guarantees
- Not considering the "P" is usually mandatory
- Choosing wrong consistency model for use case

#### Follow-up Questions
1. How do you handle split-brain scenarios in CP systems?
2. What are the business implications of eventual consistency?
3. How do you test partition tolerance in your systems?### Q4
: Design a consistency model for a global social media platform
**Difficulty:** Staff | **Companies:** Meta, Twitter, TikTok | **Frequency:** Common

#### Quick Answer (30 seconds)
Use eventual consistency for posts/feeds (AP), strong consistency for critical data like payments (CP). Implement read-your-writes consistency for user experience. Use conflict-free replicated data types (CRDTs) for collaborative features.

#### Detailed Answer (3-5 minutes)
A global social media platform requires different consistency models for different features:

**Timeline/Feed (Eventual Consistency)**
- Users can tolerate slightly stale content
- Prioritize availability and performance
- Use async replication across regions

**User Profile (Read-Your-Writes Consistency)**
- Users expect to see their own updates immediately
- Route reads to the same region as writes
- Acceptable for others to see stale data briefly

**Financial Transactions (Strong Consistency)**
- Ad payments, premium subscriptions
- Use distributed transactions with consensus
- Sacrifice some availability for correctness

**Collaborative Features (CRDTs)**
- Real-time editing, shared documents
- Use conflict-free replicated data types
- Automatic conflict resolution

#### Code Example
```javascript
// Multi-level consistency architecture
class SocialMediaDB {
  async postUpdate(userId, content) {
    // Strong consistency for user's own view
    await this.writeToMasterRegion(userId, content);
    
    // Eventual consistency for global distribution
    this.asyncReplicateToRegions(content);
    
    // Update user's timeline immediately
    await this.updateUserTimeline(userId, content);
  }
  
  async getTimeline(userId, region) {
    // Read from local region for performance
    const timeline = await this.readFromRegion(region, userId);
    
    // Ensure user sees their own posts
    const userPosts = await this.getUserRecentPosts(userId);
    
    return this.mergeTimelines(timeline, userPosts);
  }
}
```

#### Real-World Context
Facebook uses eventual consistency for news feeds but strong consistency for financial transactions, with read-your-writes for user posts.

#### Common Mistakes
- Using same consistency model for all features
- Not considering user experience implications
- Ignoring conflict resolution strategies

#### Follow-up Questions
1. How do you handle conflicting updates in eventual consistency?
2. What's the latency impact of different consistency models?
3. How do you test consistency across global regions?

### Database Scaling & Architecture

### Q5: Design a database architecture for handling 100M+ users
**Difficulty:** Staff | **Companies:** Uber, Airbnb, Netflix | **Frequency:** Very Common

#### Quick Answer (30 seconds)
Use horizontal sharding by user ID, read replicas for scaling reads, caching layer (Redis), and separate OLTP/OLAP systems. Implement database federation by feature and use CDC for real-time analytics.

#### Detailed Answer (3-5 minutes)
Scaling to 100M+ users requires a multi-layered approach:

**Horizontal Sharding Strategy**
- Shard by user ID using consistent hashing
- Each shard handles 10-20M users
- Cross-shard queries minimized through denormalization

**Read Scaling**
- Multiple read replicas per shard
- Read/write splitting at application layer
- Geographic distribution of read replicas

**Caching Architecture**
- L1: Application-level cache (in-memory)
- L2: Distributed cache (Redis Cluster)
- L3: CDN for static content

**Data Architecture Separation**
- OLTP: Transactional workloads (MySQL/PostgreSQL)
- OLAP: Analytics workloads (BigQuery/Redshift)
- Real-time: Streaming analytics (Kafka + Flink)

#### Code Example
```javascript
// Database routing and sharding
class DatabaseRouter {
  constructor() {
    this.shards = [
      { id: 'shard1', range: [0, 25000000] },
      { id: 'shard2', range: [25000001, 50000000] },
      { id: 'shard3', range: [50000001, 75000000] },
      { id: 'shard4', range: [75000001, 100000000] }
    ];
  }
  
  getShardForUser(userId) {
    const hash = this.consistentHash(userId);
    return this.shards.find(shard => 
      hash >= shard.range[0] && hash <= shard.range[1]
    );
  }
  
  async readUser(userId) {
    const shard = this.getShardForUser(userId);
    // Try cache first
    const cached = await this.cache.get(`user:${userId}`);
    if (cached) return cached;
    
    // Read from replica
    const replica = this.getReadReplica(shard.id);
    const user = await replica.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    // Cache result
    await this.cache.set(`user:${userId}`, user, 3600);
    return user;
  }
}
```

#### Real-World Context
Uber's architecture uses geographic sharding for rides, user-based sharding for profiles, and separate systems for real-time tracking vs historical analytics.

#### Common Mistakes
- Not planning for cross-shard queries
- Ignoring hot shard problems
- Not separating OLTP from OLAP workloads

#### Follow-up Questions
1. How do you handle cross-shard transactions?
2. What's your strategy for resharding as you grow?
3. How do you maintain data consistency across shards?### 
Q6: Explain database replication strategies and their trade-offs
**Difficulty:** Senior | **Companies:** Amazon, Google, Microsoft | **Frequency:** Common

#### Quick Answer (30 seconds)
Master-slave replication provides read scaling but single point of failure. Master-master enables high availability but risks conflicts. Synchronous replication ensures consistency but impacts performance. Asynchronous replication improves performance but risks data loss.

#### Detailed Answer (3-5 minutes)
Database replication strategies balance consistency, availability, and performance:

**Master-Slave Replication**
- Single master handles writes, multiple slaves handle reads
- Pros: Simple, read scaling, consistent writes
- Cons: Single point of failure, write bottleneck
- Use case: Read-heavy applications

**Master-Master Replication**
- Multiple masters accept writes
- Pros: High availability, write scaling
- Cons: Conflict resolution complexity
- Use case: Geographically distributed applications

**Synchronous Replication**
- Writes confirmed only after all replicas updated
- Pros: Strong consistency, no data loss
- Cons: Higher latency, availability impact
- Use case: Financial systems

**Asynchronous Replication**
- Writes confirmed immediately, replicas updated later
- Pros: Low latency, high availability
- Cons: Potential data loss, eventual consistency
- Use case: Social media, content platforms

#### Code Example
```sql
-- MySQL Master-Slave Configuration
-- Master configuration
[mysqld]
server-id = 1
log-bin = mysql-bin
binlog-format = ROW

-- Slave configuration
[mysqld]
server-id = 2
relay-log = relay-bin
read-only = 1

-- Setup replication
CHANGE MASTER TO
  MASTER_HOST='master-host',
  MASTER_USER='replication_user',
  MASTER_PASSWORD='password',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=0;

START SLAVE;
```

#### Real-World Context
Amazon RDS uses synchronous replication for Multi-AZ deployments (high availability) and asynchronous replication for read replicas (read scaling).

#### Common Mistakes
- Not monitoring replication lag
- Ignoring conflict resolution in master-master
- Not planning for failover scenarios

#### Follow-up Questions
1. How do you handle replication lag in read replicas?
2. What's your strategy for master failover?
3. How do you resolve conflicts in master-master replication?

### Database Migration & Scaling Challenges

### Q7: Design a zero-downtime database migration strategy
**Difficulty:** Staff | **Companies:** Stripe, Shopify, GitHub | **Frequency:** Common

#### Quick Answer (30 seconds)
Use dual-write pattern: write to both old and new systems, gradually migrate reads, validate data consistency, then cut over. Implement feature flags, rollback plans, and comprehensive monitoring throughout the process.

#### Detailed Answer (3-5 minutes)
Zero-downtime migration requires careful orchestration:

**Phase 1: Preparation**
- Set up new database with identical schema
- Implement dual-write mechanism
- Create data validation tools
- Prepare rollback procedures

**Phase 2: Data Migration**
- Bulk copy historical data (offline)
- Start dual-writing new changes
- Continuously validate data consistency
- Monitor performance impact

**Phase 3: Read Migration**
- Gradually shift read traffic using feature flags
- Compare results between old and new systems
- Monitor error rates and performance
- Maintain ability to rollback reads

**Phase 4: Cutover**
- Stop writing to old system
- Verify all reads from new system
- Clean up old infrastructure
- Document lessons learned

#### Code Example
```javascript
// Dual-write migration pattern
class MigrationService {
  constructor(oldDB, newDB) {
    this.oldDB = oldDB;
    this.newDB = newDB;
    this.migrationEnabled = true;
    this.readFromNew = false;
  }
  
  async writeUser(userData) {
    // Always write to old system first
    const oldResult = await this.oldDB.insert('users', userData);
    
    if (this.migrationEnabled) {
      try {
        // Write to new system
        const newResult = await this.newDB.insert('users', userData);
        
        // Validate consistency
        await this.validateWrite(oldResult, newResult);
      } catch (error) {
        // Log but don't fail - old system is source of truth
        this.logger.error('New DB write failed', error);
      }
    }
    
    return oldResult;
  }
  
  async readUser(userId) {
    if (this.readFromNew && this.featureFlag.isEnabled('read_from_new_db')) {
      try {
        const result = await this.newDB.findById('users', userId);
        
        // Shadow read from old system for validation
        const oldResult = await this.oldDB.findById('users', userId);
        this.validateRead(result, oldResult);
        
        return result;
      } catch (error) {
        // Fallback to old system
        this.logger.error('New DB read failed, falling back', error);
      }
    }
    
    return await this.oldDB.findById('users', userId);
  }
}
```

#### Real-World Context
GitHub migrated from MySQL to GitHub's Spokes (distributed storage) using dual-writes over several months, with extensive validation and gradual traffic shifting.

#### Common Mistakes
- Not having comprehensive rollback plans
- Insufficient data validation during migration
- Not monitoring performance impact on production

#### Follow-up Questions
1. How do you handle schema changes during migration?
2. What's your strategy for validating data consistency?
3. How do you minimize performance impact during migration?### Q8:
 Handle database scaling challenges for a fintech application
**Difficulty:** Staff | **Companies:** Stripe, Square, PayPal | **Frequency:** Common

#### Quick Answer (30 seconds)
Use event sourcing for audit trails, implement CQRS for read/write separation, ensure ACID compliance for transactions, implement circuit breakers for resilience, and maintain strict data consistency for financial operations while scaling horizontally.

#### Detailed Answer (3-5 minutes)
Fintech applications have unique scaling challenges due to regulatory and consistency requirements:

**Event Sourcing Architecture**
- Store all changes as immutable events
- Enables complete audit trail for compliance
- Allows rebuilding state from events
- Supports temporal queries for investigations

**CQRS (Command Query Responsibility Segregation)**
- Separate write models (commands) from read models (queries)
- Optimize each for their specific use case
- Enable independent scaling of reads and writes
- Support complex reporting without impacting transactions

**Strict Consistency Requirements**
- Use distributed transactions for multi-account operations
- Implement saga pattern for long-running processes
- Ensure exactly-once processing for payments
- Maintain strong consistency for account balances

**Compliance and Security**
- Encrypt sensitive data at rest and in transit
- Implement comprehensive audit logging
- Support data retention and deletion policies
- Enable real-time fraud detection

#### Code Example
```javascript
// Event sourcing for financial transactions
class PaymentEventStore {
  async processPayment(paymentCommand) {
    const events = [];
    
    // Validate payment
    const validationEvent = await this.validatePayment(paymentCommand);
    events.push(validationEvent);
    
    if (validationEvent.type === 'PAYMENT_VALIDATED') {
      // Reserve funds
      const reserveEvent = await this.reserveFunds(paymentCommand);
      events.push(reserveEvent);
      
      if (reserveEvent.type === 'FUNDS_RESERVED') {
        // Process payment
        const paymentEvent = await this.executePayment(paymentCommand);
        events.push(paymentEvent);
        
        if (paymentEvent.type === 'PAYMENT_COMPLETED') {
          // Release reserved funds
          const releaseEvent = await this.releaseFunds(paymentCommand);
          events.push(releaseEvent);
        }
      }
    }
    
    // Store all events atomically
    await this.eventStore.appendEvents(paymentCommand.id, events);
    
    // Update read models asynchronously
    await this.updateReadModels(events);
    
    return events;
  }
  
  async getAccountBalance(accountId) {
    // Replay events to calculate current balance
    const events = await this.eventStore.getEvents(accountId);
    return this.calculateBalance(events);
  }
}
```

#### Real-World Context
Stripe uses event sourcing to maintain complete payment history and CQRS to separate payment processing from reporting, enabling them to scale to millions of transactions while maintaining compliance.

#### Common Mistakes
- Not implementing proper audit trails
- Ignoring regulatory compliance requirements
- Not handling partial failures in distributed transactions

#### Follow-up Questions
1. How do you ensure exactly-once payment processing?
2. What's your strategy for handling failed transactions?
3. How do you implement real-time fraud detection at scale?

### Database Security & Compliance

### Q9: Implement GDPR compliance in a distributed database system
**Difficulty:** Staff | **Companies:** Google, Microsoft, Airbnb | **Frequency:** Common

#### Quick Answer (30 seconds)
Implement data minimization, pseudonymization, encryption at rest/transit, right to erasure with cascading deletes, data portability APIs, consent management, and audit logging. Use data classification and retention policies across all database nodes.

#### Detailed Answer (3-5 minutes)
GDPR compliance in distributed systems requires comprehensive data governance:

**Data Classification and Minimization**
- Classify all personal data (PII, sensitive categories)
- Implement data retention policies
- Minimize data collection to necessary purposes
- Regular data audits and cleanup

**Technical Safeguards**
- Encryption at rest and in transit
- Pseudonymization of personal identifiers
- Access controls with role-based permissions
- Secure key management across regions

**Individual Rights Implementation**
- Right to access: Data export APIs
- Right to rectification: Update mechanisms
- Right to erasure: Cascading delete procedures
- Right to portability: Standardized data formats

**Consent and Legal Basis**
- Consent management system
- Legal basis tracking per data element
- Withdrawal mechanisms
- Cross-border transfer safeguards

#### Code Example
```javascript
// GDPR-compliant user data service
class GDPRUserService {
  async exportUserData(userId, requestId) {
    // Log the access request
    await this.auditLog.record({
      type: 'DATA_EXPORT_REQUEST',
      userId,
      requestId,
      timestamp: new Date(),
      legalBasis: 'GDPR_ARTICLE_15'
    });
    
    // Collect data from all systems
    const userData = {
      profile: await this.userDB.getProfile(userId),
      orders: await this.orderDB.getUserOrders(userId),
      analytics: await this.analyticsDB.getUserEvents(userId),
      communications: await this.emailDB.getUserEmails(userId)
    };
    
    // Pseudonymize sensitive data
    const exportData = this.pseudonymizeForExport(userData);
    
    // Encrypt export file
    const encryptedData = await this.encrypt(exportData);
    
    return {
      exportId: requestId,
      data: encryptedData,
      format: 'JSON',
      timestamp: new Date()
    };
  }
  
  async deleteUserData(userId, requestId) {
    const deletionPlan = await this.createDeletionPlan(userId);
    
    try {
      // Start distributed transaction
      await this.beginDistributedDeletion(requestId);
      
      // Delete from all systems in dependency order
      for (const system of deletionPlan.systems) {
        await system.deleteUserData(userId);
        await this.auditLog.record({
          type: 'DATA_DELETED',
          system: system.name,
          userId,
          requestId
        });
      }
      
      // Commit deletion
      await this.commitDistributedDeletion(requestId);
      
    } catch (error) {
      // Rollback on failure
      await this.rollbackDistributedDeletion(requestId);
      throw error;
    }
  }
}
```

#### Real-World Context
Airbnb implemented GDPR compliance by creating a unified data platform that tracks personal data across all services and enables automated deletion workflows.

#### Common Mistakes
- Not mapping all personal data across systems
- Ignoring data in backups and logs
- Not implementing proper consent withdrawal

#### Follow-up Questions
1. How do you handle GDPR compliance in data backups?
2. What's your strategy for cross-border data transfers?
3. How do you implement data minimization in analytics systems?### Q10
: Design a database security architecture for healthcare data (HIPAA)
**Difficulty:** Staff | **Companies:** Epic, Cerner, Teladoc | **Frequency:** Common

#### Quick Answer (30 seconds)
Implement end-to-end encryption, role-based access controls, audit logging, data masking, secure backup procedures, and network segmentation. Ensure minimum necessary access, regular security assessments, and incident response procedures for PHI protection.

#### Detailed Answer (3-5 minutes)
HIPAA compliance requires comprehensive security controls for Protected Health Information (PHI):

**Access Controls**
- Role-based access control (RBAC) with minimum necessary principle
- Multi-factor authentication for all access
- Regular access reviews and deprovisioning
- Break-glass procedures for emergencies

**Encryption and Data Protection**
- Encryption at rest using AES-256
- Encryption in transit using TLS 1.3
- Key management with hardware security modules
- Data masking for non-production environments

**Audit and Monitoring**
- Comprehensive audit logging of all PHI access
- Real-time monitoring for suspicious activity
- Regular security assessments and penetration testing
- Incident response procedures

**Infrastructure Security**
- Network segmentation and firewalls
- Secure backup and disaster recovery
- Physical security controls
- Vendor risk management

#### Code Example
```javascript
// HIPAA-compliant healthcare data access
class HIPAADataService {
  constructor() {
    this.encryptionKey = process.env.PHI_ENCRYPTION_KEY;
    this.auditLogger = new HIPAAAuditLogger();
  }
  
  async getPatientData(patientId, userId, purpose) {
    // Verify user authorization
    const authorized = await this.verifyAccess(userId, patientId, purpose);
    if (!authorized) {
      await this.auditLogger.logUnauthorizedAccess(userId, patientId);
      throw new Error('Unauthorized access to PHI');
    }
    
    // Log the access
    await this.auditLogger.logPHIAccess({
      userId,
      patientId,
      purpose,
      timestamp: new Date(),
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent()
    });
    
    // Retrieve encrypted data
    const encryptedData = await this.database.getPatient(patientId);
    
    // Decrypt PHI
    const patientData = await this.decryptPHI(encryptedData);
    
    // Apply data minimization based on purpose
    const filteredData = this.applyMinimumNecessary(patientData, purpose);
    
    return filteredData;
  }
  
  async updatePatientData(patientId, updates, userId) {
    // Create audit trail before update
    const originalData = await this.getPatientData(patientId, userId, 'UPDATE');
    
    // Encrypt updates
    const encryptedUpdates = await this.encryptPHI(updates);
    
    // Update with transaction
    await this.database.transaction(async (tx) => {
      await tx.updatePatient(patientId, encryptedUpdates);
      
      await this.auditLogger.logPHIModification({
        userId,
        patientId,
        changes: this.calculateChanges(originalData, updates),
        timestamp: new Date()
      });
    });
  }
  
  async anonymizeForResearch(patientIds, studyId) {
    const anonymizedData = [];
    
    for (const patientId of patientIds) {
      const patientData = await this.getPatientData(patientId, 'SYSTEM', 'RESEARCH');
      
      // Remove direct identifiers
      const deidentified = this.removeDirectIdentifiers(patientData);
      
      // Apply statistical disclosure control
      const anonymized = this.applySDC(deidentified);
      
      anonymizedData.push({
        studyId,
        anonymizedId: this.generateAnonymousId(),
        data: anonymized
      });
    }
    
    return anonymizedData;
  }
}
```

#### Real-World Context
Epic's EHR system implements comprehensive HIPAA controls including encryption, audit logging, and role-based access to protect millions of patient records across healthcare systems.

#### Common Mistakes
- Not implementing comprehensive audit logging
- Ignoring data in transit encryption
- Not properly deidentifying data for research

#### Follow-up Questions
1. How do you handle emergency access to patient data?
2. What's your strategy for secure data sharing between providers?
3. How do you implement data retention policies for medical records?

### Advanced Database Architecture Questions

### Q11: Design a multi-tenant database architecture with data isolation
**Difficulty:** Staff | **Companies:** Salesforce, Slack, Zoom | **Frequency:** Common

#### Quick Answer (30 seconds)
Use schema-per-tenant for strong isolation, shared schema with tenant ID for cost efficiency, or database-per-tenant for maximum security. Implement tenant-aware queries, connection pooling, and cross-tenant analytics while maintaining data privacy.

#### Detailed Answer (3-5 minutes)
Multi-tenant architecture requires balancing isolation, performance, and cost:

**Database-per-Tenant**
- Complete isolation, dedicated resources
- Highest security, easiest compliance
- Higher cost, complex management
- Use case: Enterprise customers, regulated industries

**Schema-per-Tenant**
- Logical isolation within shared database
- Moderate security, shared resources
- Balanced cost and complexity
- Use case: Mid-market SaaS applications

**Shared Schema with Tenant ID**
- Row-level security with tenant filtering
- Lowest cost, highest density
- Complex queries, potential data leakage
- Use case: Small business SaaS, freemium models

#### Code Example
```javascript
// Multi-tenant database service
class MultiTenantDB {
  constructor() {
    this.tenantConnections = new Map();
    this.sharedConnection = this.createSharedConnection();
  }
  
  async getTenantConnection(tenantId) {
    if (!this.tenantConnections.has(tenantId)) {
      const config = await this.getTenantConfig(tenantId);
      
      if (config.isolationLevel === 'DATABASE') {
        // Database-per-tenant
        const connection = this.createConnection(config.databaseUrl);
        this.tenantConnections.set(tenantId, connection);
      } else if (config.isolationLevel === 'SCHEMA') {
        // Schema-per-tenant
        const connection = this.createSchemaConnection(config.schemaName);
        this.tenantConnections.set(tenantId, connection);
      }
    }
    
    return this.tenantConnections.get(tenantId) || this.sharedConnection;
  }
  
  async queryTenantData(tenantId, query, params) {
    const connection = await this.getTenantConnection(tenantId);
    
    // Add tenant context to all queries
    const tenantAwareQuery = this.addTenantFilter(query, tenantId);
    
    // Execute with tenant isolation
    return await connection.query(tenantAwareQuery, params);
  }
  
  addTenantFilter(query, tenantId) {
    // Automatically add tenant_id filter to prevent cross-tenant access
    if (query.includes('WHERE')) {
      return query.replace('WHERE', `WHERE tenant_id = '${tenantId}' AND`);
    } else {
      return query + ` WHERE tenant_id = '${tenantId}'`;
    }
  }
}
```

#### Real-World Context
Salesforce uses a combination of shared schemas with tenant ID for most data and separate databases for enterprise customers requiring complete isolation.

#### Common Mistakes
- Not implementing proper tenant isolation
- Forgetting tenant filters in queries
- Not planning for tenant-specific scaling needs

#### Follow-up Questions
1. How do you handle cross-tenant analytics?
2. What's your strategy for tenant data migration?
3. How do you implement tenant-specific customizations?

### Q12: Implement database disaster recovery and high availability
**Difficulty:** Senior | **Companies:** Amazon, Google, Microsoft | **Frequency:** Very Common

#### Quick Answer (30 seconds)
Use multi-region replication, automated failover, point-in-time recovery, and regular disaster recovery testing. Implement RTO/RPO targets, backup validation, and runbook automation for different failure scenarios.

#### Detailed Answer (3-5 minutes)
Disaster recovery requires comprehensive planning for different failure scenarios:

**High Availability Architecture**
- Multi-AZ deployment with synchronous replication
- Automated failover with health checks
- Load balancing across healthy nodes
- Circuit breakers for cascading failure prevention

**Disaster Recovery Strategy**
- Cross-region asynchronous replication
- Regular backup testing and validation
- Documented recovery procedures (runbooks)
- Regular disaster recovery drills

**Recovery Objectives**
- RTO (Recovery Time Objective): Maximum downtime
- RPO (Recovery Point Objective): Maximum data loss
- Different tiers for different criticality levels

**Backup Strategy**
- Full backups with incremental changes
- Point-in-time recovery capability
- Encrypted backups with secure storage
- Automated backup verification

#### Code Example
```javascript
// Disaster recovery orchestration
class DisasterRecoveryService {
  constructor() {
    this.primaryRegion = 'us-east-1';
    this.drRegion = 'us-west-2';
    this.rtoTarget = 300; // 5 minutes
    this.rpoTarget = 60;  // 1 minute
  }
  
  async monitorHealth() {
    const healthCheck = await this.performHealthCheck();
    
    if (!healthCheck.primary.healthy) {
      await this.initiateFailover();
    }
    
    if (healthCheck.replicationLag > this.rpoTarget) {
      await this.alertReplicationLag(healthCheck.replicationLag);
    }
  }
  
  async initiateFailover() {
    const startTime = Date.now();
    
    try {
      // 1. Stop writes to primary
      await this.stopWrites(this.primaryRegion);
      
      // 2. Promote DR replica to primary
      await this.promoteReplica(this.drRegion);
      
      // 3. Update DNS/load balancer
      await this.updateTrafficRouting(this.drRegion);
      
      // 4. Start accepting writes
      await this.enableWrites(this.drRegion);
      
      const recoveryTime = Date.now() - startTime;
      
      await this.logFailover({
        recoveryTime,
        rtoMet: recoveryTime < this.rtoTarget * 1000,
        timestamp: new Date()
      });
      
    } catch (error) {
      await this.rollbackFailover();
      throw error;
    }
  }
  
  async performBackupValidation() {
    const latestBackup = await this.getLatestBackup();
    
    // Restore to test environment
    const testDB = await this.restoreBackup(latestBackup, 'test-env');
    
    // Validate data integrity
    const validationResults = await this.validateBackupIntegrity(testDB);
    
    // Cleanup test environment
    await this.cleanupTestEnvironment(testDB);
    
    return validationResults;
  }
}
```

#### Real-World Context
Amazon RDS provides automated backups, Multi-AZ deployments, and cross-region read replicas to achieve different RTO/RPO targets based on customer requirements.

#### Common Mistakes
- Not testing disaster recovery procedures regularly
- Not considering network partitions in failover logic
- Not validating backup integrity

#### Follow-up Questions
1. How do you handle split-brain scenarios during failover?
2. What's your strategy for testing disaster recovery procedures?
3. How do you implement gradual traffic shifting during recovery?## Real-Wo
rld Database Architecture Scenarios

### Scenario 1: Netflix Content Delivery Database Architecture

**Problem Statement**
Netflix needs to serve personalized content recommendations to 200M+ global users with sub-second response times while maintaining content metadata consistency across regions.

**Technical Challenges**
1. Global content catalog synchronization
2. Personalized recommendation data at scale
3. Real-time viewing history updates
4. Content licensing restrictions by region

**Solution Approach**
- **Global Content Catalog**: Master-master replication with conflict resolution
- **User Data**: Sharded by user ID with regional read replicas
- **Recommendations**: Precomputed and cached with real-time updates
- **Viewing History**: Event streaming with eventual consistency

**Implementation Details**
```javascript
// Netflix-style content architecture
class ContentDeliveryDB {
  async getPersonalizedContent(userId, region) {
    // Get user preferences (cached)
    const preferences = await this.cache.get(`prefs:${userId}`);
    
    // Get regional content catalog
    const availableContent = await this.getRegionalCatalog(region);
    
    // Get precomputed recommendations
    const recommendations = await this.recommendationDB
      .getRecommendations(userId, preferences);
    
    // Filter by regional availability
    return this.filterByRegion(recommendations, availableContent, region);
  }
  
  async updateViewingHistory(userId, contentId, progress) {
    // Immediate update to user's region
    await this.userDB.updateProgress(userId, contentId, progress);
    
    // Async update to recommendation engine
    await this.eventStream.publish('viewing_progress', {
      userId, contentId, progress, timestamp: Date.now()
    });
    
    // Update global analytics (eventual consistency)
    this.analyticsDB.recordView(userId, contentId, progress);
  }
}
```

**Performance Metrics**
- 99.9% availability across all regions
- <100ms response time for content queries
- 1M+ concurrent streams supported
- 99.99% data consistency for billing

**Lessons Learned**
- Regional data sovereignty requires careful architecture
- Precomputation is essential for real-time recommendations
- Event streaming enables loose coupling between services

**Interview Questions from This Scenario**
1. How would you handle content licensing changes across regions?
2. What's your strategy for handling recommendation model updates?
3. How do you ensure viewing history consistency for billing?

### Scenario 2: Uber's Real-Time Location Database

**Problem Statement**
Uber needs to track millions of drivers and riders in real-time, match rides efficiently, and maintain location history for safety and analytics while ensuring data privacy.

**Technical Challenges**
1. Real-time location updates at massive scale
2. Efficient geospatial queries for ride matching
3. Location data privacy and retention
4. Cross-region ride coordination

**Solution Approach**
- **Location Tracking**: Time-series database with geospatial indexing
- **Ride Matching**: In-memory spatial data structures
- **Historical Data**: Partitioned by time and geography
- **Privacy**: Automatic data expiration and anonymization

**Implementation Details**
```javascript
// Uber-style location tracking
class LocationTrackingDB {
  async updateDriverLocation(driverId, lat, lng, timestamp) {
    // Update real-time location (Redis with geospatial)
    await this.realTimeDB.geoadd('drivers', lng, lat, driverId);
    
    // Store in time-series DB for history
    await this.timeSeriesDB.insert('location_history', {
      driverId, lat, lng, timestamp,
      ttl: 30 * 24 * 3600 // 30 days retention
    });
    
    // Update driver availability status
    await this.updateDriverStatus(driverId, 'AVAILABLE');
  }
  
  async findNearbyDrivers(riderLat, riderLng, radius = 5000) {
    // Query geospatial index
    const nearbyDrivers = await this.realTimeDB.georadius(
      'drivers', riderLng, riderLat, radius, 'm',
      'WITHDIST', 'WITHCOORD', 'ASC'
    );
    
    // Filter by availability and capacity
    const availableDrivers = await this.filterAvailableDrivers(nearbyDrivers);
    
    // Apply matching algorithm
    return this.rankDriversByMatchingScore(availableDrivers, {
      riderLat, riderLng, timestamp: Date.now()
    });
  }
  
  async anonymizeLocationHistory() {
    // Daily job to anonymize old location data
    const cutoffDate = new Date(Date.now() - 90 * 24 * 3600 * 1000);
    
    await this.timeSeriesDB.update('location_history', 
      { timestamp: { $lt: cutoffDate } },
      { 
        $unset: { driverId: 1, riderId: 1 },
        $set: { anonymized: true }
      }
    );
  }
}
```

**Performance Metrics**
- <500ms for ride matching globally
- 10M+ location updates per minute
- 99.99% uptime for location services
- <1km accuracy for location tracking

**Lessons Learned**
- Geospatial indexing is critical for location-based services
- Data retention policies must balance analytics and privacy
- Real-time systems require careful caching strategies

**Interview Questions from This Scenario**
1. How would you handle location data in areas with poor connectivity?
2. What's your strategy for cross-city ride coordination?
3. How do you implement privacy-preserving location analytics?

### Scenario 3: Stripe's Payment Processing Database

**Problem Statement**
Stripe processes millions of payments daily across 40+ countries with strict consistency requirements, regulatory compliance, and sub-second response times for payment authorization.

**Technical Challenges**
1. ACID compliance for financial transactions
2. Multi-currency and multi-region processing
3. Fraud detection in real-time
4. Regulatory compliance (PCI DSS, local regulations)

**Solution Approach**
- **Event Sourcing**: Immutable transaction log for audit trails
- **CQRS**: Separate command and query models
- **Distributed Transactions**: Saga pattern for complex workflows
- **Real-time Analytics**: Stream processing for fraud detection

**Implementation Details**
```javascript
// Stripe-style payment processing
class PaymentProcessingDB {
  async processPayment(paymentRequest) {
    const sagaId = this.generateSagaId();
    
    try {
      // Start distributed transaction saga
      await this.startSaga(sagaId, 'PAYMENT_PROCESSING');
      
      // Step 1: Validate payment method
      const validation = await this.validatePaymentMethod(paymentRequest);
      await this.recordSagaStep(sagaId, 'VALIDATION', validation);
      
      // Step 2: Check fraud score
      const fraudScore = await this.calculateFraudScore(paymentRequest);
      if (fraudScore > 0.8) {
        await this.rejectPayment(sagaId, 'HIGH_FRAUD_RISK');
        return;
      }
      
      // Step 3: Reserve funds
      const reservation = await this.reserveFunds(paymentRequest);
      await this.recordSagaStep(sagaId, 'FUNDS_RESERVED', reservation);
      
      // Step 4: Process with payment processor
      const processorResult = await this.processWithAcquirer(paymentRequest);
      await this.recordSagaStep(sagaId, 'PROCESSOR_RESPONSE', processorResult);
      
      if (processorResult.success) {
        // Step 5: Capture funds
        await this.captureFunds(reservation.id);
        await this.completeSaga(sagaId, 'SUCCESS');
      } else {
        // Compensate - release reserved funds
        await this.releaseFunds(reservation.id);
        await this.completeSaga(sagaId, 'FAILED');
      }
      
    } catch (error) {
      // Compensate all completed steps
      await this.compensateSaga(sagaId);
      throw error;
    }
  }
  
  async getPaymentHistory(merchantId, filters) {
    // Query read model optimized for reporting
    return await this.readModel.query(`
      SELECT * FROM payment_summary 
      WHERE merchant_id = ? 
      AND created_at BETWEEN ? AND ?
      ORDER BY created_at DESC
    `, [merchantId, filters.startDate, filters.endDate]);
  }
}
```

**Performance Metrics**
- 99.99% payment success rate
- <200ms payment authorization time
- Zero data loss for financial transactions
- 100% audit trail compliance

**Lessons Learned**
- Event sourcing is essential for financial audit requirements
- Saga pattern enables complex distributed transactions
- Real-time fraud detection requires stream processing

**Interview Questions from This Scenario**
1. How do you handle payment processor failures?
2. What's your strategy for handling currency conversion?
3. How do you implement real-time fraud detection at scale?

## Quick Reference Summary

### Key Database Architecture Concepts
- **ACID Properties**: Foundation of reliable database systems
- **CAP Theorem**: Choose consistency or availability during partitions
- **Consistency Models**: Strong, eventual, weak consistency trade-offs
- **Scaling Patterns**: Sharding, replication, federation strategies
- **Security & Compliance**: GDPR, HIPAA, encryption, audit requirements

### Common Architecture Patterns
- **Master-Slave Replication**: Read scaling with single write point
- **Master-Master Replication**: High availability with conflict resolution
- **Database Sharding**: Horizontal scaling with data distribution
- **CQRS**: Separate read and write models for optimization
- **Event Sourcing**: Immutable event log for audit and rebuilding state

### Interview Preparation Tips
1. **Practice System Design**: Focus on trade-offs and scaling decisions
2. **Understand Compliance**: Know GDPR, HIPAA, and security requirements
3. **Study Real Systems**: Learn from Netflix, Uber, Stripe architectures
4. **Master Fundamentals**: ACID, CAP theorem, consistency models
5. **Prepare for Scale**: Practice designing for millions of users

### Common Mistakes to Avoid
- Choosing wrong consistency model for use case
- Not planning for cross-shard operations
- Ignoring compliance requirements early
- Not considering data migration strategies
- Underestimating monitoring and observability needs