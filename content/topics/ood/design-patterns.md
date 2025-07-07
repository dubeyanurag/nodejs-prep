# Design Patterns in Node.js

## Overview
Design patterns are reusable solutions to commonly occurring problems in software design. In Node.js development, understanding and applying design patterns helps create maintainable, scalable, and robust applications.

## Creational Patterns

### Singleton Pattern
Ensures a class has only one instance and provides global access to it.

```javascript
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connection = null;
    DatabaseConnection.instance = this;
  }
  
  connect() {
    if (!this.connection) {
      this.connection = 'Connected to database';
      console.log('Database connection established');
    }
    return this.connection;
  }
}

// Usage
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();
console.log(db1 === db2); // true
```

**When to use:**
- Database connections
- Configuration objects
- Logging services
- Cache managers

### Factory Pattern
Creates objects without specifying their exact classes.

```javascript
class Logger {
  log(message) {
    throw new Error('Method must be implemented');
  }
}

class FileLogger extends Logger {
  log(message) {
    console.log(`[FILE] ${new Date().toISOString()}: ${message}`);
  }
}

class ConsoleLogger extends Logger {
  log(message) {
    console.log(`[CONSOLE] ${new Date().toISOString()}: ${message}`);
  }
}

class LoggerFactory {
  static createLogger(type) {
    switch (type) {
      case 'file':
        return new FileLogger();
      case 'console':
        return new ConsoleLogger();
      default:
        throw new Error('Unknown logger type');
    }
  }
}

// Usage
const logger = LoggerFactory.createLogger('console');
logger.log('Application started');
```

### Builder Pattern
Constructs complex objects step by step.

```javascript
class QueryBuilder {
  constructor() {
    this.query = {
      select: [],
      from: '',
      where: [],
      orderBy: [],
      limit: null
    };
  }
  
  select(fields) {
    this.query.select = Array.isArray(fields) ? fields : [fields];
    return this;
  }
  
  from(table) {
    this.query.from = table;
    return this;
  }
  
  where(condition) {
    this.query.where.push(condition);
    return this;
  }
  
  orderBy(field, direction = 'ASC') {
    this.query.orderBy.push(`${field} ${direction}`);
    return this;
  }
  
  limit(count) {
    this.query.limit = count;
    return this;
  }
  
  build() {
    let sql = `SELECT ${this.query.select.join(', ')} FROM ${this.query.from}`;
    
    if (this.query.where.length > 0) {
      sql += ` WHERE ${this.query.where.join(' AND ')}`;
    }
    
    if (this.query.orderBy.length > 0) {
      sql += ` ORDER BY ${this.query.orderBy.join(', ')}`;
    }
    
    if (this.query.limit) {
      sql += ` LIMIT ${this.query.limit}`;
    }
    
    return sql;
  }
}

// Usage
const query = new QueryBuilder()
  .select(['name', 'email'])
  .from('users')
  .where('age > 18')
  .where('status = "active"')
  .orderBy('name')
  .limit(10)
  .build();

console.log(query);
// SELECT name, email FROM users WHERE age > 18 AND status = "active" ORDER BY name LIMIT 10
```

## Structural Patterns

### Adapter Pattern
Allows incompatible interfaces to work together.

```javascript
// Legacy payment system
class LegacyPaymentSystem {
  makePayment(amount) {
    console.log(`Processing payment of $${amount} through legacy system`);
    return { success: true, transactionId: Math.random().toString(36) };
  }
}

// New payment interface
class ModernPaymentInterface {
  processPayment(paymentData) {
    throw new Error('Method must be implemented');
  }
}

// Adapter
class PaymentAdapter extends ModernPaymentInterface {
  constructor(legacySystem) {
    super();
    this.legacySystem = legacySystem;
  }
  
  processPayment(paymentData) {
    // Adapt the interface
    const result = this.legacySystem.makePayment(paymentData.amount);
    return {
      status: result.success ? 'completed' : 'failed',
      id: result.transactionId,
      amount: paymentData.amount
    };
  }
}

// Usage
const legacySystem = new LegacyPaymentSystem();
const adapter = new PaymentAdapter(legacySystem);
const result = adapter.processPayment({ amount: 100 });
```

### Decorator Pattern
Adds new functionality to objects without altering their structure.

