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

##BBt PtPcs

1. o' ovusepe * - A3.t-mAppl- themswh  dihtynsoltoplprlm
2.**Udndrmfis**-Choot.pigc -peea rnbitnsthke e hioh
3.t**Krapam ttimpln**-Ptrsshldmkmnb,W*ov -nnpigxlems complex
4.4**C Noi* rNNofenjAvpcfic**-Lvsrar pb i[t-Sy phneernseckvEvsncEt
5.v**ist thsi ugsRs** -tP tIe(tscIca UddSvomplexii  tntpity/tnde this.userRepository = userRepository;
  }
CommMk

1. Psanfop' takuere-cUs = epUserSiussy
2.**Wrgpukrhoi Pten-Ntudrndigwh oswhh paer
3Ov-enginer-Mkimplplm
4.renIgn eayi Nodf.jairice, cijavas/- Ndeefa coe tysNoto.jsrs-mom)or [Security Monitoring](../security-monitoring/security-monitoring-comprehensive.md) topics)
5.ls PoorierrBr handaker {-Nnsderirorai ptpt .n*imati

##AdvdPatrn f cpDir.r bu/SystBrfOvrvew)

Wilesmohsrvere dep [SymDsg](./yte-s/icrsvic-rchtur,'utkneevchcxfsignpttn

###ttjecsnystem ino pools so that if one fails, others can continue to function. Prevents cascading failures by limiting resource consumption.

chiquerededniddafrmoutsd thrsuve dbh clssfromolocplgdby  constructor() { /* ... */ }
uteCriticalOperation(operation) { /* ... */ }
}
```NDI
OldUsrSrvice
##aorsncor(
is.useRepsitory= UseRposiry();//Tght couig
Manages distributed transactions across multiple services to ensure data consistency in a microservices architecture. It involves a sequence of local transactions where each transaction updates data and publishes an event to trigger the next step.

```javascript
// WiehdDIe(Conntauo oQeI jnvtion)nt Streaming](./message-queues-event-streaming.md) or [Microservices Architecture](../system-design/microservices-architecture.md) topics)
class NSwUseragaOrchestrator {
  aonstnuctorpusorRepoOitoryrde}//Dncy injc
```hi.Repotry= ueRposiory

### Question 7: Describe the Factory Pattern and when it is useful.
**Difficulty**: Intermediate
**Category**: Creational Patterns

**Answer**: The Factory Pattern is a creational design pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created. It's useful when:
*   You don't know beforehand what exact type of objects your code should work with.
*   You want to encapsulate the object creation logic, making it easier to change or extend.
*   You want to decouple the client code from the concrete classes it instantiates.

**Example**:
```javascript
class Car {
  constructor(model) { this.model = model; }
  drive() { console.log(`${this.model} is driving.`); }
}

class Truck {
  constructor(model) { this.model = model; }
  haul() { console.log(`${this.model} is hauling.`); }
}

class VehicleFactory {
  createVehicle(type, model) {
    if (type === 'car') {
      return new Car(model);
    } else if (type === 'truck') {
      return new Truck(model);
    }
    throw new Error('Unknown vehicle type');
  }
}

const factory = new VehicleFactory();
const myCar = factory.createVehicle('car', 'Tesla Model 3');
myCar.drive(); // Tesla Model 3 is driving.
```

### Question 8: What is the Singleton Pattern, and what are its pros and cons in Node.js?
**Difficulty**: Intermediate
**Category**: Creational Patterns

**Answer**: The Singleton Pattern ensures that a class has only one instance and provides a global point of access to that instance.

**Pros**:
*   **Controlled Access**: Ensures only one instance, preventing multiple conflicting instances.
*   **Resource Saving**: Useful for managing shared resources (e.g., database connections, configuration objects) to avoid creating multiple expensive instances.
*   **Global Access**: Provides a single point of access, which can be convenient.

**Cons**:
*   **Global State**: Introduces global state, which can make testing difficult and lead to hidden dependencies.
*   **Tight Coupling**: Can lead to tight coupling if not used carefully, as components directly depend on the single instance.
*   **Testability Issues**: Hard to mock or replace the singleton instance in tests.
*   **Concurrency Issues**: In multi-threaded environments (like Node.js with Worker Threads if not properly managed), race conditions can occur if the instance creation is not thread-safe.

**Node.js Specifics**: Due to Node.js's module caching mechanism (CommonJS), any module exported as a single object (e.g., `module.exports = new MyClass();`) effectively acts as a singleton *within the scope of that module loader*. However, this doesn't guarantee a true application-wide singleton across multiple processes (e.g., in a `cluster` setup) or separate module loaders.

### Question 9: Describe the Adapter Pattern and provide a scenario where it would be useful.
**Difficulty**: Intermediate
**Category**: Structural Patterns

**Answer**: The Adapter Pattern allows objects with incompatible interfaces to collaborate. It acts as a wrapper between two objects, converting the interface of one class into another interface that the client expects.

**Scenario**: Integrating a new payment gateway into an existing e-commerce application. The existing application expects a specific `processPayment(orderId, amount)` interface, but the new payment gateway provides a `charge(transactionDetails)` method. An Adapter can be created to bridge this gap.

**Example**:
```javascript
// Existing interface expected by our application
class PaymentGateway {
  processPayment(orderId, amount) {
    throw new Error('Method not implemented');
  }
}

// New external payment service with a different interface
class StripeService {
  charge(details) {
    console.log(`Stripe charging: ${details.amount} for order ${details.orderId}`);
    return { status: 'succeeded', transactionId: 'stripe_tx_123' };
  }
}

// Adapter to make StripeService compatible with PaymentGateway interface
class StripeAdapter extends PaymentGateway {
  constructor(stripeService) {
    super();
    this.stripeService = stripeService;
  }

  processPayment(orderId, amount) {
    const details = {
      orderId: orderId,
      amount: amount,
      currency: 'USD' // Assume default currency
    };
    const result = this.stripeService.charge(details);
    if (result.status === 'succeeded') {
      return { success: true, transactionId: result.transactionId };
    }
    return { success: false, error: 'Payment failed' };
  }
}

// Client code using the unified interface
const stripeGateway = new StripeAdapter(new StripeService());
stripeGateway.processPayment('ORD-001', 100); // Works with the expected interface
```

### Question 10: How does the Strategy Pattern improve flexibility in an application?
**Difficulty**: Intermediate
**Category**: Behavioral Patterns

**Answer**: The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. This pattern allows the algorithm to vary independently from clients that use it.

**How it improves flexibility**:
*   **Decoupling**: It decouples the client from the implementation details of an algorithm. The client only needs to know the interface of the strategy.
*   **Easy Algorithm Switching**: You can change the algorithm used at runtime without modifying the client code.
*   **Open/Closed Principle**: New algorithms (strategies) can be added easily without modifying existing code, adhering to the Open/Closed Principle.
*   **Avoids Conditional Logic**: Reduces large conditional statements (if/else if or switch) in the client code that would be used to select an algorithm.

**Example**:
```javascript
// Strategy Interface (implicit in JS)
// class PaymentStrategy { pay(amount) { throw new Error('Method not implemented'); } }

// Concrete Strategies
class CreditCardPayment {
  pay(amount) { console.log(`Paid $${amount} with Credit Card`); }
}

class PayPalPayment {
  pay(amount) { console.log(`Paid $${amount} with PayPal`); }
}

class BankTransferPayment {
  pay(amount) { console.log(`Paid $${amount} with Bank Transfer`); }
}

// Context that uses a Strategy
class ShoppingCart {
  constructor(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
  }

  checkout(amount) {
    this.paymentStrategy.pay(amount);
  }
}

// Usage
const cart = new ShoppingCart(new CreditCardPayment());
cart.checkout(100); // Paid $100 with Credit Card

cart.setPaymentStrategy(new PayPalPayment());
cart.checkout(50); // Paid $50 with PayPal
```

### Question 11: Explain the Command Pattern and provide a use case demonstrating its benefits.
**Difficulty**: Advanced
**Category**: Behavioral Patterns

**Answer**: The Command Pattern encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.

**Benefits**:
*   **Decoupling**: Decouples the object that invokes the operation from the object that knows how to perform it.
*   **Undo/Redo Functionality**: Easily implement undo/redo mechanisms by storing commands in a history.
*   **Queueing/Logging**: Commands can be queued, logged, or executed remotely.
*   **Flexibility**: New commands can be added without changing existing code.

**Use Case: Text Editor with Undo/Redo**
In a text editor, every action (typing, deleting, formatting) can be represented as a command.

```javascript
// Receiver (knows how to perform operations)
class TextEditor {
  constructor(content = '') {
    this.content = content;
  }

  type(text) {
    this.content += text;
    console.log(`Typed: "${text}". Current content: "${this.content}"`);
  }

  deleteLastChar() {
    this.content = this.content.slice(0, -1);
    console.log(`Deleted last char. Current content: "${this.content}"`);
  }
}

// Command Interface (implicit in JS)
// class Command { execute(); undo(); }

// Concrete Command for typing
class TypeCommand {
  constructor(editor, text) {
    this.editor = editor;
    this.text = text;
  }

  execute() {
    this.editor.type(this.text);
  }

  undo() {
    this.editor.content = this.editor.content.slice(0, -this.text.length);
    console.log(`Undo type. Content: "${this.editor.content}"`);
  }
}

// Invoker (manages commands and history)
class CommandManager {
  constructor() {
    this.history = [];
    this.pointer = -1; // Points to the last executed command
  }

  execute(command) {
    // Clear redo history if new command is executed
    this.history = this.history.slice(0, this.pointer + 1);
    this.history.push(command);
    this.pointer++;
    command.execute();
  }

  undo() {
    if (this.pointer >= 0) {
      const command = this.history[this.pointer];
      command.undo();
      this.pointer--;
    } else {
      console.log('Nothing to undo.');
    }
  }

  redo() {
    if (this.pointer < this.history.length - 1) {
      this.pointer++;
      const command = this.history[this.pointer];
      command.execute();
    } else {
      console.log('Nothing to redo.');
    }
  }
}

// Usage
const editor = new TextEditor();
const manager = new CommandManager();

manager.execute(new TypeCommand(editor, 'Hello'));
manager.execute(new TypeCommand(editor, ' World'));
manager.undo(); // Undo " World"
manager.redo(); // Redo " World"
manager.execute(new TypeCommand(editor, '!!!'));
```

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

## Advanced Patterns for Distributed Systems (Brief Overview)

While some of these are covered in depth in [System Design topics](../system-design/microservices-architecture.md), it's useful to know their relevance in the context of design patterns.

### Dependency Injection Pattern

A technique where dependencies are provided to a class from the outside rather than created by the class itself. This promotes loose coupling and testability.

```javascript
// No DI
class OldUserService {
  constructor() {
    this.userRepository = new UserRepository(); // Tight coupling
  }
}

// With DI (Constructor Injection)
class NewUserService {
  constructor(userRepository) { // Dependency is injected
    this.userRepository = userRepository;
  }
}

// Usage
const userRepository = new MySqlUserRepository(); // Or MongoUserRepository
const userService = new NewUserService(userRepository);
```

### Circuit Breaker Pattern

Prevents a system from repeatedly trying to access a failing remote service, which could lead to cascading failures. When failures exceed a threshold, the circuit "breaks," and subsequent calls fail immediately.

```javascript
// (See detailed implementation in [Microservices Architecture](../system-design/microservices-architecture.md) or [Security Monitoring](../security-monitoring/security-monitoring-comprehensive.md) topics)
class CircuitBreaker {
  constructor(options) { /* ... */ }
  async execute(operation) { /* ... */ }
}
```

### Bulkhead Pattern

Isolates elements of a system into pools so that if one fails, others can continue to function. Prevents cascading failures by limiting resource consumption.

```javascript
// (See detailed implementation in [Scalability Patterns](../system-design/scalability-patterns-microservices.md) topic)
class BulkheadService {
  constructor() { /* ... */ }
  async executeCriticalOperation(operation) { /* ... */ }
}
```

### Saga Pattern

Manages distributed transactions across multiple services to ensure data consistency in a microservices architecture. It involves a sequence of local transactions where each transaction updates data and publishes an event to trigger the next step.

```javascript
// (See detailed implementation in [Message Queues and Event Streaming](./message-queues-event-streaming.md) or [Microservices Architecture](../system-design/microservices-architecture.md) topics)
class OrderSagaOrchestrator {
  async processOrder(orderData) { /* ... */ }
}
```

## Resources for Further Learning

- "Design Patterns: Elements of Reusable Object-Oriented Software" by Gang of Four
- "Learning JavaScript Design Patterns" by Addy Osmani
- Node.js documentation on EventEmitter

- "Ussgn
ctnsttusslReaosetore = eftrMySq ULeiR aosiSory();i// Or MoegoUitrR"positoryddy Osmani
Node. smtrion on v=-nswNewUr(uRpository)```###Ciuit Braker ttr

Pvesaysmfm peedlyingtoaccea iingm, whi could le o cascdngfalu When filreexahhold,hciui"bk," subsqetalliimdiaey.```javascript(Seetaildmplemetaioni[McrosviAchtcur](../ssm-sig/micos-achtcurd[SuriyMonitorg](../sriy-montrig/cui-monioig-coehensi.md)topics)
cass CrcuBreaker {
costructor(os) { / ... / }
 asyc xcue(oprin) { / ... / }
}
```

###ulkhdIoleefsyo poosoth if oefi,oscncontutfunton. Prveccadngfalumitirsrconsumpto.

```javascrip
//(Seedeaild[ScabliyPattrs](../sysem-desig/scaabilit-patters-microsrvic.md)pic)
classBuladSvi{
conucor(){/.../}
sycxcCraratio(pato) { / ... /}
}
```

###SaPtrn

Mgdsribetranacosarss multiplsvcesuatacssency  mrosrvihecture. It vove  squcolcalransatoswreachtransatin upatsdaanpulish an venttriggr heextsep(edeildeii[essagQuus aEveemin](./msge-queue-evnt-seig.dor[MirrvcesArchcue](../ste-dsig/irervics-rchtecture.m)tpcsOrderSagOchetorscproesOrder(rdrDat)/*...*/
```##Resurcs forFurer Lerning

-"DignPrn:Elemesf Reuable Obje-Oied ofwa" bGangofFour
-"Learnng Javcip DsinPrns" bAddyOsmani-Node.j documntion on EvEmi-Expresjs iddlwadocumenion
