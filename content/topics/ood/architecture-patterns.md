# Architecture Patterns and Code Organization in Node.js

## Overview
Architecture patterns provide proven solutions for organizing code in large-scale applications. They help create maintainable, testable, and scalable Node.js applications by defining clear boundaries between different layers and components.

## Clean Architecture

**Definition:** Clean Architecture separates concerns by organizing code into concentric circles, where inner circles contain business logic and outer circles contain implementation details.

### Core Principles
1. **Independence of Frameworks** - Business rules don't depend on frameworks
2. **Testable** - Business rules can be tested without UI, database, or external elements
3. **Independence of UI** - UI can change without changing business rules
4. **Independence of Database** - Business rules aren't bound to the database
5. **Independence of External Agencies** - Business rules don't know about the outside world

### Clean Architecture Structure

```
src/
├── domain/           # Enterprise Business Rules
│   ├── entities/     # Core business objects
│   ├── value-objects/
│   └── interfaces/   # Repository interfaces
├── use-cases/        # Application Business Rules
│   ├── user/
│   └── order/
├── interface-adapters/  # Interface Adapters
│   ├── controllers/
│   ├── presenters/
│   ├── repositories/
│   └── gateways/
└── frameworks-drivers/  # Frameworks & Drivers
    ├── web/          # Express routes
    ├── database/     # Database implementations
    └── external/     # External service clients
```

### Implementation Example

```javascript
// domain/entities/User.js
class User {
  constructor(id, email, name, createdAt = new Date()) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt;
    
    this.validate();
  }
  
  validate() {
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Invalid email');
    }
    if (!this.name || this.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
  }
  
  updateEmail(newEmail) {
    if (!newEmail || !newEmail.includes('@')) {
      throw new Error('Invalid email');
    }
    this.email = newEmail;
  }
  
  isActive() {
    return this.createdAt && this.createdAt < new Date();
  }
}

module.exports = User;
```

```javascript
// domain/interfaces/UserRepository.js
class UserRepository {
  async save(user) {
    throw new Error('Method must be implemented');
  }
  
  async findById(id) {
    throw new Error('Method must be implemented');
  }
  
  async findByEmail(email) {
    throw new Error('Method must be implemented');
  }
  
  async delete(id) {
    throw new Error('Method must be implemented');
  }
}

module.exports = UserRepository;
```

```javascript
// use-cases/user/CreateUser.js
const User = require('../../domain/entities/User');

class CreateUser {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
  
  async execute(userData) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user entity
    const user = new User(
      this.generateId(),
      userData.email,
      userData.name
    );
    
    // Save user
    await this.userRepository.save(user);
    
    // Send welcome email
    await this.emailService.sendWelcomeEmail(user);
    
    return user;
  }
  
  generateId() {
    return Date.now().toString();
  }
}

module.exports = CreateUser;
```

```javascript
// interface-adapters/controllers/UserController.js
class UserController {
  constructor(createUserUseCase, getUserUseCase) {
    this.createUserUseCase = createUserUseCase;
    this.getUserUseCase = getUserUseCase;
  }
  
  async createUser(req, res) {
    try {
      const user = await this.createUserUseCase.execute(req.body);
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  async getUser(req, res) {
    try {
      const user = await this.getUserUseCase.execute(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
```

```javascript
// interface-adapters/repositories/MongoUserRepository.js
const UserRepository = require('../../domain/interfaces/UserRepository');
const User = require('../../domain/entities/User');

class MongoUserRepository extends UserRepository {
  constructor(mongoClient) {
    super();
    this.collection = mongoClient.db('myapp').collection('users');
  }
  
  async save(user) {
    const userData = {
      _id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };
    
    await this.collection.replaceOne(
      { _id: user.id },
      userData,
      { upsert: true }
    );
    
    return user;
  }
  
  async findById(id) {
    const userData = await this.collection.findOne({ _id: id });
    if (!userData) return null;
    
    return new User(
      userData._id,
      userData.email,
      userData.name,
      userData.createdAt
    );
  }
  
  async findByEmail(email) {
    const userData = await this.collection.findOne({ email });
    if (!userData) return null;
    
    return new User(
      userData._id,
      userData.email,
      userData.name,
      userData.createdAt
    );
  }
  
  async delete(id) {
    await this.collection.deleteOne({ _id: id });
  }
}

module.exports = MongoUserRepository;
```

