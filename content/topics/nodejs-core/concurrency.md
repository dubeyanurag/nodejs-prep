---
title: "Concurrency and Parallelism in Node.js"
category: "nodejs-core"
difficulty: "advanced"
estimatedReadTime: 30
tags: ["concurrency", "parallelism", "cluster", "child-process", "worker-threads", "nodejs-core"]
lastUpdated: "2024-07-26"
---

# Concurrency and Parallelism in Node.js

## Introduction

Node.js is single-threaded by nature, handling concurrency through its event loop. However, for CPU-bound tasks, Node.js provides mechanisms like the `Cluster` module, `Child Process` module, and `Worker Threads` to achieve parallelism and better utilize multi-core processors.

## Child Process Module

The `child_process` module allows you to spawn child processes, which can run external commands or separate Node.js scripts. This is useful for offloading CPU-intensive tasks or interacting with system commands.

### `spawn()`

`spawn()` launches a new process with a given command. It streams data (stdout, stderr) and is suitable for commands that return a large amount of data.

```javascript
const { spawn } = require('child_process');

const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

### `exec()`

`exec()` runs a command in a shell and buffers the output. It is suitable for commands that return small amounts of data.

```javascript
const { exec } = require('child_process');

exec('find . -type f | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`Number of files: ${stdout}`);
});
```

### `fork()`

`fork()` is a special case of `spawn()` that creates new Node.js processes. These child processes communicate with the parent via an IPC (Inter-Process Communication) channel. It's ideal for running multiple instances of your Node.js application or offloading long-running tasks.

```javascript
// parent.js
const { fork } = require('child_process');
const child = fork('./child.js');

child.on('message', (message) => {
  console.log('Message from child:', message);
});

child.send({ hello: 'world' });

// child.js
process.on('message', (message) => {
  console.log('Message from parent:', message);
  process.send({ foo: 'bar' });
});
```

### Deeper Dive into IPC (Inter-Process Communication)

Child processes and worker threads in Node.js provide various mechanisms for inter-process communication (IPC), allowing them to exchange data and coordinate tasks.

#### 1. Message Passing (`.send()` and `on('message')`)

This is the primary method for `fork()`'d processes and `worker_threads` to communicate. Data is serialized and deserialized, meaning complex objects (like functions or Promises) cannot be directly passed, but structured data (JSON-serializable objects) can.

```javascript
// parent.js
const { fork } = require('child_process');
const child = fork('./child.js');

child.on('message', (message) => {
  console.log('Parent received message:', message); // { response: 'pong' }
});

child.send({ command: 'ping', data: { value: 123 } }); // Send data to child
```

```javascript
// child.js
process.on('message', (message) => {
  console.log('Child received message:', message); // { command: 'ping', data: { value: 123 } }
  process.send({ response: 'pong' }); // Send data back to parent
});
```

#### 2. Streams (`.stdin`, `.stdout`, `.stderr`)

For `spawn()`'d processes, communication is typically done via standard I/O streams. This is suitable for large amounts of data or when interacting with external programs.

```javascript
const { spawn } = require('child_process');

// Parent writes to child's stdin, child writes to parent's stdout
const child = spawn('node', ['-e', 'process.stdin.on("data", d => process.stdout.write(d.toString().toUpperCase()))']);

child.stdout.on('data', (data) => {
  console.log(`Child stdout: ${data}`); // CHILD STDOUT: HELLO WORLD
});

child.stdin.write('hello world');
child.stdin.end();
```

#### 3. Shared Memory (for `worker_threads` with `SharedArrayBuffer`)

`worker_threads` can share memory directly using `SharedArrayBuffer` and `Atomics` operations. This is highly efficient for CPU-bound tasks that need to read/write to the same data structure, but requires careful synchronization to avoid race conditions.

```javascript
// main.js (part of worker_threads example)
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  const sharedBuffer = new SharedArrayBuffer(4); // 4 bytes for an Int32
  const sharedArray = new Int32Array(sharedBuffer);
  sharedArray[0] = 0; // Initial value

  const worker = new Worker(__filename, {
    workerData: { sharedBuffer }
  });

  worker.on('message', (msg) => {
    if (msg === 'done') {
      console.log('Main thread: Final value in shared array:', sharedArray[0]); // Expected: 100
    }
  });

  console.log('Main thread: Initial value in shared array:', sharedArray[0]);
} else {
  // worker.js (part of worker_threads example)
  const { parentPort, workerData } = require('worker_threads');
  const sharedArray = new Int32Array(workerData.sharedBuffer);

  for (let i = 0; i < 100; i++) {
    // Atomically increment the value to avoid race conditions
    Atomics.add(sharedArray, 0, 1);
  }
  parentPort.postMessage('done');
}
```

### Error Handling in Multi-Process/Thread Applications

Managing errors in concurrent Node.js applications is crucial for stability.

#### 1. Child Process Errors

*   **`error` event**: Emitted if the process could not be spawned, or killed.
*   **`exit` event**: Emitted when the child process exits. Provides the `code` and `signal`.
*   **`stderr` stream**: Capture error output from the child process.

```javascript
const { spawn } = require('child_process');

