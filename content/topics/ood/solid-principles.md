# SOLID Principles in Node.js

## Overview
SOLID is an acronym for five design principles that make software designs more understandable, flexible, and maintainable. These principles are especially important in Node.js applications for creating scalable and robust code.

## S - Single Responsibility Principle (SRP)

**Definition:** A class should have only one reason to change, meaning it should have only one job or responsibility.

### Bad Example
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
    this.users = this.users.filter(user => user.id !== userId);
  }
  
  // Email responsibility (violates SRP)
  sendWelcomeEmail(user) {
    console.log(`Sending welcome email to ${user.email}`);
    // Email sending logic
  }
  
  // Database responsibility (violates SRP)
  saveToDatabase() {
    console.log('Saving users to database');
    // Database logic
  }
  
  // Validation responsibility (violates SRP)
  validateUser(user) {
    return user.email && user.name;
  }
}
```

### Good Example
```javascript
// Single responsibility: User data management
class UserRepository {
  constructor() {
    this.users = [];
  }
  
  addUser(user) {
    this.users.push(user);
  }
  
  removeUser(userId) {
    this.users = this.users.filter(user => user.id !== userId);
  }
  
  findUser(userId) {
    return this.users.find(user => user.id === userId);
  }
}

// Single responsibility: User validation
class UserValidator {
  static validate(user) {
    if (!user.email || !user.name) {
      throw new Error('User must have email and name');
    }
    
    if (!this.isValidEmail(user.email)) {
      throw new Error('Invalid email format');
    }
    
    return true;
  }
  
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Single responsibility: Email operations
class EmailService {
  static sendWelcomeEmail(user) {
    console.log(`Sending welcome email to ${user.email}`);
    // Email sending logic
  }
  
  static sendPasswordResetEmail(user) {
    console.log(`Sending password reset email to ${user.email}`);
    // Password reset email logic
  }
}

// Single responsibility: Database operations
class DatabaseService {
  static async saveUsers(users) {
    console.log('Saving users to database');
    // Database saving logic
  }
  
  static async loadUsers() {
    console.log('Loading users from database');
    // Database loading logic
    return [];
  }
}

// Orchestrating class that uses all services
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  
  async createUser(userData) {
    // Validate user
    UserValidator.validate(userData);
    
    // Create user
    const user = { id: Date.now(), ...userData };
    this.userRepository.addUser(user);
    
    // Send welcome email
    EmailService.sendWelcomeEmail(user);
    
    // Save to database
    await DatabaseService.saveUsers(this.userRepository.users);
    
    return user;
  }
}
```

## O - Open/Closed Principle (OCP)

**Definition:** Software entities should be open for extension but closed for modification.

### Bad Example
```javascript
class PaymentProcessor {
  processPayment(paymentType, amount) {
    if (paymentType === 'credit_card') {
      console.log(`Processing credit card payment of $${amount}`);
      // Credit card processing logic
    } else if (paymentType === 'paypal') {
      console.log(`Processing PayPal payment of $${amount}`);
      // PayPal processing logic
    } else if (paymentType === 'bank_transfer') {
      console.log(`Processing bank transfer of $${amount}`);
      // Bank transfer processing logic
    }
    // Adding new payment method requires modifying this class
  }
}
```

### Good Example
```javascript
// Abstract base class
class PaymentMethod {
  process(amount) {
    throw new Error('Process method must be implemented');
  }
}

// Concrete implementations
class CreditCardPayment extends PaymentMethod {
  constructor(cardNumber, cvv) {
    super();
    this.cardNumber = cardNumber;
    this.cvv = cvv;
  }
  
  process(amount) {
    console.log(`Processing credit card payment of $${amount}`);
    console.log(`Card ending in ${this.cardNumber.slice(-4)}`);
    // Credit card specific logic
    return { success: true, transactionId: 'cc_' + Date.now() };
  }
}

class PayPalPayment extends PaymentMethod {
  constructor(email) {
    super();
    this.email = email;
  }
  
