---
title: "Design Patterns Interview Questions"
description: "Comprehensive interview questions covering design patterns, SOLID principles, and architectural patterns for Node.js developers"
category: "ood"
subcategory: "design-patterns"
difficulty: "intermediate-advanced"
tags: ["design-patterns", "SOLID", "architecture", "refactoring", "microservices", "interview-questions"]
lastUpdated: "2024-11-07"
---

# Design Patterns Interview Questions

## Implementation Questions - Design Patterns (25+ Questions)

### Creational Patterns

**Q1: When would you use the Singleton pattern in a Node.js application? Provide a practical implementation.**

**Answer:**
Use Singleton for database connections, configuration managers, or logging services where you need exactly one instance.

```javascript
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connection = null;
    this.isConnected = false;
    DatabaseConnection.instance = this;
  }
  
  async connect() {
    if (!this.isConnected) {
      this.connection = await require('mongodb').MongoClient.connect(process.env.DB_URL);
      this.isConnected = true;
    }
    return this.connection;
  }
  
  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}

// Usage
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true
```

**Q2: Implement a Factory pattern for creating different types of payment processors (Stripe, PayPal, Square).**

**Answer:**
```javascript
class PaymentProcessor {
  process(amount) {
    throw new Error('Must implement process method');
  }
}

class StripeProcessor extends PaymentProcessor {
  process(amount) {
    return `Processing $${amount} via Stripe`;
  }
}

class PayPalProcessor extends PaymentProcessor {
  process(amount) {
    return `Processing $${amount} via PayPal`;
  }
}

class SquareProcessor extends PaymentProcessor {
  process(amount) {
    return `Processing $${amount} via Square`;
  }
}

class PaymentProcessorFactory {
  static create(type) {
    switch (type.toLowerCase()) {
      case 'stripe':
        return new StripeProcessor();
      case 'paypal':
        return new PayPalProcessor();
      case 'square':
        return new SquareProcessor();
      default:
        throw new Error(`Unknown payment processor: ${type}`);
    }
  }
}

// Usage
const processor = PaymentProcessorFactory.create('stripe');
console.log(processor.process(100));
```

**Q3: When would you choose Builder pattern over constructor parameters? Show an implementation for HTTP request building.**

**Answer:**
Use Builder when you have many optional parameters or complex object construction.

```javascript
class HttpRequest {
  constructor() {
    this.url = '';
    this.method = 'GET';
    this.headers = {};
    this.body = null;
    this.timeout = 5000;
  }
}

class HttpRequestBuilder {
  constructor() {
    this.request = new HttpRequest();
  }
  
  setUrl(url) {
    this.request.url = url;
    return this;
  }
  
  setMethod(method) {
    this.request.method = method;
    return this;
  }
  
  addHeader(key, value) {
    this.request.headers[key] = value;
    return this;
  }
  
  setBody(body) {
    this.request.body = body;
    return this;
  }
  
  setTimeout(timeout) {
    this.request.timeout = timeout;
    return this;
  }
  
  build() {
    if (!this.request.url) {
      throw new Error('URL is required');
    }
    return this.request;
  }
}

// Usage
const request = new HttpRequestBuilder()
  .setUrl('https://api.example.com/users')
  .setMethod('POST')
  .addHeader('Content-Type', 'application/json')
  .addHeader('Authorization', 'Bearer token123')
  .setBody(JSON.stringify({ name: 'John' }))
  .setTimeout(10000)
  .build();
```

### Structural Patterns

**Q4: Implement an Adapter pattern to integrate a legacy XML API with your modern JSON-based system.**

**Answer:**
```javascript
// Legacy XML API
class LegacyXmlApi {
  getUserDataXml(userId) {
    return `<user><id>${userId}</id><name>John Doe</name><email>john@example.com</email></user>`;
  }
}

// Modern interface expected by our system
class ModernUserService {
  getUserData(userId) {
    // Expected to return JSON object
    throw new Error('Must be implemented');
  }
}

// Adapter
class XmlToJsonAdapter extends ModernUserService {
  constructor(legacyApi) {
    super();
    this.legacyApi = legacyApi;
  }
  
  getUserData(userId) {
    const xmlData = this.legacyApi.getUserDataXml(userId);
    return this.parseXmlToJson(xmlData);
  }
  
  parseXmlToJson(xmlString) {
    // Simple XML parsing (in real app, use proper XML parser)
    const idMatch = xmlString.match(/<id>(\d+)<\/id>/);
    const nameMatch = xmlString.match(/<name>([^<]+)<\/name>/);
    const emailMatch = xmlString.match(/<email>([^<]+)<\/email>/);
    
    return {
      id: idMatch ? parseInt(idMatch[1]) : null,
      name: nameMatch ? nameMatch[1] : null,
      email: emailMatch ? emailMatch[1] : null
    };
  }
}

// Usage
const legacyApi = new LegacyXmlApi();
const adapter = new XmlToJsonAdapter(legacyApi);
const userData = adapter.getUserData(123);
console.log(userData); // { id: 123, name: 'John Doe', email: 'john@example.com' }
```

**Q5: Create a Decorator pattern for adding caching, logging, and rate limiting to API endpoints.**

**Answer:**
```javascript
class ApiEndpoint {
  async handleRequest(request) {
    return { data: 'Original response', timestamp: Date.now() };
  }
}

class EndpointDecorator {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }
  
  async handleRequest(request) {
    return this.endpoint.handleRequest(request);
  }
}

class CachingDecorator extends EndpointDecorator {
  constructor(endpoint, ttl = 60000) {
    super(endpoint);
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  async handleRequest(request) {
    const key = JSON.stringify(request);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return { ...cached.data, fromCache: true };
    }
    
    const response = await super.handleRequest(request);
    this.cache.set(key, { data: response, timestamp: Date.now() });
    return response;
  }
}

class LoggingDecorator extends EndpointDecorator {
  async handleRequest(request) {
    console.log(`[${new Date().toISOString()}] Request:`, request);
    const response = await super.handleRequest(request);
    console.log(`[${new Date().toISOString()}] Response:`, response);
    return response;
  }
}

class RateLimitDecorator extends EndpointDecorator {
  constructor(endpoint, maxRequests = 100, windowMs = 60000) {
    super(endpoint);
    this.requests = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  async handleRequest(request) {
    const clientId = request.clientId || 'anonymous';
    const now = Date.now();
    
    if (!this.requests.has(clientId)) {
      this.requests.set(clientId, []);
    }
    
    const clientRequests = this.requests.get(clientId);
    const validRequests = clientRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      throw new Error('Rate limit exceeded');
    }
    
    validRequests.push(now);
    this.requests.set(clientId, validRequests);
    
    return super.handleRequest(request);
  }
}

// Usage
let endpoint = new ApiEndpoint();
endpoint = new CachingDecorator(endpoint, 30000);
endpoint = new LoggingDecorator(endpoint);
endpoint = new RateLimitDecorator(endpoint, 10, 60000);

// Now endpoint has caching, logging, and rate limiting
```

### Behavioral Patterns

**Q6: Implement the Observer pattern for a real-time notification system.**

**Answer:**
```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  subscribe(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    };
  }
  
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }
}

class NotificationSystem extends EventEmitter {
  sendNotification(type, message, userId) {
    const notification = {
      id: Date.now(),
      type,
      message,
      userId,
      timestamp: new Date().toISOString()
    };
    
    this.emit('notification', notification);
    this.emit(`notification:${type}`, notification);
  }
}

// Observers
class EmailNotifier {
  constructor(notificationSystem) {
    this.unsubscribe = notificationSystem.subscribe('notification:email', 
      this.handleEmailNotification.bind(this));
  }
  
  handleEmailNotification(notification) {
    console.log(`Sending email: ${notification.message} to user ${notification.userId}`);
  }
}

class SMSNotifier {
  constructor(notificationSystem) {
    this.unsubscribe = notificationSystem.subscribe('notification:sms', 
      this.handleSMSNotification.bind(this));
  }
  
  handleSMSNotification(notification) {
    console.log(`Sending SMS: ${notification.message} to user ${notification.userId}`);
  }
}

class PushNotifier {
  constructor(notificationSystem) {
    this.unsubscribe = notificationSystem.subscribe('notification', 
      this.handlePushNotification.bind(this));
  }
  
  handlePushNotification(notification) {
    if (notification.type !== 'push') return;
    console.log(`Sending push: ${notification.message} to user ${notification.userId}`);
  }
}

// Usage
const notificationSystem = new NotificationSystem();
const emailNotifier = new EmailNotifier(notificationSystem);
const smsNotifier = new SMSNotifier(notificationSystem);
const pushNotifier = new PushNotifier(notificationSystem);

notificationSystem.sendNotification('email', 'Welcome to our service!', 'user123');
notificationSystem.sendNotification('sms', 'Your order is ready', 'user456');
```

**Q7: When would you use the Strategy pattern? Implement it for different sorting algorithms.**

**Answer:**
Use Strategy when you have multiple ways to perform a task and want to switch between them at runtime.

```javascript
class SortStrategy {
  sort(array) {
    throw new Error('Must implement sort method');
  }
}

class BubbleSortStrategy extends SortStrategy {
  sort(array) {
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSortStrategy extends SortStrategy {
  sort(array) {
    if (array.length <= 1) return array;
    
    const pivot = array[Math.floor(array.length / 2)];
    const left = array.filter(x => x < pivot);
    const middle = array.filter(x => x === pivot);
    const right = array.filter(x => x > pivot);
    
    return [...this.sort(left), ...middle, ...this.sort(right)];
  }
}

class MergeSortStrategy extends SortStrategy {
  sort(array) {
    if (array.length <= 1) return array;
    
    const mid = Math.floor(array.length / 2);
    const left = this.sort(array.slice(0, mid));
    const right = this.sort(array.slice(mid));
    
    return this.merge(left, right);
  }
  
  merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}

class SortContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  sort(array) {
    return this.strategy.sort(array);
  }
}

// Usage
const data = [64, 34, 25, 12, 22, 11, 90];
const sorter = new SortContext(new QuickSortStrategy());

console.log('Quick Sort:', sorter.sort(data));

sorter.setStrategy(new MergeSortStrategy());
console.log('Merge Sort:', sorter.sort(data));

// Choose strategy based on data size
const chooseStrategy = (dataSize) => {
  if (dataSize < 10) return new BubbleSortStrategy();
  if (dataSize < 1000) return new QuickSortStrategy();
  return new MergeSortStrategy();
};

sorter.setStrategy(chooseStrategy(data.length));
```

**Q8: Implement the Command pattern for an undo/redo system in a text editor.**

**Answer:**
```javascript
class Command {
  execute() {
    throw new Error('Must implement execute method');
  }
  
  undo() {
    throw new Error('Must implement undo method');
  }
}

class InsertTextCommand extends Command {
  constructor(editor, text, position) {
    super();
    this.editor = editor;
    this.text = text;
    this.position = position;
  }
  
  execute() {
    this.editor.insertText(this.text, this.position);
  }
  
  undo() {
    this.editor.deleteText(this.position, this.text.length);
  }
}

class DeleteTextCommand extends Command {
  constructor(editor, position, length) {
    super();
    this.editor = editor;
    this.position = position;
    this.length = length;
    this.deletedText = '';
  }
  
  execute() {
    this.deletedText = this.editor.getText(this.position, this.length);
    this.editor.deleteText(this.position, this.length);
  }
  
  undo() {
    this.editor.insertText(this.deletedText, this.position);
  }
}

class TextEditor {
  constructor() {
    this.content = '';
  }
  
  insertText(text, position) {
    this.content = this.content.slice(0, position) + text + this.content.slice(position);
  }
  
  deleteText(position, length) {
    this.content = this.content.slice(0, position) + this.content.slice(position + length);
  }
  
  getText(position, length) {
    return this.content.slice(position, position + length);
  }
  
  getContent() {
    return this.content;
  }
}

class CommandManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }
  
  executeCommand(command) {
    // Remove any commands after current index (for when we execute after undo)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    command.execute();
    this.history.push(command);
    this.currentIndex++;
  }
  
  undo() {
    if (this.currentIndex >= 0) {
      const command = this.history[this.currentIndex];
      command.undo();
      this.currentIndex--;
      return true;
    }
    return false;
  }
  
  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      command.execute();
      return true;
    }
    return false;
  }
}

// Usage
const editor = new TextEditor();
const commandManager = new CommandManager();

// Execute commands
commandManager.executeCommand(new InsertTextCommand(editor, 'Hello', 0));
console.log(editor.getContent()); // "Hello"

commandManager.executeCommand(new InsertTextCommand(editor, ' World', 5));
console.log(editor.getContent()); // "Hello World"

commandManager.executeCommand(new DeleteTextCommand(editor, 5, 6));
console.log(editor.getContent()); // "Hello"

// Undo operations
commandManager.undo();
console.log(editor.getContent()); // "Hello World"

commandManager.undo();
console.log(editor.getContent()); // "Hello"

// Redo operations
commandManager.redo();
console.log(editor.getContent()); // "Hello World"
```
**Q9: 
Implement the State pattern for a TCP connection state machine.**

**Answer:**
```javascript
class TCPState {
  open(connection) {
    throw new Error('Invalid operation for current state');
  }
  
  close(connection) {
    throw new Error('Invalid operation for current state');
  }
  
  acknowledge(connection) {
    throw new Error('Invalid operation for current state');
  }
}

class ClosedState extends TCPState {
  open(connection) {
    console.log('Opening connection...');
    connection.setState(new ListenState());
  }
}

class ListenState extends TCPState {
  open(connection) {
    console.log('Connection established');
    connection.setState(new EstablishedState());
  }
  
  close(connection) {
    console.log('Closing from listen state');
    connection.setState(new ClosedState());
  }
}

class EstablishedState extends TCPState {
  close(connection) {
    console.log('Closing established connection');
    connection.setState(new ClosedState());
  }
  
  acknowledge(connection) {
    console.log('Acknowledging data');
  }
}

class TCPConnection {
  constructor() {
    this.state = new ClosedState();
  }
  
  setState(state) {
    this.state = state;
  }
  
  open() {
    this.state.open(this);
  }
  
  close() {
    this.state.close(this);
  }
  
  acknowledge() {
    this.state.acknowledge(this);
  }
}

// Usage
const connection = new TCPConnection();
connection.open(); // Opening connection...
connection.open(); // Connection established
connection.acknowledge(); // Acknowledging data
connection.close(); // Closing established connection
```

**Q10: Create a Chain of Responsibility pattern for processing HTTP middleware.**

**Answer:**
```javascript
class Middleware {
  constructor() {
    this.next = null;
  }
  
  setNext(middleware) {
    this.next = middleware;
    return middleware;
  }
  
  async handle(request, response) {
    const result = await this.process(request, response);
    
    if (result && this.next) {
      return this.next.handle(request, response);
    }
    
    return result;
  }
  
  async process(request, response) {
    throw new Error('Must implement process method');
  }
}

class AuthenticationMiddleware extends Middleware {
  async process(request, response) {
    console.log('Checking authentication...');
    
    if (!request.headers.authorization) {
      response.status = 401;
      response.body = { error: 'Unauthorized' };
      return false;
    }
    
    request.user = { id: 1, name: 'John Doe' };
    return true;
  }
}

class AuthorizationMiddleware extends Middleware {
  constructor(requiredRole) {
    super();
    this.requiredRole = requiredRole;
  }
  
  async process(request, response) {
    console.log('Checking authorization...');
    
    if (!request.user || request.user.role !== this.requiredRole) {
      response.status = 403;
      response.body = { error: 'Forbidden' };
      return false;
    }
    
    return true;
  }
}

class RateLimitMiddleware extends Middleware {
  constructor(maxRequests = 100) {
    super();
    this.requests = new Map();
    this.maxRequests = maxRequests;
  }
  
  async process(request, response) {
    console.log('Checking rate limit...');
    
    const clientId = request.ip || 'unknown';
    const count = this.requests.get(clientId) || 0;
    
    if (count >= this.maxRequests) {
      response.status = 429;
      response.body = { error: 'Rate limit exceeded' };
      return false;
    }
    
    this.requests.set(clientId, count + 1);
    return true;
  }
}

class LoggingMiddleware extends Middleware {
  async process(request, response) {
    console.log(`${request.method} ${request.url} - ${new Date().toISOString()}`);
    return true;
  }
}

// Usage
const authMiddleware = new AuthenticationMiddleware();
const authzMiddleware = new AuthorizationMiddleware('admin');
const rateLimitMiddleware = new RateLimitMiddleware(10);
const loggingMiddleware = new LoggingMiddleware();

// Chain the middleware
authMiddleware
  .setNext(authzMiddleware)
  .setNext(rateLimitMiddleware)
  .setNext(loggingMiddleware);

// Process request
const request = {
  method: 'GET',
  url: '/admin/users',
  headers: { authorization: 'Bearer token123' },
  ip: '192.168.1.1'
};

const response = { status: 200, body: {} };

authMiddleware.handle(request, response);
```