## Hexagonal Architecture (Ports and Adapters)

**Definition:** Hexagonal Architecture isolates the core business logic from external concerns by defining ports (interfaces) and adapters (implementations).

### Core Concepts
- **Ports**: Interfaces that define how the application can be used
- **Adapters**: Implementations that connect ports to external systems
- **Application Core**: Contains business logic and domain models
- **Primary Adapters**: Drive the application (web controllers, CLI)
- **Secondary Adapters**: Driven by the application (databases, external APIs)

### Hexagonal Architecture Structure

```
src/
├── application/      # Application Core
│   ├── domain/       # Domain models and business logic
│   ├── ports/        # Interfaces (primary and secondary)
│   └── services/     # Application services
├── adapters/
│   ├── primary/      # Driving adapters
│   │   ├── web/      # HTTP controllers
│   │   └── cli/      # Command line interface
│   └── secondary/    # Driven adapters
│       ├── persistence/  # Database adapters
│       ├── messaging/    # Message queue adapters
│       └── external/     # External service adapters
└── config/          # Configuration and dependency injection
```

### Implementation Example

```javascript
// application/ports/primary/UserService.js
class UserService {
  async createUser(userData) {
    throw new Error('Method must be implemented');
  }
  
  async getUserById(id) {
    throw new Error('Method must be implemented');
  }
  
  async updateUser(id, userData) {
    throw new Error('Method must be implemented');
  }
  
  async deleteUser(id) {
    throw new Error('Method must be implemented');
  }
}

module.exports = UserService;
```

```javascript
// application/ports/secondary/UserRepository.js
class UserRepository {
  async save(user) {
    throw new Error('Method must be implemented');
  }
  
  async findById(id) {
    throw new Error('Method must be implemented');
  }
  
  async findByEmail(email) {
    throw new Error('Method must be implemented');
  }
  
  async update(id, userData) {
    throw new Error('Method must be implemented');
  }
  
  async delete(id) {
    throw new Error('Method must be implemented');
  }
}

module.exports = UserRepository;
```

```javascript
// application/ports/secondary/EmailService.js
class EmailService {
  async sendWelcomeEmail(user) {
    throw new Error('Method must be implemented');
  }
  
  async sendPasswordResetEmail(user, resetToken) {
    throw new Error('Method must be implemented');
  }
}

module.exports = EmailService;
```

```javascript
// application/services/UserServiceImpl.js
const UserService = require('../ports/primary/UserService');
const User = require('../domain/User');

class UserServiceImpl extends UserService {
  constructor(userRepository, emailService) {
    super();
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
  
  async createUser(userData) {
    // Validate input
    if (!userData.email || !userData.name) {
      throw new Error('Email and name are required');
    }
    
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create user
    const user = new User(
      this.generateId(),
      userData.email,
      userData.name
    );
    
    // Save user
    await this.userRepository.save(user);
    
    // Send welcome email
    await this.emailService.sendWelcomeEmail(user);
    
    return user;
  }
  
  async getUserById(id) {
    if (!id) {
      throw new Error('User ID is required');
    }
    
    return await this.userRepository.findById(id);
  }
  
  async updateUser(id, userData) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user data
    if (userData.email) user.updateEmail(userData.email);
    if (userData.name) user.name = userData.name;
    
    await this.userRepository.update(id, user);
    return user;
  }
  
  async deleteUser(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    await this.userRepository.delete(id);
  }
  
  generateId() {
    return Date.now().toString();
  }
}

module.exports = UserServiceImpl;
```

