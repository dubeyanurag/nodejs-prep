---
title: "NestJS Framework: A Comprehensive Guide"
category: "nestjs"
difficulty: "intermediate"
estimatedReadTime: 30
tags: ["nestjs", "node-framework", "typescript", "architecture", "backend"]
lastUpdated: "2024-07-26"
---

# NestJS Framework: A Comprehensive Guide

## Introduction

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses modern JavaScript, is built with TypeScript (and fully supports it), and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

## Core Concepts

### Architecture Overview

NestJS is heavily inspired by Angular's architecture, providing a modular structure that encourages maintainability and scalability.

*   **Modules**: Organize code into logical units. Each application has at least one root module.
*   **Controllers**: Handle incoming requests and return responses. They define route handlers.
*   **Providers**: Services, repositories, factories, helpers, etc. Anything that can be injected into other classes.
    *   **Services**: Handle business logic and data manipulation.
*   **Decorators**: Special type of declaration that can be attached to classes, methods, properties, or parameters.
*   **Middleware**: Functions that execute before route handlers. Similar to Express.js middleware.
*   **Pipes**: Transform input data and validate it.
*   **Guards**: Determine if a request should be handled by the route handler. Used for authentication and authorization.
*   **Interceptors**: Allow you to bind extra logic before or after method execution.

## Getting Started

### Installation

```bash
npm i -g @nestjs/cli
nest new project-name
cd project-name
npm run start:dev
```

### Basic Controller

```typescript
// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### Basic Service (Provider)

```typescript
// src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

### Basic Module

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Advanced Concepts

### Dependency Injection

NestJS has a powerful dependency injection system. Providers are automatically resolved and injected where needed.

```typescript
// Example: injecting a service into a controller
// app.controller.ts
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // AppService is injected
}
```

### Custom Decorators

You can create custom decorators to reduce boilerplate or add specific logic.

```typescript
// src/common/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // Assuming user is attached by an auth guard

    return data ? user?.[data] : user;
  },
);

// Usage in controller
// @Get('profile')
// getProfile(@User('firstName') firstName: string) {
//   return `Hello, ${firstName}`;
// }
```

### Guards

Guards are executed before the route handler. They are primarily used for authentication and authorization.

```typescript
// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator'; // Custom decorator for roles

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
```

### Pipes

Pipes transform the input data or validate it.

```typescript
// src/common/pipes/parse-int.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed: A number is expected');
    }
    return val;
  }
}

// Usage in controller
// @Get(':id')
// findOne(@Param('id', ParseIntPipe) id: number) {
//   return `Found item with ID: ${id}`;
// }
```

### Interceptors

Interceptors are special classes that allow you to bind extra logic before or after method execution. They can:
*   Transform the result returned from a function.
*   Intercept an exception.
*   Extend the basic request/response cycle behavior.
*   Override a function completely.

```typescript
// src/common/interceptors/logging.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    console.log(`Request to ${req.method} ${req.url} started...`);

    return next
      .handle()
      .pipe(
        tap(() => console.log(`Request to ${req.method} ${req.url} finished in ${Date.now() - now}ms`)),
      );
  }
}

// Usage in controller or globally
// @UseInterceptors(LoggingInterceptor)
// @Get()
// findAll() { /* ... */ }
```

### Exception Filters

Exception filters are a way to catch unhandled exceptions that occur within your application and format the error response.

```typescript
// src/common/exceptions/http-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message || 'Internal server error',
      });
  }
}

// Usage in controller or globally
// @UseFilters(HttpExceptionFilter)
// @Get('error')
// throwError() {
//   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
// }
```

### Custom Providers

Beyond services, NestJS allows creating custom providers for flexible dependency injection, such as value providers, factory providers, or non-class-based providers.

```typescript
// src/constants.ts
export const APP_CONFIG = 'APP_CONFIG';

// src/config.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: any };

  constructor() {
    this.envConfig = {
      PORT: process.env.PORT || 3000,
      DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/test',
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}

// src/app.module.ts (using factory provider)
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService, APP_CONFIG } from './config.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    ConfigService,
    {
      provide: APP_CONFIG, // Custom injection token
      useFactory: (configService: ConfigService) => {
        return {
          port: configService.get('PORT'),
          databaseUrl: configService.get('DATABASE_URL'),
        };
      },
      inject: [ConfigService],
    },
    AppService,
  ],
})
export class AppModule {}

// Usage in another service/controller
// import { Inject } from '@nestjs/common';
// import { APP_CONFIG } from './constants';
// constructor(@Inject(APP_CONFIG) private readonly appConfig: { port: number, databaseUrl: string }) {}
```