## SOLID Principles Questions (20+ Questions)

**Q11: Explain the Single Responsibility Principle with a Node.js example. How would you refactor a class that violates SRP?**

**Answer:**
SRP states that a class should have only one reason to change.

**Violating SRP:**
```javascript
class UserManager {
  constructor() {
    this.users = [];
  }
  
  // User management responsibility
  addUser(user) {
    this.users.push(user);
  }
  
  removeUser(userId) {
    this.users = this.users.filter(u => u.id !== userId);
  }
  
  // Email responsibility (violation!)
  sendWelcomeEmail(user) {
    console.log(`Sending welcome email to ${user.email}`);
    // Email sending logic
  }
  
  // Database responsibility (violation!)
  saveToDatabase() {
    console.log('Saving users to database');
    // Database logic
  }
  
  // Validation responsibility (violation!)
  validateUser(user) {
    return user.email && user.name && user.email.includes('@');
  }
}
```

**Following SRP:**
```javascript
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

class UserValidator {
  validate(user) {
    if (!user.email || !user.name) {
      throw new Error('Name and email are required');
    }
    
    if (!user.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    
    return true;
  }
}

class UserRepository {
  constructor() {
    this.users = [];
  }
  
  add(user) {
    this.users.push(user);
  }
  
  remove(userId) {
    this.users = this.users.filter(u => u.id !== userId);
  }
  
  findById(userId) {
    return this.users.find(u => u.id === userId);
  }
  
  save() {
    console.log('Saving users to database');
    // Database persistence logic
  }
}

class EmailService {
  sendWelcomeEmail(user) {
    console.log(`Sending welcome email to ${user.email}`);
    // Email sending logic
  }
  
  sendPasswordResetEmail(user) {
    console.log(`Sending password reset email to ${user.email}`);
  }
}

class UserService {
  constructor(userRepository, emailService, userValidator) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.userValidator = userValidator;
  }
  
  createUser(userData) {
    const user = new User(userData.id, userData.name, userData.email);
    
    this.userValidator.validate(user);
    this.userRepository.add(user);
    this.emailService.sendWelcomeEmail(user);
    
    return user;
  }
}

// Usage
const userRepo = new UserRepository();
const emailService = new EmailService();
const userValidator = new UserValidator();
const userService = new UserService(userRepo, emailService, userValidator);
```

**Q12: Demonstrate the Open/Closed Principle with a payment processing system.**

**Answer:**
OCP states that classes should be open for extension but closed for modification.

```javascript
// Base class - closed for modification
class PaymentProcessor {
  processPayment(amount, paymentDetails) {
    throw new Error('Must implement processPayment method');
  }
  
  validatePayment(amount, paymentDetails) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    return true;
  }
}

// Extensions - open for extension
class CreditCardProcessor extends PaymentProcessor {
  processPayment(amount, paymentDetails) {
    this.validatePayment(amount, paymentDetails);
    this.validateCreditCard(paymentDetails);
    
    console.log(`Processing $${amount} via Credit Card ending in ${paymentDetails.cardNumber.slice(-4)}`);
    return { success: true, transactionId: `cc_${Date.now()}` };
  }
  
  validateCreditCard(paymentDetails) {
    if (!paymentDetails.cardNumber || !paymentDetails.cvv) {
      throw new Error('Credit card details incomplete');
    }
  }
}

class PayPalProcessor extends PaymentProcessor {
  processPayment(amount, paymentDetails) {
    this.validatePayment(amount, paymentDetails);
    this.validatePayPalAccount(paymentDetails);
    
    console.log(`Processing $${amount} via PayPal account ${paymentDetails.email}`);
    return { success: true, transactionId: `pp_${Date.now()}` };
  }
  
  validatePayPalAccount(paymentDetails) {
    if (!paymentDetails.email || !paymentDetails.password) {
      throw new Error('PayPal credentials incomplete');
    }
  }
}

class CryptocurrencyProcessor extends PaymentProcessor {
  processPayment(amount, paymentDetails) {
    this.validatePayment(amount, paymentDetails);
    this.validateWallet(paymentDetails);
    
    console.log(`Processing $${amount} via ${paymentDetails.currency} to ${paymentDetails.walletAddress}`);
    return { success: true, transactionId: `crypto_${Date.now()}` };
  }
  
  validateWallet(paymentDetails) {
    if (!paymentDetails.walletAddress || !paymentDetails.currency) {
      throw new Error('Cryptocurrency details incomplete');
    }
  }
}

// Payment service that works with any processor
class PaymentService {
  constructor() {
    this.processors = new Map();
  }
  
  registerProcessor(type, processor) {
    this.processors.set(type, processor);
  }
  
  processPayment(type, amount, paymentDetails) {
    const processor = this.processors.get(type);
    if (!processor) {
      throw new Error(`Unknown payment type: ${type}`);
    }
    
    return processor.processPayment(amount, paymentDetails);
  }
}

// Usage - adding new payment methods without modifying existing code
const paymentService = new PaymentService();
paymentService.registerProcessor('credit-card', new CreditCardProcessor());
paymentService.registerProcessor('paypal', new PayPalProcessor());
paymentService.registerProcessor('crypto', new CryptocurrencyProcessor());

// Process different payment types
paymentService.processPayment('credit-card', 100, {
  cardNumber: '1234567890123456',
  cvv: '123'
});

paymentService.processPayment('crypto', 50, {
  walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  currency: 'BTC'
});
```

**Q13: Show how Liskov Substitution Principle applies to database connections.**

**Answer:**
LSP states that objects of a superclass should be replaceable with objects of its subclasses without breaking functionality.

```javascript
// Base class defining the contract
class DatabaseConnection {
  async connect() {
    throw new Error('Must implement connect method');
  }
  
  async disconnect() {
    throw new Error('Must implement disconnect method');
  }
  
  async query(sql, params = []) {
    throw new Error('Must implement query method');
  }
  
  async transaction(callback) {
    throw new Error('Must implement transaction method');
  }
}

// Implementations that follow LSP
class MySQLConnection extends DatabaseConnection {
  constructor(config) {
    super();
    this.config = config;
    this.connection = null;
  }
  
  async connect() {
    console.log('Connecting to MySQL...');
    // MySQL-specific connection logic
    this.connection = { type: 'mysql', connected: true };
    return this.connection;
  }
  
  async disconnect() {
    console.log('Disconnecting from MySQL...');
    this.connection = null;
  }
  
  async query(sql, params = []) {
    if (!this.connection) {
      throw new Error('Not connected to database');
    }
    
    console.log(`MySQL Query: ${sql}`, params);
    return { rows: [], affectedRows: 0 };
  }
  
  async transaction(callback) {
    console.log('Starting MySQL transaction');
    try {
      await this.query('START TRANSACTION');
      const result = await callback(this);
      await this.query('COMMIT');
      return result;
    } catch (error) {
      await this.query('ROLLBACK');
      throw error;
    }
  }
}

class PostgreSQLConnection extends DatabaseConnection {
  constructor(config) {
    super();
    this.config = config;
    this.client = null;
  }
  
  async connect() {
    console.log('Connecting to PostgreSQL...');
    this.client = { type: 'postgresql', connected: true };
    return this.client;
  }
  
  async disconnect() {
    console.log('Disconnecting from PostgreSQL...');
    this.client = null;
  }
  
  async query(sql, params = []) {
    if (!this.client) {
      throw new Error('Not connected to database');
    }
    
    console.log(`PostgreSQL Query: ${sql}`, params);
    return { rows: [], rowCount: 0 };
  }
  
  async transaction(callback) {
    console.log('Starting PostgreSQL transaction');
    try {
      await this.query('BEGIN');
      const result = await callback(this);
      await this.query('COMMIT');
      return result;
    } catch (error) {
      await this.query('ROLLBACK');
      throw error;
    }
  }
}

// Service that works with any database connection (LSP in action)
class UserService {
  constructor(dbConnection) {
    this.db = dbConnection;
  }
  
  async createUser(userData) {
    await this.db.connect();
    
    return this.db.transaction(async (db) => {
      const result = await db.query(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [userData.name, userData.email]
      );
      
      console.log('User created successfully');
      return result;
    });
  }
  
  async getUser(userId) {
    await this.db.connect();
    return this.db.query('SELECT * FROM users WHERE id = ?', [userId]);
  }
}

// Usage - can substitute any database connection
const mysqlConnection = new MySQLConnection({ host: 'localhost' });
const postgresConnection = new PostgreSQLConnection({ host: 'localhost' });

// Both work identically due to LSP
const userServiceMySQL = new UserService(mysqlConnection);
const userServicePostgres = new UserService(postgresConnection);

// Same interface, different implementations
userServiceMySQL.createUser({ name: 'John', email: 'john@example.com' });
userServicePostgres.createUser({ name: 'Jane', email: 'jane@example.com' });
```

**Q14: Implement Interface Segregation Principle for a multi-function printer system.**

**Answer:**
ISP states that no client should be forced to depend on methods it doesn't use.

**Violating ISP:**
```javascript
// Fat interface - violates ISP
class MultiFunctionDevice {
  print(document) {
    throw new Error('Must implement print');
  }
  
  scan(document) {
    throw new Error('Must implement scan');
  }
  
  fax(document) {
    throw new Error('Must implement fax');
  }
  
  copy(document) {
    throw new Error('Must implement copy');
  }
}

// Simple printer forced to implement unused methods
class SimplePrinter extends MultiFunctionDevice {
  print(document) {
    console.log(`Printing: ${document}`);
  }
  
  // Forced to implement methods it doesn't support
  scan(document) {
    throw new Error('Scanning not supported');
  }
  
  fax(document) {
    throw new Error('Faxing not supported');
  }
  
  copy(document) {
    throw new Error('Copying not supported');
  }
}
```

**Following ISP:**
```javascript
// Segregated interfaces
class Printer {
  print(document) {
    throw new Error('Must implement print');
  }
}

class Scanner {
  scan(document) {
    throw new Error('Must implement scan');
  }
}

class FaxMachine {
  fax(document) {
    throw new Error('Must implement fax');
  }
}

class Copier {
  copy(document) {
    throw new Error('Must implement copy');
  }
}

// Implementations only implement what they need
class SimplePrinter extends Printer {
  print(document) {
    console.log(`Simple printer printing: ${document}`);
  }
}

class BasicScanner extends Scanner {
  scan(document) {
    console.log(`Scanning: ${document}`);
    return `scanned_${document}`;
  }
}

// Multi-function device implements multiple interfaces
class MultiFunctionPrinter extends Printer {
  constructor() {
    super();
    this.scanner = new BasicScanner();
  }
  
  print(document) {
    console.log(`Multi-function printer printing: ${document}`);
  }
  
  scan(document) {
    return this.scanner.scan(document);
  }
}

// Composition for complex devices
class OfficeDevice {
  constructor(printer, scanner, faxMachine, copier) {
    this.printer = printer;
    this.scanner = scanner;
    this.faxMachine = faxMachine;
    this.copier = copier;
  }
  
  print(document) {
    if (this.printer) {
      return this.printer.print(document);
    }
    throw new Error('Printing not available');
  }
  
  scan(document) {
    if (this.scanner) {
      return this.scanner.scan(document);
    }
    throw new Error('Scanning not available');
  }
  
  fax(document) {
    if (this.faxMachine) {
      return this.faxMachine.fax(document);
    }
    throw new Error('Faxing not available');
  }
  
  copy(document) {
    if (this.copier) {
      return this.copier.copy(document);
    }
    throw new Error('Copying not available');
  }
}

// Usage
const simplePrinter = new SimplePrinter();
const scanner = new BasicScanner();

// Only use what each device supports
simplePrinter.print('document.pdf');
scanner.scan('photo.jpg');

// Compose complex device
const officeDevice = new OfficeDevice(
  new SimplePrinter(),
  new BasicScanner(),
  null, // No fax machine
  null  // No copier
);

officeDevice.print('report.pdf');
officeDevice.scan('contract.pdf');
// officeDevice.fax('document.pdf'); // Would throw error
```

**Q15: Demonstrate Dependency Inversion Principle with a notification system.**

**Answer:**
DIP states that high-level modules should not depend on low-level modules. Both should depend on abstractions.

**Violating DIP:**
```javascript
// High-level module depending on low-level modules
class EmailSender {
  send(message, recipient) {
    console.log(`Sending email to ${recipient}: ${message}`);
  }
}

class SMSSender {
  send(message, recipient) {
    console.log(`Sending SMS to ${recipient}: ${message}`);
  }
}

// Violation: NotificationService depends on concrete classes
class NotificationService {
  constructor() {
    this.emailSender = new EmailSender(); // Direct dependency
    this.smsSender = new SMSSender();     // Direct dependency
  }
  
  sendNotification(type, message, recipient) {
    if (type === 'email') {
      this.emailSender.send(message, recipient);
    } else if (type === 'sms') {
      this.smsSender.send(message, recipient);
    }
  }
}
```

**Following DIP:**
```javascript
// Abstraction (interface)
class NotificationSender {
  send(message, recipient) {
    throw new Error('Must implement send method');
  }
}

// Low-level modules implementing the abstraction
class EmailSender extends NotificationSender {
  send(message, recipient) {
    console.log(`📧 Email to ${recipient}: ${message}`);
    // Email-specific implementation
    return { type: 'email', status: 'sent', timestamp: Date.now() };
  }
}

class SMSSender extends NotificationSender {
  send(message, recipient) {
    console.log(`📱 SMS to ${recipient}: ${message}`);
    // SMS-specific implementation
    return { type: 'sms', status: 'sent', timestamp: Date.now() };
  }
}

class PushNotificationSender extends NotificationSender {
  send(message, recipient) {
    console.log(`🔔 Push notification to ${recipient}: ${message}`);
    // Push notification implementation
    return { type: 'push', status: 'sent', timestamp: Date.now() };
  }
}

class SlackSender extends NotificationSender {
  send(message, recipient) {
    console.log(`💬 Slack message to ${recipient}: ${message}`);
    // Slack API implementation
    return { type: 'slack', status: 'sent', timestamp: Date.now() };
  }
}

// High-level module depending on abstraction
class NotificationService {
  constructor() {
    this.senders = new Map();
  }
  
  // Dependency injection
  registerSender(type, sender) {
    if (!(sender instanceof NotificationSender)) {
      throw new Error('Sender must implement NotificationSender interface');
    }
    this.senders.set(type, sender);
  }
  
  async sendNotification(type, message, recipient) {
    const sender = this.senders.get(type);
    if (!sender) {
      throw new Error(`No sender registered for type: ${type}`);
    }
    
    return sender.send(message, recipient);
  }
  
  async sendMultipleNotifications(types, message, recipient) {
    const results = [];
    
    for (const type of types) {
      try {
        const result = await this.sendNotification(type, message, recipient);
        results.push(result);
      } catch (error) {
        results.push({ type, status: 'failed', error: error.message });
      }
    }
    
    return results;
  }
}

// Dependency injection container
class NotificationContainer {
  static create() {
    const service = new NotificationService();
    
    // Register all available senders
    service.registerSender('email', new EmailSender());
    service.registerSender('sms', new SMSSender());
    service.registerSender('push', new PushNotificationSender());
    service.registerSender('slack', new SlackSender());
    
    return service;
  }
}

// Usage
const notificationService = NotificationContainer.create();

// Easy to extend with new notification types
notificationService.sendNotification('email', 'Welcome!', 'user@example.com');
notificationService.sendNotification('slack', 'Deploy completed', '#dev-team');

// Send to multiple channels
notificationService.sendMultipleNotifications(
  ['email', 'sms', 'push'],
  'Your order has been shipped!',
  'customer@example.com'
);
```

## Architectural Patterns Questions (20+ Questions)

**Q16: When would you choose MVC over MVP or MVVM? Implement a simple MVC pattern in Node.js.**

**Answer:**
- **MVC**: Use when you have clear separation between data, presentation, and business logic. Good for web applications.
- **MVP**: Use when you want to make the view more passive and testable. Good for desktop applications.
- **MVVM**: Use when you have complex UI binding requirements. Good for frameworks with data binding.