```javascript
// adapters/primary/web/UserController.js
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
  
  async updateUser(req, res) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  async deleteUser(req, res) {
    try {
      await this.userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UserController;
```

```javascript
// adapters/secondary/persistence/MongoUserRepository.js
const UserRepository = require('../../../application/ports/secondary/UserRepository');
const User = require('../../../application/domain/User');

class MongoUserRepository extends UserRepository {
  constructor(mongoClient) {
    super();
    this.collection = mongoClient.db('myapp').collection('users');
  }
  
  async save(user) {
    const result = await this.collection.insertOne({
      _id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    });
    
    return user;
  }
  
  async findById(id) {
    const userData = await this.collection.findOne({ _id: id });
    if (!userData) return null;
    
    return new User(
      userData._id,
      userData.email,
      userData.name,
      userData.createdAt
    );
  }
  
  async findByEmail(email) {
    const userData = await this.collection.findOne({ email });
    if (!userData) return null;
    
    return new User(
      userData._id,
      userData.email,
      userData.name,
      userData.createdAt
    );
  }
  
  async update(id, user) {
    await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          email: user.email,
          name: user.name,
          updatedAt: new Date()
        }
      }
    );
  }
  
  async delete(id) {
    await this.collection.deleteOne({ _id: id });
  }
}

module.exports = MongoUserRepository;
```

## Domain-Driven Design (DDD)

**Definition:** DDD focuses on modeling software to match a domain according to input from domain experts.

### Core Concepts
- **Domain**: The sphere of knowledge and activity around which the application logic revolves
- **Bounded Context**: Explicit boundaries within which a domain model applies
- **Entities**: Objects with identity that run through time and different states
- **Value Objects**: Objects that describe characteristics but have no identity
- **Aggregates**: Clusters of entities and value objects with defined boundaries
- **Domain Services**: Operations that don't naturally fit within entities or value objects
- **Repositories**: Encapsulate logic needed to access data sources

### DDD Structure

```
src/
├── domain/
│   ├── user/             # User bounded context
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── aggregates/
│   │   ├── services/
│   │   └── repositories/
│   ├── order/            # Order bounded context
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── aggregates/
│   │   ├── services/
│   │   └── repositories/
│   └── shared/           # Shared kernel
├── application/
│   ├── user/
│   │   ├── commands/
│   │   ├── queries/
│   │   └── handlers/
│   └── order/
├── infrastructure/
│   ├── persistence/
│   ├── messaging/
│   └── external/
└── presentation/
    ├── web/
    └── api/
```

### Implementation Example

```javascript
// domain/user/value-objects/Email.js
class Email {
  constructor(value) {
    this.value = value;
    this.validate();
  }
  
  validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new Error('Invalid email format');
    }
  }
  
  equals(other) {
    return other instanceof Email && this.value === other.value;
  }
  
  toString() {
    return this.value;
  }
}

module.exports = Email;
```

```javascript
// domain/user/value-objects/UserId.js
class UserId {
  constructor(value) {
    if (!value) {
      throw new Error('UserId cannot be empty');
    }
    this.value = value;
  }
  
  equals(other) {
    return other instanceof UserId && this.value === other.value;
  }
  
  toString() {
    return this.value;
  }
}

module.exports = UserId;
```

```javascript
// domain/user/entities/User.js
const Email = require('../value-objects/Email');
const UserId = require('../value-objects/UserId');

class User {
  constructor(id, email, name, createdAt = new Date()) {
    this.id = id instanceof UserId ? id : new UserId(id);
    this.email = email instanceof Email ? email : new Email(email);
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = new Date();
    
    this.validate();
  }
  
  validate() {
    if (!this.name || this.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
  }
  
  changeEmail(newEmail) {
    const email = newEmail instanceof Email ? newEmail : new Email(newEmail);
    this.email = email;
    this.updatedAt = new Date();
  }
  
  changeName(newName) {
    if (!newName || newName.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    this.name = newName;
    this.updatedAt = new Date();
  }
  
  equals(other) {
    return other instanceof User && this.id.equals(other.id);
  }
}

module.exports = User;
```

