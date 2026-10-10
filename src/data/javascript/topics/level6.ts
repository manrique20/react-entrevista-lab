import { JsTopic } from '@/types/javascript';

export const level6Topics: JsTopic[] = [
  {
    "id": "P56",
    "level": 6,
    "levelTitle": "ES6+ & Modules",
    "question": "What is the difference between ESM and CommonJS modules?",
    "shortAnswer": "**ESM (`import`/`export`)** is the official ECMAScript standard: it features compile-time static analysis, supports *tree shaking*, *top-level await*, and exports **live bindings**. **CommonJS (`require`/`module.exports`)** is Node.js's legacy module system: it evaluates dynamically at runtime, is synchronous, and copies exported values by value.",
    "explanation": `Exhaustive comparison between both module systems:

| Feature | ESM (\`import\` / \`export\`) | CommonJS (\`require\` / \`module.exports\`) |
|---|---|---|
| Analysis & Loading | **Static** (resolved before code execution) | **Dynamic** (evaluated at runtime wherever called) |
| Asynchrony | Native (supports *Top-level await* at root level) | Strictly synchronous |
| Optimization | Enables automatic **Tree Shaking** in bundlers | Very difficult or impossible to optimize statically |
| Export Bindings | **Live Bindings** (if the exporter mutates a variable, importer reflects it) | **Copied by value** (snapshots state at require time) |
| Default Environment | Mandatory strict mode (\`'use strict'\`), \`this === undefined\` | \`module.exports\` object as \`this\` at top level |

Dynamic import in ESM:
ESM also supports on-demand loading via \`import('./module.js')\`, which returns a Promise, enabling code splitting and lazy loading in React and Next.js.`,
    "codeSnippet": "// ESM (official ECMAScript standard)\nexport const PI = 3.1416;\nexport default function area(r) { return PI * r ** 2; }\nimport area, { PI } from './geometry.js';\nconst module = await import('./heavy.js');   // lazy dynamic import\n\n// CommonJS (Node.js legacy)\nconst fs = require('fs');\nmodule.exports = { area };",
    "seniorTip": "In interviews, explain the concept of 'Live Bindings': in ESM, import { count } does not copy a primitive number; it creates a read-only pointer to the exporter's original variable. If the exporting module mutates count, the importer reflects the new value without needing to re-import.",
    "tags": [
      "level-6",
      "modules",
      "esm",
      "commonjs",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P57",
    "level": 6,
    "levelTitle": "ES6+ & Modules",
    "question": "What are template literals and tagged templates?",
    "shortAnswer": "**Template literals** are backtick-delimited strings (`` ` ``) that allow expression interpolation (`${expression}`) and native multi-line text. **Tagged templates** are function calls where a template literal is passed as parsed arguments (an array of static string chunks and the evaluated interpolated expressions), allowing custom string transformation, sanitization, or compilation.",
    "explanation": `Mechanics and applications in modern frameworks:

1. **Standard Template Literals:**
- Allow multi-line strings without manual \`\\n\` escapes.
- Evaluate any valid JavaScript expression inside \`\${}\`: arithmetic, function calls, and ternary operators.

2. **Anatomy of a Tagged Template:**
- Tag function definition: \`function tag(strings, ...values) { ... }\`
- Invocation without parentheses: \`tag\` followed directly by the backtick template literal.
- \`strings\`: Array of static string fragments: \`['Hello ', ', you have ', ' notifications']\`. Also includes \`strings.raw\` containing raw unescaped strings.
- \`...values\`: Rest parameter collecting evaluated expressions: \`[name, messages]\`.

3. **Widespread Industry Use Cases:**
- **CSS-in-JS Styling:** \`styled.div\` in styled-components and emotion.
- **GraphQL Queries:** \`gql\` in Apollo Client for AST query parsing.
- **SQL Injection & XSS Prevention:** Database libraries like Prisma or Slonik sanitize interpolated query parameters using tagged templates to neutralize injection attacks.`,
    "codeSnippet": "const name = 'Ana';\nconst message = `Hello ${name},\nthis is multiline and ${1 + 1} is an expression`;\n\n// Tagged Template Function\nfunction highlight(strings, ...values) {\n  return strings.reduce((acc, s, i) => {\n    const val = values[i] !== undefined ? `<b>${values[i]}</b>` : '';\n    return acc + s + val;\n  }, '');\n}\n\nconst html = highlight`User ${name} has ${5} messages`;\nconsole.log(html); // 'User <b>Ana</b> has <b>5</b> messages'",
    "seniorTip": "Common React/CSS question: How does styled.button work under the hood? Answer: 'It is a tagged template function that receives static CSS rule segments separated from interpolated theme functions (props => props.color), dynamically generating injected CSS classes in the DOM.'",
    "tags": [
      "level-6",
      "javascript",
      "es6",
      "template-literals"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P58",
    "level": 6,
    "levelTitle": "ES6+ & Modules",
    "question": "What are iterables and iterators?",
    "shortAnswer": "An **iterable** is any object that adheres to the iteration protocol by providing a `[Symbol.iterator]()` method. An **iterator** is the object returned by that method, which provides a `.next()` function that yields objects formatted as `{ value: any, done: boolean }` until the sequence is exhausted.",
    "explanation": `The ES6 iteration protocol in depth:

1. **The Iteration Protocol Contract:**
- **Iterable Object:** An object possessing the \`[Symbol.iterator]\` property: a zero-argument function returning an iterator object.
- **Iterator Object:** An object implementing the \`.next()\` method:
  - While items remain: \`{ value: currentItem, done: false }\`.
  - Upon completing iteration: \`{ value: undefined, done: true }\`.

2. **Built-in Iterable Data Structures:**
Arrays, Strings, Maps, Sets, \`TypedArrays\`, \`arguments\`, and DOM \`NodeList\` collections.
*(Critical note: Plain objects \`{}\` are **NOT iterable** by default because they lack an inherent traversal order).*

3. **Native Consumers of Iterables:**
- \`for...of\` loops
- Spread operator (\`[...iterable]\`, \`Math.max(...iterable)\`)
- Array destructuring (\`const [x, y] = iterable\`)
- Constructors: \`new Set(iterable)\`, \`new Map(iterable)\`
- Static methods: \`Promise.all(iterable)\``,
    "codeSnippet": "const range = {\n  from: 1, to: 3,\n  [Symbol.iterator]() {\n    let current = this.from, to = this.to;\n    return {\n      next: () => current <= to\n        ? { value: current++, done: false }\n        : { value: undefined, done: true }\n    };\n  },\n};\n\nconsole.log([...range]); // [1, 2, 3]\nfor (const n of range) console.log(n); // 1, 2, 3",
    "seniorTip": "Demonstrate technical depth by explaining how to make custom domain objects iterable: simply add *[Symbol.iterator]() { yield this.prop1; yield this.prop2; }. This enables for...of or [...myObject] directly on your domain model.",
    "tags": [
      "level-6",
      "javascript",
      "iterators",
      "protocols"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P59",
    "level": 6,
    "levelTitle": "ES6+ & Modules",
    "question": "What are generators?",
    "shortAnswer": "**Generators** are special functions declared with `function*` that can **pause execution** at each `yield` expression and resume later on demand. They return an iterator object and enable lazy evaluation of potentially infinite sequences.",
    "explanation": `Execution mechanics and bidirectional communication:

1. **Lazy Evaluation:**
Unlike regular functions that execute to completion synchronously, a generator does not immediately run its body when called; it returns a generator object (implementing the iterator protocol). Execution only advances to the next \`yield\` when the consumer invokes \`.next()\`.

2. **Infinite Streams Without Memory Overflow:**
A generator can run an infinite loop \`while (true) { yield id++; }\` without exhausting system memory or locking the main thread, because it produces exactly one item per request.

3. **Bidirectional Communication with \`.next(value)\`:**
\`yield\` does not merely emit values outward; it can also **receive values** passed from the outside:
\`const input = yield 'waiting for data';\`
Calling \`gen.next('myData')\` assigns that value directly to \`input\` inside the generator.

4. **Historical Use in Asynchronous Programming:**
Prior to \`async/await\`, libraries like \`co\` and Redux-Saga used generators with \`yield\` on promises to orchestrate clean async workflows.`,
    "codeSnippet": "function* infiniteIds() {\n  let id = 1;\n  while (true) yield id++;\n}\nconst gen = infiniteIds();\nconsole.log(gen.next().value); // 1\nconsole.log(gen.next().value); // 2\n\nfunction* take(n, iterable) {\n  let i = 0;\n  for (const x of iterable) {\n    if (i++ >= n) return;\n    yield x;\n  }\n}\nconsole.log([...take(3, infiniteIds())]); // [1, 2, 3]",
    "seniorTip": "In an architecture interview, cite Redux-Saga: explain how it uses generators to represent side effects (API calls, delays) as descriptive plain objects (yield call(fetchUser)), making unit testing effortless with simple .next() calls without mocking complex APIs.",
    "tags": [
      "level-6",
      "javascript",
      "generators",
      "yield"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P60",
    "level": 6,
    "levelTitle": "ES6+ & Modules",
    "question": "What are `Proxy` and `Reflect`?",
    "shortAnswer": "`Proxy` wraps an object to intercept and customize its fundamental operations (property lookup, assignment, deletion, function invocation). `Reflect` is a built-in object providing methods corresponding to JavaScript's internal operations with predictable return values, simplifying delegating default behavior inside Proxy traps.",
    "explanation": `Metaprogramming and modern reactive architectures:

1. **Anatomy of a \`Proxy\`:**
\`const proxy = new Proxy(target, handler);\`
- \`target\`: The original object being wrapped.
- \`handler\`: Object containing 'traps' that intercept operations:
  - \`get(target, prop, receiver)\`: Intercepts property reads.
  - \`set(target, prop, value, receiver)\`: Intercepts property writes.
  - \`deleteProperty(target, prop)\`: Intercepts property deletion with \`delete\`.
  - \`has(target, prop)\`: Intercepts the \`in\` operator.
  - \`apply(target, thisArg, argumentsList)\`: Intercepts function invocations.

2. **Why \`Reflect\` is Indispensable:**
\`Reflect\` exposes mirror methods for every Proxy trap:
- Returns boolean indicators rather than throwing silent errors (\`Reflect.set()\` returns \`false\` on failure, avoiding \`try/catch\` boilerplate).
- Forwards the \`receiver\` parameter, ensuring \`this\` binds correctly to the Proxy on inherited getters.

3. **Vue 3 Reactivity Engine:**
Vue 3 replaced \`Object.defineProperty\` getters/setters with \`Proxy\`. This enables native detection of added properties, deleted properties, and array mutations (\`arr.push(1)\`) without monkey-patching.`,
    "codeSnippet": "const validator = new Proxy({}, {\n  set(obj, prop, value) {\n    if (prop === 'age' && !Number.isInteger(value)) {\n      throw new TypeError('Age must be an integer');\n    }\n    return Reflect.set(obj, prop, value);\n  },\n  get(obj, prop) {\n    return prop in obj ? Reflect.get(obj, prop) : `property_${String(prop)}_does_not_exist`;\n  },\n});\nvalidator.age = 30; // Valid\n// validator.age = 'thirty'; // Throws TypeError",
    "seniorTip": "Keep Proxy Invariants in mind: a Proxy cannot violate non-configurable or non-writable properties on the target object (for example, if a property is writable: false, configurable: false, the get trap is strictly required to return the original value, or the engine throws a TypeError).",
    "tags": [
      "proxy",
      "level-6",
      "javascript",
      "metaprogramming",
      "reflect"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P61",
    "level": 6,
    "levelTitle": "ES6+ & Modules",
    "question": "What useful features were introduced in recent versions (ES2022–ES2024)?",
    "shortAnswer": "Recent ECMAScript editions introduced major enhancements: `Array.prototype.at()` (negative indexing), `Object.hasOwn()`, and `#` private fields (ES2022); immutable array methods like `toSorted` and `toReversed` (ES2023); and `Object.groupBy()` along with `Promise.withResolvers()` (ES2024).",
    "explanation": `Breakdown of modern additions in production:

1. **ES2022:**
- **\`.at(index)\` on Arrays and Strings:** Enables clean negative indexing: \`arr.at(-1)\` replaces cumbersome \`arr[arr.length - 1]\`.
- **\`Object.hasOwn(obj, prop)\`:** Safe direct replacement for \`obj.hasOwnProperty(prop)\`, immune to \`Object.create(null)\` objects or shadowed properties.
- **Top-level await:** Enables \`await\` outside \`async\` functions at the root of ESM modules.
- **Error Cause:** Chained error diagnostics: \`new Error('Network failure', { cause: originalErr })\`.

2. **ES2023:**
- **Immutable Array Methods:** \`toSorted()\`, \`toReversed()\`, \`toSpliced()\`, and \`with(index, value)\` return transformed copies without mutating the original array.
- **\`findLast()\` and \`findLastIndex()\`:** Optimized search starting from the end of arrays.

3. **ES2024:**
- **\`Object.groupBy(items, callback)\` and \`Map.groupBy()\`:** Native collection grouping without external Lodash helpers or manual reduce functions.
- **\`Promise.withResolvers()\`:** Destructures \`{ promise, resolve, reject }\` in a single clean call, eliminating external executor callback bindings.`,
    "codeSnippet": "[1, 2, 3].at(-1);                                    // 3 (ES2022)\nObject.hasOwn({ a: 1 }, 'a');                        // true (ES2022)\n[3, 1, 2].toSorted();                                // [1, 2, 3] immutable (ES2023)\nObject.groupBy([{ g: 'a' }, { g: 'b' }], (x) => x.g); // { a: [...], b: [...] } (ES2024)\nconst { promise, resolve } = Promise.withResolvers(); // ES2024",
    "seniorTip": "Highlighting Promise.withResolvers() and Object.groupBy() in a technical interview shows you stay on top of the latest TC39 specifications. Demonstrate how Object.groupBy(users, u => u.role) replaces manual reduce boilerplate or lodash imports.",
    "tags": [
      "level-6",
      "javascript",
      "es2022",
      "es2023",
      "es2024"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P62",
    "level": 6,
    "levelTitle": "ES6+ & Modules",
    "question": "What is tree shaking?",
    "shortAnswer": "The **Tree Shaking** optimization technique employed by modern module bundlers (Rollup, Webpack, Turbopack, esbuild) during compilation analyzes the dependency graph and **eliminates unused exported dead code**, significantly reducing production bundle size.",
    "explanation": `Technical foundations and requirements for tree shaking:

1. **Why it relies exclusively on ESM:**
ES Modules (\`import\`/\`export\`) feature a **static structure**: imports cannot be conditional or placed inside runtime \`if\` blocks. This allows bundlers to statically trace the full dependency graph at build time without executing code, identifying unused exports with certainty.
*(CommonJS does not permit reliable tree shaking because \`require('./' + variable)\` is dynamic).*

2. **The Hazard of Side Effects:**
A bundler will not prune an unused module if it suspects importing it executes global side effects (e.g., polyfills, mutating \`window\`, or injecting global CSS).
- If a library is pure, declare in its \`package.json\`:
  \`"sideEffects": false\`
  This authorizes the bundler to safely drop any file from the package if none of its exports are consumed.

3. **Code Best Practices:**
- Import specific named exports: \`import { debounce } from 'lodash-es'\` instead of importing default namespaces like \`import _ from 'lodash'\`.
- Avoid monolithic classes or default-exported mega-objects with bundled methods.`,
    "codeSnippet": "// utils.js\nexport const formatDate = (d) => d.toISOString();\nexport const heavyUnusedFunction = () => { /* 50kb of logic */ };\n\n// app.js\nimport { formatDate } from './utils.js';\n// The bundler drops 'heavyUnusedFunction' from the final production bundle",
    "seniorTip": "The classic junior mistake in interviews is attempting to tree-shake lodash: standard lodash is packaged in CommonJS, so bundlers will import the entire 70KB bundle. The correct solution is migrating to lodash-es or modern native libraries like es-toolkit.",
    "tags": [
      "level-6",
      "javascript",
      "tree-shaking",
      "bundlers",
      "performance"
    ],
    "interactiveDemo": "console"
  }
];
