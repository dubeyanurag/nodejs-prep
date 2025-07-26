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

## Advanced ES6+ Features

### Classes

Classes provide a cleaner and more organized way to create constructor functions and implement object-oriented programming concepts like inheritance.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call the parent class constructor
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks.`);
  }

  static info() {
    console.log('Dogs are loyal companions.');
  }
}

const myDog = new Dog('Buddy', 'Golden Retriever');
myDog.speak(); // Buddy barks.
Dog.info(); // Dogs are loyal companions.
```

### Promises

Promises provide a cleaner way to handle asynchronous operations, especially for chaining multiple asynchronous calls, avoiding "callback hell."
(For a deeper dive, refer to the [JavaScript Promises guide](../javascript/promises.md) and [Node.js Promises Async/Await guide](./promises-async-await.md)).

```javascript
const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
};

fetchData('https://api.example.com/data')
  .then(data => console.log('Data fetched:', data))
  .catch(error => console.error('Error fetching:', error));
```

### Generators

Generators are functions that can be paused and resumed, yielding (producing) a sequence of values. They are defined using `function*` and use the `yield` keyword.

```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
```

### Iterators (`for...of`)

Iterators are objects that define a sequence and a return value upon its termination. The `for...of` loop works with any iterable object.

```javascript
const myIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
};

for (const value of myIterable) {
  console.log(value); // 1, 2, 3
}
```

### Proxy

The `Proxy` object allows you to create an object that can be used in place of the original object, but which can intercept and redefine fundamental operations for that object (e.g., property lookup, assignment, enumeration, function invocation).

```javascript
const target = {
  message1: 'hello',
  message2: 'world'
};

const handler = {
  get: function(target, prop, receiver) {
    if (prop === 'message2') {
      return 'Intercepted world';
    }
    return Reflect.get(target, prop, receiver);
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.message1); // hello
console.log(proxy.message2); // Intercepted world
```

### Reflect

`Reflect` is a built-in object that provides methods for interceptable JavaScript operations. It's often used with `Proxy` to forward operations to the original object.

```javascript
const obj = { a: 1 };
Object.defineProperty(obj, 'b', { value: 2 });

const proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    console.log(`Getting property: ${prop}`);
    return Reflect.get(target, prop, receiver);
  }
});

console.log(proxy.a); // Getting property: a -> 1
console.log(proxy.b); // Getting property: b -> 2
```

### Symbols

Symbols are unique and immutable primitive values that can be used as keys for object properties. They are often used to define well-known symbols or to create private-like properties.

```javascript
const sym1 = Symbol('description');
const sym2 = Symbol('description');

console.log(sym1 === sym2); // false (unique)

const obj = {
  [sym1]: 'value for sym1',
  property: 'regular property'
};

console.log(obj[sym1]); // value for sym1
console.log(obj.property); // regular property
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

### Question 3: How do `async/await` and Promises simplify asynchronous JavaScript?
**Difficulty**: Intermediate
**Category**: Asynchronous JavaScript

**Answer**:
*   **Promises**: Provide a structured way to handle asynchronous operations, representing a value that may be available now, in the future, or never. They chain `.then()` for success and `.catch()` for errors, avoiding "callback hell."
*   **`async/await`**: Built on top of Promises, `async/await` provides syntactic sugar that allows asynchronous code to be written and read in a synchronous-like, linear fashion. An `async` function implicitly returns a Promise, and `await` pauses the execution of the `async` function until a Promise settles, making the code cleaner and easier to debug.

**Example**:
```javascript
// Promise-based
function fetchDataPromise(url) {
  return fetch(url).then(response => response.json());
}

fetchDataPromise('https://api.example.com/data')
  .then(data => console.log('Promise data:', data))
  .catch(error => console.error('Promise error:', error));

// Async/await
async function fetchDataAsync(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Async/await data:', data);
  } catch (error) {
    console.error('Async/await error:', error);
  }
}
fetchDataAsync('https://api.example.com/data');
```

### Question 4: What are JavaScript Generators and what are their use cases?
**Difficulty**: Advanced
**Category**: Generators

**Answer**: Generators are special functions that can be paused and resumed. They are defined using `function*` and use the `yield` keyword to produce a sequence of values (an iterable). Each `yield` pauses the generator's execution, and `next()` resumes it.

**Use Cases**:
*   **Lazy Evaluation**: Generate sequences of values on demand, saving memory.
*   **Asynchronous Flow Control**: Can be used with Promises to manage asynchronous operations in a more synchronous-looking way (though `async/await` is now preferred).
*   **Implementing Iterators**: Easily create custom iterators for complex data structures.
*   **Infinite Sequences**: Generate sequences that theoretically never end (e.g., an infinite ID generator).

**Example**:
```javascript
function* fibonacciGenerator() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b]; // Destructuring assignment for swapping values
  }
}

const fibGen = fibonacciGenerator();
console.log(fibGen.next().value); // 0
console.log(fibGen.next().value); // 1
console.log(fibGen.next().value); // 1
console.log(fibGen.next().value); // 2
```

### Question 5: Explain `Proxy` and `Reflect` in ES6+. How do they work together?
**Difficulty**: Advanced
**Category**: Metaprogramming

**Answer**:
*   **`Proxy`**: An object that "wraps" another object (the `target`) and intercepts fundamental operations performed on it, such as property lookups, assignments, function calls, etc. These interceptions are defined by a `handler` object. `Proxy` allows you to customize or extend the behavior of objects.
*   **`Reflect`**: A built-in object that provides methods for interceptable JavaScript operations. It's not a constructor and its methods are static. `Reflect` methods are typically used inside `Proxy` handlers to forward operations to the original target object, ensuring the default behavior is preserved while allowing custom logic.

**How they work together**: `Proxy` intercepts operations, and `Reflect` performs the default operation on the target. This pattern ensures that the proxy behaves correctly as a substitute for the target object while allowing custom behavior to be injected.

**Example**:
```javascript
const user = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30
};

const userProxy = new Proxy(user, {
  get(target, prop, receiver) {
    console.log(`Accessing property: ${String(prop)}`);
    if (prop === 'fullName') {
      return `${target.firstName} ${target.lastName}`;
    }
    return Reflect.get(target, prop, receiver); // Forward to original object
  },
  set(target, prop, value, receiver) {
    console.log(`Setting property: ${String(prop)} to ${value}`);
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be a number.');
    }
    return Reflect.set(target, prop, value, receiver); // Forward to original object
  }
});

console.log(userProxy.firstName); // Accessing property: firstName -> John
console.log(userProxy.fullName);  // Accessing property: fullName -> John Doe

try {
  userProxy.age = 'thirty'; // Setting property: age to thirty
} catch (e) {
  console.error(e.message); // Age must be a number.
}
```