  process(amount) {
    console.log(`Processing PayPal payment of $${amount}`);
    console.log(`PayPal account: ${this.email}`);
    // PayPal specific logic
    return { success: true, transactionId: 'pp_' + Date.now() };
  }
}

class BankTransferPayment extends PaymentMethod {
  constructor(accountNumber, routingNumber) {
    super();
    this.accountNumber = accountNumber;
    this.routingNumber = routingNumber;
  }
  
  process(amount) {
    console.log(`Processing bank transfer of $${amount}`);
    console.log(`Account: ${this.accountNumber}`);
    // Bank transfer specific logic
    return { success: true, transactionId: 'bt_' + Date.now() };
  }
}

// Payment processor that's closed for modification but open for extension
class PaymentProcessor {
  processPayment(paymentMethod, amount) {
    if (!(paymentMethod instanceof PaymentMethod)) {
      throw new Error('Invalid payment method');
    }
    
    return paymentMethod.process(amount);
  }
}

// Adding new payment method doesn't require modifying existing code
class CryptocurrencyPayment extends PaymentMethod {
  constructor(walletAddress, currency) {
    super();
    this.walletAddress = walletAddress;
    this.currency = currency;
  }
  
  process(amount) {
    console.log(`Processing ${this.currency} payment of $${amount}`);
    console.log(`Wallet: ${this.walletAddress}`);
    // Cryptocurrency specific logic
    return { success: true, transactionId: 'crypto_' + Date.now() };
  }
}

// Usage
const processor = new PaymentProcessor();
const creditCard = new CreditCardPayment('1234567890123456', '123');
const paypal = new PayPalPayment('user@example.com');
const crypto = new CryptocurrencyPayment('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'BTC');

processor.processPayment(creditCard, 100);
processor.processPayment(paypal, 50);
processor.processPayment(crypto, 200);
```

## L - Liskov Substitution Principle (LSP)

**Definition:** Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.

### Bad Example
```javascript
class Bird {
  fly() {
    console.log('Flying...');
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error('Penguins cannot fly!'); // Violates LSP
  }
}

// This will break when using Penguin
function makeBirdFly(bird) {
  bird.fly(); // Will throw error for Penguin
}

const sparrow = new Bird();
const penguin = new Penguin();

makeBirdFly(sparrow); // Works
makeBirdFly(penguin); // Throws error - violates LSP
```

### Good Example
```javascript
// Base class with common behavior
class Bird {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    console.log(`${this.name} is eating`);
  }
  
  sleep() {
    console.log(`${this.name} is sleeping`);
  }
}

// Interface for flying birds
class FlyingBird extends Bird {
  fly() {
    console.log(`${this.name} is flying`);
  }
}

// Interface for swimming birds
class SwimmingBird extends Bird {
  swim() {
    console.log(`${this.name} is swimming`);
  }
}

// Concrete implementations
class Sparrow extends FlyingBird {
  constructor() {
    super('Sparrow');
  }
}

class Penguin extends SwimmingBird {
  constructor() {
    super('Penguin');
  }
}

class Duck extends Bird {
  constructor() {
    super('Duck');
  }
  
  fly() {
    console.log(`${this.name} is flying`);
  }
  
  swim() {
    console.log(`${this.name} is swimming`);
  }
}

// Functions that work with appropriate abstractions
function feedBird(bird) {
  bird.eat(); // Works with any Bird
}

function makeFlyingBirdFly(bird) {
  if (bird instanceof FlyingBird || (bird.fly && typeof bird.fly === 'function')) {
    bird.fly();
  } else {
    console.log(`${bird.name} cannot fly`);
  }
}

// Usage
const sparrow = new Sparrow();
const penguin = new Penguin();
const duck = new Duck();

feedBird(sparrow); // Works
feedBird(penguin); // Works
feedBird(duck);    // Works

makeFlyingBirdFly(sparrow); // Works
makeFlyingBirdFly(penguin); // Handles gracefully
makeFlyingBirdFly(duck);    // Works
```

## I - Interface Segregation Principle (ISP)

**Definition:** No client should be forced to depend on methods it does not use.

### Bad Example
```javascript
// Fat interface that forces classes to implement methods they don't need
class Worker {
  work() {
    throw new Error('Method must be implemented');
  }
  