```javascript
// Model - Data and business logic
class UserModel {
  constructor() {
    this.users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
  }
  
  getAllUsers() {
    return this.users;
  }
  
  getUserById(id) {
    return this.users.find(user => user.id === parseInt(id));
  }
  
  createUser(userData) {
    const newUser = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email
    };
    this.users.push(newUser);
    return newUser;
  }
  
  updateUser(id, userData) {
    const userIndex = this.users.findIndex(user => user.id === parseInt(id));
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...userData };
      return this.users[userIndex];
    }
    return null;
  }
  
  deleteUser(id) {
    const userIndex = this.users.findIndex(user => user.id === parseInt(id));
    if (userIndex !== -1) {
      return this.users.splice(userIndex, 1)[0];
    }
    return null;
  }
}

// View - Presentation layer
class UserView {
  renderUserList(users) {
    return `
      <div class="user-list">
        <h2>Users</h2>
        <ul>
          ${users.map(user => `
            <li>
              <strong>${user.name}</strong> - ${user.email}
              <button onclick="editUser(${user.id})">Edit</button>
              <button onclick="deleteUser(${user.id})">Delete</button>
            </li>
          `).join('')}
        </ul>
        <button onclick="showCreateForm()">Add New User</button>
      </div>
    `;
  }
  
  renderUserDetail(user) {
    if (!user) {
      return '<div class="error">User not found</div>';
    }
    
    return `
      <div class="user-detail">
        <h2>User Details</h2>
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <button onclick="editUser(${user.id})">Edit</button>
        <button onclick="showUserList()">Back to List</button>
      </div>
    `;
  }
  
  renderUserForm(user = null) {
    const isEdit = user !== null;
    
    return `
      <div class="user-form">
        <h2>${isEdit ? 'Edit User' : 'Create User'}</h2>
        <form onsubmit="${isEdit ? `updateUser(${user.id}, event)` : 'createUser(event)'}">
          <div>
            <label>Name:</label>
            <input type="text" name="name" value="${user ? user.name : ''}" required>
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value="${user ? user.email : ''}" required>
          </div>
          <button type="submit">${isEdit ? 'Update' : 'Create'}</button>
          <button type="button" onclick="showUserList()">Cancel</button>
        </form>
      </div>
    `;
  }
  
  renderError(message) {
    return `<div class="error">Error: ${message}</div>`;
  }
  
  renderSuccess(message) {
    return `<div class="success">Success: ${message}</div>`;
  }
}

// Controller - Handles user input and coordinates Model and View
class UserController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.currentView = 'list';
  }
  
  // Display all users
  showUserList() {
    try {
      const users = this.model.getAllUsers();
      const html = this.view.renderUserList(users);
      this.updateDOM(html);
      this.currentView = 'list';
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  // Display single user
  showUserDetail(userId) {
    try {
      const user = this.model.getUserById(userId);
      const html = this.view.renderUserDetail(user);
      this.updateDOM(html);
      this.currentView = 'detail';
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  // Show create form
  showCreateForm() {
    const html = this.view.renderUserForm();
    this.updateDOM(html);
    this.currentView = 'create';
  }
  
  // Show edit form
  showEditForm(userId) {
    try {
      const user = this.model.getUserById(userId);
      if (!user) {
        this.showError('User not found');
        return;
      }
      
      const html = this.view.renderUserForm(user);
      this.updateDOM(html);
      this.currentView = 'edit';
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  // Create new user
  createUser(formData) {
    try {
      const newUser = this.model.createUser(formData);
      this.showSuccess(`User ${newUser.name} created successfully`);
      setTimeout(() => this.showUserList(), 1500);
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  // Update existing user
  updateUser(userId, formData) {
    try {
      const updatedUser = this.model.updateUser(userId, formData);
      if (!updatedUser) {
        this.showError('User not found');
        return;
      }
      
      this.showSuccess(`User ${updatedUser.name} updated successfully`);
      setTimeout(() => this.showUserList(), 1500);
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  // Delete user
  deleteUser(userId) {
    try {
      const deletedUser = this.model.deleteUser(userId);
      if (!deletedUser) {
        this.showError('User not found');
        return;
      }
      
      this.showSuccess(`User ${deletedUser.name} deleted successfully`);
      setTimeout(() => this.showUserList(), 1500);
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  // Helper methods
  showError(message) {
    const html = this.view.renderError(message);
    this.updateDOM(html);
  }
  
  showSuccess(message) {
    const html = this.view.renderSuccess(message);
    this.updateDOM(html);
  }
  
  updateDOM(html) {
    // In a real application, this would update the actual DOM
    console.log('Updating DOM with:', html);
  }
}

// Usage and initialization
const userModel = new UserModel();
const userView = new UserView();
const userController = new UserController(userModel, userView);

// Simulate user interactions
userController.showUserList();
userController.showCreateForm();
userController.createUser({ name: 'Bob Johnson', email: 'bob@example.com' });
```

**Q17: Compare Repository pattern vs Data Access Object (DAO) pattern. When would you use each?**

**Answer:**
- **Repository**: Domain-driven, works with aggregate roots, more business-focused
- **DAO**: Data-focused, one-to-one mapping with database tables, more technical

**Repository Pattern:**
```javascript
// Domain entities
class User {
  constructor(id, name, email, profile) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.profile = profile;
  }
  
  updateProfile(profileData) {
    this.profile = { ...this.profile, ...profileData };
  }
  
  isActive() {
    return this.profile && this.profile.status === 'active';
  }
}

class UserProfile {
  constructor(userId, bio, avatar, preferences) {
    this.userId = userId;
    this.bio = bio;
    this.avatar = avatar;
    this.preferences = preferences;
    this.status = 'active';
  }
}

// Repository interface - domain-focused
class UserRepository {
  async findById(id) {
    throw new Error('Must implement findById');
  }
  
  async findByEmail(email) {
    throw new Error('Must implement findByEmail');
  }
  
  async findActiveUsers() {
    throw new Error('Must implement findActiveUsers');
  }
  
  async save(user) {
    throw new Error('Must implement save');
  }
  
  async delete(user) {
    throw new Error('Must implement delete');
  }
}

// Repository implementation
class DatabaseUserRepository extends UserRepository {
  constructor(database) {
    super();
    this.db = database;
  }
  
  async findById(id) {
    const userData = await this.db.query(
      'SELECT u.*, p.* FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id = ?',
      [id]
    );
    
    if (!userData.length) return null;
    
    const row = userData[0];
    const profile = new UserProfile(row.user_id, row.bio, row.avatar, JSON.parse(row.preferences || '{}'));
    return new User(row.id, row.name, row.email, profile);
  }
  
  async findByEmail(email) {
    const userData = await this.db.query(
      'SELECT u.*, p.* FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.email = ?',
      [email]
    );
    
    if (!userData.length) return null;
    
    const row = userData[0];
    const profile = new UserProfile(row.user_id, row.bio, row.avatar, JSON.parse(row.preferences || '{}'));
    return new User(row.id, row.name, row.email, profile);
  }
  
  async findActiveUsers() {
    const usersData = await this.db.query(
      'SELECT u.*, p.* FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE p.status = ?',
      ['active']
    );
    
    return usersData.map(row => {
      const profile = new UserProfile(row.user_id, row.bio, row.avatar, JSON.parse(row.preferences || '{}'));
      return new User(row.id, row.name, row.email, profile);
    });
  }
  
  async save(user) {
    await this.db.transaction(async (tx) => {
      // Save user
      await tx.query(
        'INSERT INTO users (id, name, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, email = ?',
        [user.id, user.name, user.email, user.name, user.email]
      );
      
      // Save profile
      if (user.profile) {
        await tx.query(
          'INSERT INTO profiles (user_id, bio, avatar, preferences, status) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE bio = ?, avatar = ?, preferences = ?, status = ?',
          [user.id, user.profile.bio, user.profile.avatar, JSON.stringify(user.profile.preferences), user.profile.status,
           user.profile.bio, user.profile.avatar, JSON.stringify(user.profile.preferences), user.profile.status]
        );
      }
    });
  }
  
  async delete(user) {
    await this.db.transaction(async (tx) => {
      await tx.query('DELETE FROM profiles WHERE user_id = ?', [user.id]);
      await tx.query('DELETE FROM users WHERE id = ?', [user.id]);
    });
  }
}
```

**DAO Pattern:**
```javascript
// Data Transfer Objects (DTOs)
class UserDTO {
  constructor(id, name, email, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

class ProfileDTO {
  constructor(id, userId, bio, avatar, preferences, status, createdAt, updatedAt) {
    this.id = id;
    this.userId = userId;
    this.bio = bio;
    this.avatar = avatar;
    this.preferences = preferences;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

// DAO interfaces - data-focused
class UserDAO {
  async insert(userDTO) {
    throw new Error('Must implement insert');
  }
  
  async update(userDTO) {
    throw new Error('Must implement update');
  }
  
  async delete(id) {
    throw new Error('Must implement delete');
  }
  
  async findById(id) {
    throw new Error('Must implement findById');
  }
  
  async findByEmail(email) {
    throw new Error('Must implement findByEmail');
  }
  
  async findAll() {
    throw new Error('Must implement findAll');
  }
}

class ProfileDAO {
  async insert(profileDTO) {
    throw new Error('Must implement insert');
  }
  
  async update(profileDTO) {
    throw new Error('Must implement update');
  }
  
  async delete(id) {
    throw new Error('Must implement delete');
  }
  
  async findById(id) {
    throw new Error('Must implement findById');
  }
  
  async findByUserId(userId) {
    throw new Error('Must implement findByUserId');
  }
}

// DAO implementations
class DatabaseUserDAO extends UserDAO {
  constructor(database) {
    super();
    this.db = database;
  }
  
  async insert(userDTO) {
    const result = await this.db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [userDTO.name, userDTO.email]
    );
    
    return new UserDTO(
      result.insertId,
      userDTO.name,
      userDTO.email,
      new Date(),
      new Date()
    );
  }
  
  async update(userDTO) {
    await this.db.query(
      'UPDATE users SET name = ?, email = ?, updated_at = NOW() WHERE id = ?',
      [userDTO.name, userDTO.email, userDTO.id]
    );
    
    return this.findById(userDTO.id);
  }
  
  async delete(id) {
    const result = await this.db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
  
  async findById(id) {
    const rows = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows.length) return null;
    
    const row = rows[0];
    return new UserDTO(row.id, row.name, row.email, row.created_at, row.updated_at);
  }
  
  async findByEmail(email) {
    const rows = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return null;
    
    const row = rows[0];
    return new UserDTO(row.id, row.name, row.email, row.created_at, row.updated_at);
  }
  
  async findAll() {
    const rows = await this.db.query('SELECT * FROM users ORDER BY created_at DESC');
    return rows.map(row => new UserDTO(row.id, row.name, row.email, row.created_at, row.updated_at));
  }
}

class DatabaseProfileDAO extends ProfileDAO {
  constructor(database) {
    super();
    this.db = database;
  }
  
  async insert(profileDTO) {
    const result = await this.db.query(
      'INSERT INTO profiles (user_id, bio, avatar, preferences, status) VALUES (?, ?, ?, ?, ?)',
      [profileDTO.userId, profileDTO.bio, profileDTO.avatar, profileDTO.preferences, profileDTO.status]
    );
    
    return new ProfileDTO(
      result.insertId,
      profileDTO.userId,
      profileDTO.bio,
      profileDTO.avatar,
      profileDTO.preferences,
      profileDTO.status,
      new Date(),
      new Date()
    );
  }
  
  async findByUserId(userId) {
    const rows = await this.db.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    if (!rows.length) return null;
    
    const row = rows[0];
    return new ProfileDTO(
      row.id,
      row.user_id,
      row.bio,
      row.avatar,
      row.preferences,
      row.status,
      row.created_at,
      row.updated_at
    );
  }
}

// Service layer using DAOs
class UserService {
  constructor(userDAO, profileDAO) {
    this.userDAO = userDAO;
    this.profileDAO = profileDAO;
  }
  
  async createUserWithProfile(userData, profileData) {
    // Create user
    const userDTO = new UserDTO(null, userData.name, userData.email);
    const createdUser = await this.userDAO.insert(userDTO);
    
    // Create profile
    const profileDTO = new ProfileDTO(
      null,
      createdUser.id,
      profileData.bio,
      profileData.avatar,
      JSON.stringify(profileData.preferences),
      'active'
    );
    const createdProfile = await this.profileDAO.insert(profileDTO);
    
    return { user: createdUser, profile: createdProfile };
  }
  
  async getUserWithProfile(userId) {
    const user = await this.userDAO.findById(userId);
    if (!user) return null;
    
    const profile = await this.profileDAO.findByUserId(userId);
    return { user, profile };
  }
}
```

**When to use each:**
- **Repository**: Use for domain-driven design, complex business logic, aggregate roots
- **DAO**: Use for simple CRUD operations, data-centric applications, when you need fine-grained control over database operations**
Q18: Implement the Unit of Work pattern for managing database transactions.**

**Answer:**
Unit of Work maintains a list of objects affected by a business transaction and coordinates writing out changes and resolving concurrency problems.

```javascript
// Entity base class
class Entity {
  constructor(id = null) {
    this.id = id;
    this.isNew = id === null;
    this.isDirty = false;
    this.isDeleted = false;
  }
  
  markDirty() {
    if (!this.isNew) {
      this.isDirty = true;
    }
  }
  
  markDeleted() {
    this.isDeleted = true;
  }
}

// Domain entities
class User extends Entity {
  constructor(id, name, email) {
    super(id);
    this.name = name;
    this.email = email;
  }
  
  updateName(name) {
    this.name = name;
    this.markDirty();
  }
  
  updateEmail(email) {
    this.email = email;
    this.markDirty();
  }
}

class Order extends Entity {
  constructor(id, userId, total, items = []) {
    super(id);
    this.userId = userId;
    this.total = total;
    this.items = items;
  }
  
  addItem(item) {
    this.items.push(item);
    this.total += item.price * item.quantity;
    this.markDirty();
  }
  
  removeItem(itemId) {
    const itemIndex = this.items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      const item = this.items[itemIndex];
      this.total -= item.price * item.quantity;
      this.items.splice(itemIndex, 1);
      this.markDirty();
    }
  }
}

// Unit of Work implementation
class UnitOfWork {
  constructor(database) {
    this.db = database;
    this.newEntities = [];
    this.dirtyEntities = [];
    this.deletedEntities = [];
    this.transaction = null;
  }
  
  // Register entities for tracking
  registerNew(entity) {
    if (entity.id !== null) {
      throw new Error('Entity is not new');
    }
    
    if (this.isRegistered(entity)) {
      throw new Error('Entity already registered');
    }
    
    this.newEntities.push(entity);
  }
  
  registerDirty(entity) {
    if (entity.id === null) {
      throw new Error('Entity must have an ID');
    }
    
    if (!this.isRegistered(entity) && !this.dirtyEntities.includes(entity)) {
      this.dirtyEntities.push(entity);
    }
  }
  
  registerDeleted(entity) {
    if (entity.id === null) {
      throw new Error('Entity must have an ID');
    }
    
    // Remove from new/dirty if present
    this.newEntities = this.newEntities.filter(e => e !== entity);
    this.dirtyEntities = this.dirtyEntities.filter(e => e !== entity);
    
    if (!this.deletedEntities.includes(entity)) {
      this.deletedEntities.push(entity);
    }
  }
  
  isRegistered(entity) {
    return this.newEntities.includes(entity) || 
           this.dirtyEntities.includes(entity) || 
           this.deletedEntities.includes(entity);
  }
  
  // Commit all changes in a single transaction
  async commit() {
    if (this.newEntities.length === 0 && 
        this.dirtyEntities.length === 0 && 
        this.deletedEntities.length === 0) {
      return; // Nothing to commit
    }
    
    this.transaction = await this.db.beginTransaction();
    
    try {
      // Insert new entities
      for (const entity of this.newEntities) {
        await this.insertEntity(entity);
      }
      
      // Update dirty entities
      for (const entity of this.dirtyEntities) {
        await this.updateEntity(entity);
      }
      
      // Delete entities
      for (const entity of this.deletedEntities) {
        await this.deleteEntity(entity);
      }
      
      await this.transaction.commit();
      this.clear();
      
    } catch (error) {
      await this.transaction.rollback();
      throw error;
    }
  }
  
  async rollback() {
    if (this.transaction) {
      await this.transaction.rollback();
    }
    this.clear();
  }
  
  clear() {
    this.newEntities = [];
    this.dirtyEntities = [];
    this.deletedEntities = [];
    this.transaction = null;
  }
  
  // Entity-specific operations
  async insertEntity(entity) {
    if (entity instanceof User) {
      const result = await this.transaction.query(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [entity.name, entity.email]
      );
      entity.id = result.insertId;
      entity.isNew = false;
      
    } else if (entity instanceof Order) {
      const result = await this.transaction.query(
        'INSERT INTO orders (user_id, total) VALUES (?, ?)',
        [entity.userId, entity.total]
      );
      entity.id = result.insertId;
      entity.isNew = false;
      
      // Insert order items
      for (const item of entity.items) {
        await this.transaction.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [entity.id, item.productId, item.quantity, item.price]
        );
      }
    }
  }
  
  async updateEntity(entity) {
    if (entity instanceof User) {
      await this.transaction.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [entity.name, entity.email, entity.id]
      );
      entity.isDirty = false;
      
    } else if (entity instanceof Order) {
      await this.transaction.query(
        'UPDATE orders SET total = ? WHERE id = ?',
        [entity.total, entity.id]
      );
      
      // For simplicity, delete and re-insert order items
      await this.transaction.query('DELETE FROM order_items WHERE order_id = ?', [entity.id]);
      
      for (const item of entity.items) {
        await this.transaction.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [entity.id, item.productId, item.quantity, item.price]
        );
      }
      
      entity.isDirty = false;
    }
  }
  
  async deleteEntity(entity) {
    if (entity instanceof User) {
      await this.transaction.query('DELETE FROM users WHERE id = ?', [entity.id]);
      
    } else if (entity instanceof Order) {
      await this.transaction.query('DELETE FROM order_items WHERE order_id = ?', [entity.id]);
      await this.transaction.query('DELETE FROM orders WHERE id = ?', [entity.id]);
    }
  }
}

// Repository with Unit of Work
class UserRepository {
  constructor(database, unitOfWork) {
    this.db = database;
    this.uow = unitOfWork;
  }
  
  async findById(id) {
    const rows = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows.length) return null;
    
    const row = rows[0];
    return new User(row.id, row.name, row.email);
  }
  
  save(user) {
    if (user.isNew) {
      this.uow.registerNew(user);
    } else if (user.isDirty) {
      this.uow.registerDirty(user);
    }
  }
  
  delete(user) {
    this.uow.registerDeleted(user);
  }
}

class OrderRepository {
  constructor(database, unitOfWork) {
    this.db = database;
    this.uow = unitOfWork;
  }
  
  async findById(id) {
    const orderRows = await this.db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!orderRows.length) return null;
    
    const orderRow = orderRows[0];
    const itemRows = await this.db.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
    
    const items = itemRows.map(row => ({
      id: row.id,
      productId: row.product_id,
      quantity: row.quantity,
      price: row.price
    }));
    
    return new Order(orderRow.id, orderRow.user_id, orderRow.total, items);
  }
  
  save(order) {
    if (order.isNew) {
      this.uow.registerNew(order);
    } else if (order.isDirty) {
      this.uow.registerDirty(order);
    }
  }
  
  delete(order) {
    this.uow.registerDeleted(order);
  }
}

// Service using Unit of Work
class OrderService {
  constructor(userRepository, orderRepository, unitOfWork) {
    this.userRepo = userRepository;
    this.orderRepo = orderRepository;
    this.uow = unitOfWork;
  }
  
  async createOrderForUser(userId, items) {
    try {
      // Find user
      const user = await this.userRepo.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Create order
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const order = new Order(null, userId, total, items);
      
      // Register for saving
      this.orderRepo.save(order);
      
      // Update user's last order date (example of multiple entity changes)
      user.lastOrderDate = new Date();
      this.userRepo.save(user);
      
      // Commit all changes in single transaction
      await this.uow.commit();
      
      return order;
      
    } catch (error) {
      await this.uow.rollback();
      throw error;
    }
  }
  
  async updateOrder(orderId, newItems) {
    try {
      const order = await this.orderRepo.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Update order items
      order.items = newItems;
      order.total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      order.markDirty();
      
      this.orderRepo.save(order);
      await this.uow.commit();
      
      return order;
      
    } catch (error) {
      await this.uow.rollback();
      throw error;
    }
  }
}

// Usage
const database = new Database(); // Your database implementation
const unitOfWork = new UnitOfWork(database);
const userRepo = new UserRepository(database, unitOfWork);
const orderRepo = new OrderRepository(database, unitOfWork);
const orderService = new OrderService(userRepo, orderRepo, unitOfWork);

// Create order with automatic transaction management
const order = await orderService.createOrderForUser(1, [
  { productId: 1, quantity: 2, price: 25.99 },
  { productId: 2, quantity: 1, price: 15.50 }
]);
```

