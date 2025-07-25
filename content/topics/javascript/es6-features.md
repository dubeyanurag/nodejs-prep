---
title: "Key ES6+ Features for Modern JavaScript"
category: "javascript"
difficulty: "beginner"
estimatedReadTime: 25
tags: ["es6", "let", "const", "arrow-functions", "template-literals", "destructuring", "spread-operator", "rest-parameters", "modules"]
lastUpdated: "2024-07-26"
---

# Key ES6+ Features for Modern JavaScript

## Introduction

ES6 (ECMAScript 2015) brought a host of new features to JavaScript that have become standard in modern development. This guide covers some of the most important ones.

## `let` and `const`

`let` and `const` are block-scoped variable declarations, which offer more control over variable scope than the function-scoped `var`.

*   **`let`**: Declares a block-scoped variable that can be reassigned.
*   **`const`**: Declares a block-scoped variable that cannot be reassigned. For objects and arrays, the contents can be modified, but the variable cannot be reassigned to a new object or array.

```javascript
let a = 1;
a = 2; // Allowed

const b = 1;
// b = 2; // TypeError: Assignment to constant variable.

const obj = { name: 'Alice' };
obj.name = 'Bob'; // Allowed
// obj = {}; // TypeError
```

## Arrow Functions

Arrow functions provide a more concise syntax for writing function expressions. They do not have their own `this`, `arguments`, `super`, or `new.target`.

```javascript
const add = (a, b) => a + b;
```

## Template Literals

Template literals allow for embedded expressions and multi-line strings.

```javascript
const name = 'World';
const greeting = `Hello, ${name}!`;
console.log(greeting); // "Hello, World!"
```

## Destructuring Assignment

Destructuring allows you to unpack values from arrays or properties from objects into distinct variables.

```javascript
// Object Destructuring
const person = { firstName: 'John', lastName: 'Doe' };
const { firstName, lastName } = person;
console.log(firstName); // "John"

// Array Destructuring
const [x, y] = [1, 2];
console.log(x); // 1
```

## Spread Operator (`...`)

The spread operator allows an iterable (like an array) to be expanded in places where zero or more arguments or elements are expected.

```javascript
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }
```

## Rest Parameters (`...`)

Rest parameters allow a function to accept an indefinite number of arguments as an array.

```javascript
function sum(...numbers) {
  return numbers.reduce((acc, current) => acc + current, 0);
}

console.log(sum(1, 2, 3)); // 6
```

## Default Parameters

You can provide default values for function parameters.

```javascript
function greet(name = 'Guest') {
  console.log(`Hello, ${name}`);
}

greet(); // "Hello, Guest"
greet('Alice'); // "Hello, Alice"
```

## Modules (import/export)

ES6 introduced a standard module system for JavaScript.

```javascript
// lib.js
export const pi = 3.14;
export default function sayHi() {
  console.log('Hi');
}

// main.js
import sayHi, { pi } from './lib.js';
sayHi(); // "Hi"
console.log(pi); // 3.14
```

## Interview Questions & Answers

### Question 1: What's the difference between `let`, `const`, and `var`?
**Difficulty**: Junior
**Category**: Core Concepts

**Answer**: 
*   **`var`**: Function-scoped, can be redeclared and updated.
*   **`let`**: Block-scoped, cannot be redeclared but can be updated.
*   **`const`**: Block-scoped, cannot be redeclared or updated.

### Question 2: Explain the difference between the spread operator and rest parameters.
**Difficulty**: Junior
**Category**: Core Concepts

**Answer**: Both use the `...` syntax, but they are used in different contexts. The **spread operator** "expands" an iterable into individual elements. **Rest parameters** "collect" multiple elements and "condense" them into a single array.