### WebSockets (Socket.io / WebSockets)

NestJS provides a robust way to build real-time applications using WebSockets, abstracting away the underlying WebSocket library (e.g., Socket.io or native WebSockets).

```typescript
// src/events/events.gateway.ts
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(@MessageBody() data: string): void {
    this.server.emit('msgToClient', data); // Broadcast to all connected clients
    console.log(`Message received: ${data}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() room: string, client: Socket): void {
    client.join(room);
    client.emit('joinedRoom', room);
    console.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('msgToRoom')
  handleMessageToRoom(@MessageBody() data: { room: string; message: string }): void {
    this.server.to(data.room).emit('msgToClient', data.message);
    console.log(`Message "${data.message}" sent to room: ${data.room}`);
  }
}
```

### Microservices

NestJS has first-class support for building microservices using various transport layers (TCP, Redis, Kafka, NATS, gRPC, MQTT).

```typescript
// main.ts (for a microservice)
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });
  await app.listen();
  console.log('Microservice is listening on port 3001');
}
bootstrap();

// user.controller.ts (in a client application)
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  @Get()
  getHello(): Observable<string> {
    return this.client.send<string>({ cmd: 'get_hello' }, 'Hello from client');
  }
}

// app.module.ts (in a client application)
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
    ]),
  ],
  controllers: [UserController],
})
export class AppModule {}
```

### GraphQL Integration

NestJS provides powerful integration with GraphQL, allowing you to build type-safe GraphQL APIs using code-first or schema-first approaches.

```typescript
// src/app.module.ts (GraphQL setup)
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthorsResolver } from './authors/authors.resolver';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [
    AuthorsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Code-first approach
      sortSchema: true,
      playground: true, // Enable GraphQL Playground for testing
    }),
  ],
})
export class AppModule {}

// src/authors/authors.resolver.ts
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Author } from './models/author.model';
import { AuthorsService } from './authors.service';

@Resolver(of => Author)
export class AuthorsResolver {
  constructor(private authorsService: AuthorsService) {}

  @Query(returns => Author)
  async author(@Args('id') id: number) {
    return this.authorsService.findOneById(id);
  }

  @Query(returns => [Author])
  async authors() {
    return this.authorsService.findAll();
  }
}

// src/authors/models/author.model.ts
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Author {
  @Field(type => Int)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(type => [String])
  posts: string[];
}
```

## Testing Strategies for NestJS Applications

NestJS provides robust testing utilities that facilitate unit, integration, and end-to-end testing.

### Unit Testing Providers (Services)

```typescript
// src/app.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return "Hello World!"', () => {
    expect(service.getHello()).toBe('Hello World!');
  });
});
```

### Integration Testing Controllers

```typescript
// src/app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('AppController (e2e)', () => { // Often called e2e but acts as integration here
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### End-to-End Testing (E2E)

Typically involves the full application stack, including HTTP requests and database interactions. Tools like Supertest (used above) or Cypress can be used. For database interactions, often a test database is used, or transactions are rolled back after each test.

## Interview Questions & Answers

### Question 1: What are the main building blocks of a NestJS application?
**Difficulty**: Intermediate
**Category**: Architecture

**Answer**: The main building blocks are:
*   **Modules**: Organize components.
*   **Controllers**: Handle HTTP requests.
*   **Providers (Services)**: Encapsulate business logic.
*   **Middleware**: Functions executed during the request-response cycle.
*   **Pipes**: Transform and validate data.
*   **Guards**: Handle authentication and authorization.
*   **Interceptors**: Bind extra logic before/after method execution.

### Question 2: How does NestJS leverage TypeScript?
**Difficulty**: Intermediate
**Category**: TypeScript Integration

**Answer**: NestJS is built from the ground up with TypeScript. It uses TypeScript's features like decorators extensively for defining modules, controllers, providers, and other architectural elements. This provides strong typing throughout the application, enabling better code quality, maintainability, and tooling.

### Question 3: Explain the role of Guards and Interceptors in NestJS.
**Difficulty**: Intermediate
**Category**: Core Concepts

**Answer**:
*   **Guards**: Execute before a route handler. They determine whether a given request should be handled by the route or not, primarily used for authentication and authorization. They implement the `CanActivate` interface.
    ```typescript
    // Example: AuthGuard checking for a valid token
    import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
    
    @Injectable()
    export class AuthGuard implements CanActivate {
      canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        // Logic to validate token from request.headers.authorization
        return request.headers.authorization === 'Bearer valid_token';
      }
    }
    // Usage: @UseGuards(AuthGuard)
    ```