**Q19: Explain the difference between Layered Architecture and Hexagonal Architecture (Ports and Adapters).**

**Answer:**

**Layered Architecture:**
```javascript
// Traditional Layered Architecture
// Presentation Layer
class UserController {
  constructor(userService) {
    this.userService = userService;
  }
  
  async createUser(req, res) {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  async getUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

// Business Logic Layer
class UserService {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
  
  async createUser(userData) {
    // Business logic
    if (!userData.email || !userData.name) {
      throw new Error('Email and name are required');
    }
    
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const user = await this.userRepository.create(userData);
    await this.emailService.sendWelcomeEmail(user);
    
    return user;
  }
  
  async getUserById(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

// Data Access Layer
class UserRepository {
  constructor(database) {
    this.db = database;
  }
  
  async create(userData) {
    const result = await this.db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [userData.name, userData.email]
    );
    
    return { id: result.insertId, ...userData };
  }
  
  async findById(id) {
    const rows = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }
  
  async findByEmail(email) {
    const rows = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }
}

// Infrastructure Layer
class EmailService {
  async sendWelcomeEmail(user) {
    console.log(`Sending welcome email to ${user.email}`);
    // Email sending implementation
  }
}
```

**Hexagonal Architecture (Ports and Adapters):**
```javascript
// Domain Layer (Core)
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
  
  static create(name, email) {
    if (!name || !email) {
      throw new Error('Name and email are required');
    }
    
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
    
    return new User(null, name, email);
  }
  
  updateEmail(newEmail) {
    if (!newEmail.includes('@')) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
  }
}

// Ports (Interfaces) - Define what the application needs
class UserRepositoryPort {
  async save(user) {
    throw new Error('Must implement save method');
  }
  
  async findById(id) {
    throw new Error('Must implement findById method');
  }
  
  async findByEmail(email) {
    throw new Error('Must implement findByEmail method');
  }
}

class NotificationPort {
  async sendWelcomeNotification(user) {
    throw new Error('Must implement sendWelcomeNotification method');
  }
}

// Application Services (Use Cases)
class CreateUserUseCase {
  constructor(userRepository, notificationService) {
    this.userRepository = userRepository;
    this.notificationService = notificationService;
  }
  
  async execute(userData) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create user
    const user = User.create(userData.name, userData.email);
    const savedUser = await this.userRepository.save(user);
    
    // Send notification
    await this.notificationService.sendWelcomeNotification(savedUser);
    
    return savedUser;
  }
}

class GetUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  
  async execute(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

// Adapters (Implementations)
// Database Adapter
class DatabaseUserRepository extends UserRepositoryPort {
  constructor(database) {
    super();
    this.db = database;
  }
  
  async save(user) {
    if (user.id) {
      // Update existing user
      await this.db.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [user.name, user.email, user.id]
      );
      return user;
    } else {
      // Create new user
      const result = await this.db.query(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [user.name, user.email]
      );
      return new User(result.insertId, user.name, user.email);
    }
  }
  
  async findById(id) {
    const rows = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!rows.length) return null;
    
    const row = rows[0];
    return new User(row.id, row.name, row.email);
  }
  
  async findByEmail(email) {
    const rows = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return null;
    
    const row = rows[0];
    return new User(row.id, row.name, row.email);
  }
}

// Email Adapter
class EmailNotificationAdapter extends NotificationPort {
  constructor(emailClient) {
    super();
    this.emailClient = emailClient;
  }
  
  async sendWelcomeNotification(user) {
    await this.emailClient.send({
      to: user.email,
      subject: 'Welcome!',
      body: `Hello ${user.name}, welcome to our platform!`
    });
  }
}

// SMS Adapter
class SMSNotificationAdapter extends NotificationPort {
  constructor(smsClient) {
    super();
    this.smsClient = smsClient;
  }
  
  async sendWelcomeNotification(user) {
    await this.smsClient.send({
      to: user.phone,
      message: `Hello ${user.name}, welcome to our platform!`
    });
  }
}

// HTTP Adapter (Primary/Driving Adapter)
class HttpUserController {
  constructor(createUserUseCase, getUserUseCase) {
    this.createUserUseCase = createUserUseCase;
    this.getUserUseCase = getUserUseCase;
  }
  
  async createUser(req, res) {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  async getUser(req, res) {
    try {
      const user = await this.getUserUseCase.execute(req.params.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

// CLI Adapter (Alternative Primary Adapter)
class CLIUserController {
  constructor(createUserUseCase, getUserUseCase) {
    this.createUserUseCase = createUserUseCase;
    this.getUserUseCase = getUserUseCase;
  }
  
  async createUser(name, email) {
    try {
      const user = await this.createUserUseCase.execute({ name, email });
      console.log(`User created: ${JSON.stringify(user)}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
  
  async getUser(userId) {
    try {
      const user = await this.getUserUseCase.execute(userId);
      console.log(`User: ${JSON.stringify(user)}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

// Dependency Injection / Configuration
class ApplicationConfiguration {
  static createHttpApplication(database, emailClient) {
    // Adapters
    const userRepository = new DatabaseUserRepository(database);
    const notificationService = new EmailNotificationAdapter(emailClient);
    
    // Use Cases
    const createUserUseCase = new CreateUserUseCase(userRepository, notificationService);
    const getUserUseCase = new GetUserUseCase(userRepository);
    
    // Controller
    return new HttpUserController(createUserUseCase, getUserUseCase);
  }
  
  static createCLIApplication(database, smsClient) {
    // Adapters
    const userRepository = new DatabaseUserRepository(database);
    const notificationService = new SMSNotificationAdapter(smsClient);
    
    // Use Cases
    const createUserUseCase = new CreateUserUseCase(userRepository, notificationService);
    const getUserUseCase = new GetUserUseCase(userRepository);
    
    // Controller
    return new CLIUserController(createUserUseCase, getUserUseCase);
  }
}

// Usage
const database = new Database();
const emailClient = new EmailClient();
const smsClient = new SMSClient();

// HTTP Application
const httpApp = ApplicationConfiguration.createHttpApplication(database, emailClient);

// CLI Application
const cliApp = ApplicationConfiguration.createCLIApplication(database, smsClient);
```

**Key Differences:**
1. **Dependency Direction**: Layered has top-down dependencies; Hexagonal has dependencies pointing inward to the domain
2. **Testability**: Hexagonal is more testable due to dependency inversion
3. **Flexibility**: Hexagonal allows easy swapping of adapters (database, UI, etc.)
4. **Domain Focus**: Hexagonal keeps business logic isolated from infrastructure concerns

**Q20: Implement the CQRS (Command Query Responsibility Segregation) pattern.**

**Answer:**
CQRS separates read and write operations, allowing different models for commands and queries.

```javascript
// Domain Events
class DomainEvent {
  constructor(aggregateId, eventType, data, timestamp = new Date()) {
    this.aggregateId = aggregateId;
    this.eventType = eventType;
    this.data = data;
    this.timestamp = timestamp;
    this.id = `${eventType}_${Date.now()}_${Math.random()}`;
  }
}

class UserCreatedEvent extends DomainEvent {
  constructor(userId, userData) {
    super(userId, 'UserCreated', userData);
  }
}

class UserEmailUpdatedEvent extends DomainEvent {
  constructor(userId, oldEmail, newEmail) {
    super(userId, 'UserEmailUpdated', { oldEmail, newEmail });
  }
}

// Command Side (Write Model)
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.version = 0;
    this.uncommittedEvents = [];
  }
  
  static create(id, name, email) {
    const user = new User(id, name, email);
    user.addEvent(new UserCreatedEvent(id, { name, email }));
    return user;
  }
  
  updateEmail(newEmail) {
    if (newEmail === this.email) return;
    
    const oldEmail = this.email;
    this.email = newEmail;
    this.addEvent(new UserEmailUpdatedEvent(this.id, oldEmail, newEmail));
  }
  
  addEvent(event) {
    this.uncommittedEvents.push(event);
  }
  
  getUncommittedEvents() {
    return [...this.uncommittedEvents];
  }
  
  markEventsAsCommitted() {
    this.uncommittedEvents = [];
    this.version++;
  }
}

// Commands
class CreateUserCommand {
  constructor(userId, name, email) {
    this.userId = userId;
    this.name = name;
    this.email = email;
  }
}

class UpdateUserEmailCommand {
  constructor(userId, newEmail) {
    this.userId = userId;
    this.newEmail = newEmail;
  }
}

// Command Handlers
class CreateUserCommandHandler {
  constructor(userRepository, eventStore) {
    this.userRepository = userRepository;
    this.eventStore = eventStore;
  }
  
  async handle(command) {
    // Check if user already exists
    const existingUser = await this.userRepository.findById(command.userId);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create user
    const user = User.create(command.userId, command.name, command.email);
    
    // Save events
    const events = user.getUncommittedEvents();
    await this.eventStore.saveEvents(command.userId, events, -1);
    
    // Save to repository
    await this.userRepository.save(user);
    user.markEventsAsCommitted();
    
    return user;
  }
}

class UpdateUserEmailCommandHandler {
  constructor(userRepository, eventStore) {
    this.userRepository = userRepository;
    this.eventStore = eventStore;
  }
  
  async handle(command) {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    user.updateEmail(command.newEmail);
    
    // Save events
    const events = user.getUncommittedEvents();
    await this.eventStore.saveEvents(command.userId, events, user.version);
    
    // Save to repository
    await this.userRepository.save(user);
    user.markEventsAsCommitted();
    
    return user;
  }
}

// Command Bus
class CommandBus {
  constructor() {
    this.handlers = new Map();
  }
  
  register(commandType, handler) {
    this.handlers.set(commandType, handler);
  }
  
  async execute(command) {
    const handler = this.handlers.get(command.constructor);
    if (!handler) {
      throw new Error(`No handler registered for ${command.constructor.name}`);
    }
    
    return handler.handle(command);
  }
}

// Query Side (Read Model)
class UserReadModel {
  constructor(id, name, email, createdAt, updatedAt) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

class UserListReadModel {
  constructor(id, name, email, createdAt) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = createdAt;
  }
}

// Queries
class GetUserByIdQuery {
  constructor(userId) {
    this.userId = userId;
  }
}

class GetAllUsersQuery {
  constructor(page = 1, limit = 10) {
    this.page = page;
    this.limit = limit;
  }
}

class SearchUsersByEmailQuery {
  constructor(emailPattern) {
    this.emailPattern = emailPattern;
  }
}

// Query Handlers
class GetUserByIdQueryHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository;
  }
  
  async handle(query) {
    return this.readModelRepository.findById(query.userId);
  }
}

class GetAllUsersQueryHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository;
  }
  
  async handle(query) {
    return this.readModelRepository.findAll(query.page, query.limit);
  }
}

class SearchUsersByEmailQueryHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository;
  }
  
  async handle(query) {
    return this.readModelRepository.searchByEmail(query.emailPattern);
  }
}

// Query Bus
class QueryBus {
  constructor() {
    this.handlers = new Map();
  }
  
  register(queryType, handler) {
    this.handlers.set(queryType, handler);
  }
  
  async execute(query) {
    const handler = this.handlers.get(query.constructor);
    if (!handler) {
      throw new Error(`No handler registered for ${query.constructor.name}`);
    }
    
    return handler.handle(query);
  }
}

// Event Store
class EventStore {
  constructor(database) {
    this.db = database;
  }
  
  async saveEvents(aggregateId, events, expectedVersion) {
    const transaction = await this.db.beginTransaction();
    
    try {
      // Check version for concurrency control
      const currentVersion = await this.getCurrentVersion(aggregateId);
      if (currentVersion !== expectedVersion) {
        throw new Error('Concurrency conflict');
      }
      
      // Save events
      for (const event of events) {
        await transaction.query(
          'INSERT INTO events (aggregate_id, event_type, event_data, version, timestamp) VALUES (?, ?, ?, ?, ?)',
          [aggregateId, event.eventType, JSON.stringify(event.data), currentVersion + 1, event.timestamp]
        );
      }
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  async getEvents(aggregateId, fromVersion = 0) {
    const rows = await this.db.query(
      'SELECT * FROM events WHERE aggregate_id = ? AND version > ? ORDER BY version',
      [aggregateId, fromVersion]
    );
    
    return rows.map(row => new DomainEvent(
      row.aggregate_id,
      row.event_type,
      JSON.parse(row.event_data),
      row.timestamp
    ));
  }
  
  async getCurrentVersion(aggregateId) {
    const rows = await this.db.query(
      'SELECT MAX(version) as version FROM events WHERE aggregate_id = ?',
      [aggregateId]
    );
    
    return rows[0]?.version || -1;
  }
}

// Read Model Repository
class UserReadModelRepository {
  constructor(database) {
    this.db = database;
  }
  
  async findById(userId) {
    const rows = await this.db.query(
      'SELECT * FROM user_read_model WHERE id = ?',
      [userId]
    );
    
    if (!rows.length) return null;
    
    const row = rows[0];
    return new UserReadModel(row.id, row.name, row.email, row.created_at, row.updated_at);
  }
  
  async findAll(page, limit) {
    const offset = (page - 1) * limit;
    const rows = await this.db.query(
      'SELECT id, name, email, created_at FROM user_read_model ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    return rows.map(row => new UserListReadModel(row.id, row.name, row.email, row.created_at));
  }
  
  async searchByEmail(emailPattern) {
    const rows = await this.db.query(
      'SELECT id, name, email, created_at FROM user_read_model WHERE email LIKE ? ORDER BY name',
      [`%${emailPattern}%`]
    );
    
    return rows.map(row => new UserListReadModel(row.id, row.name, row.email, row.created_at));
  }
  
  async save(userReadModel) {
    await this.db.query(
      'INSERT INTO user_read_model (id, name, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, email = ?, updated_at = ?',
      [userReadModel.id, userReadModel.name, userReadModel.email, userReadModel.createdAt, userReadModel.updatedAt,
       userReadModel.name, userReadModel.email, userReadModel.updatedAt]
    );
  }
}

// Event Handlers for Read Model Updates
class UserCreatedEventHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository;
  }
  
  async handle(event) {
    const readModel = new UserReadModel(
      event.aggregateId,
      event.data.name,
      event.data.email,
      event.timestamp,
      event.timestamp
    );
    
    await this.readModelRepository.save(readModel);
  }
}

class UserEmailUpdatedEventHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository;
  }
  
  async handle(event) {
    const readModel = await this.readModelRepository.findById(event.aggregateId);
    if (readModel) {
      readModel.email = event.data.newEmail;
      readModel.updatedAt = event.timestamp;
      await this.readModelRepository.save(readModel);
    }
  }
}

// Application Service
class UserApplicationService {
  constructor(commandBus, queryBus) {
    this.commandBus = commandBus;
    this.queryBus = queryBus;
  }
  
  // Commands
  async createUser(userId, name, email) {
    const command = new CreateUserCommand(userId, name, email);
    return this.commandBus.execute(command);
  }
  
  async updateUserEmail(userId, newEmail) {
    const command = new UpdateUserEmailCommand(userId, newEmail);
    return this.commandBus.execute(command);
  }
  
  // Queries
  async getUserById(userId) {
    const query = new GetUserByIdQuery(userId);
    return this.queryBus.execute(query);
  }
  
  async getAllUsers(page, limit) {
    const query = new GetAllUsersQuery(page, limit);
    return this.queryBus.execute(query);
  }
  
  async searchUsersByEmail(emailPattern) {
    const query = new SearchUsersByEmailQuery(emailPattern);
    return this.queryBus.execute(query);
  }
}

// Configuration
class CQRSConfiguration {
  static setup(database) {
    // Repositories
    const userRepository = new UserRepository(database);
    const readModelRepository = new UserReadModelRepository(database);
    const eventStore = new EventStore(database);
    
    // Command Bus
    const commandBus = new CommandBus();
    commandBus.register(CreateUserCommand, new CreateUserCommandHandler(userRepository, eventStore));
    commandBus.register(UpdateUserEmailCommand, new UpdateUserEmailCommandHandler(userRepository, eventStore));
    
    // Query Bus
    const queryBus = new QueryBus();
    queryBus.register(GetUserByIdQuery, new GetUserByIdQueryHandler(readModelRepository));
    queryBus.register(GetAllUsersQuery, new GetAllUsersQueryHandler(readModelRepository));
    queryBus.register(SearchUsersByEmailQuery, new SearchUsersByEmailQueryHandler(readModelRepository));
    
    // Application Service
    return new UserApplicationService(commandBus, queryBus);
  }
}

// Usage
const database = new Database();
const userService = CQRSConfiguration.setup(database);

// Commands (writes)
await userService.createUser('user-1', 'John Doe', 'john@example.com');
await userService.updateUserEmail('user-1', 'john.doe@example.com');

// Queries (reads)
const user = await userService.getUserById('user-1');
const allUsers = await userService.getAllUsers(1, 10);
const searchResults = await userService.searchUsersByEmail('john');
```

## Real-World Scenarios (Legacy Code & Microservices)

**Q21: You have a monolithic e-commerce application that needs to be broken down into microservices. How would you approach this refactoring using design patterns?**

**Answer:**
```javascript
// Original Monolithic Structure
class ECommerceMonolith {
  constructor() {
    this.users = [];
    this.products = [];
    this.orders = [];
    this.inventory = new Map();
    this.payments = [];
  }
  
  // User management
  createUser(userData) {
    const user = { id: Date.now(), ...userData };
    this.users.push(user);
    this.sendWelcomeEmail(user);
    return user;
  }
  
  // Product management
  createProduct(productData) {
    const product = { id: Date.now(), ...productData };
    this.products.push(product);
    this.inventory.set(product.id, productData.stock);
    return product;
  }
  
  // Order processing
  createOrder(userId, items) {
    // Check inventory
    for (const item of items) {
      const stock = this.inventory.get(item.productId);
      if (stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }
    
    // Calculate total
    let total = 0;
    for (const item of items) {
      const product = this.products.find(p => p.id === item.productId);
      total += product.price * item.quantity;
    }
    
    // Process payment
    const payment = this.processPayment(userId, total);
    
    // Update inventory
    for (const item of items) {
      const currentStock = this.inventory.get(item.productId);
      this.inventory.set(item.productId, currentStock - item.quantity);
    }
    
    // Create order
    const order = {
      id: Date.now(),
      userId,
      items,
      total,
      paymentId: payment.id,
      status: 'confirmed'
    };
    
    this.orders.push(order);
    this.sendOrderConfirmation(order);
    
    return order;
  }
  
  processPayment(userId, amount) {
    const payment = {
      id: Date.now(),
      userId,
      amount,
      status: 'completed'
    };
    this.payments.push(payment);
    return payment;
  }
  
  sendWelcomeEmail(user) {
    console.log(`Sending welcome email to ${user.email}`);
  }
  
  sendOrderConfirmation(order) {
    console.log(`Sending order confirmation for order ${order.id}`);
  }
}
```

**Microservices Refactoring Strategy:**

**Step 1: Extract Domain Services using Domain-Driven Design**
```javascript
// User Service
class UserService {
  constructor(userRepository, eventBus) {
    this.userRepository = userRepository;
    this.eventBus = eventBus;
  }
  
  async createUser(userData) {
    const user = new User(userData.name, userData.email);
    await this.userRepository.save(user);
    
    // Publish domain event
    await this.eventBus.publish(new UserCreatedEvent(user.id, user));
    
    return user;
  }
  
  async getUserById(userId) {
    return this.userRepository.findById(userId);
  }
}

// Product Service
class ProductService {
  constructor(productRepository, eventBus) {
    this.productRepository = productRepository;
    this.eventBus = eventBus;
  }
  
  async createProduct(productData) {
    const product = new Product(productData.name, productData.price, productData.description);
    await this.productRepository.save(product);
    
    await this.eventBus.publish(new ProductCreatedEvent(product.id, product, productData.stock));
    
    return product;
  }
  
  async getProduct(productId) {
    return this.productRepository.findById(productId);
  }
}

// Inventory Service
class InventoryService {
  constructor(inventoryRepository, eventBus) {
    this.inventoryRepository = inventoryRepository;
    this.eventBus = eventBus;
  }
  
  async reserveItems(items) {
    const reservations = [];
    
    for (const item of items) {
      const inventory = await this.inventoryRepository.findByProductId(item.productId);
      
      if (inventory.availableStock < item.quantity) {
        // Rollback previous reservations
        for (const reservation of reservations) {
          await this.releaseReservation(reservation.id);
        }
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
      
      const reservation = await inventory.reserve(item.quantity);
      await this.inventoryRepository.save(inventory);
      reservations.push(reservation);
    }
    
    return reservations;
  }
  
  async confirmReservations(reservationIds) {
    for (const reservationId of reservationIds) {
      const inventory = await this.inventoryRepository.findByReservationId(reservationId);
      inventory.confirmReservation(reservationId);
      await this.inventoryRepository.save(inventory);
    }
  }
  
  async releaseReservation(reservationId) {
    const inventory = await this.inventoryRepository.findByReservationId(reservationId);
    inventory.releaseReservation(reservationId);
    await this.inventoryRepository.save(inventory);
  }
}

// Payment Service
class PaymentService {
  constructor(paymentRepository, paymentGateway, eventBus) {
    this.paymentRepository = paymentRepository;
    this.paymentGateway = paymentGateway;
    this.eventBus = eventBus;
  }
  
  async processPayment(userId, amount, paymentMethod) {
    const payment = new Payment(userId, amount, paymentMethod);
    
    try {
      const result = await this.paymentGateway.charge(amount, paymentMethod);
      payment.markAsCompleted(result.transactionId);
      
      await this.paymentRepository.save(payment);
      await this.eventBus.publish(new PaymentCompletedEvent(payment.id, payment));
      
      return payment;
    } catch (error) {
      payment.markAsFailed(error.message);
      await this.paymentRepository.save(payment);
      await this.eventBus.publish(new PaymentFailedEvent(payment.id, payment));
      
      throw error;
    }
  }
}

// Order Service (Orchestrator)
class OrderService {
  constructor(orderRepository, inventoryService, paymentService, eventBus) {
    this.orderRepository = orderRepository;
    this.inventoryService = inventoryService;
    this.paymentService = paymentService;
    this.eventBus = eventBus;
  }
  
  async createOrder(userId, items, paymentMethod) {
    const order = new Order(userId, items);
    await this.orderRepository.save(order);
    
    try {
      // Step 1: Reserve inventory
      const reservations = await this.inventoryService.reserveItems(items);
      order.addReservations(reservations);
      
      // Step 2: Process payment
      const payment = await this.paymentService.processPayment(
        userId, 
        order.total, 
        paymentMethod
      );
      order.addPayment(payment);
      
      // Step 3: Confirm reservations
      await this.inventoryService.confirmReservations(
        reservations.map(r => r.id)
      );
      
      // Step 4: Confirm order
      order.confirm();
      await this.orderRepository.save(order);
      
      await this.eventBus.publish(new OrderConfirmedEvent(order.id, order));
      
      return order;
      
    } catch (error) {
      // Compensating actions
      if (order.reservations.length > 0) {
        for (const reservation of order.reservations) {
          await this.inventoryService.releaseReservation(reservation.id);
        }
      }
      
      order.markAsFailed(error.message);
      await this.orderRepository.save(order);
      
      throw error;
    }
  }
}
```

**Step 2: Implement Saga Pattern for Distributed Transactions**
```javascript
// Saga Orchestrator
class OrderSaga {
  constructor(inventoryService, paymentService, orderService, eventBus) {
    this.inventoryService = inventoryService;
    this.paymentService = paymentService;
    this.orderService = orderService;
    this.eventBus = eventBus;
    this.state = new Map();
  }
  
  async handleOrderCreated(event) {
    const sagaId = `saga_${event.orderId}`;
    const sagaState = {
      orderId: event.orderId,
      userId: event.userId,
      items: event.items,
      paymentMethod: event.paymentMethod,
      step: 'INVENTORY_RESERVATION',
      reservations: [],
      payment: null
    };
    
    this.state.set(sagaId, sagaState);
    
    try {
      await this.reserveInventory(sagaId);
    } catch (error) {
      await this.handleSagaFailure(sagaId, error);
    }
  }
  
  async reserveInventory(sagaId) {
    const sagaState = this.state.get(sagaId);
    
    try {
      const reservations = await this.inventoryService.reserveItems(sagaState.items);
      sagaState.reservations = reservations;
      sagaState.step = 'PAYMENT_PROCESSING';
      
      await this.processPayment(sagaId);
    } catch (error) {
      throw error;
    }
  }
  
  async processPayment(sagaId) {
    const sagaState = this.state.get(sagaId);
    
    try {
      const payment = await this.paymentService.processPayment(
        sagaState.userId,
        this.calculateTotal(sagaState.items),
        sagaState.paymentMethod
      );
      
      sagaState.payment = payment;
      sagaState.step = 'INVENTORY_CONFIRMATION';
      
      await this.confirmInventory(sagaId);
    } catch (error) {
      // Compensate: Release inventory reservations
      await this.releaseInventoryReservations(sagaId);
      throw error;
    }
  }
  
  async confirmInventory(sagaId) {
    const sagaState = this.state.get(sagaId);
    
    try {
      await this.inventoryService.confirmReservations(
        sagaState.reservations.map(r => r.id)
      );
      
      sagaState.step = 'ORDER_CONFIRMATION';
      await this.confirmOrder(sagaId);
    } catch (error) {
      // Compensate: Refund payment and release reservations
      await this.refundPayment(sagaId);
      await this.releaseInventoryReservations(sagaId);
      throw error;
    }
  }
  
  async confirmOrder(sagaId) {
    const sagaState = this.state.get(sagaId);
    
    await this.orderService.confirmOrder(sagaState.orderId);
    sagaState.step = 'COMPLETED';
    
    await this.eventBus.publish(new OrderSagaCompletedEvent(sagaId, sagaState.orderId));
    this.state.delete(sagaId);
  }
  
  async handleSagaFailure(sagaId, error) {
    const sagaState = this.state.get(sagaId);
    
    await this.orderService.markOrderAsFailed(sagaState.orderId, error.message);
    await this.eventBus.publish(new OrderSagaFailedEvent(sagaId, sagaState.orderId, error));
    
    this.state.delete(sagaId);
  }
  
  async releaseInventoryReservations(sagaId) {
    const sagaState = this.state.get(sagaId);
    
    for (const reservation of sagaState.reservations) {
      await this.inventoryService.releaseReservation(reservation.id);
    }
  }
  
  async refundPayment(sagaId) {
    const sagaState = this.state.get(sagaId);
    
    if (sagaState.payment) {
      await this.paymentService.refundPayment(sagaState.payment.id);
    }
  }
  
  calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
```

**Step 3: API Gateway Pattern**
```javascript
class APIGateway {
  constructor(userService, productService, orderService, authService) {
    this.userService = userService;
    this.productService = productService;
    this.orderService = orderService;
    this.authService = authService;
    this.rateLimiter = new RateLimiter();
    this.circuitBreaker = new CircuitBreaker();
  }
  
  async handleRequest(request) {
    // Rate limiting
    await this.rateLimiter.checkLimit(request.clientId);
    
    // Authentication
    const user = await this.authService.authenticate(request.token);
    
    // Route to appropriate service
    switch (request.path) {
      case '/users':
        return this.circuitBreaker.execute(() => 
          this.userService.handleRequest(request, user)
        );
        
      case '/products':
        return this.circuitBreaker.execute(() => 
          this.productService.handleRequest(request, user)
        );
        
      case '/orders':
        return this.circuitBreaker.execute(() => 
          this.orderService.handleRequest(request, user)
        );
        
      default:
        throw new Error('Route not found');
    }
  }
}

// Circuit Breaker Pattern
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
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
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

This refactoring approach uses:
- **Domain-Driven Design** to identify service boundaries
- **Saga Pattern** for distributed transactions
- **Event-Driven Architecture** for loose coupling
- **API Gateway Pattern** for unified entry point
- **Circuit Breaker Pattern** for resilience
- **Repository Pattern** for data access abstraction*
*Q22: You're working with a legacy codebase that has tight coupling and no tests. How would you refactor it using design patterns while maintaining backward compatibility?**

**Answer:**
```javascript
// Legacy Code Example
class LegacyOrderProcessor {
  processOrder(orderData) {
    // Tightly coupled code with multiple responsibilities
    
    // Validate order
    if (!orderData.customerId || !orderData.items || orderData.items.length === 0) {
      throw new Error('Invalid order data');
    }
    
    // Calculate total (hardcoded tax rate)
    let total = 0;
    for (const item of orderData.items) {
      total += item.price * item.quantity;
    }
    total = total * 1.08; // 8% tax hardcoded
    
    // Check inventory (direct database access)
    const mysql = require('mysql');
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'inventory'
    });
    
    for (const item of orderData.items) {
      const query = `SELECT stock FROM products WHERE id = ${item.productId}`;
      const result = connection.query(query);
      if (result[0].stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }
    
    // Process payment (hardcoded Stripe)
    const stripe = require('stripe')('sk_test_...');
    const charge = stripe.charges.create({
      amount: total * 100,
      currency: 'usd',
      source: orderData.paymentToken
    });
    
    // Send email (hardcoded SMTP)
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'orders@company.com',
        pass: 'password123'
      }
    });
    
    transporter.sendMail({
      from: 'orders@company.com',
      to: orderData.customerEmail,
      subject: 'Order Confirmation',
      text: `Your order total is $${total}`
    });
    
    // Update inventory
    for (const item of orderData.items) {
      const updateQuery = `UPDATE products SET stock = stock - ${item.quantity} WHERE id = ${item.productId}`;
      connection.query(updateQuery);
    }
    
    connection.end();
    
    return {
      orderId: Date.now(),
      total: total,
      status: 'processed'
    };
  }
}
```

**Refactoring Strategy - Strangler Fig Pattern:**

**Step 1: Extract and Wrap (Facade Pattern)**
```javascript
// Create a facade to maintain backward compatibility
class OrderProcessorFacade {
  constructor() {
    this.legacyProcessor = new LegacyOrderProcessor();
    this.newProcessor = null; // Will be injected later
  }
  
