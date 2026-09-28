//Q1:
//The event loop is the mechanism that lets Node.js handle many asynchronous operations without creating a separate JavaScript thread for each one.
//It checks whether the call stack (main thread) is idle and then runs callbacks whose operations have completed,
//such as a timer callback or a completed http request.

//Q2:
//libuv is a C library used by Node.js to provide asynchronous input and output.
//It supports the event loop, handles operations such as timers, and provides a thread pool for certain tasks that cannot be handled asynchronously by the operating system.

//Q3:
//When JavaScript starts an asynchronous operation,
//Node.js hands it to the operating system or to libuv’s thread pool, depending on the operation.
//JavaScript can continue running while the operation is in progress.
//Once it finishes, its callback is placed in an appropriate queue. The event loop runs that callback when the call stack(main thread) is idle.

//Q4:
//Call stack: Holds the JavaScript functions currently being executed. Functions are added to the stack when called and removed when they finish.
//Event queue: Holds callbacks that are ready to run after asynchronous operations have completed.
//Event loop: Checks whether the call stack is idle and, if so, moves ready callbacks from the queues to the stack for execution.

//Q5:
//The thread pool is a group of worker threads managed by libuv.
//Node.js uses it for certain operations, including some file system tasks, cryptographic functions, and DNS lookups.
//Its default size is 4. You can set its size using the UV_THREADPOOL_SIZE environment variable before starting Node.js

//Q6:
//Non-blocking code starts an operation and allows JavaScript to continue while the operation runs. When it finishes,
//Node.js runs its callback or resumes the associated promise or async function.
//Blocking code keeps the JavaScript thread busy until the operation finishes.
//While it is blocked, the event loop cannot handle other JavaScript callbacks, which can delay other requests.