const child = spawn('nonexistent-command'); // This will emit an 'error' event

child.on('error', (err) => {
  console.error('Failed to start child process:', err);
});

child.stderr.on('data', (data) => {
  console.error(`Child stderr: ${data}`);
});

child.on('exit', (code, signal) => {
  if (code !== 0) {
    console.warn(`Child process exited with code ${code} and signal ${signal}`);
  }
});
```

#### 2. Worker Thread Errors

*   **`error` event**: Emitted when an uncaught exception is thrown in the worker thread.
*   **`exit` event**: Emitted when the worker thread exits.
*   **Message-based errors**: Workers can explicitly send error objects back to the parent.

```javascript
// main.js (parent thread)
const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, {
    eval: true,
    workerData: '{"shouldError": true}' // Pass data to worker
  });

  worker.on('message', (msg) => {
    if (msg.type === 'error') {
      console.error('Worker reported error:', msg.error);
    }
  });

  worker.on('error', (err) => {
    console.error('Uncaught error in worker thread:', err); // Catches exceptions from worker
  });

  worker.on('exit', (code) => {
    if (code !== 0)
      console.error(`Worker exited with non-zero code: ${code}`);
  });
} else {
  // worker.js (worker thread)
  const { parentPort, workerData } = require('worker_threads');
  const data = JSON.parse(workerData);

  try {
    if (data.shouldError) {
      throw new Error('Something went wrong in the worker!');
    }
    parentPort.postMessage('Operation successful');
  } catch (error) {
    // Send error message back to parent
    parentPort.postMessage({ type: 'error', error: error.message });
  }
}
```

#### 3. Graceful Shutdown

Implement graceful shutdown procedures to ensure all pending tasks are completed and resources are released when a process is terminated. This is especially important for `cluster` workers and long-running `child_process` instances.

```javascript
// Example: Graceful shutdown for an Express app in a Cluster worker
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

let connections = new Set();

server.on('connection', connection => {
  connections.add(connection);
  connection.on('close', () => connections.delete(connection));
});

process.on('SIGTERM', () => {
  console.log('Worker received SIGTERM signal. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed. Closing remaining connections...');
    // Destroy remaining open connections
    for (const connection of connections) {
      connection.destroy();
    }
    console.log('All connections closed. Worker exiting.');
    process.exit(0);
  });

  // Force close connections after a timeout
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000); // 10 seconds timeout
});

server.listen(8000, () => {
  console.log(`Worker ${process.pid} listening on port 8000`);
});
```

## Cluster Module

The `cluster` module allows you to create child processes that share server ports. This enables Node.js applications to take full advantage of multi-core systems, improving performance and reliability.

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    // Optional: fork a new worker if one dies
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

## Worker Threads

`worker_threads` module enables the use of threads that execute JavaScript in parallel. Unlike child processes, worker threads share memory (via SharedArrayBuffer), making them efficient for CPU-bound tasks that require shared data access.

```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  console.log('This is the main thread');
  const worker = new Worker(__filename, {
    workerData: { num: 10 }
  });

  worker.on('message', (result) => {
    console.log(`Result from worker: ${result}`);
  });

  worker.on('error', (err) => {
    console.error(err);
  });

  worker.on('exit', (code) => {
    if (code !== 0)
      console.error(`Worker stopped with exit code ${code}`);
  });
} else {
  console.log('This is a worker thread');
  // Simulate a CPU-intensive task
  let counter = 0;
  for (let i = 0; i < workerData.num; i++) {
    counter += i;
  }
  parentPort.postMessage(counter);
}
```

## Performance Benchmarking

When dealing with concurrency, it's crucial to measure the performance impact. Tools like Node.js's built-in `perf_hooks` module, `benchmark.js`, or simple `console.time`/`console.timeEnd` can help.

```javascript
const { performance, PerformanceObserver } = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach(entry => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
  obs.disconnect();
});
obs.observe({ type: 'measure' });

