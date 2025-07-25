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