*   **Interceptors**: Allow you to bind extra logic before or after method execution. They can:
    *   Transform the result returned from a function.
    *   Intercept and transform an exception.
    *   Extend the basic request/response cycle behavior.
    *   Override a function completely.
    Interceptors implement the `NestInterceptor` interface and use RxJS observables.
    ```typescript
    // Example: Transform response data
    import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
    import { Observable } from 'rxjs';
    import { map } from 'rxjs/operators';
    
    @Injectable()
    export class TransformInterceptor implements NestInterceptor {
      intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map(data => ({ data }))); // Wrap response in { data: ... }
      }
    }
    // Usage: @UseInterceptors(TransformInterceptor)
    ```

### Question 4: How would you structure a large NestJS application to promote modularity and maintainability?
**Difficulty**: Advanced
**Category**: Architecture

**Answer**: For large NestJS applications, a modular and feature-based structure is highly recommended.

1.  **Feature Modules**: Organize code by domain or feature. Each module (`UserModule`, `ProductModule`, `OrderModule`) should encapsulate its own controllers, services, repositories, DTOs, etc. This promotes cohesion and loose coupling.
    ```
    src/
    ├── app.module.ts
    ├── main.ts
    ├── common/          // Shared utilities, decorators, filters
    │   ├── filters/
    │   ├── guards/
    │   ├── interceptors/
    │   └── utils/
    ├── modules/         // Feature-based modules
    │   ├── users/
    │   │   ├── users.module.ts
    │   │   ├── users.controller.ts
    │   │   ├── users.service.ts
    │   │   ├── users.repository.ts // Data access
    │   │   ├── dto/
    │   │   └── entities/
    │   ├── products/
    │   │   ├── products.module.ts
    │   │   ├── products.controller.ts
    │   │   └── products.service.ts
    │   └── orders/
    ```
2.  **Shared Modules**: Create dedicated modules for common functionalities that are used across multiple features (e.g., `AuthModule`, `DatabaseModule`, `ConfigModule`). These should be imported into feature modules as needed.
3.  **Monorepo Strategy**: For very large applications or multiple related services, consider a monorepo (e.g., using Nx or Lerna) to manage multiple NestJS applications and libraries within a single repository.
4.  **Clear Folder Structure**: Maintain a consistent and logical folder structure within each module.
5.  **Dependency Injection**: Leverage NestJS's DI system for loose coupling between components.
6.  **Configuration**: Centralize application configuration and use environment variables.

### Question 5: How does NestJS support building microservices, and what transport layers can it use?
**Difficulty**: Advanced
**Category**: Microservices

**Answer**: NestJS provides first-class support for building microservices, making it easy to create distributed applications. It abstracts away the complexities of inter-service communication and allows developers to focus on business logic.

**Key Features for Microservices**:
*   **Declarative Syntax**: Use decorators (`@MessagePattern`, `@EventPattern`) to define message handlers.
*   **Client Proxies**: Automatically generate client proxies to communicate with microservices, simplifying RPC calls.
*   **Interceptors/Guards/Filters**: Apply existing NestJS features to microservice communication.

**Supported Transport Layers**: NestJS supports various transport layers, allowing flexibility based on project needs:
*   **TCP**: Simple, low-overhead communication (default).
*   **Redis**: For message-based communication, leveraging Redis's Pub/Sub capabilities.
*   **Kafka**: For high-throughput, fault-tolerant event streaming.
*   **NATS**: A high-performance messaging system for microservices, IoT, and distributed systems.
*   **gRPC**: For high-performance, language-agnostic RPC communication, especially useful with polyglot microservices.
*   **MQTT**: For IoT and low-bandwidth networks.

**Example (TCP Microservice):**
```typescript
// main.ts (Microservice A)
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: { port: 3001 },
  });
  await app.listen();
  console.log('Microservice A is listening');
}
bootstrap();

// SomeService.ts (in Microservice A)
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class MathController {
  @MessagePattern({ cmd: 'add' })
  accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
  }
}

// Client (e.g., in Microservice B or a Gateway)
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('math')
export class MathClientController {
  constructor(@Inject('MATH_SERVICE') private client: ClientProxy) {}

  @Get('add')
  addNumbers(): Observable<number> {
    const numbers = [1, 2, 3, 4, 5];
    return this.client.send({ cmd: 'add' }, numbers); // Sends 'add' command with data
  }
}

// Client Module (app.module.ts for MathClientController)
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MathClientController } from './math-client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
    ]),
  ],
  controllers: [MathClientController],
})
export class AppModule {}
```
### Question 6: How do you handle validation and transformation of incoming data in NestJS?
**Difficulty**: Intermediate
**Category**: Data Handling