async function runBenchmark() {
  performance.mark('startHeavyTask');
  // Simulate a heavy CPU-bound task
  let sum = 0;
  for (let i = 0; i < 1e7; i++) {
    sum += i;
  }
  performance.mark('endHeavyTask');
  performance.measure('Heavy Task Duration', 'startHeavyTask', 'endHeavyTask');
  console.log('Task completed, sum:', sum);
}

runBenchmark();
```

## Advanced Use Cases

### 1. Image Processing with Worker Threads

Offloading image manipulation to worker threads to keep the main event loop free.

```javascript
// main.js
const { Worker, isMainThread } = require('worker_threads');
const path = require('path');

if (isMainThread) {
  const imagePath = path.join(__dirname, 'input.jpg'); // Assume input.jpg exists
  const worker = new Worker(path.join(__dirname, 'image_worker.js'), {
    workerData: { imagePath }
  });

  worker.on('message', (msg) => {
    if (msg.status === 'success') {
      console.log(`Image processed: ${msg.outputPath}`);
    } else {
      console.error(`Image processing failed: ${msg.error}`);
    }
  });

  worker.on('error', (err) => {
    console.error('Worker error:', err);
  });
}

// image_worker.js
// (Requires 'sharp' or similar library to be installed: npm install sharp)
const { parentPort, workerData } = require('worker_threads');
const sharp = require('sharp');
const path = require('path');

async function processImage() {
  try {
    const { imagePath } = workerData;
    const outputPath = path.join(path.dirname(imagePath), `output_${Date.now()}.jpg`);

    await sharp(imagePath)
      .resize(200, 200)
      .grayscale()
      .toFile(outputPath);

    parentPort.postMessage({ status: 'success', outputPath });
  } catch (error) {
    parentPort.postMessage({ status: 'error', error: error.message });
  }
}

processImage();
```

### 2. Distributed Task Queue with Child Processes

Using child processes to manage and execute tasks from a queue.

```javascript
// task_queue_manager.js (main process)
const { fork } = require('child_process');
const path = require('path');

const workers = [];
const taskQueue = ['task1', 'task2', 'task3', 'task4', 'task5'];

function createWorker() {
  const worker = fork(path.join(__dirname, 'task_worker.js'));
  workers.push(worker);

  worker.on('message', (msg) => {
    if (msg.status === 'ready' && taskQueue.length > 0) {
      const task = taskQueue.shift();
      worker.send({ type: 'process_task', task });
      console.log(`Manager: Assigned ${task} to worker ${worker.pid}`);
    } else if (msg.status === 'completed') {
      console.log(`Manager: Worker ${worker.pid} completed ${msg.task}`);
      if (taskQueue.length > 0) {
        const task = taskQueue.shift();
        worker.send({ type: 'process_task', task });
        console.log(`Manager: Assigned ${task} to worker ${worker.pid}`);
      } else {
        worker.send({ type: 'exit' });
        worker.kill(); // Terminate worker if no more tasks
      }
    }
  });

  worker.on('exit', (code) => {
    console.log(`Manager: Worker ${worker.pid} exited with code ${code}`);
    // Handle worker crashes: potentially re-queue task or spawn new worker
  });

  worker.send({ type: 'init' });
}

