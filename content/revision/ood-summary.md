---
title: "Object-Oriented Design - Revision Summary"
category: "revision"
difficulty: "advanced"
estimatedReadTime: 10
tags: ["ood", "design-patterns", "solid-principles", "architecture", "clean-code", "revision"]
lastUpdated: "2024-01-15"
printFriendly: true
---

# Object-Oriented Design - Revision Summary

## SOLID Principles

### Single Responsibility Principle (SRP)
**Definition**: A class should have only one reason to change.

```javascript
// Bad: Multiple responsibilities
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  save() {
    // Database logic
    database.save(this);
  }
  
  sendEmail() {
    // Email logic
    emailService.send(this.email, 'Welcome!');
  }
}

// Good: Single responsibility
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class UserRepository {
  save(user) {
    database.save(user);
  }
}

class EmailService {
  sendWelcomeEmail(user) {
    this.send(user.email, 'Welcome!');
  }
}
```

### Open/Closed Principle (OCP)
**Definition**: Open for extension, closed for modification.

```javascript
// Bad: Modifying existing code for new shapes
class AreaCalculator {
  calculate(shapes) {
    return shapes.reduce((total, shape) => {
      if (shape.type === 'circle') {
        return total + Math.PI * shape.radius ** 2;
      } else if (shape.type === 'rectangle') {
        return total + shape.width * shape.height;
      }
      return total;
    }, 0);
  }
}

// Good: Extensible without modification
class Shape {
  area() {
    throw new Error('Must implement area method');
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  
  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  
  area() {
    return this.width * this.height;
  }
}

class AreaCalculator {
  calculate(shapes) {
    return shapes.reduce((total, shape) => total + shape.area(), 0);
  }
}
```

### Liskov Substitution Principle (LSP)
**Definition**: Objects of a superclass should be replaceable with objects of its subclasses.

```javascript
// Good: Proper inheritance
class Bird {
  fly() {
    return "Flying";
  }
}

class Duck extends Bird {
  fly() {
    return "Duck flying";
  }
  
  swim() {
    return "Duck swimming";
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error("Penguins can't fly");
  }
  
  swim() {
    return "Penguin swimming";
  }
}

// Better design
class Bird {
  move() {
    throw new Error('Must implement move method');
  }
}

class FlyingBird extends Bird {
  fly() {
    return "Flying";
  }
  
  move() {
    return this.fly();
  }
}

class SwimmingBird extends Bird {
  swim() {
    return "Swimming";
  }
  
  move() {
    return this.swim();
  }
}
```

## Design Patterns

### Creational Patterns

#### Singleton Pattern
```javascript
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connection = this.createConnection();
    DatabaseConnection.instance = this;
    return this;
  }
  
  createConnection() {
    return { connected: true, host: 'localhost' };
  }
  
  query(sql) {
    return this.connection.query(sql);
  }
}

// Usage
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();
console.log(db1 === db2); // true
```

#### Factory Pattern
```javascript
class PaymentFactory {
  static createPayment(type, amount) {
    switch (type) {
      case 'credit':
        return new CreditCardPayment(amount);
      case 'paypal':
        return new PayPalPayment(amount);
      case 'crypto':
        return new CryptoPayment(amount);
      default:
        throw new Error(`Unknown payment type: ${type}`);
    }
  }
}

class CreditCardPayment {
  constructor(amount) {
    this.amount = amount;
  }
  
  process() {
    return `Processing $${this.amount} via Credit Card`;
  }
}

class PayPalPayment {
  constructor(amount) {
    this.amount = amount;
  }
  
  process() {
    return `Processing $${this.amount} via PayPal`;
  }
}
```

### Structural Patterns

#### Adapter Pattern
```javascript
// Legacy API
class LegacyPrinter {
  printOldFormat(text) {
    return `Legacy: ${text}`;
  }
}

// New interface
class ModernPrinter {
  print(document) {
    return `Modern: ${document.content}`;
  }
}

// Adapter
class PrinterAdapter {
  constructor(legacyPrinter) {
    this.legacyPrinter = legacyPrinter;
  }
  
  print(document) {
    return this.legacyPrinter.printOldFormat(document.content);
  }
}

// Usage
const legacyPrinter = new LegacyPrinter();
const adapter = new PrinterAdapter(legacyPrinter);
const document = { content: 'Hello World' };
console.log(adapter.print(document)); // Legacy: Hello World
```

#### Decorator Pattern
```javascript
class Coffee {
  cost() {
    return 2;
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
    return this.coffee.cost() + 0.5;
  }
  
  description() {
    return this.coffee.description() + ', milk';
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 0.2;
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
console.log(coffee.cost()); // 2.7
```

### Behavioral Patterns

#### Observer Pattern
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
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(data));
    }
  }
  
  off(event, listenerToRemove) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(
        listener => listener !== listenerToRemove
      );
    }
  }
}

// Usage
const emitter = new EventEmitter();

const userLoginHandler = (user) => {
  console.log(`User ${user.name} logged in`);
};

const analyticsHandler = (user) => {
  console.log(`Track login event for ${user.id}`);
};

emitter.on('user:login', userLoginHandler);
emitter.on('user:login', analyticsHandler);

emitter.emit('user:login', { id: 1, name: 'John' });
```

#### Strategy Pattern
```javascript
class PaymentContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  executePayment(amount) {
    return this.strategy.pay(amount);
  }
}

class CreditCardStrategy {
  constructor(cardNumber, cvv) {
    this.cardNumber = cardNumber;
    this.cvv = cvv;
  }
  
  pay(amount) {
    return `Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`;
  }
}

class PayPalStrategy {
  constructor(email) {
    this.email = email;
  }
  