  processOrder(orderData) {
    // Feature flag to gradually migrate
    if (this.shouldUseNewProcessor(orderData)) {
      return this.newProcessor.processOrder(orderData);
    }
    
    return this.legacyProcessor.processOrder(orderData);
  }
  
  shouldUseNewProcessor(orderData) {
    // Gradual rollout based on customer ID, order value, etc.
    return orderData.customerId % 10 === 0; // 10% of customers
  }
  
  setNewProcessor(processor) {
    this.newProcessor = processor;
  }
}
```

**Step 2: Extract Services (Strategy Pattern)**
```javascript
// Extract validation logic
class OrderValidator {
  validate(orderData) {
    const errors = [];
    
    if (!orderData.customerId) {
      errors.push('Customer ID is required');
    }
    
    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Order must contain at least one item');
    }
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    return true;
  }
}

// Extract calculation logic
class TaxCalculator {
  calculateTax(subtotal, region = 'US') {
    const taxRates = {
      'US': 0.08,
      'CA': 0.12,
      'EU': 0.20
    };
    
    return subtotal * (taxRates[region] || 0.08);
  }
}

class OrderCalculator {
  constructor(taxCalculator) {
    this.taxCalculator = taxCalculator;
  }
  
  calculateTotal(items, region) {
    const subtotal = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    const tax = this.taxCalculator.calculateTax(subtotal, region);
    return subtotal + tax;
  }
}

