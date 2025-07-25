---
title: "TypeScript Fundamentals: A Comprehensive Guide"
category: "typescript"
difficulty: "beginner"
estimatedReadTime: 30
tags: ["typescript", "javascript", "static-typing", "interfaces", "types"]
lastUpdated: "2024-07-26"
---

# TypeScript Fundamentals: A Comprehensive Guide

## Introduction

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It offers static type checking, which can catch errors early in development, improve code readability, and enhance developer tooling.

## Core Concepts

### Why TypeScript?

*   **Catch Errors Early**: Type checking at compile time reduces runtime errors.
*   **Improved Readability**: Types make code easier to understand and maintain.
*   **Better Tooling**: Enhanced autocompletion, refactoring, and navigation in IDEs.
*   **Scalability**: Helps manage complexity in large applications.

### Basic Types

TypeScript supports all standard JavaScript types, plus a few additional ones.

```typescript
// Boolean
let isDone: boolean = false;

// Number
let decimal: number = 6;
let hex: number = 0xf00d;

// String
let color: string = "blue";

// Array
let list: number[] = [1, 2, 3];
let genericList: Array<number> = [1, 2, 3];

// Tuple (fixed number of elements of known types)
let x: [string, number];
x = ["hello", 10];

// Enum (friendly names to sets of numeric values)
enum Color { Red, Green, Blue }
let c: Color = Color.Green;

// Any (opt-out of type checking)
let notSure: any = 4;
notSure = "maybe a string instead";

// Void (for functions returning nothing)
function warnUser(): void {
    console.log("This is a warning message");
}

// Null and Undefined
let u: undefined = undefined;
let n: null = null;

// Never (for functions that never return)
function error(message: string): never {
    throw new Error(message);
}

// Object (for non-primitive types)
let obj: object = { name: "Alice" };
```

## Interfaces

Interfaces are powerful ways to define contracts within your code and for external code. They define the shape of objects.

```typescript
interface Person {
  firstName: string;
  lastName: string;
  age?: number; // Optional property
  readonly id: number; // Readonly property
}

function greet(person: Person) {
  console.log(`Hello, ${person.firstName} ${person.lastName}!`);
}

let user: Person = { firstName: "John", lastName: "Doe", id: 123 };
greet(user);
```

## Classes

TypeScript supports classes with public, private, and protected modifiers, along with interfaces and inheritance.

```typescript
class Animal {
  private name: string;

  constructor(theName: string) {
    this.name = theName;
  }

  public move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
  bark() {
    console.log('Woof! Woof!');
  }
}

let dog = new Dog('Buddy');
dog.bark();
dog.move(10);
```

## Functions

You can add types to function parameters and return values.

```typescript
function add(x: number, y: number): number {
  return x + y;
}

const multiply = (x: number, y: number): number => x * y;
```

## Generics

Generics provide a way to create reusable components that can work with a variety of types, rather than a single one.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("myString"); // type of output1 is string
let output2 = identity<number>(100);     // type of output2 is number
```

## Type Inference

TypeScript can often infer types on its own, reducing the need for explicit type annotations.

```typescript
let x = 3; // TypeScript infers 'x' is of type 'number'
let y = [0, 1, null]; // TypeScript infers 'y' is of type '(number | null)[]'
```

## Union and Intersection Types

*   **Union Types**: A variable can be one of several types (e.g., `string | number`).
*   **Intersection Types**: Combines multiple types into one (e.g., `TypeA & TypeB`).

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
printId(101);
printId("202");

interface A { a: number; }
interface B { b: string; }
type C = A & B; // C has properties 'a' (number) and 'b' (string)
```

## Interview Questions & Answers

### Question 1: What is TypeScript and what are its benefits?
**Difficulty**: Junior
**Category**: Fundamentals

**Answer**: TypeScript is a superset of JavaScript that adds static typing. Its benefits include catching errors early during development (compile-time), improving code maintainability and readability, and providing better developer tooling (autocompletion, refactoring).

### Question 2: Explain the difference between an `interface` and a `type` in TypeScript.
**Difficulty**: Intermediate
**Category**: Types

**Answer**: Both `interface` and `type` are used to define the shape of objects.
*   **`interface`**: Can be implemented by classes, can be extended by other interfaces, and can be merged (declaration merging). Preferred for defining public APIs.
*   **`type`**: More flexible, can define union types, intersection types, tuple types, and map types. Cannot be implemented by classes or merged.