```javascript
// domain/user/aggregates/UserAggregate.js
const User = require('../entities/User');

class UserAggregate {
  constructor(user) {
    this.user = user;
    this.domainEvents = [];
  }
  
  static create(id, email, name) {
    const user = new User(id, email, name);
    const aggregate = new UserAggregate(user);
    
    aggregate.addDomainEvent({
      type: 'UserCreated',
      userId: user.id.toString(),
      email: user.email.toString(),
      name: user.name,
      occurredAt: new Date()
    });
    
    return aggregate;
  }
  
  changeEmail(newEmail) {
    const oldEmail = this.user.email.toString();
    this.user.changeEmail(newEmail);
    
    this.addDomainEvent({
      type: 'UserEmailChanged',
      userId: this.user.id.toString(),
      oldEmail,
      newEmail: this.user.email.toString(),
      occurredAt: new Date()
    });
  }
  
  changeName(newName) {
    const oldName = this.user.name;
    this.user.changeName(newName);
    
    this.addDomainEvent({
      type: 'UserNameChanged',
      userId: this.user.id.toString(),
      oldName,
      newName: this.user.name,
      occurredAt: new Date()
    });
  }
  
  addDomainEvent(event) {
    this.domainEvents.push(event);
  }
  
  clearDomainEvents() {
    this.domainEvents = [];
  }
  
  getDomainEvents() {
    return [...this.domainEvents];
  }
}

module.exports = UserAggregate;
```

```javascript
// domain/user/services/UserDomainService.js
class UserDomainService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  
  async isEmailUnique(email) {
    const existingUser = await this.userRepository.findByEmail(email);
    return !existingUser;
  }
  
  async canUserBeDeleted(userId) {
    // Business logic to determine if user can be deleted
    // For example, check if user has pending orders
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return false;
    }
    
    // Add more complex business rules here
    return true;
  }
}

module.exports = UserDomainService;
```

```javascript
// application/user/commands/CreateUserCommand.js
class CreateUserCommand {
  constructor(email, name) {
    this.email = email;
    this.name = name;
  }
}

module.exports = CreateUserCommand;
```

```javascript
// application/user/handlers/CreateUserHandler.js
const UserAggregate = require('../../../domain/user/aggregates/UserAggregate');
const UserId = require('../../../domain/user/value-objects/UserId');

class CreateUserHandler {
  constructor(userRepository, userDomainService, eventPublisher) {
    this.userRepository = userRepository;
    this.userDomainService = userDomainService;
    this.eventPublisher = eventPublisher;
  }
  
  async handle(command) {
    // Check if email is unique
    const isEmailUnique = await this.userDomainService.isEmailUnique(command.email);
    if (!isEmailUnique) {
      throw new Error('Email already exists');
    }
    
    // Create user aggregate
    const userId = new UserId(this.generateId());
    const userAggregate = UserAggregate.create(
      userId,
      command.email,
      command.name
    );
    
    // Save user
    await this.userRepository.save(userAggregate.user);
    
    // Publish domain events
    const events = userAggregate.getDomainEvents();
    for (const event of events) {
      await this.eventPublisher.publish(event);
    }
    
    userAggregate.clearDomainEvents();
    
    return userAggregate.user;
  }
  
  generateId() {
    return Date.now().toString();
  }
}

module.exports = CreateUserHandler;
```

## Project Structure Examples

### Small to Medium Projects

```
my-app/
├── src/
│   ├── controllers/      # HTTP request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── models/          # Data models
│   ├── middleware/      # Express middleware
│   ├── routes/          # Route definitions
│   ├── utils/           # Utility functions
│   └── config/          # Configuration files
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
├── package.json
└── README.md
```

### Large Enterprise Projects

```
enterprise-app/
├── src/
│   ├── modules/         # Feature modules
│   │   ├── user/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   ├── order/
│   │   └── payment/
│   ├── shared/          # Shared components
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── presentation/
│   └── app.js
├── tests/
├── docs/
├── scripts/
├── config/
└── package.json
```