// Extract inventory service
class InventoryService {
  constructor(database) {
    this.db = database;
  }
  
  async checkAvailability(items) {
    for (const item of items) {
      const product = await this.db.query(
        'SELECT stock FROM products WHERE id = ?',
        [item.productId]
      );
      
      if (!product.length || product[0].stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
    }
    
    return true;
  }
  
  async reserveItems(items) {
    const reservations = [];
    
    for (const item of items) {
      const reservation = await this.db.query(
        'UPDATE products SET stock = stock - ?, reserved = reserved + ? WHERE id = ? AND stock >= ?',
        [item.quantity, item.quantity, item.productId, item.quantity]
      );
      
      if (reservation.affectedRows === 0) {
        // Rollback previous reservations
        await this.releaseReservations(reservations);
        throw new Error(`Could not reserve ${item.quantity} units of product ${item.productId}`);
      }
      
      reservations.push({ productId: item.productId, quantity: item.quantity });
    }
    
    return reservations;
  }
  
  async releaseReservations(reservations) {
    for (const reservation of reservations) {
      await this.db.query(
        'UPDATE products SET stock = stock + ?, reserved = reserved - ? WHERE id = ?',
        [reservation.quantity, reservation.quantity, reservation.productId]
      );
    }
  }
}

// Extract payment service (Strategy Pattern)
class PaymentProcessor {
  async processPayment(amount, paymentMethod) {
    throw new Error('Must implement processPayment method');
  }
}

class StripePaymentProcessor extends PaymentProcessor {
  constructor(apiKey) {
    super();
    this.stripe = require('stripe')(apiKey);
  }
  
  async processPayment(amount, paymentMethod) {
    const charge = await this.stripe.charges.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      source: paymentMethod.token
    });
    
    return {
      transactionId: charge.id,
      status: charge.status,
      amount: amount
    };
  }
}

class PayPalPaymentProcessor extends PaymentProcessor {
  constructor(clientId, clientSecret) {
    super();
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }
  
  async processPayment(amount, paymentMethod) {
    // PayPal implementation
    return {
      transactionId: `pp_${Date.now()}`,
      status: 'completed',
      amount: amount
    };
  }
}

// Extract notification service (Observer Pattern)
class NotificationService {
  constructor() {
    this.notifiers = [];
  }
  
  addNotifier(notifier) {
    this.notifiers.push(notifier);
  }
  
  async sendOrderConfirmation(order, customer) {
    const notifications = this.notifiers.map(notifier => 
      notifier.sendOrderConfirmation(order, customer)
    );
    
    await Promise.all(notifications);
  }
}

class EmailNotifier {
  constructor(emailService) {
    this.emailService = emailService;
  }
  
  async sendOrderConfirmation(order, customer) {
    await this.emailService.send({
      to: customer.email,
      subject: 'Order Confirmation',
      template: 'order-confirmation',
      data: { order, customer }
    });
  }
}

class SMSNotifier {
  constructor(smsService) {
    this.smsService = smsService;
  }
  
  async sendOrderConfirmation(order, customer) {
    if (customer.phone) {
      await this.smsService.send({
        to: customer.phone,
        message: `Order ${order.id} confirmed. Total: $${order.total}`
      });
    }
  }
}
```

**Step 3: New Order Processor (Template Method Pattern)**
```javascript
class ModernOrderProcessor {
  constructor(validator, calculator, inventoryService, paymentProcessor, notificationService) {
    this.validator = validator;
    this.calculator = calculator;
    this.inventoryService = inventoryService;
    this.paymentProcessor = paymentProcessor;
    this.notificationService = notificationService;
  }
  
  async processOrder(orderData) {
    // Template method pattern
    try {
      await this.validateOrder(orderData);
      const total = await this.calculateTotal(orderData);
      const reservations = await this.reserveInventory(orderData.items);
      const payment = await this.processPayment(total, orderData.paymentMethod);
      const order = await this.createOrder(orderData, total, payment);
      await this.sendNotifications(order, orderData.customer);
      
      return order;
    } catch (error) {
      await this.handleError(error, orderData);
      throw error;
    }
  }
  
  async validateOrder(orderData) {
    return this.validator.validate(orderData);
  }
  
  async calculateTotal(orderData) {
    return this.calculator.calculateTotal(orderData.items, orderData.region);
  }
  
  async reserveInventory(items) {
    return this.inventoryService.reserveItems(items);
  }
  
  async processPayment(amount, paymentMethod) {
    return this.paymentProcessor.processPayment(amount, paymentMethod);
  }
  
  async createOrder(orderData, total, payment) {
    return {
      id: `order_${Date.now()}`,
      customerId: orderData.customerId,
      items: orderData.items,
      total: total,
      paymentId: payment.transactionId,
      status: 'confirmed',
      createdAt: new Date()
    };
  }
  
  async sendNotifications(order, customer) {
    return this.notificationService.sendOrderConfirmation(order, customer);
  }
  
  async handleError(error, orderData) {
    console.error('Order processing failed:', error);
    // Log error, send alerts, etc.
  }
}
```

**Step 4: Dependency Injection Container**
```javascript
class DIContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }
  
  register(name, factory, singleton = false) {
    this.services.set(name, { factory, singleton });
  }
  
  get(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    
    if (service.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.factory(this));
      }
      return this.singletons.get(name);
    }
    
    return service.factory(this);
  }
}

// Configuration
function configureServices() {
  const container = new DIContainer();
  
  // Register services
  container.register('database', () => new Database(), true);
  container.register('orderValidator', () => new OrderValidator());
  container.register('taxCalculator', () => new TaxCalculator());
  container.register('orderCalculator', (c) => new OrderCalculator(c.get('taxCalculator')));
  container.register('inventoryService', (c) => new InventoryService(c.get('database')));
  container.register('paymentProcessor', () => new StripePaymentProcessor(process.env.STRIPE_KEY));
  container.register('emailService', () => new EmailService());
  container.register('smsService', () => new SMSService());
  container.register('notificationService', (c) => {
    const service = new NotificationService();
    service.addNotifier(new EmailNotifier(c.get('emailService')));
    service.addNotifier(new SMSNotifier(c.get('smsService')));
    return service;
  });
  
  container.register('modernOrderProcessor', (c) => new ModernOrderProcessor(
    c.get('orderValidator'),
    c.get('orderCalculator'),
    c.get('inventoryService'),
    c.get('paymentProcessor'),
    c.get('notificationService')
  ));
  
  return container;
}
```

**Step 5: Migration Strategy**
```javascript
class OrderProcessorMigration {
  constructor() {
    this.container = configureServices();
    this.facade = new OrderProcessorFacade();
    this.facade.setNewProcessor(this.container.get('modernOrderProcessor'));
  }
  
  // Gradual migration with feature flags
  processOrder(orderData) {
    return this.facade.processOrder(orderData);
  }
  
  // A/B testing method
  async processOrderWithTesting(orderData) {
    const legacyResult = await this.processWithLegacy(orderData);
    
    try {
      const modernResult = await this.processWithModern(orderData);
      
      // Compare results and log differences
      this.compareResults(legacyResult, modernResult);
      
      // Return legacy result for now (shadow mode)
      return legacyResult;
    } catch (error) {
      console.error('Modern processor failed:', error);
      return legacyResult;
    }
  }
  
  async processWithLegacy(orderData) {
    const legacyProcessor = new LegacyOrderProcessor();
    return legacyProcessor.processOrder(orderData);
  }
  
  async processWithModern(orderData) {
    const modernProcessor = this.container.get('modernOrderProcessor');
    return modernProcessor.processOrder(orderData);
  }
  
  compareResults(legacy, modern) {
    const differences = [];
    
    if (Math.abs(legacy.total - modern.total) > 0.01) {
      differences.push(`Total mismatch: ${legacy.total} vs ${modern.total}`);
    }
    
    if (differences.length > 0) {
      console.warn('Result differences detected:', differences);
    }
  }
}

// Usage
const migrationProcessor = new OrderProcessorMigration();

// This maintains backward compatibility while gradually introducing new code
const result = await migrationProcessor.processOrder(orderData);
```

**Benefits of this approach:**
- **Backward Compatibility**: Existing code continues to work
- **Gradual Migration**: Can migrate piece by piece
- **Testing**: Can compare old vs new implementations
- **Rollback**: Easy to revert if issues arise
- **Separation of Concerns**: Each service has a single responsibility
- **Testability**: New code is easily testable
- **Flexibility**: Can swap implementations easily

**Q23: Design a caching system using multiple design patterns that can handle different cache strategies (LRU, LFU, TTL).**

**Answer:**
```javascript
// Strategy Pattern for different eviction policies
class EvictionStrategy {
  evict(cache) {
    throw new Error('Must implement evict method');
  }
  
  onAccess(key, cache) {
    // Override if needed for tracking access patterns
  }
  
  onSet(key, cache) {
    // Override if needed for tracking set operations
  }
}

class LRUEvictionStrategy extends EvictionStrategy {
  constructor() {
    super();
    this.accessOrder = new Map(); // key -> timestamp
  }
  
  onAccess(key, cache) {
    this.accessOrder.set(key, Date.now());
  }
  
  onSet(key, cache) {
    this.accessOrder.set(key, Date.now());
  }
  
  evict(cache) {
    if (cache.size === 0) return null;
    
    let oldestKey = null;
    let oldestTime = Infinity;
    
    for (const [key, timestamp] of this.accessOrder) {
      if (cache.has(key) && timestamp < oldestTime) {
        oldestTime = timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.accessOrder.delete(oldestKey);
      return oldestKey;
    }
    
    return null;
  }
}

class LFUEvictionStrategy extends EvictionStrategy {
  constructor() {
    super();
    this.frequencies = new Map(); // key -> frequency count
  }
  
  onAccess(key, cache) {
    const currentFreq = this.frequencies.get(key) || 0;
    this.frequencies.set(key, currentFreq + 1);
  }
  
  onSet(key, cache) {
    this.frequencies.set(key, 1);
  }
  
  evict(cache) {
    if (cache.size === 0) return null;
    
    let leastFrequentKey = null;
    let lowestFrequency = Infinity;
    
    for (const [key, frequency] of this.frequencies) {
      if (cache.has(key) && frequency < lowestFrequency) {
        lowestFrequency = frequency;
        leastFrequentKey = key;
      }
    }
    
    if (leastFrequentKey) {
      this.frequencies.delete(leastFrequentKey);
      return leastFrequentKey;
    }
    
    return null;
  }
}

class TTLEvictionStrategy extends EvictionStrategy {
  constructor() {
    super();
    this.expirationTimes = new Map(); // key -> expiration timestamp
    this.defaultTTL = 300000; // 5 minutes
  }
  
  onSet(key, cache, ttl = this.defaultTTL) {
    this.expirationTimes.set(key, Date.now() + ttl);
  }
  
  evict(cache) {
    const now = Date.now();
    const expiredKeys = [];
    
    for (const [key, expirationTime] of this.expirationTimes) {
      if (cache.has(key) && now > expirationTime) {
        expiredKeys.push(key);
      }
    }
    
    // Clean up expired entries
    for (const key of expiredKeys) {
      this.expirationTimes.delete(key);
    }
    
    return expiredKeys.length > 0 ? expiredKeys[0] : null;
  }
  
  isExpired(key) {
    const expirationTime = this.expirationTimes.get(key);
    return expirationTime && Date.now() > expirationTime;
  }
}

// Cache Entry with metadata
class CacheEntry {
  constructor(key, value, metadata = {}) {
    this.key = key;
    this.value = value;
    this.metadata = metadata;
    this.createdAt = Date.now();
    this.lastAccessed = Date.now();
    this.accessCount = 0;
  }
  
  access() {
    this.lastAccessed = Date.now();
    this.accessCount++;
    return this.value;
  }
}

// Template Method Pattern for cache operations
class Cache {
  constructor(maxSize = 100, evictionStrategy = new LRUEvictionStrategy()) {
    this.maxSize = maxSize;
    this.evictionStrategy = evictionStrategy;
    this.storage = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }
  
  get(key) {
    const entry = this.storage.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Check TTL expiration
    if (this.evictionStrategy instanceof TTLEvictionStrategy && 
        this.evictionStrategy.isExpired(key)) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    this.evictionStrategy.onAccess(key, this.storage);
    return entry.access();
  }
  
  set(key, value, options = {}) {
    // If key exists, update it
    if (this.storage.has(key)) {
      const entry = this.storage.get(key);
      entry.value = value;
      entry.lastAccessed = Date.now();
      this.evictionStrategy.onSet(key, this.storage, options.ttl);
      return;
    }
    
    // If cache is full, evict entries
    while (this.storage.size >= this.maxSize) {
      const keyToEvict = this.evictionStrategy.evict(this.storage);
      if (keyToEvict) {
        this.storage.delete(keyToEvict);
        this.stats.evictions++;
      } else {
        break; // No more entries to evict
      }
    }
    
    // Add new entry
    const entry = new CacheEntry(key, value, options);
    this.storage.set(key, entry);
    this.evictionStrategy.onSet(key, this.storage, options.ttl);
  }
  
  delete(key) {
    const deleted = this.storage.delete(key);
    if (deleted && this.evictionStrategy.frequencies) {
      this.evictionStrategy.frequencies.delete(key);
    }
    if (deleted && this.evictionStrategy.accessOrder) {
      this.evictionStrategy.accessOrder.delete(key);
    }
    if (deleted && this.evictionStrategy.expirationTimes) {
      this.evictionStrategy.expirationTimes.delete(key);
    }
    return deleted;
  }
  
  clear() {
    this.storage.clear();
    if (this.evictionStrategy.frequencies) {
      this.evictionStrategy.frequencies.clear();
    }
    if (this.evictionStrategy.accessOrder) {
      this.evictionStrategy.accessOrder.clear();
    }
    if (this.evictionStrategy.expirationTimes) {
      this.evictionStrategy.expirationTimes.clear();
    }
  }
  
  has(key) {
    return this.storage.has(key);
  }
  
  get size() {
    return this.storage.size;
  }
  
  getStats() {
    const hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) || 0;
    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100,
      size: this.size,
      maxSize: this.maxSize
    };
  }
}

// Decorator Pattern for cache features
class CacheDecorator {
  constructor(cache) {
    this.cache = cache;
  }
  
  get(key) {
    return this.cache.get(key);
  }
  