```javascript
class Coffee {
  cost() {
    return 5;
  }
  
  description() {
    return 'Simple coffee';
  }
}

class CoffeeDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }
  
  cost() {
    return this.coffee.cost();
  }
  
  description() {
    return this.coffee.description();
  }
}

class MilkDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 2;
  }
  
  description() {
    return this.coffee.description() + ', milk';
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 1;
  }
  
  description() {
    return this.coffee.description() + ', sugar';
  }
}

// Usage
let coffee = new Coffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);

console.log(coffee.description()); // Simple coffee, milk, sugar
console.log(coffee.cost()); // 8
```

## Behavioral Patterns

### Observer Pattern
Defines a one-to-many dependency between objects.

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  
  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(
      listener => listener !== listenerToRemove
    );
  }
  
  emit(event, data) {
    if (!this.events[event]) return;
    
    this.events[event].forEach(listener => listener(data));
  }
}

class UserService extends EventEmitter {
  createUser(userData) {
    // Create user logic
    const user = { id: Date.now(), ...userData };
    
    // Emit event
    this.emit('userCreated', user);
    
    return user;
  }
}

// Usage
const userService = new UserService();

userService.on('userCreated', (user) => {
  console.log(`Welcome email sent to ${user.email}`);
});

userService.on('userCreated', (user) => {
  console.log(`User analytics tracked for ${user.id}`);
});

userService.createUser({ name: 'John', email: 'john@example.com' });
```

### Strategy Pattern
Defines a family of algorithms and makes them interchangeable.

```javascript
class PaymentStrategy {
  pay(amount) {
    throw new Error('Method must be implemented');
  }
}

class CreditCardPayment extends PaymentStrategy {
  constructor(cardNumber) {
    super();
    this.cardNumber = cardNumber;
  }
  
  pay(amount) {
    console.log(`Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`);
  }
}

class PayPalPayment extends PaymentStrategy {
  constructor(email) {
    super();
    this.email = email;
  }
  
  pay(amount) {
    console.log(`Paid $${amount} using PayPal account ${this.email}`);
  }
}

class BankTransferPayment extends PaymentStrategy {
  constructor(accountNumber) {
    super();
    this.accountNumber = accountNumber;
  }
  
  pay(amount) {
    console.log(`Paid $${amount} using Bank Transfer from account ${this.accountNumber}`);
  }
}

class PaymentContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  executePayment(amount) {
    this.strategy.pay(amount);
  }
}

// Usage
const payment = new PaymentContext(new CreditCardPayment('1234567890123456'));
payment.executePayment(100);

payment.setStrategy(new PayPalPayment('user@example.com'));
payment.executePayment(50);
```

### Command Pattern
Encapsulates requests as objects, allowing you to parameterize clients with different requests.

```javascript
class Command {
  execute() {
    throw new Error('Method must be implemented');
  }
  
  undo() {
    throw new Error('Method must be implemented');
  }
}

class CreateFileCommand extends Command {
  constructor(fileSystem, filename, content) {
    super();
    this.fileSystem = fileSystem;
    this.filename = filename;
    this.content = content;
  }
  
  execute() {
    this.fileSystem.createFile(this.filename, this.content);
  }
  
  undo() {
    this.fileSystem.deleteFile(this.filename);
  }
}

class DeleteFileCommand extends Command {
  constructor(fileSystem, filename) {
    super();
    this.fileSystem = fileSystem;
    this.filename = filename;
    this.backup = null;
  }
  
  execute() {
    this.backup = this.fileSystem.getFile(this.filename);
    this.fileSystem.deleteFile(this.filename);
  }
  
  undo() {
    if (this.backup) {
      this.fileSystem.createFile(this.filename, this.backup);
    }
  }
}

class FileSystem {
  constructor() {
    this.files = new Map();
  }
  
  createFile(filename, content) {
    this.files.set(filename, content);
    console.log(`Created file: ${filename}`);
  }
  
  deleteFile(filename) {
    this.files.delete(filename);
    console.log(`Deleted file: ${filename}`);
  }
  
  getFile(filename) {
    return this.files.get(filename);
  }
}

class FileManager {
  constructor() {
    this.history = [];
    this.currentPosition = -1;
  }
  
  executeCommand(command) {
    // Remove any commands after current position
    this.history = this.history.slice(0, this.currentPosition + 1);
    
    // Execute and add to history
    command.execute();
    this.history.push(command);
    this.currentPosition++;
  }
  
  undo() {
    if (this.currentPosition >= 0) {
      const command = this.history[this.currentPosition];
      command.undo();
      this.currentPosition--;
    }
  }
  
  redo() {
    if (this.currentPosition < this.history.length - 1) {
      this.currentPosition++;
      const command = this.history[this.currentPosition];
      command.execute();
    }
  }
}

// Usage
const fileSystem = new FileSystem();
const fileManager = new FileManager();

