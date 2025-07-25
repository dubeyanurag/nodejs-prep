---
title: "Recursion in JavaScript"
category: "javascript"
difficulty: "intermediate"
estimatedReadTime: 20
tags: ["recursion", "algorithms", "functions", "javascript-core"]
lastUpdated: "2024-07-26"
---

# Recursion in JavaScript

## Introduction

Recursion is a powerful programming technique where a function calls itself to solve a problem. It's an alternative to iteration and is particularly useful for problems that can be broken down into smaller, self-similar subproblems.

## Core Concepts

### What is Recursion?

A recursive function is a function that calls itself until it reaches a "base case" — a condition that stops the recursion. Without a base case, a recursive function would call itself indefinitely, leading to a stack overflow error.

### The Call Stack

Understanding the call stack is crucial for understanding recursion. Each time a function is called, a new frame is pushed onto the call stack. When the function returns, its frame is popped off the stack. In recursion, many frames for the same function are pushed onto the stack.

## Code Examples

### Factorial

The factorial of a non-negative integer `n` is the product of all positive integers less than or equal to `n`.

```javascript
// Iterative approach
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Recursive approach
function factorialRecursive(n) {
  if (n === 0) {
    return 1; // Base case
  }
  return n * factorialRecursive(n - 1); // Recursive step
}

console.log(factorialRecursive(5)); // Output: 120
```

### Fibonacci Sequence

The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones.

```javascript
function fibonacci(n) {
  if (n < 2) {
    return n; // Base cases
  }
  return fibonacci(n - 1) + fibonacci(n - 2); // Recursive step
}

console.log(fibonacci(7)); // Output: 13
```
*Note: This is an inefficient way to calculate Fibonacci numbers due to repeated calculations. Memoization can be used to optimize it.*

## Real-World Applications

### Traversing Tree-like Structures

Recursion is ideal for traversing nested data structures like file systems, DOM trees, or JSON objects.

```javascript
const fileSystem = {
  name: 'root',
  type: 'folder',
  children: [
    { name: 'file1.txt', type: 'file' },
    {
      name: 'folder1',
      type: 'folder',
      children: [{ name: 'file2.txt', type: 'file' }]
    }
  ]
};

function findFile(node, fileName) {
  if (node.type === 'file' && node.name === fileName) {
    return node;
  }
  if (node.type === 'folder') {
    for (const child of node.children) {
      const found = findFile(child, fileName);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

console.log(findFile(fileSystem, 'file2.txt'));
```

## Common Pitfalls

### Stack Overflow

If the base case is not reached or is incorrect, the recursion will continue until the call stack's memory is exhausted, resulting in a stack overflow.

### Performance

Recursive solutions can be less performant than iterative ones due to the overhead of function calls. In some cases, tail-call optimization can help, but it's not supported in all JavaScript environments.

## Interview Questions & Answers

### Question 1: What is the difference between recursion and iteration?
**Difficulty**: Junior
**Category**: Core Concepts

**Answer**: Recursion is when a function calls itself, while iteration uses loops (like `for` or `while`) to repeat a block of code. Recursion can lead to more readable code for certain problems but may have higher memory consumption due to the call stack.

### Question 2: What is a base case in recursion?
**Difficulty**: Junior
**Category**: Core Concepts

**Answer**: A base case is a condition within a recursive function that stops the recursion. It's the simplest instance of the problem that can be solved directly. Without a base case, the function would call itself infinitely.
