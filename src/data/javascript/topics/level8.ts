import { JsTopic } from '@/types/javascript';

export const level8Topics: JsTopic[] = [
  {
    "id": "P74",
    "level": 8,
    "levelTitle": "Advanced JavaScript",
    "question": "How does memory management work and what causes memory leaks?",
    "shortAnswer": "JavaScript employs automatic memory management via a **Garbage Collector** using the **Mark-and-Sweep** algorithm: it reclaims memory from objects that are no longer **reachable** from root references (the Call Stack and global object). A **memory leak** occurs when an unintended reference keeps an unused object alive in the Heap, preventing reclamation.",
    "explanation": `Garbage Collector mechanics and the 5 primary sources of memory leaks:

1. **Mark-and-Sweep Algorithm:**
- **Mark Phase:** The collector starts from roots (\`window\`/\`global\`, active execution stack frames) and traverses all reference pointers, marking every reachable object.
- **Sweep Phase:** Any object remaining in the Heap that was not marked is deemed unreachable; its allocated memory is reclaimed and returned to the OS.

2. **The 5 Common Sources of Memory Leaks in Production:**
- **Accidental Global Variables:** Omitting \`const\`/\`let\` (\`data = []\`) binds references permanently to \`window\`.
- **Uncleared Timers (\`setInterval\`) & Lingering Listeners:** Window event listeners or recurring intervals referencing unmounted component state.
- **Unintended Closures:** Long-lived inner functions retaining bulky variables from parent scopes that are no longer required.
- **Detached DOM Nodes:** Removing elements from the visible DOM while retaining a JavaScript variable pointing to the node (\`const ref = document.getElementById(...)\`).
- **Unbounded Caches & Maps:** Global collections appending keys indefinitely without an eviction policy (LRU) or without leveraging \`WeakMap\`.

3. **Diagnosing Leaks with Chrome DevTools:**
Panel **Memory** → Capture Heap Snapshots before and after interacting with the feature, and evaluate using **Comparison view** sorted by **Retained Size**.`,
    "codeSnippet": "// 1) Accidental global (prevented with 'use strict')\nfunction leak() { data = 'persists on window'; }\n\n// 2) Uncleared interval (keeps entire closure scope alive)\nconst id = setInterval(() => processData(heavyObject), 1000);\n// Fix: clearInterval(id) during teardown/unmount\n\n// 3) Forgotten listener on window\nwindow.addEventListener('resize', handler);\n// Fix: window.removeEventListener('resize', handler);",
    "seniorTip": "Distinguish between Shallow Size (the byte size of the object itself) and Retained Size (the total memory freed if this object were garbage collected, including all dependent objects kept alive solely by it). In memory profiling, always prioritize optimizing by Retained Size.",
    "tags": [
      "level-8",
      "javascript",
      "memory",
      "garbage-collector",
      "memory-leaks"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P75",
    "level": 8,
    "levelTitle": "Advanced JavaScript",
    "question": "What is immutability and why is it used?",
    "shortAnswer": "**Immutability** is the architectural practice of treating data structures as unmodifiable: rather than mutating an existing object or array in place, a **new reference is created incorporating the changes**. It forms the foundation of React and Redux because it enables $O(1)$ change detection via strict reference equality (`prev !== next`).",
    "explanation": `Why immutability dominates modern frontend architecture:

1. **Ultra-Fast Shallow Comparison ($O(1)$ vs $O(n)$):**
If state were mutated in place, detecting changes in an array of 10,000 items would require deep property-by-property comparison. With immutability, if references differ (\`next !== prev\`), React instantly knows it must trigger a re-render.

2. **Predictability & Time-Travel Debugging:**
- Enables stable time-travel debugging (Redux DevTools): state history represents an immutable sequence of snapshots immune to retroactive mutation side effects.
- Facilitates straightforward Undo/Redo architecture.

3. **Modern Tools & Patterns:**
- Native immutable cloning via spread syntax (\`{ ...obj, key: 1 }\`) or ES2023 non-mutating methods (\`arr.toSorted()\`).
- For deeply nested state trees, libraries like **Immer** (\`produce(draft => { draft.a.b.c = 1; })\`) leverage Proxies to provide intuitive mutable syntax while producing frozen immutable state trees without boilerplate.`,
    "codeSnippet": "const state = { user: { name: 'Ana' }, items: [1, 2] };\n\n// Immutable update:\nconst newState = {\n  ...state,\n  user: { ...state.user, name: 'Luis' },\n  items: [...state.items, 3],\n};\n\nconsole.log(state === newState);                 // false (new reference)\nconsole.log(state.items === newState.items);     // false\nconsole.log(state.user.name);                    // 'Ana' (untouched)",
    "seniorTip": "Explain the trade-off: immutability allocates more ephemeral objects on the Heap. However, modern engines (V8) feature a generational garbage collector (Scavenger / Young Generation) hyper-optimized to recycle short-lived objects in microseconds, making the gains in predictability and diffing far outweigh GC overhead.",
    "tags": [
      "level-8",
      "javascript",
      "immutability",
      "react",
      "architecture"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P76",
    "level": 8,
    "levelTitle": "Advanced JavaScript",
    "question": "Which design patterns are commonly used in JavaScript?",
    "shortAnswer": "Common design patterns in JavaScript include: **Singleton** (ESM modules are native singletons), **Factory** (functions instantiating configured objects), **Observer / Pub-Sub** (decoupled event systems like `EventEmitter` or Redux), **Module Pattern** (encapsulating private state), and **Strategy / Decorator** (higher-order function composition).",
    "explanation": `Idiomatic implementation of classic patterns in JS:

1. **Singleton (Single Shared Instance):**
Modern JavaScript does not require complex classes with private constructors: any ESM file is evaluated once and cached by the runtime as a natural singleton.
\`export const config = Object.freeze({ api: 'https://...' });\`

2. **Factory (Object Factory):**
Pure functions producing configured objects without requiring \`class\` instantiation or navigating \`new\` and \`this\` bindings:
\`const createButton = (type) => ({ type, click: () => console.log(type) });\`

3. **Observer / EventEmitter (Pub-Sub):**
Reactive pattern where emitters notify multiple subscribers without tight coupling. Powers \`document.addEventListener\`, WebSockets, Redux, and Node.js \`EventEmitter\`.

4. **Strategy Pattern:**
Because JavaScript treats functions as first-class citizens, the Strategy pattern does not require class hierarchies: passing different callbacks or higher-order functions fulfills the pattern cleanly.`,
    "codeSnippet": "// Minimalist Observer / Pub-Sub pattern implementation:\nclass EventEmitter {\n  #events = new Map();\n  on(event, fn) {\n    const list = this.#events.get(event) ?? [];\n    list.push(fn);\n    this.#events.set(event, list);\n    return () => this.off(event, fn); // Unsubscribe\n  }\n  off(event, fn) {\n    const list = this.#events.get(event) ?? [];\n    this.#events.set(event, list.filter(f => f !== fn));\n  }\n  emit(event, ...data) {\n    (this.#events.get(event) ?? []).forEach(fn => fn(...data));\n  }\n}",
    "seniorTip": "In a design interview, emphasize 'Composition over Inheritance' in JavaScript. Instead of deep, rigid class hierarchies using extends, compose behavior by combining pure functions and blending object properties (functional mixins).",
    "tags": [
      "level-8",
      "javascript",
      "patterns",
      "architecture",
      "observer"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P77",
    "level": 8,
    "levelTitle": "Advanced JavaScript",
    "question": "How are errors handled in JavaScript?",
    "shortAnswer": "`try/catch` catches **synchronous** exceptions and promises awaited with `await`. For async promises without `await`, `.catch()` is required. Best practices mandate creating **custom error classes** extending `Error`, never swallowing errors with empty catch blocks, and leveraging the `cause` option (ES2022) to retain original stack traces.",
    "explanation": `Professional error handling strategies:

1. **The Golden Rule of Asynchronous \`try/catch\`:**
A synchronous \`try/catch\` block cannot intercept an exception thrown inside a deferred callback:
\`\`\`js
// ERROR: catch block will not trap this error
try {
  setTimeout(() => { throw new Error('Failure'); }, 100);
} catch (e) { /* Never reached */ }
\`\`\`
For modern asynchronous code, always use \`await\` inside \`try/catch\`:
\`\`\`js
try {
  await fetchData();
} catch (e) { /* Correctly intercepted */ }
\`\`\`

2. **Custom Domain Error Classes:**
Enable \`catch\` blocks to identify and react to specific failure modes using \`instanceof\`:
\`class NotFoundError extends Error { constructor(msg) { super(msg); this.name = 'NotFoundError'; } }\`

3. **Chained Error Causes (*Error Cause* - ES2022):**
\`\`\`js
try {
  await db.query();
} catch (err) {
  throw new Error('Failed to load user profile', { cause: err });
}
\`\`\`
Allows wrapping low-level exceptions with high-level domain context while preserving the original \`stack trace\`.`,
    "codeSnippet": "class ValidationError extends Error {\n  constructor(message, field) {\n    super(message);\n    this.name = 'ValidationError';\n    this.field = field;\n  }\n}\n\ntry {\n  throw new ValidationError('Invalid email address', 'email');\n} catch (e) {\n  if (e instanceof ValidationError) {\n    console.warn(`Field ${e.field}: ${e.message}`);\n  } else {\n    throw e; // Never swallow unknown errors\n  }\n}",
    "seniorTip": "Deadly anti-pattern: never write catch (e) {} (swallowing errors silently). If you cannot recover from the error locally, you must at least report it to a telemetry platform (Sentry/Datadog) or re-throw it (throw e) so upstream callers can take corrective action.",
    "tags": [
      "level-8",
      "javascript",
      "errors",
      "exceptions"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P78",
    "level": 8,
    "levelTitle": "Advanced JavaScript",
    "question": "How does the Node.js event loop work? (`nextTick`, `setImmediate`)",
    "shortAnswer": "Node.js powers its Event Loop through **libuv**, structured across 6 phases: (1) Timers (`setTimeout`), (2) Pending callbacks, (3) Idle/prepare, (4) **Poll (I/O network and disk)**, (5) **Check (`setImmediate`)**, and (6) Close callbacks. **`process.nextTick`** is not part of libuv: it executes immediately after the current operation finishes, before any microtasks or Event Loop phases.",
    "explanation": `libuv phase architecture and priorities in Node.js:

1. **The Core libuv Phases:**
- **Timers:** Executes expired \`setTimeout\` and \`setInterval\` callbacks.
- **Poll:** Central phase. Waits for incoming I/O events (sockets, filesystem) and executes their handlers.
- **Check:** Executes \`setImmediate()\` callbacks immediately following the Poll phase.

2. **\`setImmediate\` vs \`setTimeout(fn, 0)\`:**
- Within an I/O callback (e.g., \`fs.readFile\`), \`setImmediate\` **always executes before** \`setTimeout(..., 0)\` because the Check phase immediately follows the Poll phase.
- In the main root script, execution order is non-deterministic due to process scheduling and system timer resolution.

3. **\`process.nextTick\` vs \`Promise.then\`:**
- \`process.nextTick\` drains its own high-priority queue **before** standard Promise microtasks in CommonJS.
- *(ESM Technical Note):* In ESM modules, the entry module evaluates inside a promise microtask, which can cause promise queues to drain prior to the initial \`nextTick\` flush.`,
    "codeSnippet": "setTimeout(() => console.log('timeout'), 0);\nsetImmediate(() => console.log('setImmediate (check phase)'));\nprocess.nextTick(() => console.log('nextTick (immediate priority)'));\nPromise.resolve().then(() => console.log('promise microtask'));\nconsole.log('synchronous');\n\n// Typical output in CommonJS:\n// synchronous -> nextTick -> promise microtask -> timeout -> setImmediate",
    "seniorTip": "Warn that recursive calls to process.nextTick will completely starve the Node.js Event Loop, preventing the server from handling I/O requests from other clients. For safe asynchronous recursion in Node.js, prefer setImmediate.",
    "tags": [
      "event-loop",
      "level-8",
      "javascript",
      "nodejs",
      "libuv"
    ],
    "interactiveDemo": "event-loop"
  },
  {
    "id": "P79",
    "level": 8,
    "levelTitle": "Advanced JavaScript",
    "question": "How do you improve JavaScript code performance?",
    "shortAnswer": "To optimize JavaScript, follow the cardinal rule: **measure before optimizing** using the Chrome DevTools Performance Profiler and `performance.now()`. Key strategies include: reducing algorithmic complexity ($O(1)$ lookups via `Map`/`Set`), keeping the main thread responsive (Web Workers, `scheduler.yield`), and batching DOM reads and writes.",
    "explanation": `Pillars of high-performance JavaScript:

1. **Algorithmic Complexity ($O(n^2) \\to O(n)$):**
Replace nested linear searches (\`arr.filter(x => other.includes(x))\`) with hash lookups or \`Set\` structures (\`set.has(x)\` in $O(1)$).

2. **Keeping the Main Thread Responsive (*Long Tasks*):**
Any JavaScript task exceeding 50ms is classified as a Long Task, degrading Core Web Vitals (TBT and INP). Chunk heavy computations by yielding to the main thread using \`await new Promise(r => setTimeout(r, 0))\` or the native \`scheduler.yield()\` API.

3. **V8 Engine Optimizations (Crankshaft / TurboFan):**
- **Consistent Object Shapes (*Hidden Classes*):** Always instantiate objects with properties declared in the same sequence; dynamic property injection de-optimizes Inline Caches.
- **Avoid Sparse Arrays (*Holey Arrays*):** Keep arrays continuous and monomorphic (e.g., pure integers/numbers) so V8 represents them using unboxed C++ arrays in memory.`,
    "codeSnippet": "// Inefficient O(n²) complexity:\nconst commonSlow = a.filter(x => b.includes(x));\n\n// Optimized O(n) with Set hash lookup:\nconst setB = new Set(b);\nconst commonFast = a.filter(x => setB.has(x));\n\n// Precise microsecond profiling:\nconst t0 = performance.now();\nrunComputation();\nconsole.log(`Execution time: ${(performance.now() - t0).toFixed(2)}ms`);",
    "seniorTip": "Quote Donald Knuth: 'Premature optimization is the root of all evil.' In an interview, explain that you first identify real bottlenecks using CPU flame charts in DevTools before sacrificing code readability.",
    "tags": [
      "level-8",
      "javascript",
      "performance",
      "v8",
      "optimization"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P80",
    "level": 8,
    "levelTitle": "Advanced JavaScript",
    "question": "What does TypeScript offer over JavaScript?",
    "shortAnswer": "TypeScript is a **statically typed superset** of JavaScript that compiles down to standard JavaScript via **type erasure**. It provides compile-time type checking, intelligent autocompletion (*IntelliSense*), automated refactoring, and living contracts without incurring any runtime overhead or behavioral modifications.",
    "explanation": `Structural distinctions and architectural benefits:

1. **Compile-Time vs Runtime Verification:**
- In plain JavaScript, type mismatches (\`TypeError: Cannot read properties of undefined\`) only emerge when end users interact with the production application.
- TypeScript intercepts contract violations, illegal invocations, and nonexistent property lookups statically inside your IDE before code reaches staging.

2. **Type Erasure:**
TypeScript compilers (\`tsc\`, SWC, Turbopack) strip away all interfaces, types, generics, and annotations. The emitted output is clean, standard JavaScript without library bloat or runtime performance penalties.

3. **Advanced Type System Capabilities:**
- **Discriminated Unions:** Precise modeling of complex state machines.
- **Generics (\`<T>\`):** Reusable components and utilities with strict type propagation.
- **Mapped and Utility Types:** \`Pick\`, \`Omit\`, \`Partial\`, \`ReturnType\`.`,
    "codeSnippet": "type Role = 'admin' | 'user';\n\ninterface User {\n  id: number;\n  name: string;\n  role: Role;\n}\n\n// Compile-time error caught in IDE (never reaches production):\n// const u: User = { id: 1, name: 'Ana', role: 'superadmin' };",
    "seniorTip": "Common interview trap question: 'Does TypeScript make my application run faster in the browser?'. The answer is NO: types do not exist in the browser; the generated bytecode runtime performance is identical. However, it empowers engineering teams to build faster with an ~80% reduction in production regressions.",
    "tags": [
      "level-8",
      "javascript",
      "typescript",
      "types"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P81",
    "level": 8,
    "levelTitle": "Advanced JavaScript",
    "question": "What is a `WeakRef` and when would you use it?",
    "shortAnswer": "A **`WeakRef`** (*Weak Reference*) is an object holding a **weak reference** to a target object without preventing the Garbage Collector from destroying the target if no strong references remain. It pairs with `FinalizationRegistry` to trigger clean-up callbacks once target objects are collected.",
    "explanation": `Mechanics, APIs, and critical TC39 caveats:

1. **How It Works:**
\`\`\`js
let heavyObject = { data: new Array(1e6) };
const ref = new WeakRef(heavyObject);

// Dereference:
const obj = ref.deref();
if (obj) {
  // Target is still retained in memory
  console.log(obj.data.length);
} else {
  // Target has been reclaimed by Garbage Collection
  console.log('Object was garbage collected');
}
\`\`\`

2. **Valid Use Cases:**
- **Caches of Expensive Reconstructible Objects:** Storing processed image bitmaps or parsed AST structures that can easily be recomputed if garbage collection frees them under memory pressure.
- **UI Element Metadata Mappings:** Associating secondary data with DOM nodes without preventing their cleanup.

3. **TC39 Specification Warning:**
The exact moment the Garbage Collector executes is **entirely non-deterministic**. Never base core application business logic or control flow on garbage collection timing of a \`WeakRef\`.`,
    "codeSnippet": "let cache = new Map();\n\nfunction getHeavyData(key) {\n  const ref = cache.get(key);\n  const data = ref?.deref();\n  if (data) return data; // Cache hit\n\n  const freshData = computeHeavy(key);\n  cache.set(key, new WeakRef(freshData));\n  return freshData;\n}",
    "seniorTip": "Highlight the official ECMAScript specification advice: 'Avoid using WeakRef whenever possible.' In virtually all typical applications, standard WeakMap or WeakSet structures are far more predictable, memory-safe, and ergonomic.",
    "tags": [
      "weakref",
      "level-8",
      "javascript",
      "memory",
      "advanced"
    ],
    "interactiveDemo": "console"
  }
];