  eat() {
    throw new Error('Method must be implemented');
  }
  
  sleep() {
    throw new Error('Method must be implemented');
  }
}

class HumanWorker extends Worker {
  work() {
    console.log('Human working...');
  }
  
  eat() {
    console.log('Human eating...');
  }
  
  sleep() {
    console.log('Human sleeping...');
  }
}

class RobotWorker extends Worker {
  work() {
    console.log('Robot working...');
  }
  
  eat() {
    // Robots don't eat - forced to implement unnecessary method
    throw new Error('Robots do not eat');
  }
  
  sleep() {
    // Robots don't sleep - forced to implement unnecessary method
    throw new Error('Robots do not sleep');
  }
}
```

### Good Example
```javascript
// Segregated interfaces
class Workable {
  work() {
    throw new Error('Method must be implemented');
  }
}

class Eatable {
  eat() {
    throw new Error('Method must be implemented');
  }
}

class Sleepable {
  sleep() {
    throw new Error('Method must be implemented');
  }
}

// Human implements all interfaces it needs
class HumanWorker extends Workable {
  work() {
    console.log('Human working...');
  }
}

class HumanEater extends Eatable {
  eat() {
    console.log('Human eating...');
  }
}

class HumanSleeper extends Sleepable {
  sleep() {
    console.log('Human sleeping...');
  }
}

// Composition approach for Human
class Human {
  constructor() {
    this.worker = new HumanWorker();
    this.eater = new HumanEater();
    this.sleeper = new HumanSleeper();
  }
  
  work() {
    this.worker.work();
  }
  
  eat() {
    this.eater.eat();
  }
  
  sleep() {
    this.sleeper.sleep();
  }
}

// Robot only implements what it needs
class RobotWorker extends Workable {
  work() {
    console.log('Robot working...');
  }
}

class Robot {
  constructor() {
    this.worker = new RobotWorker();
  }
  
  work() {
    this.worker.work();
  }
  
  // No eat() or sleep() methods - not needed
}

// Alternative approach using mixins (more JavaScript-like)
const WorkerMixin = {
  work() {
    console.log(`${this.constructor.name} working...`);
  }
};

const EaterMixin = {
  eat() {
    console.log(`${this.constructor.name} eating...`);
  }
};

const SleeperMixin = {
  sleep() {
    console.log(`${this.constructor.name} sleeping...`);
  }
};

class HumanWithMixins {
  constructor() {
    Object.assign(this, WorkerMixin, EaterMixin, SleeperMixin);
  }
}

class RobotWithMixins {
  constructor() {
    Object.assign(this, WorkerMixin);
  }
}

// Usage
const human = new HumanWithMixins();
const robot = new RobotWithMixins();

human.work(); // Works
human.eat();  // Works
human.sleep(); // Works

robot.work(); // Works
// robot.eat(); // Method doesn't exist - no error, just undefined
```

## D - Dependency Inversion Principle (DIP)

**Definition:** High-level modules should not depend on low-level modules. Both should depend on abstractions.

### Bad Example
```javascript
// Low-level module
class MySQLDatabase {
  save(data) {
    console.log('Saving to MySQL database');
    // MySQL specific code
  }
  
  find(id) {
    console.log('Finding in MySQL database');
    // MySQL specific code
    return { id, name: 'John' };
  }
}

// High-level module directly depends on low-level module
class UserService {
  constructor() {
    this.database = new MySQLDatabase(); // Direct dependency
  }
  
  createUser(userData) {
    // Business logic
    const user = { id: Date.now(), ...userData };
    this.database.save(user); // Tightly coupled to MySQL
    return user;
  }
  
  getUser(id) {
    return this.database.find(id); // Tightly coupled to MySQL
  }
}

// Changing database requires modifying UserService
```

### Good Example
```javascript
// Abstraction (interface)
class DatabaseInterface {
  save(data) {
    throw new Error('Method must be implemented');
  }
  
  find(id) {
    throw new Error('Method must be implemented');
  }
}

