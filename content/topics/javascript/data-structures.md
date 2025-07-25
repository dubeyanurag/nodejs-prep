---
title: "Advanced JavaScript Data Structures"
category: "javascript"
difficulty: "intermediate"
estimatedReadTime: 20
tags: ["data-structures", "map", "set", "weakmap", "weakset", "javascript-core"]
lastUpdated: "2024-07-26"
---

# Advanced JavaScript Data Structures

## Introduction

ES6 introduced several new data structures that provide more efficient ways to handle collections of data. This guide covers `Set`, `Map`, `WeakSet`, and `WeakMap`.

## Set

A `Set` is a collection of unique values. You can store any type of value in a `Set`, whether primitive or object references.

### Key Features

*   **Uniqueness**: A value in the `Set` may only occur once.
*   **Order**: Elements are iterated in insertion order.
*   **Methods**: `add()`, `has()`, `delete()`, `clear()`, `size`.

### Code Example

```javascript
const mySet = new Set();

mySet.add(1);
mySet.add(5);
mySet.add(5); // This will be ignored
mySet.add('some text');

console.log(mySet.has(1));      // Output: true
console.log(mySet.size);        // Output: 3

mySet.delete(5);
console.log(mySet.size);        // Output: 2

for (const item of mySet) {
  console.log(item); // 1, "some text"
}
```

## Map

A `Map` is a collection of key-value pairs where both the keys and values can be of any type.

### Key Features

*   **Key Types**: Keys can be any value (including functions, objects, or any primitive).
*   **Order**: Keys are iterated in insertion order.
*   **Methods**: `set()`, `get()`, `has()`, `delete()`, `clear()`, `size`.

### Code Example

```javascript
const myMap = new Map();

const keyString = 'a string';
const keyObj = {};
const keyFunc = function() {};

myMap.set(keyString, "value associated with 'a string'");
myMap.set(keyObj, 'value associated with keyObj');
myMap.set(keyFunc, 'value associated with keyFunc');

console.log(myMap.get(keyString)); // "value associated with 'a string'"
console.log(myMap.size); // 3
```

## WeakMap

A `WeakMap` is similar to a `Map`, but it only holds "weak" references to its keys. This means that if there are no other references to a key object, it can be garbage collected.

### Key Features

*   **Keys**: Keys must be objects. Primitive values are not allowed.
*   **Weak References**: Keys are held weakly, allowing for garbage collection.
*   **Not Enumerable**: You cannot iterate over the keys or values of a `WeakMap`.

### Use Case: Caching

`WeakMap` is useful for caching data associated with an object, where you don't want the cache to prevent the object from being garbage collected.

```javascript
let obj = { name: 'Alice' };
const cache = new WeakMap();
cache.set(obj, { data: 'some cached data' });

// When obj is no longer used, it can be garbage collected
obj = null; 
// The entry in the cache will also be removed
```

## WeakSet

A `WeakSet` is similar to a `Set`, but it only holds "weak" references to its objects.

### Key Features

*   **Values**: Values must be objects.
*   **Weak References**: Objects are held weakly.
*   **Not Enumerable**: You cannot iterate over the values of a `WeakSet`.

### Use Case: Tracking Object References

`WeakSet` can be used to track a collection of objects without preventing them from being garbage collected.

```javascript
const activeUsers = new WeakSet();

class User {
  constructor(name) {
    this.name = name;
    activeUsers.add(this);
  }
}

let user1 = new User('Bob');
let user2 = new User('Charlie');

console.log(activeUsers.has(user1)); // true

user1 = null;
// user1 can now be garbage collected, and will be removed from the WeakSet
```

## Interview Questions & Answers

### Question 1: When would you use a `Map` over a plain `Object`?
**Difficulty**: Junior
**Category**: Core Concepts

**Answer**: Use a `Map` when you need to use non-string keys, want to maintain insertion order, or need to frequently add and remove key-value pairs (as `Map` can be more performant in such scenarios).

### Question 2: What is the main benefit of `WeakMap` over `Map`?
**Difficulty**: Mid-Level
**Category**: Application

**Answer**: The main benefit of `WeakMap` is that it allows for garbage collection of its keys if they are no longer referenced elsewhere in the program. This helps prevent memory leaks, especially in caching scenarios.