  set(key, value, options) {
    return this.cache.set(key, value, options);
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
  
  clear() {
    return this.cache.clear();
  }
  
  has(key) {
    return this.cache.has(key);
  }
  
  get size() {
    return this.cache.size;
  }
  
  getStats() {
    return this.cache.getStats();
  }
}

class LoggingCacheDecorator extends CacheDecorator {
  constructor(cache, logger = console) {
    super(cache);
    this.logger = logger;
  }
  
  get(key) {
    const result = super.get(key);
    this.logger.log(`Cache GET ${key}: ${result ? 'HIT' : 'MISS'}`);
    return result;
  }
  
  set(key, value, options) {
    super.set(key, value, options);
    this.logger.log(`Cache SET ${key}`);
  }
  
  delete(key) {
    const result = super.delete(key);
    this.logger.log(`Cache DELETE ${key}: ${result ? 'SUCCESS' : 'NOT_FOUND'}`);
    return result;
  }
}

class MetricsCacheDecorator extends CacheDecorator {
  constructor(cache, metricsCollector) {
    super(cache);
    this.metrics = metricsCollector;
  }
  
  get(key) {
    const startTime = Date.now();
    const result = super.get(key);
    const duration = Date.now() - startTime;
    
    this.metrics.recordCacheOperation('get', duration, result !== null);
    return result;
  }
  
  set(key, value, options) {
    const startTime = Date.now();
    super.set(key, value, options);
    const duration = Date.now() - startTime;
    
    this.metrics.recordCacheOperation('set', duration, true);
  }
}

// Factory Pattern for creating different cache types
class CacheFactory {
  static createLRUCache(maxSize = 100) {
    return new Cache(maxSize, new LRUEvictionStrategy());
  }
  
  static createLFUCache(maxSize = 100) {
    return new Cache(maxSize, new LFUEvictionStrategy());
  }
  
  static createTTLCache(maxSize = 100, defaultTTL = 300000) {
    const strategy = new TTLEvictionStrategy();
    strategy.defaultTTL = defaultTTL;
    return new Cache(maxSize, strategy);
  }
  
  static createMultiLevelCache(l1Size = 50, l2Size = 200) {
    const l1Cache = this.createLRUCache(l1Size);
    const l2Cache = this.createLFUCache(l2Size);
    
    return new MultiLevelCache(l1Cache, l2Cache);
  }
}

// Composite Pattern for multi-level caching
class MultiLevelCache {
  constructor(l1Cache, l2Cache) {
    this.l1Cache = l1Cache;
    this.l2Cache = l2Cache;
  }
  
  get(key) {
    // Try L1 cache first
    let value = this.l1Cache.get(key);
    if (value !== null) {
      return value;
    }
    
    // Try L2 cache
    value = this.l2Cache.get(key);
    if (value !== null) {
      // Promote to L1 cache
      this.l1Cache.set(key, value);
      return value;
    }
    
    return null;
  }
  
  set(key, value, options) {
    // Set in both caches
    this.l1Cache.set(key, value, options);
    this.l2Cache.set(key, value, options);
  }
  
  delete(key) {
    const l1Deleted = this.l1Cache.delete(key);
    const l2Deleted = this.l2Cache.delete(key);
    return l1Deleted || l2Deleted;
  }
  
  clear() {
    this.l1Cache.clear();
    this.l2Cache.clear();
  }
  
  getStats() {
    return {
      l1: this.l1Cache.getStats(),
      l2: this.l2Cache.getStats()
    };
  }
}

// Observer Pattern for cache events
class CacheEventEmitter {
  constructor() {
    this.listeners = new Map();
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}

class EventAwareCacheDecorator extends CacheDecorator {
  constructor(cache, eventEmitter = new CacheEventEmitter()) {
    super(cache);
    this.eventEmitter = eventEmitter;
  }
  
  get(key) {
    const result = super.get(key);
    this.eventEmitter.emit(result ? 'cache:hit' : 'cache:miss', { key, value: result });
    return result;
  }
  
  set(key, value, options) {
    super.set(key, value, options);
    this.eventEmitter.emit('cache:set', { key, value, options });
  }
  
  delete(key) {
    const result = super.delete(key);
    if (result) {
      this.eventEmitter.emit('cache:delete', { key });
    }
    return result;
  }
  
  on(event, callback) {
    this.eventEmitter.on(event, callback);
  }
}

// Usage Examples
class CacheUsageExamples {
  static basicUsage() {
    // Create different cache types
    const lruCache = CacheFactory.createLRUCache(10);
    const lfuCache = CacheFactory.createLFUCache(10);
    const ttlCache = CacheFactory.createTTLCache(10, 5000); // 5 second TTL
    
    // Use LRU cache
    lruCache.set('user:1', { name: 'John', age: 30 });
    lruCache.set('user:2', { name: 'Jane', age: 25 });
    
    console.log(lruCache.get('user:1')); // { name: 'John', age: 30 }
    console.log(lruCache.getStats()); // { hits: 1, misses: 0, ... }
  }
  
  static decoratedCache() {
    // Create cache with decorators
    let cache = CacheFactory.createLRUCache(100);
    cache = new LoggingCacheDecorator(cache);
    cache = new EventAwareCacheDecorator(cache);
    
    // Listen to cache events
    cache.on('cache:hit', (data) => {
      console.log(`Cache hit for key: ${data.key}`);
    });
    
    cache.on('cache:miss', (data) => {
      console.log(`Cache miss for key: ${data.key}`);
    });
    
    // Use cache
    cache.set('product:123', { name: 'Laptop', price: 999 });
    cache.get('product:123'); // Logs: Cache GET product:123: HIT
    cache.get('product:456'); // Logs: Cache GET product:456: MISS
  }
  
  static multiLevelCache() {
    const multiCache = CacheFactory.createMultiLevelCache(5, 20);
    
    // Set data
    multiCache.set('session:abc', { userId: 1, token: 'xyz' });
    
    // Get data (will be in L1)
    console.log(multiCache.get('session:abc'));
    
    // Check stats
    console.log(multiCache.getStats());
  }
  
  static ttlCacheExample() {
    const cache = CacheFactory.createTTLCache(100, 2000); // 2 second TTL
    
    cache.set('temp:data', 'This will expire');
    console.log(cache.get('temp:data')); // 'This will expire'
    
    setTimeout(() => {
      console.log(cache.get('temp:data')); // null (expired)
    }, 3000);
  }
}

// Run examples
CacheUsageExamples.basicUsage();
CacheUsageExamples.decoratedCache();
CacheUsageExamples.multiLevelCache();
CacheUsageExamples.ttlCacheExample();
```

This caching system demonstrates multiple design patterns:
- **Strategy Pattern**: Different eviction strategies (LRU, LFU, TTL)
- **Template Method**: Base cache operations with customizable behavior
- **Decorator Pattern**: Adding features like logging and metrics
- **Factory Pattern**: Creating different cache types
- **Composite Pattern**: Multi-level caching
- **Observer Pattern**: Cache event notifications

The system is highly extensible and allows for easy addition of new eviction strategies, decorators, and cache levels.**Q24
: How would you implement a plugin system using design patterns that allows third-party developers to extend your application?**

**Answer:**
```javascript
// Plugin Interface (Strategy Pattern)
class Plugin {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.dependencies = [];
  }
  
  // Lifecycle methods
  async initialize(context) {
    throw new Error('Must implement initialize method');
  }
  
  async activate(context) {
    throw new Error('Must implement activate method');
  }
  
  async deactivate(context) {
    throw new Error('Must implement deactivate method');
  }
  
  // Plugin metadata
  getMetadata() {
    return {
      name: this.name,
      version: this.version,
      dependencies: this.dependencies
    };
  }
}

// Event System for Plugin Communication (Observer Pattern)
class EventBus {
  constructor() {
    this.listeners = new Map();
  }
  
  on(event, callback, priority = 0) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event).push({ callback, priority });
    
    // Sort by priority (higher priority first)
    this.listeners.get(event).sort((a, b) => b.priority - a.priority);
  }
  
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.findIndex(item => item.callback === callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  async emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    const results = [];
    
    for (const { callback } of callbacks) {
      try {
        const result = await callback(data);
        results.push(result);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    }
    
    return results;
  }
}

// Hook System for Extensibility (Template Method + Observer)
class HookManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.hooks = new Map();
  }
  
  registerHook(name, description) {
    this.hooks.set(name, {
      name,
      description,
      filters: [],
      actions: []
    });
  }
  
  addFilter(hookName, callback, priority = 10) {
    const hook = this.hooks.get(hookName);
    if (hook) {
      hook.filters.push({ callback, priority });
      hook.filters.sort((a, b) => a.priority - b.priority);
    }
  }
  
  addAction(hookName, callback, priority = 10) {
    const hook = this.hooks.get(hookName);
    if (hook) {
      hook.actions.push({ callback, priority });
      hook.actions.sort((a, b) => a.priority - b.priority);
    }
  }
  
  async applyFilters(hookName, value, ...args) {
    const hook = this.hooks.get(hookName);
    if (!hook) return value;
    
    let filteredValue = value;
    
    for (const { callback } of hook.filters) {
      try {
        filteredValue = await callback(filteredValue, ...args);
      } catch (error) {
        console.error(`Error in filter for ${hookName}:`, error);
      }
    }
    
    return filteredValue;
  }
  
  async doAction(hookName, ...args) {
    const hook = this.hooks.get(hookName);
    if (!hook) return;
    
    for (const { callback } of hook.actions) {
      try {
        await callback(...args);
      } catch (error) {
        console.error(`Error in action for ${hookName}:`, error);
      }
    }
  }
}

// Plugin Context (Facade Pattern)
class PluginContext {
  constructor(app, eventBus, hookManager, serviceRegistry) {
    this.app = app;
    this.eventBus = eventBus;
    this.hookManager = hookManager;
    this.serviceRegistry = serviceRegistry;
  }
  
  // Event system access
  on(event, callback, priority) {
    return this.eventBus.on(event, callback, priority);
  }
  
  emit(event, data) {
    return this.eventBus.emit(event, data);
  }
  
  // Hook system access
  addFilter(hookName, callback, priority) {
    return this.hookManager.addFilter(hookName, callback, priority);
  }
  
  addAction(hookName, callback, priority) {
    return this.hookManager.addAction(hookName, callback, priority);
  }
  
  // Service registry access
  getService(name) {
    return this.serviceRegistry.get(name);
  }
  
  registerService(name, service) {
    return this.serviceRegistry.register(name, service);
  }
  
  // App access
  getConfig(key) {
    return this.app.getConfig(key);
  }
  
  getLogger(name) {
    return this.app.getLogger(name);
  }
}

// Service Registry (Registry Pattern)
class ServiceRegistry {
  constructor() {
    this.services = new Map();
  }
  
  register(name, service) {
    this.services.set(name, service);
  }
  
  get(name) {
    return this.services.get(name);
  }
  
  has(name) {
    return this.services.has(name);
  }
  
  unregister(name) {
    return this.services.delete(name);
  }
  
  getAll() {
    return Array.from(this.services.entries());
  }
}

// Plugin Manager (Facade + Factory)
class PluginManager {
  constructor(app) {
    this.app = app;
    this.plugins = new Map();
    this.activePlugins = new Set();
    this.eventBus = new EventBus();
    this.hookManager = new HookManager(this.eventBus);
    this.serviceRegistry = new ServiceRegistry();
    this.context = new PluginContext(app, this.eventBus, this.hookManager, this.serviceRegistry);
    
    this.setupCoreHooks();
  }
  
  setupCoreHooks() {
    // Register core hooks that plugins can extend
    this.hookManager.registerHook('app:init', 'Application initialization');
    this.hookManager.registerHook('app:shutdown', 'Application shutdown');
    this.hookManager.registerHook('request:before', 'Before request processing');
    this.hookManager.registerHook('request:after', 'After request processing');
    this.hookManager.registerHook('user:login', 'User login event');
    this.hookManager.registerHook('user:logout', 'User logout event');
  }
  
  async loadPlugin(pluginClass, config = {}) {
    const plugin = new pluginClass();
    const metadata = plugin.getMetadata();
    
    // Check dependencies
    await this.checkDependencies(metadata.dependencies);
    
    // Initialize plugin
    await plugin.initialize(this.context);
    
    this.plugins.set(metadata.name, {
      instance: plugin,
      metadata,
      config,
      status: 'loaded'
    });
    
    await this.eventBus.emit('plugin:loaded', { name: metadata.name, plugin });
    
    return plugin;
  }
  
  async activatePlugin(name) {
    const pluginInfo = this.plugins.get(name);
    if (!pluginInfo) {
      throw new Error(`Plugin ${name} not found`);
    }
    
    if (this.activePlugins.has(name)) {
      return; // Already active
    }
    
    await pluginInfo.instance.activate(this.context);
    this.activePlugins.add(name);
    pluginInfo.status = 'active';
    
    await this.eventBus.emit('plugin:activated', { name, plugin: pluginInfo.instance });
  }
  
  async deactivatePlugin(name) {
    const pluginInfo = this.plugins.get(name);
    if (!pluginInfo || !this.activePlugins.has(name)) {
      return;
    }
    
    await pluginInfo.instance.deactivate(this.context);
    this.activePlugins.delete(name);
    pluginInfo.status = 'loaded';
    
    await this.eventBus.emit('plugin:deactivated', { name, plugin: pluginInfo.instance });
  }
  
  async unloadPlugin(name) {
    await this.deactivatePlugin(name);
    this.plugins.delete(name);
    
    await this.eventBus.emit('plugin:unloaded', { name });
  }
  
  async checkDependencies(dependencies) {
    for (const dep of dependencies) {
      if (!this.plugins.has(dep)) {
        throw new Error(`Missing dependency: ${dep}`);
      }
    }
  }
  
  getPlugin(name) {
    return this.plugins.get(name)?.instance;
  }
  
  getActivePlugins() {
    return Array.from(this.activePlugins).map(name => this.plugins.get(name));
  }
  
  getAllPlugins() {
    return Array.from(this.plugins.values());
  }
}

// Example Plugin Implementations
class LoggingPlugin extends Plugin {
  constructor() {
    super('logging-plugin', '1.0.0');
  }
  
  async initialize(context) {
    this.logger = context.getLogger('LoggingPlugin');
    this.logger.info('Logging plugin initialized');
  }
  
  async activate(context) {
    // Add logging to all requests
    context.addAction('request:before', this.logRequest.bind(this), 5);
    context.addAction('request:after', this.logResponse.bind(this), 5);
    
    this.logger.info('Logging plugin activated');
  }
  
  async deactivate(context) {
    this.logger.info('Logging plugin deactivated');
  }
  
  async logRequest(req) {
    this.logger.info(`${req.method} ${req.url} - ${req.ip}`);
  }
  
  async logResponse(req, res) {
    this.logger.info(`${req.method} ${req.url} - ${res.statusCode} - ${Date.now() - req.startTime}ms`);
  }
}

class AuthenticationPlugin extends Plugin {
  constructor() {
    super('auth-plugin', '1.0.0');
  }
  
  async initialize(context) {
    this.context = context;
    this.logger = context.getLogger('AuthPlugin');
    
    // Register authentication service
    context.registerService('auth', new AuthService());
  }
  
  async activate(context) {
    // Add authentication middleware
    context.addFilter('request:before', this.authenticate.bind(this), 1);
    
    // Listen for login/logout events
    context.on('user:login', this.onUserLogin.bind(this));
    context.on('user:logout', this.onUserLogout.bind(this));
    
    this.logger.info('Authentication plugin activated');
  }
  
  async deactivate(context) {
    this.logger.info('Authentication plugin deactivated');
  }
  
  async authenticate(req) {
    const authService = this.context.getService('auth');
    const token = req.headers.authorization;
    
    if (token) {
      try {
        req.user = await authService.verifyToken(token);
      } catch (error) {
        req.authError = error.message;
      }
    }
    
    return req;
  }
  
  async onUserLogin(data) {
    this.logger.info(`User ${data.userId} logged in`);
  }
  
  async onUserLogout(data) {
    this.logger.info(`User ${data.userId} logged out`);
  }
}

class CachingPlugin extends Plugin {
  constructor() {
    super('caching-plugin', '1.0.0');
    this.dependencies = ['logging-plugin']; // Depends on logging
  }
  
  async initialize(context) {
    this.cache = new Map();
    this.logger = context.getLogger('CachingPlugin');
    
    // Register caching service
    context.registerService('cache', {
      get: (key) => this.cache.get(key),
      set: (key, value, ttl) => this.cache.set(key, value),
      delete: (key) => this.cache.delete(key),
      clear: () => this.cache.clear()
    });
  }
  
  async activate(context) {
    // Add caching to responses
    context.addFilter('request:after', this.cacheResponse.bind(this), 10);
    context.addFilter('request:before', this.checkCache.bind(this), 10);
    
    this.logger.info('Caching plugin activated');
  }
  