**Answer**: NestJS uses Pipes for validation and transformation of incoming data. Pipes are classes annotated with `@Injectable()` that implement the `PipeTransform` interface.

**Key Features**:
*   **Validation Pipes**: Automatically validate incoming request data (e.g., DTOs) against a schema using libraries like `class-validator` and `class-transformer`.
*   **Transformation Pipes**: Transform incoming data to a desired format (e.g., converting string IDs to numbers, parsing dates).

**Example (Validation Pipe with `class-validator`):**
```typescript
// src/users/dto/create-user.dto.ts
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// src/users/users.controller.ts
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true })) // Enable validation and transformation
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

### Question 7: Describe NestJS's testing utilities and how they facilitate different types of tests.
**Difficulty**: Advanced
**Category**: Testing

**Answer**: NestJS provides a testing module (`@nestjs/testing`) that simplifies setting up the application context for different types of tests (unit, integration, end-to-end).

1.  **Unit Testing**: For isolated components (e.g., services, providers) without their dependencies. The testing module allows mocking dependencies.
    ```typescript
    // src/users/users.service.spec.ts
    import { Test, TestingModule } from '@nestjs/testing';
    import { UsersService } from './users.service';
    import { UserRepository } from './users.repository'; // Assume this is a provider

    describe('UsersService', () => {
      let service: UsersService;
      let userRepository: UserRepository;

      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            UsersService,
            {
              provide: UserRepository, // Mock UserRepository
              useValue: {
                create: jest.fn(),
                findAll: jest.fn(),
              },
            },
          ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get<UserRepository>(UserRepository);
      });

      it('should be defined', () => {
        expect(service).toBeDefined();
      });

      it('should create a user', async () => {
        const createUserDto = { name: 'Test User', email: 'test@example.com', password: 'password' };
        jest.spyOn(userRepository, 'create').mockResolvedValueOnce({ id: '1', ...createUserDto });

        const result = await service.create(createUserDto);
        expect(result.name).toEqual('Test User');
        expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      });
    });
    ```

2.  **Integration Testing**: Tests a slice of the application, including multiple interconnected components (e.g., a controller and its service, or a module). It creates a partial application context.
    ```typescript
    // src/users/users.controller.spec.ts (Integration test for controller-service interaction)
    import { Test, TestingModule } from '@nestjs/testing';
    import { INestApplication } from '@nestjs/common';
    import * as request from 'supertest';
    import { UsersModule } from './users.module'; // Import the feature module

    describe('UsersController (Integration)', () => {
      let app: INestApplication;
      let usersService: UsersService; // You can inject and spy on real services

      beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [UsersModule], // Import the actual module
        }).compile();

        app = moduleFixture.createNestApplication();
        usersService = moduleFixture.get<UsersService>(UsersService);
        await app.init();
      });

      it('/users (POST) should create a user', async () => {
        jest.spyOn(usersService, 'create').mockResolvedValueOnce({
          id: 'mock-id',
          name: 'Integration User',
          email: 'integration@example.com',
        });

        return request(app.getHttpServer())
          .post('/users')
          .send({ name: 'Integration User', email: 'integration@example.com', password: 'password' })
          .expect(201)
          .expect({ id: 'mock-id', name: 'Integration User', email: 'integration@example.com' });
      });

      afterEach(async () => {
        await app.close();
      });
    });
    ```

3.  **End-to-End (E2E) Testing**: Tests the entire application flow, typically from HTTP request to database response. It creates a full application instance. Tools like Supertest or Cypress are commonly used.
    ```typescript
    // src/app.e2e-spec.ts (Full E2E test with Supertest)
    import { Test, TestingModule } from '@nestjs/testing';
    import { INestApplication } from '@nestjs/common';
    import * as request from 'supertest';
    import { AppModule } from './app.module';

    describe('AppController (e2e)', () => {
      let app: INestApplication;

      beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
      });

      it('/ (GET)', () => {
        return request(app.getHttpServer())
          .get('/')
          .expect(200)
          .expect('Hello World!');
      });

      it('/users (POST) should create a user', async () => {
        const createUserDto = { name: 'E2E User', email: 'e2e@example.com', password: 'e2ePassword' };
        return request(app.getHttpServer())
          .post('/users')
          .send(createUserDto)
          .expect(201)
          .then(response => {
            expect(response.body.name).toEqual('E2E User');
            expect(response.body.email).toEqual('e2e@example.com');
            // Assuming the service returns the created user object
          });
      });

      afterAll(async () => {
        await app.close();
      });
    });
    ```