### Microservices Structure

```
user-service/
├── src/
│   ├── api/             # API layer
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   ├── domain/          # Domain layer
│   │   ├── entities/
│   │   ├── services/
│   │   └── repositories/
│   ├── infrastructure/  # Infrastructure layer
│   │   ├── database/
│   │   ├── messaging/
│   │   └── external/
│   ├── application/     # Application layer
│   │   ├── use-cases/
│   │   └── services/
│   └── shared/          # Shared utilities
├── tests/
├── docker/
├── k8s/
└── package.json
```

## Refactoring Case Studies

### Case Study 1: Monolithic to Layered Architecture

**Before: Monolithic Structure**
```javascript
// app.js - Everything in one file
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Database connection
mongoose.connect('mongodb://localhost/myapp');

// User schema
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Routes with business logic mixed in
app.post('/users', async (req, res) => {
  try {
    // Validation
    if (!req.body.email || !req.body.name) {
      return res.status(400).json({ error: 'Email and name required' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create user
    const user = new User(req.body);
    await user.save();
    
    // Send email (simulated)
    console.log(`Sending welcome email to ${user.email}`);
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

**After: Layered Architecture**
```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

```javascript
// repositories/UserRepository.js
const User = require('../models/User');

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }
  
  async findByEmail(email) {
    return await User.findOne({ email });
  }
  
  async findById(id) {
    return await User.findById(id);
  }
}

module.exports = UserRepository;
```

```javascript
// services/UserService.js
class UserService {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
  
  async createUser(userData) {
    // Validation
    this.validateUserData(userData);
    
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create user
    const user = await this.userRepository.create(userData);
    
    // Send welcome email
    await this.emailService.sendWelcomeEmail(user);
    
    return user;
  }
  
  validateUserData(userData) {
    if (!userData.email || !userData.name) {
      throw new Error('Email and name are required');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }
  }
}

module.exports = UserService;
```

```javascript
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
}

module.exports = UserController;
```

```javascript
// app.js - Clean separation
const express = require('express');
const mongoose = require('mongoose');

const UserRepository = require('./repositories/UserRepository');
const UserService = require('./services/UserService');
const UserController = require('./controllers/UserController');
const EmailService = require('./services/EmailService');

const app = express();
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost/myapp');

// Dependency injection
const userRepository = new UserRepository();
const emailService = new EmailService();
const userService = new UserService(userRepository, emailService);
const userController = new UserController(userService);

// Routes
app.post('/users', (req, res) => userController.createUser(req, res));

app.listen(3000);
```

### Case Study 2: Adding Clean Architecture

**Step 1: Extract Domain Entities**
```javascript
// domain/entities/User.js
class User {
  constructor(id, email, name, createdAt = new Date()) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt;
    
    this.validate();
  }
  
  validate() {
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Invalid email');
    }
    if (!this.name || this.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
  }
  
  changeEmail(newEmail) {
    if (!newEmail || !newEmail.includes('@')) {
      throw new Error('Invalid email');
    }
    this.email = newEmail;
  }
}

module.exports = User;
```

**Step 2: Create Use Cases**
```javascript
// use-cases/CreateUser.js
const User = require('../domain/entities/User');

class CreateUser {
  constructor(userRepository, emailService, idGenerator) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.idGenerator = idGenerator;
  }
  
  async execute(userData) {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create user entity
    const user = new User(
      this.idGenerator.generate(),
      userData.email,
      userData.name
    );
    
    // Save user
    await this.userRepository.save(user);
    
    // Send welcome email
    await this.emailService.sendWelcomeEmail(user);
    
    return user;
  }
}

module.exports = CreateUser;
```

