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

### Memoization for Performance Optimization

Memoization is an optimization technique used to speed up expensive function calls by caching their results. When a memoized function is called, it first checks if the results for the given inputs are already in the cache. If so, it returns the cached result; otherwise, it computes the result, stores it in the cache, and then returns it. This is particularly useful for recursive functions that repeatedly calculate the same subproblems (e.g., the naive Fibonacci implementation).

```javascript
// Fibonacci with Memoization (Top-Down Dynamic Programming)
function fibonacciMemoized(n, memo = {}) {
  if (n in memo) {
    return memo[n]; // Return cached result
  }
  if (n < 2) {
    return n; // Base cases
  }
  memo[n] = fibonacciMemoized(n - 1, memo) + fibonacciMemoized(n - 2, memo); // Store and recurse
  return memo[n];
}

console.log(fibonacciMemoized(7)); // Output: 13
console.log(fibonacciMemoized(50)); // Calculates much faster than naive recursive
```

### Advanced Recursive Algorithm Examples

#### Tower of Hanoi

A classic recursive problem involving moving disks between pegs.

```javascript
function towerOfHanoi(n, source, auxiliary, destination) {
  if (n === 1) {
    console.log(`Move disk 1 from ${source} to ${destination}`);
    return;
  }
  towerOfHanoi(n - 1, source, destination, auxiliary);
  console.log(`Move disk ${n} from ${source} to ${destination}`);
  towerOfHanoi(n - 1, auxiliary, source, destination);
}

// towerOfHanoi(3, 'A', 'B', 'C');
// Output for n=3:
// Move disk 1 from A to C
// Move disk 2 from A to B
// Move disk 1 from C to B
// Move disk 3 from A to C
// Move disk 1 from B to A
// Move disk 2 from B to C
// Move disk 1 from A to C
```

#### Permutations of a String

Generating all possible orderings of characters in a string.

```javascript
function getPermutations(str) {
  if (str.length <= 1) {
    return [str];
  }

  const permutations = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const remainingChars = str.slice(0, i) + str.slice(i + 1);

    for (const perm of getPermutations(remainingChars)) {
      permutations.push(char + perm);
    }
  }
  return permutations;
}

// console.log(getPermutations('abc'));
// Output: ['abc', 'acb', 'bac', 'bca', 'cab', 'cba']
```

#### Depth-First Search (DFS) on a Graph/Tree

Traversing a graph or tree by exploring as far as possible along each branch before backtracking.

```javascript
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

function dfs(node, visited = new Set()) {
  if (visited.has(node)) {
    return;
  }

  visited.add(node);
  console.log(node); // Process the node

  for (const neighbor of graph[node]) {
    dfs(neighbor, visited);
  }
}

// dfs('A');
// Output: A, B, D, E, F, C
```

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

### Question 3: How can you optimize recursive functions to prevent stack overflow and improve performance?
**Difficulty**: Advanced
**Category**: Optimization

**Answer**: Recursive functions can suffer from stack overflow errors due to excessive function calls on the call stack, and performance issues due to repeated computations.

**Optimization Strategies**:
1.  **Memoization (Dynamic Programming)**: Store the results of expensive function calls and return the cached result when the same inputs occur again. This is highly effective for problems with overlapping subproblems (e.g., Fibonacci sequence).
    ```javascript
    function fibonacciMemoized(n, memo = {}) {
      if (n in memo) {
        return memo[n];
      }
      if (n < 2) {
        return n;
      }
      memo[n] = fibonacciMemoized(n - 1, memo) + fibonacciMemoized(n - 2, memo);
      return memo[n];
    }
    ```
2.  **Iterative Conversion**: Many recursive problems can be rewritten iteratively using loops. This avoids call stack limitations and often improves performance.
    ```javascript
    // Iterative Factorial
    function factorialIterative(n) {
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    }
    ```
3.  **Tail Call Optimization (TCO)**: In some languages/environments, if a recursive call is the very last operation in a function (a "tail call"), the current stack frame can be reused, preventing stack growth. While ES6 specifies TCO, it's not widely implemented in JavaScript engines (V8, which Node.js uses, does not implement full TCO). So, relying on TCO in Node.js for deep recursion is not advisable.
4.  **Trampolines (for deep recursion without TCO)**: A pattern to turn a recursive function into an iterative one by having the function return another function (a "thunk") that wraps the next recursive call, instead of directly calling it. This prevents stack overflow but adds overhead.

### Question 4: Describe a real-world problem where recursion is a natural and elegant solution.
**Difficulty**: Intermediate
**Category**: Real-World Applications

**Answer**: Recursion is a natural and elegant solution for problems involving **tree-like or hierarchical data structures**, such as:
*   **Traversing a File System**: Walking through directories and subdirectories to find files or calculate total sizes.
*   **Parsing Nested JSON Objects/XML Documents**: Processing data structures with arbitrary depth.
*   **DOM Traversal**: Navigating the Document Object Model in web browsers.
*   **Graph Traversal Algorithms**: Implementing Depth-First Search (DFS) or Breadth-First Search (BFS) on graphs.
*   **Recursive Data Structures**: Operations on linked lists, trees (binary search trees, AVL trees), etc.

**Example: Flattening a Nested Array (DFS-like traversal)**
```javascript
function flattenArray(arr) {
  let flattened = [];
  arr.forEach(element => {
    if (Array.isArray(element)) {
      flattened = flattened.concat(flattenArray(element)); // Recursive call
    } else {
      flattened.push(element);
    }
  });
  return flattened;
}

const nestedArray = [1, [2, [3, 4]], 5, [6]];
console.log(flattenArray(nestedArray)); // Output: [1, 2, 3, 4, 5, 6]
```
Recursion often leads to more concise and understandable code for these types of problems, as the recursive structure directly mirrors the self-similar nature of the data.
