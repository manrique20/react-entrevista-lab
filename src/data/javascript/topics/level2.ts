import { JsTopic } from '@/types/javascript';

export const level2Topics: JsTopic[] = [
  {
    "id": "P14",
    "level": 2,
    "levelTitle": "Functions",
    "question": "What is the difference between a function declaration, a function expression, and an arrow function?",
    "shortAnswer": "A **declaration** is fully hoisted, has its own `this` and `arguments`, and can be instantiated with `new`. An **expression** is assigned to a variable, hoisting only the variable binding. An **arrow function** has a lexical `this` inherited from its enclosing context, lacks `arguments` and `prototype`, and cannot be invoked with `new`.",
    "explanation": `Detailed technical comparison:

| Feature | Declaration (\`function f(){}\`) | Expression (\`const f = function(){}\`) | Arrow Function (\`const f = () => {}\`) |
|---|---|---|---|
| Hoisting | Full (body and name usable prior to declaration) | Variable declaration only (TDZ with \`let\`/\`const\`) | Variable declaration only (TDZ with \`let\`/\`const\`) |
| \`this\` Binding | Dynamic (determined by caller) | Dynamic (determined by caller) | **Lexical** (captures enclosing scope's \`this\`) |
| \`arguments\` Object | Available (\`arguments[0]\`) | Available (\`arguments[0]\`) | **Absent** (must use \`...rest\`) |
| Constructor (\`new\`) | Yes (has \`.prototype\` property) | Yes (has \`.prototype\` property) | **No** (throws \`TypeError: not a constructor\`) |
| Generator Support | Yes (\`function*\`) | Yes (\`function*\`) | No |

Why this matters in production:
1. **Arrow functions** eliminate classic context-loss bugs in callbacks and asynchronous handlers (such as \`setTimeout\` or React / DOM event listeners).
2. **Declarations** allow clean file organization, letting you export high-level functions at the top while locating implementation details below, thanks to complete hoisting.`,
    "codeSnippet": "function sum(a, b) { return a + b; }            // declaration\nconst subtract = function (a, b) { return a - b; }; // expression\nconst multiply = (a, b) => a * b;               // arrow (implicit return)\nconst create = (id) => ({ id });                 // parenthesize to return an object literal",
    "seniorTip": "In interviews, do not stop at saying 'arrows are shorter syntax'. Emphasize that arrow functions lack an internal [[Construct]] method (saving memory per instance by not constructing a prototype object) and that you should never use arrow functions as object methods if they need to access sibling properties via this.",
    "tags": [
      "hoisting",
      "level-2",
      "this",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P15",
    "level": 2,
    "levelTitle": "Functions",
    "question": "What are default parameters, rest parameters, and spread syntax?",
    "shortAnswer": "**Default parameters** assign fallback values when an argument is `undefined`. The **rest parameter (`...`)** gathers remaining surplus arguments into a genuine array at the end of the parameter list. The **spread operator (`...`)** expands iterable elements or object properties in function calls, array literals, and object literals.",
    "explanation": `Deep breakdown of the three ES6+ features:

1. **Default Parameters (\`param = defaultValue\`):**
- Evaluated at **call time** on each function invocation, not at parse time.
- **Critical Gotcha:** They are triggered exclusively when the passed argument is strictly \`undefined\`. Passing \`null\`, \`false\`, \`0\`, or \`""\` is treated as an explicit value and will **not** trigger the default.
- They have their own intermediate lexical scope (parameter scope): \`function f(a = 1, b = a * 2)\` is valid, but \`function f(a = b, b = 2)\` throws a \`ReferenceError\` due to parameter TDZ.

2. **Rest Parameters (\`...args\`):**
- Gathers all unassigned arguments into an actual \`Array\` instance.
- Must strictly be the **last parameter** in the function signature (\`(a, b, ...rest)\`).
- Completely replaces the legacy \`arguments\` object, enabling direct usage of array methods like \`.reduce()\`, \`.map()\`, and \`.filter()\`, and typing cleanly in TypeScript.

3. **Spread Operator (\`...iterable\` / \`...object\`):**
- Performs inline unpacking of iterable collections (arrays, strings, sets, maps) or own enumerable object properties.
- **Shallow Copy:** Copies references for nested objects; it does not perform deep cloning.
- In object literals, property order determines precedence: \`{ ...base, active: true }\` overwrites \`active\` if it already existed in \`base\`.`,
    "codeSnippet": "// Default parameters (evaluated only if argument is undefined)\nfunction greet(name = 'guest') { return `Hello ${name}`; }\ngreet();            // 'Hello guest'\ngreet(null);        // 'Hello null' (null does NOT trigger default)\n\n// Rest: gathers remaining arguments into a real array\nfunction sum(...nums) { return nums.reduce((a, b) => a + b, 0); }\nsum(1, 2, 3);       // 6\n\n// Spread: unpacks an iterable or object\nconst a = [1, 2], b = [3];\nconst c = [...a, ...b];             // [1, 2, 3]\nMath.max(...c);                      // 3\nconst o2 = { ...{ x: 1 }, y: 2 };   // { x: 1, y: 2 }",
    "seniorTip": "In a Senior interview, highlight that greet(null) does NOT trigger the default because null represents an explicit, intentional absence of value. Additionally, warn that spreading massive arrays into function calls like Math.max(...giantArray) can crash with 'Maximum call stack size exceeded' by exceeding the engine's argument limit.",
    "tags": [
      "level-2",
      "javascript",
      "es6",
      "functions"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P16",
    "level": 2,
    "levelTitle": "Functions",
    "question": "What is a higher-order function?",
    "shortAnswer": "A **higher-order function** (HOF) is a function that accepts one or more functions as arguments, returns a function as its result, or both. This is possible because in JavaScript, functions are **first-class citizens**.",
    "explanation": `Mechanics and key applications:

1. **First-Class Citizens:**
In JavaScript, functions are ordinary objects that can be assigned to variables, stored in data structures, passed as arguments to other functions, and returned as values.

2. **Types of Higher-Order Functions:**
- **Callback consumers:** Native array methods such as \`.map()\`, \`.filter()\`, \`.reduce()\`, \`.find()\`, \`.some()\`, and timer utilities like \`setTimeout()\`.
- **Function factories:** Functions that return newly configured functions closed over lexical environments (decorators, middlewares, or multiplier generators).

3. **Architectural Benefits:**
- **Declarative abstraction:** Replaces manual imperative loops and intermediate mutable state tracking.
- **Composability and reusability:** Enables building decoupled, predictable data processing pipelines (the foundation of functional programming, RxJS, Redux, and lodash/fp).`,
    "codeSnippet": "const numbers = [1, 2, 3, 4, 5];\n\nnumbers.map((n) => n * 2);               // [2, 4, 6, 8, 10]\nnumbers.filter((n) => n % 2 === 0);      // [2, 4]\nnumbers.reduce((acc, n) => acc + n, 0);  // 15\n\n// Returns a function (factory)\nconst multiplierOf = (factor) => (n) => n * factor;\nconst double = multiplierOf(2);\ndouble(7); // 14",
    "seniorTip": "Technical evaluators look for the distinction between an HOF and a callback: the callback is the function passed in; the HOF is the receiver or producer. In terms of performance, note that creating inline HOFs and callbacks inside tight loops or React render bodies creates new allocations and references on every cycle.",
    "tags": [
      "level-2",
      "javascript",
      "functional",
      "hof"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P17",
    "level": 2,
    "levelTitle": "Functions",
    "question": "What is a callback?",
    "shortAnswer": "A **callback** is a function passed as an argument to another function, intended to be executed later (either synchronously or asynchronously) once an operation completes or an event occurs.",
    "explanation": `Distinction and evolution in JavaScript:

1. **Synchronous vs Asynchronous Callbacks:**
- **Synchronous:** Executed immediately within the same call stack turn (e.g., \`[1, 2].forEach(callback)\`).
- **Asynchronous:** Dispatched to the Event Loop task queue to run after an I/O operation, timer, or DOM event resolves (e.g., \`fetch\`, \`setTimeout\`).

2. **The Problem of Callback Hell (Pyramid of Doom):**
When multiple asynchronous operations depend sequentially on preceding results, nesting callbacks creates deep pyramid code that is brittle, has fragmented error handling, and suffers from **Inversion of Control** (the caller blindly trusts third-party code on when and how many times the callback will be invoked).

3. **Modern Solution:**
- ES6 introduced **Promises** (guaranteeing one-time resolution and unified error handling with \`.catch()\`).
- ES2017 consolidated **\`async/await\`**, enabling linear asynchronous logic with native \`try/catch\` control flow.`,
    "codeSnippet": "// Synchronous\n[1, 2, 3].forEach((n) => console.log(n));\n\n// Asynchronous\nsetTimeout(() => console.log('after 1s'), 1000);\n\n// Node.js convention: error-first callback\nreadFile('a.txt', (err, data) => {\n  if (err) return console.error(err);\n  console.log(data);\n});",
    "seniorTip": "Highlight the concept of 'Inversion of Control': when you pass a callback to a third-party library, you surrender control over whether it is called zero, once, or multiple times, or whether exceptions are swallowed. Promises return control of resolution back to your own code.",
    "tags": [
      "async",
      "level-2",
      "javascript",
      "callbacks"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P18",
    "level": 2,
    "levelTitle": "Functions",
    "question": "What is an IIFE and what is it used for?",
    "shortAnswer": "An **IIFE** (*Immediately Invoked Function Expression*) is a JavaScript function that is defined and executed simultaneously: `(function() { ... })()`. Historically, it was used to create a private local scope and prevent polluting the global object.",
    "explanation": `Anatomy and historical vs modern context:

1. **Syntax:**
- The first pair of parentheses \`(function() { ... })\` transforms the function declaration into an **expression**, avoiding a syntax parse error.
- The second pair \`()\` immediately invokes that expression.
- It can receive arguments: \`((window, document) => { ... })(window, document)\`.

2. **The Pre-ES6 Problem It Solved:**
Before \`let\`, \`const\`, and ES modules (ESM), JavaScript only had global and function scope (\`var\`). Any variable declared in a script could clash with variables in other scripts on the shared \`window\` object. IIFEs created an isolated scope 'sandbox' (the classic Module Pattern).

3. **Modern Relevance:**
With ESM (\`import\`/\`export\`) providing file-level scope isolation, IIFEs are rarely necessary today. However, they are still used for:
- Immediate asynchronous logic at the top level in environments without top-level await.
- Bundlers and build tools (generating UMD/IIFE bundles for \`<script>\` tags).`,
    "codeSnippet": "(function () {\n  const secret = 'not accessible from outside';\n  console.log('executes immediately');\n})();\n\nconst counter = (() => {\n  let count = 0;\n  return { inc: () => ++count, value: () => count };\n})();\ncounter.inc();\ncounter.value(); // 1",
    "seniorTip": "In an interview, explain that with native ESM and top-level await, IIFEs have become largely a legacy compatibility technique. If asked for a modern use case, mention atomic one-line complex variable initialization: const config = (() => { if (...) return a; return b; })();",
    "tags": [
      "scope",
      "level-2",
      "javascript",
      "iife"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P19",
    "level": 2,
    "levelTitle": "Functions",
    "question": "What is a pure function and why does it matter?",
    "shortAnswer": "A **pure function** is a function that, given the same arguments, always returns the same result and produces **no observable side effects** (it does not mutate external state, does not modify its arguments, and performs no I/O).",
    "explanation": `Core principles and production benefits:

1. **Determinism (Referential Transparency):**
\`f(x)\` will always yield \`y\`. A call to the function can be replaced by its return value without altering the behavior of the program.

2. **Absence of Side Effects:**
A pure function does NOT perform:
- Mutations of global or outer-scope variables.
- Mutations of arguments received by reference (\`arr.push()\` and \`arr.sort()\` are impure; \`[...arr].sort()\` is pure).
- HTTP requests, disk I/O, or storage writes (\`localStorage\`).
- Invocations of non-deterministic functions (\`Math.random()\`, \`Date.now()\`).
- Direct DOM mutations.

3. **Why It is the Core Pillar of React and Redux:**
- **Predictability and trivial testing:** No external mocks or global state resets required.
- **Safe memoization:** Since outputs depend solely on inputs, results can be cached with \`useMemo\`, \`React.memo\`, or Redux selectors without stale-state bugs.
- **Concurrency:** Without shared mutable state, race conditions are avoided.`,
    "codeSnippet": "// Impure (mutates external state)\nlet total = 0;\nfunction add(n) { total += n; return total; }\n\n// Pure (deterministic without side effects)\nconst addPure = (total, n) => total + n;\n\n// Impure: mutates argument in place\nconst sortBad = (arr) => arr.sort();\n// Pure: copies first or uses ES2023 toSorted\nconst sortGood = (arr) => [...arr].sort();",
    "seniorTip": "Call out common accidental impurity pitfalls in JavaScript: Array.prototype.sort(), splice(), and reverse() mutate the original array in place. To preserve purity without external libraries in ES2023+, use the new immutable methods: toSorted(), toSpliced(), toReversed(), and with().",
    "tags": [
      "level-2",
      "javascript",
      "functional",
      "immutability"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P20",
    "level": 2,
    "levelTitle": "Functions",
    "question": "What are currying and function composition?",
    "shortAnswer": "**Currying** transforms a multi-argument function `f(a, b, c)` into a sequence of nested unary functions `f(a)(b)(c)`. **Composition** combines two or more functions such that the output of one serves as the input to the next: `(f ∘ g)(x) = f(g(x))`.",
    "explanation": `Technical details and practical application:

1. **Currying:**
Enables **partial application** of arguments: you can pre-configure fixed parameters (e.g., a logger with a predefined prefix or a currency converter with a fixed exchange rate) and reuse the resulting function with the remaining variable arguments.

2. **Function Composition:**
- **Mathematical composition (\`compose\`):** Evaluates from right to left: \`compose(f, g)(x) => f(g(x))\`.
- **Pipeline (\`pipe\`):** Evaluates from left to right (more intuitive): \`pipe(f, g)(x) => g(f(x))\`.
- Implemented cleanly in JavaScript by combining rest parameters with \`Array.prototype.reduceRight\` (for compose) or \`Array.prototype.reduce\` (for pipe).

3. **Architectural Benefits:**
Promotes the Single Responsibility Principle (SRP), allowing complex utilities to be built by snapping together small, reusable pure functions without polluting scopes with intermediate variables.`,
    "codeSnippet": "const sum = (a) => (b) => (c) => a + b + c;\nsum(1)(2)(3); // 6\n\nconst compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);\nconst pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);\n\nconst clean = pipe(\n  (s) => s.trim(),\n  (s) => s.toLowerCase(),\n  (s) => s.replace(/\\s+/g, '-')\n);\nclean('  Hello JS World '); // 'hello-js-world'",
    "seniorTip": "Explain the difference between strict currying (which always breaks down into 1-argument functions) and partial application (which binds any number of fixed arguments, leaving the rest open). Mention how libraries like Ramda or lodash/fp provide auto-currying utilities.",
    "tags": [
      "level-2",
      "javascript",
      "currying",
      "composition"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P21",
    "level": 2,
    "levelTitle": "Functions",
    "question": "What is the `arguments` object?",
    "shortAnswer": "`arguments` is an implicit array-like object available inside non-arrow functions containing all arguments passed to the call. In modern JavaScript, it has been superseded by rest parameters (`...rest`).",
    "explanation": `Technical characteristics and reasons for obsolescence:

1. **Array-like Nature:**
- Has a \`.length\` property and indexed access (\`arguments[0]\`, \`arguments[1]\`), but **does not inherit from \`Array.prototype\`**.
- Lacks native array methods like \`.map()\`, \`.filter()\`, \`.forEach()\`, or \`.reduce()\`. In legacy code, developers had to convert it manually: \`Array.from(arguments)\` or \`Array.prototype.slice.call(arguments)\`.

2. **Incompatibility with Arrow Functions:**
Arrow functions **do not possess their own \`arguments\` object**. Accessing \`arguments\` inside an arrow function resolves to the enclosing lexical scope (if one exists).

3. **Bizarre Link to Named Parameters (in Sloppy Mode):**
In non-strict mode, mutating \`arguments[0]\` mutated the corresponding named parameter and vice versa, which thwarted JIT compiler optimizations in V8.

4. **Why \`...rest\` is the Superior Replacement:**
- Produces a genuine \`Array\` instance.
- Operates consistently across both regular and arrow functions.
- Integrates seamlessly with TypeScript typing (\`(...args: number[]) => ...\`).`,
    "codeSnippet": "function legacy() {\n  console.log(arguments.length);          // 3\n  console.log(Array.from(arguments));     // [1, 2, 3] (converted to array)\n  // arguments.map(...) → TypeError: arguments.map is not a function\n}\nlegacy(1, 2, 3);\n\nconst arrow = () => { /* arguments does not exist here; use ...args */ };",
    "seniorTip": "Mention that using the arguments object prevented function inlining optimizations in earlier versions of V8 (Crankshaft/TurboFan). Today, writing ...args is not just cleaner syntax; it allows the JIT compiler to allocate memory for typed arrays with predictable shapes.",
    "tags": [
      "level-2",
      "javascript",
      "array",
      "arguments"
    ],
    "interactiveDemo": "console"
  }
];