**Step 3: Implement Repository Interface**
```javascript
// interface-adapters/repositories/MongoUserRepository.js
const UserRepository = require('../../domain/interfaces/UserRepository');
const User = require('../../domain/entities/User');

class MongoUserRepository extends UserRepository {
  constructor(mongooseModel) {
    super();
    this.model = mongooseModel;
  }
  
  async save(user) {
    const userData = {
      _id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };
    
    await this.model.findByIdAndUpdate(
      user.id,
      userData,
      { upsert: true, new: true }
    );
    
    return user;
  }
  
  async findByEmail(email) {
    const userData = await this.model.findOne({ email });
    if (!userData) return null;
    
    return new User(
      userData._id.toString(),
      userData.email,
      userData.name,
      userData.createdAt
    );
  }
}

module.exports = MongoUserRepository;
```

## Best Practices

### 1. Dependency Injection
```javascript
// Good: Constructor injection
class UserService {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
}

// Better: Using a DI container
const container = new DIContainer();
container.register('userRepository', () => new MongoUserRepository());
container.register('emailService', () => new EmailService());
container.register('userService', () => new UserService(
  container.resolve('userRepository'),
  container.resolve('emailService')
));
```

### 2. Interface Segregation
```javascript
// Good: Small, focused interfaces
class UserReader {
  async findById(id) { /* ... */ }
  async findByEmail(email) { /* ... */ }
}

class UserWriter {
  async save(user) { /* ... */ }
  async delete(id) { /* ... */ }
}

// Better than one large interface with all methods
```

### 3. Error Handling
```javascript
// domain/errors/DomainError.js
class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DomainError';
  }
}

class UserNotFoundError extends DomainError {
  constructor(userId) {
    super(`User with ID ${userId} not found`);
    this.name = 'UserNotFoundError';
  }
}

module.exports = { DomainError, UserNotFoundError };
```

### 4. Configuration Management
```javascript
// config/index.js
const config = {
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost/myapp',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD
  },
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  }
};

module.exports = config;
```

## Testing Architecture

### Unit Testing Domain Logic
```javascript
// tests/domain/entities/User.test.js
const User = require('../../../src/domain/entities/User');

describe('User Entity', () => {
  describe('constructor', () => {
    it('should create a valid user', () => {
      const user = new User('1', 'test@example.com', 'John Doe');
      
      expect(user.id).toBe('1');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('John Doe');
      expect(user.createdAt).toBeInstanceOf(Date);
    });
    
    it('should throw error for invalid email', () => {
      expect(() => {
        new User('1', 'invalid-email', 'John Doe');
      }).toThrow('Invalid email');
    });
    
    it('should throw error for short name', () => {
      expect(() => {
        new User('1', 'test@example.com', 'J');
      }).toThrow('Name must be at least 2 characters');
    });
  });
  
  describe('changeEmail', () => {
    it('should update email when valid', () => {
      const user = new User('1', 'test@example.com', 'John Doe');
      user.changeEmail('new@example.com');
      
      expect(user.email).toBe('new@example.com');
    });
    
    it('should throw error for invalid email', () => {
      const user = new User('1', 'test@example.com', 'John Doe');
      
      expect(() => {
        user.changeEmail('invalid-email');
      }).toThrow('Invalid email');
    });
  });
});
```

### Integration Testing Use Cases
```javascript
// tests/use-cases/CreateUser.test.js
const CreateUser = require('../../src/use-cases/CreateUser');

describe('CreateUser Use Case', () => {
  let createUser;
  let mockUserRepository;
  let mockEmailService;
  let mockIdGenerator;
  
  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn()
    };
    
    mockEmailService = {
      sendWelcomeEmail: jest.fn()
    };
    
    mockIdGenerator = {
      generate: jest.fn().mockReturnValue('generated-id')
    };
    
    createUser = new CreateUser(
      mockUserRepository,
      mockEmailService,
      mockIdGenerator
    );
  });
  
  it('should create user successfully', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(true);
    mockEmailService.sendWelcomeEmail.mockResolvedValue(true);
    
    const userData = {
      email: 'test@example.com',
      name: 'John Doe'
    };
    
    const result = await createUser.execute(userData);
    
    expect(result.id).toBe('generated-id');
    expect(result.email).toBe('test@example.com');
    expect(result.name).toBe('John Doe');
    expect(mockUserRepository.save).toHaveBeenCalledWith(result);
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(result);
  });
  
  it('should throw error when user already exists', async () => {
    const existingUser = { id: '1', email: 'test@example.com' };
    mockUserRepository.findByEmail.mockResolvedValue(existingUser);
    
    const userData = {
      email: 'test@example.com',
      name: 'John Doe'
    };
    
    await expect(createUser.execute(userData)).rejects.toThrow('User already exists');
  });
});
```