// Start a few workers
for (let i = 0; i < 2; i++) {
  createWorker();
}
```

```javascript
// task_worker.js (child process)
process.on('message', async (msg) => {
  if (msg.type === 'init') {
    process.send({ status: 'ready' });
  } else if (msg.type === 'process_task') {
    console.log(`Worker ${process.pid}: Processing task ${msg.task}`);
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500)); // Simulate work
    process.send({ status: 'completed', task: msg.task });
  } else if (msg.type === 'exit') {
    console.log(`Worker ${process.pid}: Exiting.`);
    process.exit(0);
  }
});
```

## When to Use Which?

*   **`child_process` (spawn/exec)**:
    *   **Use Case**: Running external system commands, simple scripts, or when you need to interact with other programs (e.g., ImageMagick, FFMPEG).
    *   **Considerations**: High overhead for process creation, communication via streams.
*   **`child_process` (fork)**:
    *   **Use Case**: Spawning multiple Node.js processes that need to communicate via IPC, like offloading specific tasks from a main server process.
    *   **Considerations**: Each `forked` process has its own isolated memory space.
*   **`cluster`**:
    *   **Use Case**: Distributing incoming network connections across multiple Node.js processes (workers) to scale a server application across CPU cores.
    *   **Considerations**: Best for I/O-bound tasks that share a single port.
*   **`worker_threads`**:
    *   **Use Case**: Performing CPU-bound tasks that can benefit from parallelism and shared memory (e.g., heavy computations, data processing).
    *   **Considerations**: Lower overhead than `fork` for CPU-bound tasks, but care must be taken with shared memory access.

## Interview Questions & Answers

### Question 1: Explain the difference between `fork()` and `spawn()` in Node.js.
**Difficulty**: Intermediate
**Category**: Concurrency

**Answer**:
*   `spawn()`: Used to launch a new process with a given command. It streams data and is suitable for commands that return a large amount of data.
*   `fork()`: A special case of `spawn()` that creates new Node.js processes. These child processes communicate with the parent via an IPC channel and are ideal for offloading long-running tasks within a Node.js application.

### Question 2: When would you use Node.js `worker_threads` over the `cluster` module?
**Difficulty**: Advanced
**Category**: Concurrency

**Answer**:
*   **`worker_threads`**: Best for CPU-bound tasks that require parallel execution within the same Node.js application and can benefit from shared memory. Examples include heavy computations, image processing, or data compression.
*   **`cluster` module**: Best for scaling a Node.js server application across multiple CPU cores to handle more concurrent client connections, especially for I/O-bound tasks. Each worker runs independently and shares the server port.

### Question 3: How does Node.js achieve concurrency despite being single-threaded?
**Difficulty**: Intermediate
**Category**: Concurrency

**Answer**: Node.js achieves concurrency through its event-driven, non-blocking I/O model, powered by the Event Loop. While JavaScript execution is single-threaded, time-consuming operations (like I/O, network requests, file system operations) are offloaded to the underlying C++ libraries (libuv) and executed asynchronously. Once these operations complete, their callbacks are placed in the event queue and processed by the single JavaScript thread when it's free. This allows Node.js to handle many concurrent connections without creating a new thread for each one.

### Question 4: Describe a scenario where `fork()` would be more appropriate than `spawn()`.
**Difficulty**: Intermediate
**Category**: Child Processes

**Answer**: `fork()` is a special case of `spawn()` specifically designed for spawning new Node.js processes. It's more appropriate when you need to:
1.  **Spawn another Node.js script**: `fork()` sets up an IPC channel automatically, allowing easy message exchange between parent and child Node.js processes.
2.  **Offload a long-running Node.js task**: If you have a CPU-bound task written in Node.js that would block the event loop, `fork()` can run it in a separate process, communicating results back via IPC.
3.  **Build a multi-process Node.js application**: `fork()` is the basis for the `Cluster` module, enabling a single Node.js application to leverage multiple CPU cores.

`spawn()` is more general-purpose, used for running any external command (Node.js or otherwise) where you primarily need to stream data via standard I/O, not necessarily exchange structured messages.

### Question 5: When might you use `SharedArrayBuffer` with `worker_threads`, and what are the considerations?
**Difficulty**: Advanced
**Category**: Worker Threads

**Answer**: You would use `SharedArrayBuffer` with `worker_threads` when you need to perform CPU-bound tasks that require **direct, efficient sharing of memory** between the main thread and worker threads. This avoids the overhead of copying data back and forth via message passing (`postMessage`).

**Use Cases**:
*   Heavy numerical computations (e.g., scientific simulations, complex calculations)
*   Image or audio processing where raw pixel/sample data needs to be manipulated in parallel
*   Implementing custom data structures that can be accessed concurrently by multiple threads

**Considerations**:
*   **Synchronization**: `SharedArrayBuffer` alone is not enough; you must use `Atomics` operations (e.g., `Atomics.add`, `Atomics.compareExchange`) to ensure proper synchronization and prevent race conditions when multiple threads access the same memory location. Without `Atomics`, concurrent writes can lead to data corruption.
*   **Complexity**: Shared memory programming is inherently more complex and error-prone than message passing. Debugging race conditions can be very challenging.
*   **Data Types**: `SharedArrayBuffer` works with typed arrays (e.g., `Int32Array`, `Float64Array`). You cannot directly share arbitrary JavaScript objects.
*   **Security**: `SharedArrayBuffer` has security implications (e.g., Spectre vulnerability), which led to its initial disabling in browsers. In Node.js, it's generally safe within a trusted environment.

### Question 6: How would you handle graceful shutdown in a `cluster` module application?
**Difficulty**: Advanced
**Category**: Cluster Module

**Answer**: Graceful shutdown in a `cluster` application ensures that existing requests are completed and resources are released before a worker process exits.

**Steps for graceful shutdown:**
1.  **Master receives signal (e.g., `SIGTERM`)**: The master process should listen for termination signals.
2.  **Master stops accepting new connections**: Prevent new requests from being routed to workers that are shutting down.
3.  **Master notifies workers to shut down**: Send a message (e.g., `process.send('shutdown')`) to each worker.
4.  **Workers stop accepting new connections**: Workers should close their HTTP server (e.g., `server.close()`) to stop accepting new connections.
5.  **Workers wait for active connections to drain**: The `server.close()` method allows existing connections to finish. Workers can also track active connections to ensure all are closed.
6.  **Workers exit**: Once all connections are drained (or after a timeout), the worker calls `process.exit()`.
7.  **Master replaces dead workers**: The master should listen for the `exit` event from workers and, for graceful shutdowns, should *not* immediately fork a new worker to replace it. For unexpected exits, it should fork a new one.

**Example Master (simplified):**
```javascript
if (cluster.isMaster) {
  process.on('SIGTERM', () => {
    console.log('Master received SIGTERM. Initiating graceful shutdown...');
    for (const id in cluster.workers) {
      cluster.workers[id].send('shutdown');
      cluster.workers[id].disconnect(); // Stop accepting new connections
    }
    setTimeout(() => {
      console.log('All workers disconnected. Exiting master.');
      process.exit(0);
    }, 5000); // Give workers 5 seconds to exit
  });
}
```

**Example Worker (simplified, also seen in "Error Handling" section):**
```javascript
const server = http.createServer((req, res) => { /* ... */ });
let connections = new Set();
server.on('connection', connection => {
  connections.add(connection);
  connection.on('close', () => connections.delete(connection));
});