// Low-level modules implement the abstraction
class MySQLDatabase extends DatabaseInterface {
  save(data) {
    console.log('Saving to MySQL database');
    // MySQL specific implementation
    return true;
  }
  
  find(id) {
    console.log('Finding in MySQL database');
    // MySQL specific implementation
    return { id, name: 'John', source: 'MySQL' };
  }
}

class MongoDatabase extends DatabaseInterface {
  save(data) {
    console.log('Saving to MongoDB');
    // MongoDB specific implementation
    return true;
  }
  
  find(id) {
    console.log('Finding in MongoDB');
    // MongoDB specific implementation
    return { id, name: 'Jane', source: 'MongoDB' };
  }
}

class RedisCache extends DatabaseInterface {
  save(data) {
    console.log('Caching in Redis');
    // Redis specific implementation
    return true;
  }
  
  find(id) {
    console.log('Finding in Redis cache');
    // Redis specific implementation
    return { id, name: 'Cached User', source: 'Redis' };
  }
}

// High-level module depends on abstraction
class UserService {
  constructor(database) {
    if (!(database instanceof DatabaseInterface)) {
      throw new Error('Database must implement DatabaseInterface');
    }
    this.database = database; // Dependency injection
  }
  
  createUser(userData) {
    // Business logic remains the same
    const user = { id: Date.now(), ...userData };
    this.database.save(user);
    return user;
  }
  
  getUser(id) {
    return this.database.find(id);
  }
}

// Dependency injection container (simple example)
class DIContainer {
  constructor() {
    this.services = new Map();
  }
  
  register(name, factory) {
    this.services.set(name, factory);
  }
  
