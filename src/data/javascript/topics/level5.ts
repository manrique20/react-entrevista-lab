import { JsTopic } from '@/types/javascript';

export const level5Topics: JsTopic[] = [
  {
    "id": "P44",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "How does the event loop work?",
    "shortAnswer": "JavaScript is single-threaded: it executes a single thread of synchronous instructions on the **Call Stack**. Asynchronous tasks are delegated to runtime Web APIs (or libuv in Node.js); upon completion, their callbacks are queued. The **Event Loop** continuously monitors the Call Stack: once it is completely empty, it processes **all microtasks** with absolute priority and then takes **one macrotask** from the task queue.",
    "explanation": `Step-by-step lifecycle of the Event Loop in the browser:

1. **The Call Stack:**
Executes synchronous code line by line using a LIFO (Last In, First Out) stack structure. Until the Call Stack empties, nothing else can run on the main thread.

2. **Runtime APIs (Web APIs / Libuv):**
I/O operations, network requests (\`fetch\`), timers (\`setTimeout\`), and user events (\`click\`) do not run within the JavaScript thread: they are handled by browser engine background threads.

3. **The Two Execution Queues:**
- **Microtask Queue (Absolute Priority):** Contains callbacks from \`Promise.then/catch/finally\`, \`queueMicrotask()\`, and \`MutationObserver\`. It is drained completely (even if new microtasks are scheduled during draining) before yielding control.
- **Macrotask / Task Queue:** Contains callbacks from \`setTimeout\`, \`setInterval\`, \`setImmediate\`, and network/file I/O. Only ONE macrotask is processed per loop iteration.

4. **Browser Render Phase:**
Occurs between draining the microtask queue and picking the next macrotask (typically synchronized to 60Hz/120Hz display refresh rates via \`requestAnimationFrame\`).`,
    "codeSnippet": "// Runtime priority hierarchy:\n// 1. Call Stack (synchronous)\n// 2. Microtask Queue (all pending promises)\n// 3. Render / DOM repaint if scheduled\n// 4. Macrotask Queue (1 callback from setTimeout / I/O)",
    "seniorTip": "Starvation trap: because the engine processes microtasks until the queue is completely drained before yielding to the next macrotask or DOM rendering, infinitely chaining promises or microtasks (queueMicrotask) will freeze the browser UI entirely (UI starvation), preventing user clicks or page repaints.",
    "tags": [
      "level-5",
      "event-loop",
      "javascript",
      "asynchrony"
    ],
    "interactiveDemo": "event-loop"
  },
  {
    "id": "P45",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "What is the difference between microtasks and macrotasks? What does this log?",
    "shortAnswer": "**Microtasks** originate from Promises (`.then()`, `async/await`), `queueMicrotask`, and `MutationObserver`; they have maximum priority and are completely drained before any repaint or next macrotask. **Macrotasks** originate from `setTimeout`, `setInterval`, I/O, and DOM events; the Event Loop executes only **one macrotask per cycle**, checking and draining the microtask queue after each one.",
    "explanation": `Step-by-step breakdown of the output \`1, 5, 3, 4, 2\`:

1. \`console.log('1')\`: Immediate synchronous execution → Logs **1**.
2. \`setTimeout(..., 0)\`: Registers a timer in Web APIs. Expiring immediately, its callback is enqueued into the **Macrotask Queue**.
3. \`Promise.resolve().then(...)\`: The promise is already fulfilled; its callback is enqueued into the **Microtask Queue**.
4. \`queueMicrotask(...)\`: Added directly to the **Microtask Queue**.
5. \`console.log('5')\`: Immediate synchronous execution → Logs **5**.
6. **Call Stack becomes empty:** The Event Loop inspects the Microtask Queue and drains it in FIFO order → Logs **3**, then **4**.
7. **No microtasks remain:** The Event Loop advances and takes the first macrotask from the Macrotask Queue → Logs **2**.`,
    "codeSnippet": "console.log('1');\nsetTimeout(() => console.log('2'), 0);          // macrotask\nPromise.resolve().then(() => console.log('3')); // microtask\nqueueMicrotask(() => console.log('4'));         // microtask\nconsole.log('5');\n// Output: 1 5 3 4 2",
    "seniorTip": "In a technical interview, if asked 'Why does Promise.resolve().then(f) run before setTimeout(f, 0)?', do not answer vaguely with 'because it is faster.' Specify: 'Because the HTML5 event loop specification mandates a strict microtask checkpoint drain before picking the next task from the macrotask queue.'",
    "tags": [
      "level-5",
      "javascript",
      "event-loop",
      "microtasks"
    ],
    "interactiveDemo": "event-loop"
  },
  {
    "id": "P46",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "What is a Promise and what are its states?",
    "shortAnswer": "A **Promise** is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. It exists in one of 3 mutually exclusive states: **pending**, **fulfilled** (resolved with a value), or **rejected** (rejected with a reason). Once **settled**, its state and value become immutable.",
    "explanation": `Guarantees and architecture of the \`Promise\` object (ES6):

1. **Lifecycle States:**
- **\`pending\`:** Initial state; operation has not yet completed.
- **\`fulfilled\`:** Operation succeeded; resolved with a value via \`resolve(value)\`.
- **\`rejected\`:** Operation failed; rejected with an error or reason via \`reject(reason)\`.
- **\`settled\`:** Umbrella term for \`fulfilled\` or \`rejected\`; once settled, subsequent calls to \`resolve\` or \`reject\` have no effect.

2. **Promise Chaining & Composition:**
- Every call to \`.then()\`, \`.catch()\`, or \`.finally()\` returns a **new, independent Promise**.
- If a \`.then()\` callback returns a value, the new promise fulfills with that value.
- If it returns another promise, the new promise adopts the state and value of that inner promise (promise flattening).
- If it throws an exception (\`throw new Error()\`), the new promise enters the \`rejected\` state and jumps to the nearest \`.catch()\`.`,
    "codeSnippet": "const wait = (ms) => new Promise((resolve, reject) => {\n  if (ms < 0) return reject(new Error('Negative time is not allowed'));\n  setTimeout(() => resolve(`Completed in ${ms}ms`), ms);\n});\n\nwait(500)\n  .then((msg) => { console.log(msg); return 42; })   // return feeds into next then\n  .then((num) => console.log('Received:', num))\n  .catch((err) => console.error('Error:', err.message))\n  .finally(() => console.log('Operation completed'));",
    "seniorTip": "Clarify that the executor function passed to new Promise((resolve, reject) => { ... }) runs completely synchronously on the Call Stack. What is asynchronous are the callbacks subscribed via .then() or .catch(), which get dispatched to the Microtask Queue.",
    "tags": [
      "level-5",
      "javascript",
      "promises",
      "async"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P47",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "What is `async/await` and how are errors handled?",
    "shortAnswer": "`async/await` is syntactic sugar over Promises that enables writing asynchronous code with sequential, readable syntax. Any function declared with `async` **always returns a Promise**, and `await` pauses the internal execution of that function until the promise settles, allowing errors to be caught using standard synchronous `try/catch` blocks.",
    "explanation": `Mechanics and common pitfalls with \`async/await\`:

1. **Internal Mechanics (Generators + Promises):**
Under the hood, \`async/await\` is equivalent to a generator function (\`function*\`) combined with a promise iterator. When encountering an \`await\`, the function suspends execution, yields the main thread to the Event Loop, and resumes as a microtask when the promise settles.

2. **Error Handling with \`try/catch/finally\`:**
- Any promise rejection in an \`await\` expression transforms into a standard exception that triggers the \`catch\` block.
- If an \`async\` function lacks a \`try/catch\` and a promise rejects, the function returns a rejected promise that must be caught with \`.catch()\` by the caller.

3. **The #1 \`fetch\` interview trap:**
\`fetch()\` **does NOT reject its promise** on HTTP error codes like 404, 401, or 500; it only rejects on physical network failures or DNS errors. Checking \`if (!res.ok) throw new Error(...)\` is mandatory.`,
    "codeSnippet": "async function loadUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);   // fetch does NOT reject on 404/500\n    return await res.json();\n  } catch (error) {\n    console.error('Loading failed:', error);\n    throw error;                                          // re-throw if caller must handle it\n  } finally {\n    hideSpinner();\n  }\n}",
    "seniorTip": "The Go pattern in modern TypeScript/JavaScript: to avoid deeply nested try/catch blocks everywhere, many senior developers use a helper wrapper: const to = (p) => p.then(d => [null, d]).catch(e => [e, null]); const [err, user] = await to(fetchUser(id));",
    "tags": [
      "async",
      "level-5",
      "javascript",
      "await",
      "errors"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P48",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "What is the difference between `Promise.all`, `allSettled`, `race`, and `any`?",
    "shortAnswer": "`Promise.all` waits for **all** promises to fulfill or rejects immediately on the **first rejection** (*fail-fast*). `allSettled` waits until **all promises settle**, regardless of fulfillment or rejection. `race` fulfills or rejects with the **first promise that settles**. `any` fulfills with the **first fulfilled promise** and rejects only if **all promises reject** (with an `AggregateError`).",
    "explanation": `Comparison of static \`Promise\` combinators:

| Combinator | Resolution Condition | Rejection Condition | Typical Use Case |
|---|---|---|---|
| \`Promise.all\` | All fulfill successfully (array of results) | **Fail-fast:** A single promise rejects | Dependent parallel requests (e.g., user profile + permissions) |
| \`Promise.allSettled\` | **All complete** (fulfilled or rejected) | **Never rejects** | Independent operations where you need the final status of each |
| \`Promise.race\` | The **first to settle**, whether success or failure | The first to settle was a rejection | Request timeout implementations |
| \`Promise.any\` | The **first to fulfill successfully** | **All reject** (returns an \`AggregateError\`) | Querying redundant mirror servers or CDNs |

Response structure of \`allSettled\`:
Each array element is an object: \`{ status: 'fulfilled', value: T }\` or \`{ status: 'rejected', reason: any }\`.`,
    "codeSnippet": "const [user, posts] = await Promise.all([getUser(), getPosts()]);\n\nconst results = await Promise.allSettled([a(), b(), c()]);\nresults.forEach((r) => r.status === 'fulfilled' ? handleSuccess(r.value) : logError(r.reason));\n\n// Elegant timeout with race\nconst withTimeout = (promise, ms) =>\n  Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);",
    "seniorTip": "If you use Promise.all and one promise rejects, the other promises keep running in the background in the browser or server (they are not automatically cancelled). To actually abort orphaned in-flight network requests, combine them with an AbortController.",
    "tags": [
      "promise",
      "level-5",
      "javascript",
      "combinators"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P49",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "How do you run tasks in parallel vs. sequential order with `await`?",
    "shortAnswer": "To run tasks in **sequence** (one after another), use a `for...of` loop with `await`, which is necessary when each step depends on the previous result. To run tasks in **parallel** (concurrently), kick off all promises simultaneously with `Promise.all` or `map`, drastically reducing total execution time.",
    "explanation": `Latency and production architecture comparison:

1. **Sequential Execution (Total time = sum of all tasks):**
\`\`\`js
// If each task takes 1 second, total time = 3 seconds
const user = await getUser();
const posts = await getPosts(user.id);
const comments = await getComments(posts[0].id);
\`\`\`
Indispensable when cascading data dependencies exist (*waterfall*).

2. **Parallel Execution (Total time = duration of slowest task):**
\`\`\`js
// Both tasks launch concurrently: total time = max(1s, 1s) = 1s
const [products, categories] = await Promise.all([
  fetchProducts(),
  fetchCategories()
]);
\`\`\`

3. **The pitfall of starting promises inside loops:**
\`\`\`js
// SEQUENTIAL:
for (const id of ids) { await processItem(id); }

// PARALLEL (fires all and awaits completion):
await Promise.all(ids.map(id => processItem(id)));
\`\`\``,
    "codeSnippet": "// Sequential: takes ~2s (second waits for first to finish)\nconst a = await task1(); // 1s\nconst b = await task2(); // 1s\n\n// Parallel: takes ~1s (started concurrently)\nconst [a2, b2] = await Promise.all([task1(), task2()]);\n\n// In arrays:\nfor (const id of ids) await processItem(id);           // Sequential\nawait Promise.all(ids.map((id) => processItem(id)));    // Parallel",
    "seniorTip": "Beware of unbounded concurrency: running Promise.all(ids.map(...)) on an array of 10,000 items will saturate the browser network connection pool (limit of 6 TCP sockets per domain) or crash your backend database. For massive collections, use a concurrency-limiting pool (such as p-limit).",
    "tags": [
      "level-5",
      "javascript",
      "concurrency",
      "async"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P50",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "Why does `await` inside `forEach` not work as expected?",
    "shortAnswer": "`Array.prototype.forEach` does not await promises because its internal implementation is synchronous: it invokes the callback but **completely ignores any return value**, including returned promises. If you pass an `async` function, callbacks fire concurrently without being awaited, and the code following `forEach` executes immediately.",
    "explanation": `Analysis of \`forEach\` mechanics and how to resolve it:

1. **Why it fails:**
The internal implementation of \`forEach\` is conceptually:
\`\`\`js
for (let i = 0; i < array.length; i++) {
  callback(array[i], i, array); // Does not await this callback!
}
\`\`\`
When marking the callback as \`async\`, it returns a \`Promise\`, but \`forEach\` discards it. The enclosing function immediately continues its synchronous execution.

2. **Solution 1: When you need sequential execution:**
Use a standard \`for...of\` loop:
\`\`\`js
for (const item of items) {
  await processItem(item);
}
\`\`\`

3. **Solution 2: When you need concurrent execution:**
Use \`.map()\` combined with \`Promise.all()\`:
\`\`\`js
await Promise.all(items.map(async (item) => {
  await processItem(item);
}));
\`\`\``,
    "codeSnippet": "async function bad(ids) {\n  ids.forEach(async (id) => { await save(id); });\n  console.log('done'); // Prints BEFORE saves complete!\n}\n\nasync function good(ids) {\n  for (const id of ids) await save(id);          // Correct sequential\n  // or in parallel: await Promise.all(ids.map(save));\n  console.log('done');                           // Prints after all complete\n}",
    "seniorTip": "The same limitation applies to .filter() and .reduce(): array.filter(async fn) will retain ALL items because an async function returns a Promise object, and every object is truthy. To filter asynchronously, map items to boolean promises, await them with Promise.all, and then filter.",
    "tags": [
      "level-5",
      "javascript",
      "loops",
      "async"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P51",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "What happens with `setTimeout(fn, 0)`?",
    "shortAnswer": "`setTimeout(fn, 0)` does not execute the callback immediately; it enqueues the callback into the **macrotask queue** (*Task Queue*). The callback executes only after the Call Stack and all pending microtasks have completely emptied. It is used to defer non-blocking work and yield execution to the browser rendering engine.",
    "explanation": `Timing mechanics and the 4ms clamping threshold:

1. **The zero-millisecond myth:**
Specifying \`0\` does not mean immediate execution; it means 'as soon as the Call Stack is empty and the Event Loop turns to macrotasks.'
All current synchronous code and all queued microtasks take strict priority over this callback.

2. **The HTML5 4ms clamping rule:**
The W3C and WHATWG specifications mandate that after 5 consecutive nested timers (\`setTimeout\` inside \`setTimeout\`), the browser enforces a minimum clamping delay of **4 milliseconds**, even if \`0\` was requested.

3. **Production use cases:**
- **Yielding to the main thread:** Allows the browser to paint pending DOM changes before processing the next CPU-heavy task.
- **Breaking up Long Tasks:** Prevents intensive calculations from freezing user interactions (improving Core Web Vitals like INP - Interaction to Next Paint).`,
    "codeSnippet": "setTimeout(() => console.log('macrotask (setTimeout)'), 0);\nPromise.resolve().then(() => console.log('microtask (Promise)'));\nconsole.log('synchronous');\n// Output order: 'synchronous', 'microtask (Promise)', 'macrotask (setTimeout)'",
    "seniorTip": "In modern browsers, if you need to schedule non-blocking work with peak rendering efficiency, mention the modern native scheduler.yield() API or requestIdleCallback(), which were specifically designed to replace the legacy setTimeout(fn, 0) hack.",
    "tags": [
      "level-5",
      "javascript",
      "settimeout",
      "event-loop"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P52",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "How does `async/await` execution ordering work internally?",
    "shortAnswer": "An `async` function executes **completely synchronously** until it encounters its first `await` expression. At that point, it evaluates the awaited expression, suspends function execution, and schedules the remainder of the function as a **microtask** in the Promise queue, allowing the main thread to proceed with outer execution.",
    "explanation": `Step-by-step breakdown of execution flow:
\`\`\`js
async function a() { console.log('a1'); await b(); console.log('a2'); }
async function b() { console.log('b'); }
console.log('start');
a();
console.log('end');
\`\`\`

1. \`'start'\` is logged.
2. \`a()\` is invoked: Its first line runs synchronously and logs \`'a1'\`.
3. \`await b()\` is encountered: \`b()\` runs synchronously and logs \`'b'\`.
4. Function \`a()\` suspends at \`await\`: its continuation (\`console.log('a2')\`) is enqueued as a **microtask**.
5. The main thread returns to the outer execution context and logs \`'end'\`.
6. The Call Stack empties. The Event Loop dispatches the queued microtask, finally logging \`'a2'\`.

Guaranteed final output: \`start\` → \`a1\` → \`b\` → \`end\` → \`a2\`.`,
    "codeSnippet": "async function a() {\n  console.log('a1');\n  await b();\n  console.log('a2');\n}\nasync function b() {\n  console.log('b');\n}\n\nconsole.log('start');\na();\nconsole.log('end');\n// Output: start, a1, b, end, a2",
    "seniorTip": "Understanding that code BEFORE the first await runs synchronously and only code AFTER it becomes a microtask is the key to solving any Event Loop interview question with 100% accuracy.",
    "tags": [
      "async",
      "level-5",
      "javascript",
      "event-loop",
      "await"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P53",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "How do you cancel a request and avoid race conditions?",
    "shortAnswer": "To cancel HTTP requests, use **`AbortController`** and pass its `signal` into the `fetch` options. This is essential in autocomplete search inputs to prevent **race conditions**, where an earlier, slower request resolves after and overwrites the fresher search results.",
    "explanation": `The danger of race conditions and the \`AbortController\` solution:

1. **The Race Condition problem:**
- User types 're' → Fires \`fetch('/search?q=re')\` (takes 800ms).
- User types 'react' → Fires \`fetch('/search?q=react')\` (takes 200ms).
- Search for 'react' resolves first and UI displays the correct results.
- 600ms later, the outdated 're' request resolves and overwrites the screen with stale data.

2. **The \`AbortController\` solution:**
- Before firing a new query, call \`controller.abort()\`.
- This cancels the HTTP connection on the browser network socket immediately.
- The \`fetch\` promise rejects with an error where \`error.name === 'AbortError'\`, which is cleanly caught and discarded without alerting the user.

3. **React usage:**
In \`useEffect\`, the cleanup function should invoke \`controller.abort()\` to avoid updating state if the component unmounts before receiving the response.`,
    "codeSnippet": "let controller;\nasync function search(query) {\n  controller?.abort();                         // Cancel previous in-flight request\n  controller = new AbortController();\n  try {\n    const res = await fetch(`/api/search?q=${query}`, { signal: controller.signal });\n    return await res.json();\n  } catch (e) {\n    if (e.name === 'AbortError') return null;  // Expected cancellation, not an error\n    throw e;\n  }\n}",
    "seniorTip": "Mention that AbortSignal now features modern static factory methods in ES2023+: AbortSignal.timeout(5000) for clean, automatic timeouts, and AbortSignal.any([sig1, sig2]) to abort when any of multiple signals triggers.",
    "tags": [
      "level-5",
      "javascript",
      "abort-controller",
      "race-conditions"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P54",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "What happens to a rejected Promise without a `catch` handler?",
    "shortAnswer": "An unhandled rejected Promise triggers an **`unhandledrejection`** event. In modern Node.js, this crashes the process immediately with a non-zero exit code; in browsers, it logs a red console error and can leave the application in an inconsistent or broken state.",
    "explanation": `Consequences and prevention of unhandled rejections:

1. **In Node.js (Critical evolution):**
In early Node.js versions, this only logged a deprecation warning. Since Node.js 15+, any unhandled promise rejection triggers \`unhandledRejection\` and **immediately terminates the process (\`crash\`)** to prevent the server from continuing in a corrupted state.

2. **In the Browser:**
The error appears in developer tools and can be intercepted globally via:
\`window.addEventListener('unhandledrejection', (event) => { console.error(event.reason); });\`

3. **Production Defensive Strategy:**
- Always handle errors at the invocation point using \`try/catch\` or \`.catch()\`.
- Catch global rejections and forward them to monitoring platforms like Sentry or Datadog.
- In Node.js: \`process.on('unhandledRejection', (reason, promise) => { log(reason); });\``,
    "codeSnippet": "// Global monitoring in the browser:\nwindow.addEventListener('unhandledrejection', (e) => {\n  console.warn('Unhandled promise rejection:', e.reason);\n  reportErrorToSentry(e.reason);\n});\n\n// In Node.js:\nprocess.on('unhandledRejection', (reason) => {\n  console.error('Fatal unhandled rejection:', reason);\n  process.exit(1);\n});",
    "seniorTip": "In interviews, clarify that a standard synchronous try/catch block does NOT catch errors from a promise if you forgot to prefix it with the await keyword: try { fetchSomething(); } catch (e) {} will not catch the rejection; it must strictly be try { await fetchSomething(); } catch (e) {}.",
    "tags": [
      "level-5",
      "javascript",
      "errors",
      "promises"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P55",
    "level": 5,
    "levelTitle": "Asynchrony & Event Loop",
    "question": "How do you implement retry with exponential backoff?",
    "shortAnswer": "An **exponential backoff retry** pattern retries a failed asynchronous operation a finite number of times, doubling the delay between consecutive attempts (`delay * 2 ** attempt`). This allows applications to recover from transient network glitches without overwhelming downstream servers.",
    "explanation": `Resilience algorithm design:

1. **Why linear or immediate retries are harmful:**
If a server experiences transient overload and 1,000 clients retry immediately at the same instant, it causes the 'Thundering Herd Problem', collapsing the infrastructure entirely.

2. **Exponential Backoff with Jitter:**
- **Exponential:** Delays scale exponentially (e.g., 500ms, 1000ms, 2000ms, 4000ms).
- **Jitter (Randomness):** Adding random jitter to the delay (\`delay + Math.random() * 100\`) desynchronizes requests across clients, distributing load smoothly over time.

3. **Exit condition and error propagation:**
If maximum retries are exhausted and the operation continues to fail, the function must re-throw the last caught exception so the caller can handle the failure transparently.`,
    "codeSnippet": "const sleep = (ms) => new Promise((r) => setTimeout(r, ms));\n\nasync function retryWithBackoff(fn, retries = 3, delay = 500) {\n  for (let i = 0; i < retries; i++) {\n    try {\n      return await fn();\n    } catch (e) {\n      if (i === retries - 1) throw e; // All retries exhausted\n      const backoffDelay = delay * (2 ** i) + Math.random() * 100; // Exponential + Jitter\n      await sleep(backoffDelay);\n    }\n  }\n}",
    "seniorTip": "A senior candidate points out that not all errors should be retried: only transient errors (HTTP status codes 429 Too Many Requests, 502, 503, 504, or network connection dropouts). Retrying client errors like 400 Bad Request or 401 Unauthorized is an anti-pattern, as they will never succeed without payload or credential changes.",
    "tags": [
      "level-5",
      "javascript",
      "resilience",
      "patterns"
    ],
    "interactiveDemo": "console"
  }
];
