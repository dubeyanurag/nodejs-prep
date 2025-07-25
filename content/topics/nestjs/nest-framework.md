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