process.on('message', (msg) => {
  if (msg === 'shutdown') {
    console.log(`Worker ${process.pid} received shutdown signal.`);
    server.close(() => {
      console.log(`Worker ${process.pid} HTTP server closed.`);
      // Optionally wait for connections.size === 0
      for (const conn of connections) {
        conn.destroy(); // Force close if needed
      }
      process.exit(0);
    });
  }
});
```

### Question 7: Explain the concept of "sticky sessions" with Node.js `cluster` and when it's necessary.
**Difficulty**: Advanced
**Category**: Cluster Module

**Answer**: Sticky sessions (or session affinity) ensure that requests from a particular client (e.g., identified by their IP address or a session cookie) are always routed to the *same worker process* in a Node.js `cluster`.

**Why it's necessary**:
By default, the `cluster` module distributes incoming connections to workers using a round-robin approach. This is usually fine for stateless applications. However, for stateful applications that store session data directly in the worker's memory (e.g., Express sessions without a distributed store like Redis), a client's subsequent requests might land on a different worker that doesn't have their session data, leading to authentication issues or lost user state. Sticky sessions prevent this by "sticking" a client to a specific worker.

**How it's achieved**:
The `cluster` module's master process can implement a load balancing strategy that hashes the incoming connection's source IP address (or a custom identifier) to consistently select the same worker.

**Example (pseudo-code for master):**
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

const workers = {}; // Map to store workers by ID or hash

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    workers[worker.id] = worker;
  }

  // This is a simplified example; real-world solutions use more robust hashing
  // and manage worker lifecycle changes. Node.js's built-in cluster has a
  // basic sticky-session mode that can be enabled.
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (${signal || code}). Forking a new one...`);
    delete workers[worker.id];
    cluster.fork(); // Replace dead worker
  });

  // This part is handled internally by Node.js's cluster module
  // when using its built-in load balancing. You generally don't implement
  // this low-level routing yourself unless building a custom load balancer.
  // The master process's job is to distribute new connections to workers.
  // Node.js's cluster module offers a 'SCHED_RR' (round-robin, default)
  // and 'SCHED_NONE' (let OS handle it). A true IP-hash sticky session
  // requires external load balancers or custom implementation.
} else {
  // Worker processes listen for connections
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from Worker ${process.pid}!\n`);
  }).listen(8000);
  console.log(`Worker ${process.pid} started`);
}
```

**Alternatives**:
For true sticky sessions, especially in production, it's often better to use an external load balancer (like Nginx, HAProxy, AWS ALB) that supports IP-hash or cookie-based sticky sessions, or to store session data in a distributed, external store (like Redis or a database) that all workers can access. This makes workers stateless and simplifies horizontal scaling.