  pay(amount) {
    return `Paid $${amount} using PayPal account ${this.email}`;
  }
}

// Usage
const payment = new PaymentContext(new CreditCardStrategy('1234567890123456', '123'));
console.log(payment.executePayment(100));

payment.setStrategy(new PayPalStrategy('user@example.com'));
console.log(payment.executePayment(50));
```

## Architecture Patterns

### Model-View-Controller (MVC)
```javascript
// Model
class UserModel {
  constructor() {
    this.users = [];
  }
  
  addUser(user) {
    this.users.push(user);
    return user;
  }
  
  getUsers() {
    return this.users;
  }
  
  getUserById(id) {
    return this.users.find(user => user.id === id);
  }
}

// View
class UserView {
  renderUsers(users) {
    return users.map(user => `<div>${user.name} (${user.email})</div>`).join('');
  }
  
  renderUser(user) {
    return `<div><h2>${user.name}</h2><p>${user.email}</p></div>`;
  }
}

// Controller
class UserController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
  
  createUser(userData) {
    const user = this.model.addUser(userData);
    return this.view.renderUser(user);
  }
  
  getAllUsers() {
    const users = this.model.getUsers();
    return this.view.renderUsers(users);
  }
}
```

### Repository Pattern
```javascript
class UserRepository {
  constructor(database) {
    this.db = database;
  }
  
  async findById(id) {
    return await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
  
  async findByEmail(email) {
    return await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
  }
  
  async create(userData) {
    const result = await this.db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [userData.name, userData.email]
    );
    return { id: result.insertId, ...userData };
  }
  
  async update(id, userData) {
    await this.db.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [userData.name, userData.email, id]
    );
    return this.findById(id);
  }
  
  async delete(id) {
    return await this.db.query('DELETE FROM users WHERE id = ?', [id]);
  }
}

// Service Layer
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  
  async createUser(userData) {
    // Business logic validation
    if (!userData.email || !userData.name) {
      throw new Error('Name and email are required');
    }
    
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    return await this.userRepository.create(userData);
  }
}
```

## Clean Code Principles

### Naming Conventions
```javascript
// Bad
const d = new Date();
const u = users.filter(x => x.a > 18);

// Good
const currentDate = new Date();
const adultUsers = users.filter(user => user.age > 18);

// Functions should be verbs
const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + item.price, 0);
};

// Classes should be nouns
class OrderProcessor {
  process(order) {
    // Implementation
  }
}
```

### Function Design
```javascript
// Bad: Too many parameters
function createUser(name, email, age, address, phone, role, department) {
  // Implementation
}

// Good: Use object parameter
function createUser(userData) {
  const { name, email, age, address, phone, role, department } = userData;
  // Implementation
}

// Bad: Function doing too much
function processOrder(order) {
  // Validate order
  if (!order.items || order.items.length === 0) {
    throw new Error('Order must have items');
  }
  
  // Calculate total
  const total = order.items.reduce((sum, item) => sum + item.price, 0);
  
  // Apply discount
  const discount = calculateDiscount(order.customerId);
  const finalTotal = total - discount;
  
  // Save to database
  database.save(order);
  
  // Send email
  emailService.sendOrderConfirmation(order.customerId, order.id);
  
  return { orderId: order.id, total: finalTotal };
}

// Good: Single responsibility functions
function validateOrder(order) {
  if (!order.items || order.items.length === 0) {
    throw new Error('Order must have items');
  }
}

function calculateOrderTotal(order) {
  return order.items.reduce((sum, item) => sum + item.price, 0);
}

function processOrder(order) {
  validateOrder(order);
  const total = calculateOrderTotal(order);
  const discount = calculateDiscount(order.customerId);
  const finalTotal = total - discount;
  
  const savedOrder = orderRepository.save({ ...order, total: finalTotal });
  emailService.sendOrderConfirmation(order.customerId, savedOrder.id);
  
  return savedOrder;
}
```

## Quick Reference Cheat Sheet

| Pattern | Purpose | When to Use |
|---------|---------|-------------|
| Singleton | One instance | Database connections, loggers |
| Factory | Object creation | Multiple similar objects |
| Observer | Event handling | UI updates, notifications |
| Strategy | Algorithm selection | Payment methods, sorting |
| Decorator | Add behavior | Middleware, feature flags |
| Adapter | Interface compatibility | Legacy system integration |
| Repository | Data access | Database abstraction |
| MVC | Separation of concerns | Web applications |

## SOLID Principles Quick Reference

| Principle | Definition | Key Benefit |
|-----------|------------|-------------|
| **S**RP | One reason to change | Maintainability |
| **O**CP | Open for extension, closed for modification | Flexibility |
| **L**SP | Substitutable subclasses | Reliability |
| **I**SP | Interface segregation | Decoupling |
| **D**IP | Depend on abstractions | Testability |

## Common Interview Questions

1. **SOLID Principles**: Explain each principle with examples
2. **Design Patterns**: When to use Singleton vs Factory vs Strategy
3. **MVC vs MVP vs MVVM**: Differences and use cases
4. **Composition vs Inheritance**: When to use each approach
5. **Dependency Injection**: Benefits and implementation
6. **Clean Code**: Principles for writing maintainable code
7. **Code Smells**: Identify and refactor problematic code
8. **Architecture Patterns**: Layered, hexagonal, clean architecture

## Code Quality Metrics

- **Cyclomatic Complexity**: < 10 per function
- **Function Length**: < 20 lines ideally
- **Class Size**: < 200 lines typically
- **Test Coverage**: > 80% for critical code
- **Code Duplication**: < 5% duplicate code
- **Coupling**: Low coupling between modules
- **Cohesion**: High cohesion within modules