---
title: "A Guide to Loops in JavaScript"
category: "javascript"
difficulty: "beginner"
estimatedReadTime: 15
tags: ["loops", "for", "while", "for-of", "for-in", "javascript-core"]
lastUpdated: "2024-07-26"
---

# A Guide to Loops in JavaScript

## Introduction

Loops are used in JavaScript to perform repeated tasks based on a condition. This guide covers the most common types of loops.

## `for` Loop

The `for` loop is the most common type of loop. It consists of three parts: initialization, condition, and final expression.

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}
```

## `while` Loop

The `while` loop continues as long as a specified condition is true.

```javascript
let i = 0;
while (i < 5) {
  console.log(i); // 0, 1, 2, 3, 4
  i++;
}
```

## `do...while` Loop

The `do...while` loop is similar to the `while` loop, but it will always execute at least once, even if the condition is false.

```javascript
let i = 5;
do {
  console.log(i); // 5
  i++;
} while (i < 5);
```

## `for...in` Loop

The `for...in` loop iterates over the enumerable properties of an object.

```javascript
const person = { name: 'Alice', age: 25 };
for (const key in person) {
  console.log(`${key}: ${person[key]}`);
  // name: Alice
  // age: 25
}
```

**Caution**: It's not recommended to use `for...in` to iterate over arrays because the order of iteration is not guaranteed.

## `for...of` Loop

The `for...of` loop, introduced in ES6, iterates over iterable objects like arrays, strings, maps, and sets.

```javascript
const colors = ['red', 'green', 'blue'];
for (const color of colors) {
  console.log(color); // red, green, blue
}
```

## Interview Questions & Answers

### Question 1: What is the difference between `for...in` and `for...of`?
**Difficulty**: Junior
**Category**: Core Concepts

**Answer**: `for...in` iterates over the *keys* (or property names) of an object. `for...of` iterates over the *values* of an iterable object. `for...of` is generally preferred for arrays and other iterables.

### Question 2: Can you use `const` in a `for` loop?
**Difficulty**: Junior
**Category**: Core Concepts

**Answer**: You can use `const` in a `for...of` or `for...in` loop, as a new binding is created for each iteration. However, you cannot use `const` in a traditional `for` loop's initialization if the final expression modifies the variable (e.g., `i++`).