const createCommand = new CreateFileCommand(fileSystem, 'test.txt', 'Hello World');
const deleteCommand = new DeleteFileCommand(fileSystem, 'test.txt');

fileManager.executeCommand(createCommand);
fileManager.executeCommand(deleteCommand);
fileManager.undo(); // Restores test.txt
fileManager.redo(); // Deletes test.txt again
```

## Node.js Specific Patterns

### Module Pattern
Node.js uses CommonJS modules by default, but ES6 modules are also supported.

```javascript
// userService.js - CommonJS
class UserService {
  constructor() {
    this.users = [];
  }
  
  addUser(user) {
    this.users.push(user);
  }
  
  getUsers() {
    return this.users;
  }
}

module.exports = UserService;

// ES6 Module version
export class UserService {
  constructor() {
    this.users = [];
  }
  
  addUser(user) {
    this.users.push(user);
  }
  
  getUsers() {
    return this.users;
  }
}

export default UserService;
```

### Middleware Pattern
Commonly used in Express.js and other Node.js frameworks.

```javascript
class MiddlewareManager {
  constructor() {
    this.middlewares = [];
  }
  
  use(middleware) {
    this.middlewares.push(middleware);
  }
  
  async execute(context) {
    let index = 0;
    
    const next = async () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        await middleware(context, next);
      }
    };
    
    await next();
  }
}

// Usage
const manager = new MiddlewareManager();

manager.use(async (context, next) => {
  console.log('Authentication middleware');
  context.user = { id: 1, name: 'John' };
  await next();
});

manager.use(async (context, next) => {
  console.log('Logging middleware');
  console.log(`User ${context.user.name} accessed the system`);
  await next();
});

manager.use(async (context, next) => {
  console.log('Business logic');
  context.result = 'Success';
});

// Execute
manager.execute({});
```

## Interview Questions

### Basic Questions

**Q: What is a design pattern?**
A: A design pattern is a reusable solution to a commonly occurring problem in software design. It's a template for how to solve a problem that can be used in many different situations.

**Q: Name the three categories of design patterns.**
A: 
1. **Creational Patterns** - Deal with object creation mechanisms
2. **Structural Patterns** - Deal with object composition
3. **Behavioral Patterns** - Deal with communication between objects

**Q: What's the difference between Singleton and Factory patterns?**
A: 
- **Singleton** ensures only one instance of a class exists
- **Factory** creates objects without specifying their exact classes

### Intermediate Questions

**Q: How would you implement the Observer pattern in Node.js?**
A: You can use Node.js's built-in EventEmitter or implement your own:

```javascript
const EventEmitter = require('events');

class UserService extends EventEmitter {
  createUser(userData) {
    const user = { id: Date.now(), ...userData };
    this.emit('userCreated', user);
    return user;
  }
}

const userService = new UserService();
userService.on('userCreated', (user) => {
  console.log(`User created: ${user.name}`);
});
```

**Q: When would you use the Strategy pattern?**
A: Use Strategy pattern when:
- You have multiple ways to perform a task
- You want to switch algorithms at runtime
- You want to avoid conditional statements for algorithm selection

### Advanced Questions

**Q: How do you handle the "callback hell" problem using design patterns?**
A: Several approaches:
1. **Promise Pattern** with chaining
2. **Async/Await Pattern**
3. **Observer Pattern** for event-driven architecture
4. **Command Pattern** for queuing operations

**Q: Explain how middleware pattern works in Express.js.**
A: Middleware functions execute sequentially, each having access to request, response, and next function. They can modify the request/response or terminate the chain.

## Best Practices

1. **Don't overuse patterns** - Apply them when they solve real problems
2. **Understand the problem first** - Choose the right pattern for the situation
3. **Keep it simple** - Patterns should make code more maintainable, not complex
4. **Consider Node.js specifics** - Leverage built-in patterns like EventEmitter
5. **Test thoroughly** - Patterns can add complexity that needs testing

## Common Mistakes

1. **Pattern for pattern's sake** - Using patterns unnecessarily
2. **Wrong pattern choice** - Not understanding when to use which pattern
3. **Over-engineering** - Making simple problems complex
4. **Ignoring Node.js conventions** - Not following Node.js idioms
5. **Poor error handling** - Not considering error scenarios in pattern implementation

## Resources for Further Learning

- "Design Patterns: Elements of Reusable Object-Oriented Software" by Gang of Four
- "Learning JavaScript Design Patterns" by Addy Osmani
- Node.js documentation on EventEmitter
- Express.js middleware documentation