  resolve(name) {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not found`);
    }
    return factory();
  }
}

// Setup
const container = new DIContainer();

// Register services
container.register('database', () => new MySQLDatabase());
container.register('cache', () => new RedisCache());
container.register('userService', () => new UserService(container.resolve('database')));

// Usage - can easily switch implementations
const userService1 = new UserService(new MySQLDatabase());
const userService2 = new UserService(new MongoDatabase());
const userService3 = new UserService(new RedisCache());

userService1.createUser({ name: 'John' });
userService2.createUser({ name: 'Jane' });
userService3.createUser({ name: 'Bob' });

console.log(userService1.getUser(1));
console.log(userService2.getUser(1));
console.log(userService3.getUser(1));
```

## Node.js Specific Examples

### Express.js Application with SOLID Principles

```javascript
// interfaces/IUserRepository.js
class IUserRepository {
  async create(user) {
    throw new Error('Method must be implemented');
  }
  
  async findById(id) {
    throw new Error('Method must be implemented');
  }
  
  async findByEmail(email) {
    throw new Error('Method must be implemented');
  }
}

// repositories/MongoUserRepository.js
const IUserRepository = require('../interfaces/IUserRepository');

class MongoUserRepository extends IUserRepository {
  constructor(mongoClient) {
    super();
    this.db = mongoClient.db('myapp');
    this.collection = this.db.collection('users');
  }
  
  async create(user) {
    const result = await this.collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }
  
  async findById(id) {
    return await this.collection.findOne({ _id: id });
  }
  
  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }
}

// services/UserService.js
class UserService {
  constructor(userRepository, emailService, validator) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.validator = validator;
  }
  
  async createUser(userData) {
    // Validate
    this.validator.validate(userData);
    
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create user
    const user = await this.userRepository.create({
      ...userData,
      createdAt: new Date()
    });
    
    // Send welcome email
    await this.emailService.sendWelcomeEmail(user);
    
    return user;
  }
  
  async getUserById(id) {
    return await this.userRepository.findById(id);
  }
}

// controllers/UserController.js
class UserController {
  constructor(userService) {
    this.userService = userService;
  }
  
  async createUser(req, res) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  async getUser(req, res) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// app.js - Dependency injection setup
const express = require('express');
const { MongoClient } = require('mongodb');

const MongoUserRepository = require('./repositories/MongoUserRepository');
const UserService = require('./services/UserService');
const UserController = require('./controllers/UserController');
const EmailService = require('./services/EmailService');
const UserValidator = require('./validators/UserValidator');

async function createApp() {
  const app = express();
  app.use(express.json());
  
  // Setup dependencies
  const mongoClient = new MongoClient('mongodb://localhost:27017');
  await mongoClient.connect();
  
  const userRepository = new MongoUserRepository(mongoClient);
  const emailService = new EmailService();
  const userValidator = new UserValidator();
  const userService = new UserService(userRepository, emailService, userValidator);
  const userController = new UserController(userService);
  
  // Routes
  app.post('/users', (req, res) => userController.createUser(req, res));
  app.get('/users/:id', (req, res) => userController.getUser(req, res));
  
  return app;
}

module.exports = createApp;
```

## Interview Questions

### Basic Questions

**Q: What does SOLID stand for?**
A: 
- **S** - Single Responsibility Principle
- **O** - Open/Closed Principle
- **L** - Liskov Substitution Principle
- **I** - Interface Segregation Principle
- **D** - Dependency Inversion Principle

**Q: Explain the Single Responsibility Principle.**
A: A class should have only one reason to change. Each class should have only one job or responsibility.

**Q: What is the Open/Closed Principle?**
A: Software entities should be open for extension but closed for modification. You should be able to add new functionality without changing existing code.

### Intermediate Questions

**Q: How do you implement dependency injection in Node.js?**
A: Through constructor injection, setter injection, or using a DI container:

```javascript
// Constructor injection
class UserService {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
}

// Usage
const userService = new UserService(
  new MongoUserRepository(),
  new EmailService()
);
```

**Q: Give an example of violating the Liskov Substitution Principle.**
A: When a subclass changes the expected behavior of the parent class:

```javascript
class Rectangle {
  setWidth(width) { this.width = width; }
  setHeight(height) { this.height = height; }
  getArea() { return this.width * this.height; }
}

class Square extends Rectangle {
  setWidth(width) {
    this.width = width;
    this.height = width; // Changes expected behavior
  }
  
  setHeight(height) {
    this.width = height;
    this.height = height; // Changes expected behavior
  }
}
```

### Advanced Questions

**Q: How do SOLID principles help with testing?**
A: 
- **SRP**: Easier to test single responsibilities
- **OCP**: Can test extensions without modifying existing tests
- **LSP**: Substitutable objects make mocking easier
- **ISP**: Smaller interfaces are easier to mock
- **DIP**: Dependency injection enables easy mocking

**Q: How would you refactor a monolithic class to follow SOLID principles?**
A: 
1. Identify different responsibilities (SRP)
2. Extract interfaces for extensibility (OCP)
3. Ensure substitutability (LSP)
4. Split large interfaces (ISP)
5. Inject dependencies (DIP)

## Benefits of SOLID Principles

1. **Maintainability** - Easier to modify and extend code
2. **Testability** - Easier to write unit tests
3. **Flexibility** - Can adapt to changing requirements
4. **Reusability** - Components can be reused in different contexts
5. **Readability** - Code is more organized and understandable

## Common Violations and How to Fix Them

### God Classes
**Problem**: Classes that do too much
**Solution**: Apply SRP by extracting responsibilities

### Tight Coupling
**Problem**: Classes directly depend on concrete implementations
**Solution**: Apply DIP by depending on abstractions

### Rigid Inheritance
**Problem**: Inheritance hierarchies that are hard to extend
**Solution**: Apply OCP by using composition and interfaces

### Fat Interfaces
**Problem**: Interfaces with too many methods
**Solution**: Apply ISP by splitting interfaces

## Best Practices

1. **Start simple** - Don't over-engineer from the beginning
2. **Refactor gradually** - Apply principles as code grows
3. **Use TypeScript** - Interfaces and types help enforce principles
4. **Write tests** - Tests help verify principle adherence
5. **Review regularly** - Check for principle violations during code reviews

## Tools and Libraries

- **TypeScript** - For interfaces and type safety
- **InversifyJS** - Dependency injection container
- **Awilix** - Another DI container for Node.js
- **ESLint** - Can help enforce some principles through rules
- **Jest** - Testing framework that works well with SOLID code