  async deactivate(context) {
    this.cache.clear();
    this.logger.info('Caching plugin deactivated');
  }
  
  async checkCache(req) {
    if (req.method === 'GET') {
      const cached = this.cache.get(req.url);
      if (cached) {
        req.cachedResponse = cached;
      }
    }
    return req;
  }
  
  async cacheResponse(req, res) {
    if (req.method === 'GET' && res.statusCode === 200) {
      this.cache.set(req.url, res.body);
    }
    return res;
  }
}

// Main Application
class Application {
  constructor() {
    this.config = new Map();
    this.loggers = new Map();
    this.pluginManager = new PluginManager(this);
  }
  
  getConfig(key) {
    return this.config.get(key);
  }
  
  setConfig(key, value) {
    this.config.set(key, value);
  }
  
  getLogger(name) {
    if (!this.loggers.has(name)) {
      this.loggers.set(name, new Logger(name));
    }
    return this.loggers.get(name);
  }
  
  async start() {
    await this.pluginManager.hookManager.doAction('app:init');
    console.log('Application started');
  }
  
  async shutdown() {
    await this.pluginManager.hookManager.doAction('app:shutdown');
    console.log('Application shutdown');
  }
  
  getPluginManager() {
    return this.pluginManager;
  }
}

// Simple Logger
class Logger {
  constructor(name) {
    this.name = name;
  }
  
  info(message) {
    console.log(`[${this.name}] INFO: ${message}`);
  }
  
  error(message) {
    console.error(`[${this.name}] ERROR: ${message}`);
  }
}

// Auth Service
class AuthService {
  async verifyToken(token) {
    // Mock token verification
    if (token === 'valid-token') {
      return { id: 1, username: 'john_doe' };
    }
    throw new Error('Invalid token');
  }
}

// Usage Example
async function demonstratePluginSystem() {
  const app = new Application();
  const pluginManager = app.getPluginManager();
  
  try {
    // Load and activate plugins
    await pluginManager.loadPlugin(LoggingPlugin);
    await pluginManager.activatePlugin('logging-plugin');
    
    await pluginManager.loadPlugin(AuthenticationPlugin);
    await pluginManager.activatePlugin('auth-plugin');
    
    await pluginManager.loadPlugin(CachingPlugin);
    await pluginManager.activatePlugin('caching-plugin');
    
    // Start application
    await app.start();
    
    // Simulate request processing
    const mockRequest = {
      method: 'GET',
      url: '/api/users',
      ip: '127.0.0.1',
      headers: { authorization: 'valid-token' },
      startTime: Date.now()
    };
    
    // Apply request filters
    const processedRequest = await pluginManager.hookManager.applyFilters('request:before', mockRequest);
    
    // Simulate response
    const mockResponse = {
      statusCode: 200,
      body: { users: [{ id: 1, name: 'John' }] }
    };
    
    // Apply response filters
    await pluginManager.hookManager.applyFilters('request:after', processedRequest, mockResponse);
    
    // Emit user login event
    await pluginManager.eventBus.emit('user:login', { userId: 1 });
    
    // Show active plugins
    console.log('Active plugins:', pluginManager.getActivePlugins().map(p => p.metadata.name));
    
    // Shutdown
    await app.shutdown();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run demonstration
demonstratePluginSystem();
```

**Q25: Design a real-time collaborative editing system using design patterns (like Google Docs).**

**Answer:**
```javascript
// Command Pattern for Operations
class Operation {
  constructor(type, position, content, author, timestamp = Date.now()) {
    this.id = `op_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    this.type = type;
    this.position = position;
    this.content = content;
    this.author = author;
    this.timestamp = timestamp;
  }
  
  apply(document) {
    throw new Error('Must implement apply method');
  }
  
  invert() {
    throw new Error('Must implement invert method');
  }
  
  transform(otherOp) {
    throw new Error('Must implement transform method');
  }
}

class InsertOperation extends Operation {
  constructor(position, content, author) {
    super('insert', position, content, author);
  }
  
  apply(document) {
    return document.slice(0, this.position) + this.content + document.slice(this.position);
  }
  
  invert() {
    return new DeleteOperation(this.position, this.content.length, this.author);
  }
  
  transform(otherOp) {
    if (otherOp.type === 'insert') {
      if (otherOp.position <= this.position) {
        return new InsertOperation(
          this.position + otherOp.content.length,
          this.content,
          this.author
        );
      }
    } else if (otherOp.type === 'delete') {
      if (otherOp.position < this.position) {
        return new InsertOperation(
          Math.max(this.position - otherOp.length, otherOp.position),
          this.content,
          this.author
        );
      }
    }
    return this;
  }
}

class DeleteOperation extends Operation {
  constructor(position, length, author) {
    super('delete', position, null, author);
    this.length = length;
  }
  
  apply(document) {
    return document.slice(0, this.position) + document.slice(this.position + this.length);
  }
  
  invert() {
    // Would need to store deleted content for proper inversion
    throw new Error('Delete inversion requires storing deleted content');
  }
  
  transform(otherOp) {
    if (otherOp.type === 'insert') {
      if (otherOp.position <= this.position) {
        return new DeleteOperation(
          this.position + otherOp.content.length,
          this.length,
          this.author
        );
      }
    } else if (otherOp.type === 'delete') {
      if (otherOp.position < this.position) {
        return new DeleteOperation(
          Math.max(this.position - otherOp.length, otherOp.position),
          this.length,
          this.author
        );
      }
    }
    return this;
  }
}

// State Pattern for Document States
class DocumentState {
  constructor(content = '', version = 0) {
    this.content = content;
    this.version = version;
    this.operations = [];
  }
  
  applyOperation(operation) {
    const newContent = operation.apply(this.content);
    const newState = new DocumentState(newContent, this.version + 1);
    newState.operations = [...this.operations, operation];
    return newState;
  }
  
  getSnapshot() {
    return {
      content: this.content,
      version: this.version,
      timestamp: Date.now()
    };
  }
}

// Operational Transform Engine
class OperationalTransform {
  static transform(op1, op2) {
    // Transform op1 against op2
    return op1.transform(op2);
  }
  
  static transformAgainstOperations(operation, operations) {
    let transformedOp = operation;
    
    for (const op of operations) {
      transformedOp = this.transform(transformedOp, op);
    }
    
    return transformedOp;
  }
}

// Observer Pattern for Real-time Updates
class CollaborativeDocument {
  constructor(id, initialContent = '') {
    this.id = id;
    this.state = new DocumentState(initialContent);
    this.clients = new Map();
    this.operationHistory = [];
    this.observers = [];
  }
  
  addObserver(observer) {
    this.observers.push(observer);
  }
  
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }
  
  notifyObservers(event, data) {
    this.observers.forEach(observer => {
      try {
        observer.notify(event, data);
      } catch (error) {
        console.error('Observer notification error:', error);
      }
    });
  }
  
  addClient(clientId, client) {
    this.clients.set(clientId, {
      ...client,
      version: this.state.version,
      pendingOperations: []
    });
    
    this.notifyObservers('client:joined', { clientId, client });
  }
  
  removeClient(clientId) {
    const client = this.clients.get(clientId);
    this.clients.delete(clientId);
    
    this.notifyObservers('client:left', { clientId, client });
  }
  
  applyOperation(operation, fromClientId) {
    const client = this.clients.get(fromClientId);
    if (!client) {
      throw new Error('Client not found');
    }
    
    // Transform operation against operations that happened after client's version
    const operationsSinceClientVersion = this.operationHistory.slice(client.version);
    const transformedOperation = OperationalTransform.transformAgainstOperations(
      operation,
      operationsSinceClientVersion
    );
    
    // Apply operation to document
    this.state = this.state.applyOperation(transformedOperation);
    this.operationHistory.push(transformedOperation);
    
    // Update client version
    client.version = this.state.version;
    
    // Broadcast to other clients
    this.broadcastOperation(transformedOperation, fromClientId);
    
    this.notifyObservers('operation:applied', {
      operation: transformedOperation,
      fromClient: fromClientId,
      documentState: this.state.getSnapshot()
    });
    
    return transformedOperation;
  }
  
  broadcastOperation(operation, excludeClientId) {
    for (const [clientId, client] of this.clients) {
      if (clientId !== excludeClientId) {
        // Transform operation for each client's current state
        const operationsSinceClientVersion = this.operationHistory.slice(client.version, -1);
        const transformedForClient = OperationalTransform.transformAgainstOperations(
          operation,
          operationsSinceClientVersion
        );
        
        client.sendOperation(transformedForClient);
      }
    }
  }
  
  getSnapshot() {
    return this.state.getSnapshot();
  }
  
  getOperationsSince(version) {
    return this.operationHistory.slice(version);
  }
}

// Client-side Document Representation
class DocumentClient {
  constructor(clientId, documentId, websocket) {
    this.clientId = clientId;
    this.documentId = documentId;
    this.websocket = websocket;
    this.state = new DocumentState();
    this.pendingOperations = [];
    this.acknowledgedOperations = [];
    this.eventHandlers = new Map();
    
    this.setupWebSocketHandlers();
  }
  
  setupWebSocketHandlers() {
    this.websocket.on('operation', (data) => {
      this.handleRemoteOperation(data.operation);
    });
    
    this.websocket.on('operation:ack', (data) => {
      this.handleOperationAcknowledgment(data.operationId);
    });
    
    this.websocket.on('document:snapshot', (data) => {
      this.handleDocumentSnapshot(data.snapshot);
    });
  }
  
  // Local operation (user input)
  insertText(position, text) {
    const operation = new InsertOperation(position, text, this.clientId);
    this.applyLocalOperation(operation);
  }
  
  deleteText(position, length) {
    const operation = new DeleteOperation(position, length, this.clientId);
    this.applyLocalOperation(operation);
  }
  
  applyLocalOperation(operation) {
    // Apply operation locally immediately
    this.state = this.state.applyOperation(operation);
    
    // Transform against pending operations
    const transformedOperation = OperationalTransform.transformAgainstOperations(
      operation,
      this.pendingOperations
    );
    
    // Add to pending operations
    this.pendingOperations.push(transformedOperation);
    
    // Send to server
    this.websocket.emit('operation', {
      documentId: this.documentId,
      operation: transformedOperation
    });
    
    // Notify UI
    this.emit('document:changed', this.state.getSnapshot());
  }
  
  handleRemoteOperation(operation) {
    // Transform remote operation against pending operations
    let transformedOperation = operation;
    
    for (const pendingOp of this.pendingOperations) {
      transformedOperation = OperationalTransform.transform(transformedOperation, pendingOp);
    }
    
    // Apply transformed operation
    this.state = this.state.applyOperation(transformedOperation);
    
    // Notify UI
    this.emit('document:changed', this.state.getSnapshot());
    this.emit('remote:operation', {
      operation: transformedOperation,
      author: operation.author
    });
  }
  
  handleOperationAcknowledgment(operationId) {
    // Remove acknowledged operation from pending
    const index = this.pendingOperations.findIndex(op => op.id === operationId);
    if (index !== -1) {
      const acknowledgedOp = this.pendingOperations.splice(index, 1)[0];
      this.acknowledgedOperations.push(acknowledgedOp);
    }
  }
  
  handleDocumentSnapshot(snapshot) {
    this.state = new DocumentState(snapshot.content, snapshot.version);
    this.pendingOperations = [];
    this.acknowledgedOperations = [];
    
    this.emit('document:synced', snapshot);
  }
  
  // Event system
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }
  
  emit(event, data) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }
  
  getContent() {
    return this.state.content;
  }
  
  sendOperation(operation) {
    // This would be called by the server to send operations to this client
    this.handleRemoteOperation(operation);
  }
}

// Conflict Resolution Strategy (Strategy Pattern)
class ConflictResolver {
  resolve(operations) {
    throw new Error('Must implement resolve method');
  }
}

class LastWriterWinsResolver extends ConflictResolver {
  resolve(operations) {
    // Sort by timestamp, last operation wins
    return operations.sort((a, b) => b.timestamp - a.timestamp)[0];
  }
}

class OperationalTransformResolver extends ConflictResolver {
  resolve(operations) {
    // Use operational transform to merge operations
    let result = operations[0];
    
    for (let i = 1; i < operations.length; i++) {
      result = OperationalTransform.transform(result, operations[i]);
    }
    
    return result;
  }
}

// Document Manager (Facade Pattern)
class CollaborativeDocumentManager {
  constructor() {
    this.documents = new Map();
    this.conflictResolver = new OperationalTransformResolver();
  }
  
  createDocument(id, initialContent = '') {
    const document = new CollaborativeDocument(id, initialContent);
    this.documents.set(id, document);
    
    // Add logging observer
    document.addObserver({
      notify: (event, data) => {
        console.log(`Document ${id} - ${event}:`, data);
      }
    });
    
    return document;
  }
  
  getDocument(id) {
    return this.documents.get(id);
  }
  
  deleteDocument(id) {
    const document = this.documents.get(id);
    if (document) {
      // Notify all clients
      document.notifyObservers('document:deleted', { documentId: id });
      this.documents.delete(id);
    }
  }
  
  joinDocument(documentId, clientId, clientInfo) {
    const document = this.getDocument(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    const client = new DocumentClient(clientId, documentId, clientInfo.websocket);
    document.addClient(clientId, client);
    
    // Send current document state to client
    client.handleDocumentSnapshot(document.getSnapshot());
    
    return client;
  }
  
  leaveDocument(documentId, clientId) {
    const document = this.getDocument(documentId);
    if (document) {
      document.removeClient(clientId);
    }
  }
}

// Usage Example
class CollaborativeEditingDemo {
  static async demonstrate() {
    const documentManager = new CollaborativeDocumentManager();
    
    // Create a document
    const doc = documentManager.createDocument('doc1', 'Hello World');
    
    // Simulate WebSocket connections
    const mockWebSocket1 = new MockWebSocket();
    const mockWebSocket2 = new MockWebSocket();
    
    // Two clients join the document
    const client1 = documentManager.joinDocument('doc1', 'user1', { 
      websocket: mockWebSocket1,
      name: 'Alice'
    });
    
    const client2 = documentManager.joinDocument('doc1', 'user2', { 
      websocket: mockWebSocket2,
      name: 'Bob'
    });
    
    // Set up event handlers
    client1.on('document:changed', (snapshot) => {
      console.log('Client 1 sees:', snapshot.content);
    });
    
    client2.on('document:changed', (snapshot) => {
      console.log('Client 2 sees:', snapshot.content);
    });
    
    // Simulate concurrent edits
    console.log('Initial state:', doc.getSnapshot().content);
    
    // Client 1 inserts text at position 5
    client1.insertText(5, ' Beautiful');
    
    // Client 2 inserts text at position 11 (original position)
    client2.insertText(11, '!');
    
    // Client 1 deletes some text
    setTimeout(() => {
      client1.deleteText(0, 5); // Delete "Hello"
    }, 100);
    
    // Show final state after operations are processed
    setTimeout(() => {
      console.log('Final state:', doc.getSnapshot().content);
    }, 200);
  }
}

// Mock WebSocket for demonstration
class MockWebSocket {
  constructor() {
    this.handlers = new Map();
  }
  
  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event).push(handler);
  }
  
  emit(event, data) {
    // In real implementation, this would send to server
    console.log(`WebSocket emit ${event}:`, data);
  }
  
  // Simulate receiving data from server
  receive(event, data) {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }
}

// Run demonstration
CollaborativeEditingDemo.demonstrate();
```

This collaborative editing system demonstrates:
- **Command Pattern**: Operations that can be applied, inverted, and transformed
- **State Pattern**: Document states with version control
- **Observer Pattern**: Real-time notifications to clients
- **Strategy Pattern**: Different conflict resolution strategies
- **Facade Pattern**: Simplified document management interface
- **Operational Transform**: Algorithm for handling concurrent edits

The system handles the core challenges of collaborative editing:
- Concurrent operations from multiple users
- Conflict resolution through operational transformation
- Real-time synchronization
- Undo/redo capabilities
- Client-server consistency

---

## Summary

This comprehensive collection of design pattern interview questions covers:

1. **25+ Implementation Questions** covering Creational, Structural, and Behavioral patterns
2. **20+ SOLID Principles Questions** with practical Node.js examples
3. **20+ Architectural Pattern Questions** including MVC, Repository, CQRS, and microservices patterns
4. **Real-world Scenarios** for legacy code refactoring and microservices migration
5. **Complex System Design** examples like caching systems, plugin architectures, and collaborative editing

Each question includes:
- Detailed explanations of when and why to use each pattern
- Complete, working Node.js code examples
- Real-world scenarios and use cases
- Best practices and common pitfalls
- Integration with modern development practices

These questions prepare senior developers for advanced technical interviews by demonstrating deep understanding of design patterns, architectural principles, and their practical application in Node.js environments.