import { JsTopic } from '@/types/javascript';

export const level3Topics: JsTopic[] = [
  {
    "id": "P22",
    "level": 3,
    "levelTitle": "Scope, Closures & this",
    "question": "What is scope and what types of scope exist in JavaScript?",
    "shortAnswer": "**Scope** is the lexical context that determines the visibility and lifecycle of variables. JavaScript has 4 types of scope: **global**, **module**, **function**, and **block** (`let`/`const`). JavaScript uses **lexical scope** (static scope): variable resolution depends on where functions are declared in the source code, not where they are called.",
    "explanation": `Internal mechanics of the Scope Chain:

1. **Types of Scope:**
- **Global:** Variables accessible throughout the entire program. In browsers, declaring variables with \`var\` attaches them to the \`window\` object.
- **Module:** Each ES module (\`import\`/\`export\`) has its own isolated scope, preventing identifier collisions across files.
- **Function:** Variables declared with \`var\`, \`let\`, or \`const\` inside a function are inaccessible from outside.
- **Block (ES6):** Delimited by curly braces \`{ ... }\` (\`if\`, \`for\`, \`try/catch\`). Affects only \`let\`, \`const\`, and class declarations.

2. **Lexical Scope and the Scope Chain:**
When the engine executes an instruction requiring identifier resolution:
1. It searches the immediate local **Environment Record**.
2. If not found, it traverses upward via the \`outer\` lexical environment reference to the enclosing parent scope.
3. It continues ascending iteratively until reaching the global scope.
4. If the identifier is still not found, it throws a \`ReferenceError\` in strict mode.

3. **Directionality:**
Scope lookup is strictly inside-out (inner scopes can access variables from outer scopes, but an outer scope can never access variables declared inside an inner scope).`,
    "codeSnippet": "const globalVar = 'g';\n\nfunction outer() {\n  const o = 'o';\n  function inner() {\n    const i = 'i';\n    console.log(globalVar, o, i); // Sees all three: climbs the scope chain\n  }\n  inner();\n}\n// console.log(o); → ReferenceError: cannot look into inner scopes",
    "seniorTip": "In interviews, clarify that JavaScript does NOT have dynamic scoping (like Bash or Perl); it has lexical (static) scoping. This means scope is locked during lexical analysis at compile/parse time, which is precisely why closures behave reliably and predictably.",
    "tags": [
      "level-3",
      "scope",
      "javascript",
      "lexical-scope"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P23",
    "level": 3,
    "levelTitle": "Scope, Closures & this",
    "question": "What is a closure?",
    "shortAnswer": "A **closure** is the combination of a function bundled together with references to its surrounding **lexical environment**. It allows an inner function to remember and access variables from its outer enclosing scope even after the outer function has finished executing and returned from the call stack.",
    "explanation": `Memory mechanics and production use cases:

1. **How It Works in Engine Memory:**
Normally, when a function finishes execution, its Execution Context is popped off the call stack and its local variables are reclaimed by the Garbage Collector. However, if an inner function references any variable from that parent context and that inner function survives (e.g., by being returned or passed to a callback), the engine moves those variables from the stack to the **Heap** inside a special scope object (the *Closure Scope*), keeping them alive for as long as the inner function is reachable.

2. **Key Software Engineering Use Cases:**
- **Encapsulation and private state:** Emulating private variables and accessors without exposing mutable properties (Factory and Module patterns).
- **Function factories (Currying and Partial Application):** Generating specialized parameterized functions (e.g., URL builders, validators).
- **Memoization and Caching:** Storing a lookup dictionary of previously computed results hidden within a closure to avoid redundant recomputations.
- **Timers and Event Handlers:** Preserving state across asynchronous callbacks (\`debounce\`, \`throttle\`, DOM event listeners).`,
    "codeSnippet": "function createCounter() {\n  let count = 0;          // \"private\" variable\n  return () => ++count;   // inner function maintains access\n}\n\nconst a = createCounter();\nconst b = createCounter();\na(); a();                 // 1, 2\nb();                      // 1 (independent closure environment)",
    "seniorTip": "Beware of memory leaks: closures hold onto every variable referenced in their lexical scope. If a long-lived closure (such as a global event listener or setInterval) references heavy objects (like full DOM trees or large arrays), those objects cannot be collected by the Garbage Collector until the closure itself is discarded.",
    "tags": [
      "level-3",
      "scope",
      "javascript",
      "debounce",
      "closure"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P24",
    "level": 3,
    "levelTitle": "Scope, Closures & this",
    "question": "What does this loop log and how do you fix it?",
    "shortAnswer": "It logs `3 3 3` because `var` is function-scoped, creating a **single shared variable `i`** in memory. By the time the `setTimeout` callbacks run after the loop completes, `i` has reached 3. Replacing `var` with `let` causes JavaScript to create a **new `i` binding per iteration with its own closure**, logging `0 1 2`.",
    "explanation": `Step-by-step Event Loop and closure breakdown:

1. **Why It Happens with \`var\`:**
- \`var\` lacks block scope; only one variable \`i\` exists across the entire function or global context.
- \`setTimeout(..., 0)\` does not execute the callback immediately; it schedules it in the macrotask queue.
- The synchronous \`for\` loop runs to completion (\`i = 0, 1, 2, 3\`), ending with \`i === 3\`.
- The call stack clears and the Event Loop dispatches the 3 queued callbacks. Since all 3 read the exact same memory pointer for \`i\`, they all log \`3\`.

2. **Why \`let\` Automatically Fixes It:**
The ES6 specification defines special semantics for \`for (let ...)\` loops: for every iteration, the engine creates a **new independent lexical environment** and re-binds the current value of \`i\` to that specific iteration step. Each callback captures its own immutable copy of \`i\` in its closure.

3. **Historical Pre-ES6 Solution:**
Use an IIFE to capture the value of \`i\` as an argument passed by value:
\`for (var i = 0; i < 3; i++) { ((j) => setTimeout(() => console.log(j), 0))(i); }\``,
    "codeSnippet": "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n// Logs: 3 3 3\n\n// Modern Solution 1: let (per-iteration block scope)\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 0 1 2\n}\n\n// Classic Solution 2: IIFE capturing value in parameter j\nfor (var i = 0; i < 3; i++) {\n  ((j) => setTimeout(() => console.log(j), 0))(i);\n}",
    "seniorTip": "This is one of the most classic technical screening questions in the industry. If the interviewer asks you to explain the let solution, explicitly cite the ECMAScript specification's 'per-iteration environment binding' mechanism, demonstrating deep engine-level comprehension.",
    "tags": [
      "level-3",
      "closure",
      "javascript",
      "event-loop"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P25",
    "level": 3,
    "levelTitle": "Scope, Closures & this",
    "question": "How is the value of `this` determined?",
    "shortAnswer": "In regular functions, `this` is not determined by where the function is defined, but by **how it is invoked** at call time. It is resolved by evaluating 4 rules in order of precedence: (1) `new` binding, (2) explicit binding (`call`/`apply`/`bind`), (3) implicit binding (`obj.method()`), and (4) default binding (`undefined` in strict mode, `window` in sloppy mode). Arrow functions bypass these rules and use lexical `this`.",
    "explanation": `The 4 Binding Rules ordered by precedence:

1. **Rule 1: \`new\` Binding (Highest priority):**
When a function is invoked with the \`new\` operator (\`new Person()\`), \`this\` is bound to the newly created instance in memory.

2. **Rule 2: Explicit Binding (\`call\`, \`apply\`, \`bind\`):**
When invoked with \`.call(context)\`, \`.apply(context)\`, or \`.bind(context)\`, \`this\` is explicitly set to the object passed as the first argument.

3. **Rule 3: Implicit Binding (Method call on object):**
When a function is called as a property on an object (\`user.greet()\`), \`this\` points to the context object immediately preceding the dot at call time.

4. **Rule 4: Default Binding (Lowest priority):**
When a function is called as a freestanding invocation (\`greet()\`):
- In **strict mode (\`'use strict'\`):** \`this\` is \`undefined\`.
- In **non-strict mode:** \`this\` defaults to the global object (\`window\` in browsers, \`global\` in Node.js).

**Exception:** **Arrow Functions** completely ignore all 4 rules, capturing \`this\` lexically from their enclosing scope when defined.`,
    "codeSnippet": "const person = {\n  name: 'Ana',\n  greet() { return `Hello, I'm ${this.name}`; },\n};\n\nperson.greet();             // 'Hello, I'm Ana' (Rule 3: implicit binding)\nconst freestanding = person.greet;\nfreestanding();             // Loses this → TypeError in strict mode",
    "seniorTip": "To ace this in interviews, cite Kyle Simpson's 'You Don't Know JS': apply the rules in order: Was it called with new? Was it called with bind/call/apply? Was it called with a context object obj.fn()? If none apply, fall back to default binding (undefined in strict).",
    "tags": [
      "level-3",
      "scope",
      "this",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P26",
    "level": 3,
    "levelTitle": "Scope, Closures & this",
    "question": "What is the difference between `call`, `apply`, and `bind`?",
    "shortAnswer": "`call` and `apply` **invoke the function immediately** with a specified `this` context: `call` takes arguments individually separated by commas, while `apply` takes arguments as an array. `bind` **does not invoke the function**; it returns a new bound function with its `this` context (and optionally partial arguments) permanently fixed.",
    "explanation": `Comparison and use cases of \`Function.prototype\` methods:

1. **\`Function.prototype.call(thisArg, arg1, arg2, ...)\`:**
- Invokes the function immediately with \`thisArg\` as \`this\`.
- Passes additional arguments positionally one by one.
- Best suited when the number of arguments is fixed and known upfront.

2. **\`Function.prototype.apply(thisArg, [argsArray])\`:**
- Invokes the function immediately with \`thisArg\` as \`this\`.
- Passes additional arguments as an array or array-like object.
- Historically critical before ES6 for passing dynamic argument lists (\`Math.max.apply(null, numbers)\`), largely superseded today by spread syntax (\`Math.max(...numbers)\`).

3. **\`Function.prototype.bind(thisArg, arg1, arg2, ...)\`:**
- Returns a new *bound function*.
- Immutably binds \`this\`: attempting to call \`.call()\` or \`.apply()\` on an already bound function will not override its bound \`this\`.
- Enables **partial application**: you can prepend fixed arguments that will precede any arguments passed to subsequent invocations.`,
    "codeSnippet": "function introduce(greeting, punctuation) {\n  return `${greeting}, I'm ${this.name}${punctuation}`;\n}\nconst ana = { name: 'Ana' };\n\nintroduce.call(ana, 'Hello', '!');       // 'Hello, I'm Ana!'\nintroduce.apply(ana, ['Hello', '!']);    // 'Hello, I'm Ana!'\nconst bound = introduce.bind(ana, 'Hello');\nbound('?');                              // 'Hello, I'm Ana?'",
    "seniorTip": "Interview mnemonic: Call uses Commas (arg1, arg2), Apply uses Array ([args]), and Bind creates a Bound function to call later. Also note that bind() is irreversible: calling .bind() a second time on a bound function cannot alter its original this context.",
    "tags": [
      "level-3",
      "this",
      "javascript",
      "bind",
      "call"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P27",
    "level": 3,
    "levelTitle": "Scope, Closures & this",
    "question": "How does `this` behave inside an arrow function?",
    "shortAnswer": "An **arrow function has no `this` binding of its own**; instead, it retains the `this` value of the enclosing lexical scope at the time it is defined. This binding is permanent and cannot be modified using `call`, `apply`, or `bind`.",
    "explanation": `Mechanics and practical consequences:

1. **Lexical Resolution:**
Arrow functions lack the internal \`[[ThisBindingStatus]]\` slot. When the \`this\` keyword is evaluated inside an arrow function, the engine resolves it along the scope chain just as it would any ordinary variable (\`x\` or \`y\`).

2. **Behavior with \`call\`, \`apply\`, and \`bind\`:**
If you invoke \`.call(newContext)\` or \`.bind(newContext)\` on an arrow function, **the first argument is ignored**. Only subsequent arguments are passed if the function accepts parameters.

3. **When to Use:**
- Method callbacks (\`array.map(() => this.property)\`).
- Timers (\`setTimeout(() => this.count++, 1000)\`).
- Event listeners when you want to access the class instance rather than the DOM target element.

4. **When It is an Anti-Pattern:**
- **As object literal methods:** \`const obj = { id: 1, getId: () => this.id }\` fails because its lexical parent is the outer module or \`window\`, not \`obj\`.
- **As prototype methods:** \`Person.prototype.greet = () => { ... }\` will not have access to the calling instance.
- **In DOM event handlers** where you expect \`this\` to refer to \`event.currentTarget\`.`,
    "codeSnippet": "const timer = {\n  seconds: 0,\n  start() {\n    setInterval(() => {\n      this.seconds++;   // this = timer (inherited lexically from start)\n    }, 1000);\n  },\n  badMethod: () => this.seconds, // this is NOT timer (it is global/module scope)\n};",
    "seniorTip": "In interviews, if asked 'How would you rebind this on an arrow function?', the categorical technical answer is: 'You cannot. By ECMAScript specification design, arrow functions eliminate dynamic this binding at the bytecode level'.",
    "tags": [
      "level-3",
      "scope",
      "this",
      "javascript",
      "arrow-functions"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P28",
    "level": 3,
    "levelTitle": "Scope, Closures & this",
    "question": "Why is `this` lost when passing an object method as a callback, and how do you fix it?",
    "shortAnswer": "When extracting a method from an object to pass as a callback (e.g., `setTimeout(obj.method, 1000)`), only the **standalone function reference** is passed, stripping away the object receiver. When executed by the Event Loop, it runs as a freestanding invocation, triggering default binding (`undefined` in strict mode or `window` in sloppy mode).",
    "explanation": `Root cause and 3 production solutions:

1. **The Root Cause:**
The syntax \`obj.method()\` evaluates a Reference Record with base \`obj\`. Doing \`const fn = obj.method;\` or \`setTimeout(obj.method, 100);\` dereferences the method, discarding its base object. When the timer or callback dispatcher invokes \`fn()\`, it triggers Rule 4 (default binding).

2. **Solution 1: Wrap in an Arrow Function (Recommended):**
\`setTimeout(() => obj.method(), 1000);\`
The arrow function preserves the explicit call syntax \`obj.method()\`, keeping \`obj\` to the left of the dot.

3. **Solution 2: Explicit Binding with \`bind\`:**
\`setTimeout(obj.method.bind(obj), 1000);\`
Returns a new function permanently bound to the target instance.

4. **Solution 3: Class Fields with Arrow Functions (Classic React Pattern):**
\`class Button { onClick = () => { console.log(this.text); }; }\`
Attaches an arrow function directly to each instance during construction.`,
    "codeSnippet": "class Button {\n  constructor() { this.text = 'Click'; }\n  onClick() { console.log(this.text); }\n}\nconst b = new Button();\n\nsetTimeout(b.onClick, 0);                    // undefined or TypeError: lost this\n\n// Reliable solutions:\nsetTimeout(() => b.onClick(), 0);            // 1. Arrow wrapper\nsetTimeout(b.onClick.bind(b), 0);            // 2. Function.prototype.bind\nclass Button2 {\n  onClick = () => console.log(this.text);   // 3. Class field arrow function\n}",
    "seniorTip": "In React and TypeScript, arrow class fields solve the this problem conveniently, but carry a memory footprint: the function is re-created per instance rather than shared on the prototype (Button.prototype). For thousands of instances, prototype methods combined with bound handlers or wrappers are far more memory-efficient.",
    "tags": [
      "level-3",
      "this",
      "javascript",
      "callbacks"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P29",
    "level": 3,
    "levelTitle": "Scope, Closures & this",
    "question": "How do you create data privacy with closures (Module Pattern)?",
    "shortAnswer": "The **Module Pattern** leverages closures and IIFEs to encapsulate private state and helper functions within a closed function scope, returning only a public object with methods that operate on that internal state. In modern JavaScript, it coexists with native `#privateField` class syntax.",
    "explanation": `Evolution of data privacy in JavaScript:

1. **Classic Module Pattern with Closures:**
By returning an object literal from a function or IIFE, the returned methods retain a closure over the function's local variables. External code cannot read or modify these variables directly under any circumstances, guaranteeing strict encapsulation.

2. **Advantages of the Closure-Based Approach:**
- Does not rely on classes or \`this\` binding.
- Truly impenetrable from the outside (cannot be bypassed with \`Object.keys()\` or \`Reflect\`).
- 100% isolated state per instance produced by the factory function.

3. **Modern ES2022 Alternative: Private \`#\` Fields:**
JavaScript classes now natively support hard private fields prefixed with \`#\` (\`#balance = 0\`). Unlike cosmetic naming conventions like \`_balance\`, accessing \`#balance\` from outside the class produces a compile/runtime \`SyntaxError\`.`,
    "codeSnippet": "const bank = (() => {\n  let balance = 0;                       // Inaccessible from outside\n  const isValid = (n) => n > 0;\n\n  return {\n    deposit(n) { if (isValid(n)) balance += n; },\n    getBalance: () => balance,\n  };\n})();\n\nbank.deposit(100);\nconsole.log(bank.getBalance()); // 100\nconsole.log(bank.balance);      // undefined (true privacy)",
    "seniorTip": "Senior technical distinction between _prop (TypeScript private modifier) and #prop (ECMAScript native private field): TypeScript's private keyword is merely a compile-time check stripped away during transpilation; #prop is enforced by the JavaScript engine itself at runtime.",
    "tags": [
      "level-3",
      "closure",
      "javascript",
      "patterns",
      "privacy"
    ],
    "interactiveDemo": "console"
  }
];