## Interview Questions

### Basic Questions

**Q: What is the difference between Clean Architecture and Hexagonal Architecture?**
A: 
- **Clean Architecture** organizes code in concentric circles with dependency rules flowing inward
- **Hexagonal Architecture** focuses on ports and adapters, isolating the core from external concerns
- Both achieve similar goals but use different organizational metaphors

**Q: What are the benefits of using layered architecture?**
A:
- **Separation of concerns** - Each layer has a specific responsibility
- **Maintainability** - Changes in one layer don't affect others
- **Testability** - Layers can be tested independently
- **Reusability** - Business logic can be reused across different interfaces

### Intermediate Questions

**Q: How do you implement dependency injection without a framework?**
A: Through constructor injection and factory functions:

```javascript
// Manual DI
class UserService {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
}

// Factory function
function createUserService() {
  const userRepository = new MongoUserRepository();
  const emailService = new EmailService();
  return new UserService(userRepository, emailService);
}
```

**Q: What is Domain-Driven Design and when should you use it?**
A: DDD is an approach that focuses on modeling software to match a domain according to input from domain experts. Use it when:
- Domain complexity is high
- Business rules are complex and change frequently
- You have access to domain experts
- Long-term maintainability is important

### Advanced Questions

**Q: How do you handle cross-cutting concerns in Clean Architecture?**
A: Through:
- **Middleware** for HTTP concerns (logging, authentication)
- **Decorators** for use case concerns (validation, caching)
- **Domain Events** for business concerns
- **Infrastructure services** for technical concerns

**Q: How do you migrate from a monolithic to a clean architecture?**
A: 
1. **Identify boundaries** - Find natural seams in the code
2. **Extract domain logic** - Move business rules to domain entities
3. **Create use cases** - Extract application logic
4. **Implement interfaces** - Define contracts between layers
5. **Refactor incrementally** - Don't try to change everything at once

## Common Pitfalls

### 1. Over-Engineering
```javascript
// Bad: Too many layers for simple CRUD
class GetUserByIdUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  
  async execute(id) {
    return await this.userRepository.findById(id);
  }
}

// Good: Direct repository call for simple operations
class UserController {
  async getUser(req, res) {
    const user = await this.userRepository.findById(req.params.id);
    res.json(user);
  }
}
```

### 2. Anemic Domain Models
```javascript
// Bad: No business logic in entities
class User {
  constructor(id, email, name) {
    this.id = id;
    this.email = email;
    this.name = name;
  }
}

// Good: Rich domain models
class User {
  constructor(id, email, name) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.validate();
  }
  
  validate() {
    if (!this.email.includes('@')) {
      throw new Error('Invalid email');
    }
  }
  
  changeEmail(newEmail) {
    this.validate();
    this.email = newEmail;
  }
}
```

### 3. Tight Coupling
```javascript
// Bad: Direct dependencies
class UserService {
  constructor() {
    this.userRepository = new MongoUserRepository(); // Tight coupling
  }
}

// Good: Dependency injection
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository; // Loose coupling
  }
}
```

Architecture patterns provide the foundation for building maintainable, scalable Node.js applications. Choose the right pattern based on your project's complexity, team size, and long-term goals.

### Question 7: When would you choose Clean Architecture over Hexagonal Architecture, or vice-versa?
**Difficulty**: Expert
**Category**: Architecture Choice

**Answer**: While both Clean Architecture and Hexagonal Architecture (Ports and Adapters) share the core goal of separating business logic from infrastructure concerns, the choice between them often comes down to emphasis and team familiarity.

*   **Clean Architecture**:
    *   **Emphasis**: Stronger emphasis on layered dependency rules (inner circles define interfaces, outer circles implement them). It explicitly defines "Enterprise Business Rules" and "Application Business Rules."
    *   **Best for**: Very large, complex enterprise applications with stable and critical core business logic that needs to be independent of any external concerns. Teams familiar with Uncle Bob Martin's SOLID principles and layered design.
    *   **Benefit**: Provides a very rigorous structure, making it highly testable and framework-agnostic.
    *   **Drawback**: Can be seen as over-engineered for smaller projects due to its strictness.

*   **Hexagonal Architecture**:
    *   **Emphasis**: Focuses on "ports" (interfaces) and "adapters" (implementations) to isolate the "application core" (domain and application services) from external actors (primary adapters) and external systems (secondary adapters). It's more about "inversion of control" at the boundaries.
    *   **Best for**: Projects where the core business logic needs to be easily swappable between different types of external systems (e.g., different databases, different UIs, different messaging systems). Often favored in microservices where services need to interact with various external components.
    *   **Benefit**: High flexibility in technology choices for adapters, good for testability.
    *   **Drawback**: Less prescriptive on internal layering compared to Clean Architecture, which can lead to less consistent internal structure if not managed well.

**In Practice**: Many teams find Hexagonal Architecture to be a slightly more pragmatic and less opinionated approach to achieving similar goals as Clean Architecture. Often, elements of both are combined, or one is used as a guiding philosophy.

### Question 8: How do you ensure testability when applying these architectural patterns in a Node.js application?
**Difficulty**: Advanced
**Category**: Testing

**Answer**: These architectural patterns inherently promote testability by enforcing separation of concerns and dependency inversion.

**Key Strategies**:
1.  **Isolation**: The core business logic (Domain and Use Cases/Application Services) is isolated from external frameworks, databases, and UI. This means you can unit test these critical parts without needing to set up complex infrastructure.
2.  **Dependency Inversion (DIP)**: High-level modules (Use Cases/Application Services) depend on abstractions (interfaces/ports), not concrete implementations (adapters/frameworks). This allows you to easily substitute real implementations with mock or stub implementations during testing.
    *   **Implementation in Node.js**: Use constructor injection to provide dependencies. For interfaces, rely on TypeScript interfaces or simply define the expected methods in JSDoc for JavaScript.
    ```javascript
    // application/services/UserService.js (depends on UserRepository interface)
    class UserService {
      constructor(userRepository) {
        this.userRepository = userRepository;
      }
      async createUser(userData) { /* ... */ }
    }

    // tests/application/services/UserService.test.js
    describe('UserService', () => {
      let userService;
      let mockUserRepository;

      beforeEach(() => {
        mockUserRepository = {
          findByEmail: jest.fn(),
          save: jest.fn(),
        };
        userService = new UserService(mockUserRepository);
      });

      it('should create a user if email is unique', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.save.mockResolvedValue({ id: '1', email: 'test@example.com' });

        const user = await userService.createUser({ email: 'test@example.com' });
        expect(user).toBeDefined();
        expect(mockUserRepository.save).toHaveBeenCalled();
      });
    });
    ```
3.  **Clear Boundaries**: Each layer or hexagon has a well-defined responsibility and API. This makes it easier to test each component independently or in small groups (integration tests).
4.  **Test Doubles**: Use mocks, stubs, and spies (e.g., with Jest) to control the behavior of dependencies during tests. Since dependencies are injected, they can be easily replaced.
5.  **Domain Events**: If using Domain-Driven Design, domain events can be captured and asserted in tests to ensure business logic is correctly emitting events.
6.  **Configuration Management**: Externalizing configuration prevents tests from relying on specific environment setups, making them more portable.

By adhering to these patterns, you build a codebase that is inherently designed for automated testing, leading to higher quality and more reliable applications.
