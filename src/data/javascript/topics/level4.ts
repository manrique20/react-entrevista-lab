import { JsTopic } from '@/types/javascript';

export const level4Topics: JsTopic[] = [
  {
    "id": "P30",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "What is the prototype chain?",
    "shortAnswer": "Every object in JavaScript has an internal private link (`[[Prototype]]`, accessible via `Object.getPrototypeOf`) pointing to another prototype object. When accessing a property, the engine checks the receiving object; if not found, it ascends the **prototype chain** until reaching `Object.prototype`, whose prototype is `null`.",
    "explanation": `Mechanics and architecture of prototypal inheritance:

1. **How Property Lookup Works:**
- **Own Property:** Checks whether the property exists on the object's own property dictionary (\`obj.hasOwnProperty('x')\` or \`Object.hasOwn(obj, 'x')\`).
- **Prototypal Delegation:** If not found, the engine traverses the \`[[Prototype]]\` pointer. If still not present on that prototype, it continues to the prototype's prototype.
- If it reaches \`Object.prototype\` and the property remains unresolved, the next link is \`null\`, returning \`undefined\`.

2. **Difference between \`prototype\` and \`[[Prototype]]\` (\`__proto__\`):**
- **\`Fn.prototype\`:** An ordinary object existing exclusively on constructor functions and classes. It serves as the object assigned as \`[[Prototype]]\` to all instances instantiated via \`new Fn()\`.
- **\`[[Prototype]]\` (or accessor \`__proto__\`):** The actual internal reference link each instance holds pointing to its prototype.

3. **Safe Creation and Inspection:**
- \`Object.create(proto)\`: Creates a new object with the specified prototype.
- \`Object.getPrototypeOf(obj)\` and \`Object.setPrototypeOf(obj, proto)\`: Official reflection APIs (avoid legacy \`__proto__\` in production).`,
    "codeSnippet": "const animal = { eat() { return 'eating'; } };\nconst dog = Object.create(animal);   // dog.__proto__ === animal\ndog.bark = () => 'woof';\n\ndog.bark();   // Own property\ndog.eat();    // Resolved via prototype chain\nObject.hasOwn(dog, 'eat');          // false (inherited)\nObject.getPrototypeOf(dog) === animal; // true",
    "seniorTip": "Performance alert in interviews: mutating an object's prototype at runtime with Object.setPrototypeOf is among the slowest operations in JavaScript because it invalidates all V8 JIT inline caches and hidden classes. If you need a custom prototype, always define it at instantiation time with Object.create().",
    "tags": [
      "prototype",
      "object",
      "level-4",
      "javascript",
      "inheritance"
    ],
    "interactiveDemo": "prototype"
  },
  {
    "id": "P31",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "What does the `new` operator do?",
    "shortAnswer": "The `new` operator performs 4 steps: (1) creates a new plain object in memory, (2) binds its `[[Prototype]]` to the constructor function's `prototype`, (3) executes the constructor with `this` bound to the new object, and (4) returns the new object, unless the constructor explicitly returns a non-primitive object.",
    "explanation": `Step-by-step breakdown of the \`new\` algorithm per the specification:

1. **Internal Execution Steps of \`new\`:**
1. **Object Allocation:** Allocates a new empty object on the heap (\`{}\`).
2. **Prototype Link:** Sets \`Object.setPrototypeOf(newObj, Constructor.prototype)\`.
3. **Constructor Execution:** Invokes the constructor function with \`newObj\` as its \`this\` context (\`Constructor.apply(newObj, args)\`).
4. **Return Value Resolution:** If the constructor function returns a primitive (number, string, boolean) or nothing (\`undefined\`), \`new\` discards that return and delivers \`newObj\`. If it explicitly returns an object instance (\`return { custom: true }\`), \`new\` returns that object instead.

2. **Detecting Whether a Function Was Invoked with \`new\`:**
ES6 introduced the **\`new.target\`** meta-property: it references the constructor function when called with \`new\`, and evaluates to \`undefined\` when invoked as a regular function.`,
    "codeSnippet": "function Person(name) {\n  this.name = name;\n}\nPerson.prototype.greet = function () {\n  return `Hello, ${this.name}`;\n};\n\nconst p = new Person('Ana');\np.greet();                            // 'Hello, Ana'\np instanceof Person;                  // true\nObject.getPrototypeOf(p) === Person.prototype; // true",
    "seniorTip": "A classic senior technical interview question is to implement a polyfill for the new operator: function myNew(Constructor, ...args) { const obj = Object.create(Constructor.prototype); const res = Constructor.apply(obj, args); return (typeof res === 'object' && res !== null) ? res : obj; }",
    "tags": [
      "prototype",
      "level-4",
      "this",
      "javascript",
      "new"
    ],
    "interactiveDemo": "prototype"
  },
  {
    "id": "P32",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "Are ES6 classes \"real\" classes?",
    "shortAnswer": "ES6 classes are primarily **syntactic sugar** built on top of JavaScript's existing prototypal inheritance model. They do not introduce a new object-oriented engine paradigm, but enforce stricter guarantees: they always execute in strict mode, are not hoisted (TDZ), and throw a `TypeError` if invoked without `new`.",
    "explanation": `Crucial technical differences between ES6 classes and constructor functions:

1. **Under the Hood:**
Writing \`class Person { greet() {} }\` still creates a function under the hood (\`typeof Person === 'function'\`) and assigns methods to its prototype (\`Person.prototype.greet\`).

2. **Guarantees and Enhancements of \`class\` Syntax:**
- **Enforced Instantiation:** Cannot be called as regular functions (\`Person()\` throws \`TypeError: Class constructor Person cannot be invoked without 'new'\`), preventing accidental pollution of the global object.
- **Non-Enumerable Methods:** Methods defined inside a \`class\` are created with \`enumerable: false\` on the prototype, preventing them from leaking into \`for...in\` loops.
- **Mandatory Strict Mode:** All code within a class body runs strictly in \`'use strict'\`.
- **Temporal Dead Zone:** Classes are not hoisted like functions; accessing them before declaration throws a \`ReferenceError\`.
- **First-Class Support for Modern Features:** Supports native private members (\`#\`) and static initialization blocks (\`static {}\`).`,
    "codeSnippet": "class Person {\n  constructor(name) { this.name = name; }\n  greet() { return `Hello, ${this.name}`; }     // Added to Person.prototype\n  static create(n) { return new Person(n); }    // Static method on constructor\n}\ntypeof Person;                                    // 'function'\nPerson.prototype.greet === new Person('x').greet; // true",
    "seniorTip": "If asked whether JS classes are equivalent to Java or C# classes, explain that NO: in classical OOP languages, classes are blueprints instantiated via memory copies of structure. In JavaScript, all instances remain dynamically linked to the exact same prototype object in heap memory via [[Prototype]] pointers.",
    "tags": [
      "strict-mode",
      "level-4",
      "javascript",
      "classes",
      "es6"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P33",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "How does inheritance work with `extends` and `super`?",
    "shortAnswer": "`extends` sets up the prototype chain both between the child and parent classes (for static methods) and between their prototypes (for instance methods). `super()` invokes the parent class constructor and must be called before accessing `this` inside a derived constructor.",
    "explanation": `Mechanics of inheritance and the role of \`super\`:

1. **Dual Prototypal Linkage:**
When \`class Dog extends Animal\` executes:
- For instances: \`Object.getPrototypeOf(Dog.prototype) === Animal.prototype\` (instance method inheritance).
- For statics: \`Object.getPrototypeOf(Dog) === Animal\` (static method inheritance: \`Animal.staticMethod()\`).

2. **Why \`super()\` Must Precede \`this\`:**
In derived classes, the subclass constructor does not allocate the \`this\` instance independently. It delegates memory allocation to the base class constructor via \`super()\`. Until \`super()\` executes and initializes the instance, \`this\` does not exist in memory, and accessing it throws \`ReferenceError: Must call super constructor in derived class before accessing 'this'\`.

3. **Using \`super\` in Methods:**
In regular methods, \`super.speak()\` invokes the parent class method while automatically binding \`this\` to the current calling instance.`,
    "codeSnippet": "class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return `${this.name} makes a noise`; }\n}\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name);              // Mandatory before referencing `this`\n    this.breed = breed;\n  }\n  speak() { return `${super.speak()} and barks`; }  // Calls parent method\n}\n\nnew Dog('Rex', 'Labrador').speak(); // 'Rex makes a noise and barks'",
    "seniorTip": "Mention that super internally leverages the [[HomeObject]] slot in the ECMAScript specification to resolve the parent class statically regardless of how the method is called. Because of this, extracting or reassigning methods that use super can sever their static link to the parent class.",
    "tags": [
      "level-4",
      "javascript",
      "inheritance",
      "super",
      "classes"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P34",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "How are private members declared in classes?",
    "shortAnswer": "Private members are declared using the hash prefix (`#name`). They provide **true runtime privacy** enforced by the JavaScript engine; attempting to read or modify a private field from outside the class triggers an immediate `SyntaxError`.",
    "explanation": `Technical characteristics of ES2022 private fields:

1. **Hard Private vs Soft Private:**
- \`_property\` convention: Entirely public; anyone can read or mutate it.
- TypeScript \`private property\`: Compile-time check only. Transpilation converts it into a regular public property accessible with \`(obj as any).property\`.
- Native \`#property\`: Neither TypeScript nor JavaScript at runtime permits access outside the lexical class body. Not even \`Object.getOwnPropertyNames()\`, \`Object.keys()\`, or \`Reflect\` can inspect them.

2. **Supported Members:**
- Instance fields: \`#balance = 0;\`
- Private methods: \`#calculateCommission() { ... }\`
- Private getters and setters: \`get #id() { ... }\`
- Private static fields and methods: \`static #singleton;\`

3. **Safe Brand Checking with the \`in\` Operator:**
You can verify whether an object possesses a private field without throwing an exception:
\`if (#balance in object) { /* legitimately holds the private field */ }\``,
    "codeSnippet": "class Account {\n  #balance = 0;\n  static #totalAccounts = 0;\n\n  deposit(n) { this.#balance += n; Account.#totalAccounts++; }\n  get balance() { return this.#balance; }\n  #validate() { return this.#balance >= 0; }\n}\nconst acc = new Account();\n// acc.#balance;  → SyntaxError: Private field '#balance' must be declared in an enclosing class\nconsole.log(acc.balance); // 0 (accessed through public getter)",
    "seniorTip": "Emphasize that private # fields are not stored as conventional string properties in the object's hash table, but in internal PrivateElements slots with weak-key associations. This guarantees that private fields never suffer from name collisions with subclasses in inheritance hierarchies.",
    "tags": [
      "level-4",
      "javascript",
      "privacy",
      "es2022"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P35",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "What are the most important array methods and which ones mutate the original array?",
    "shortAnswer": "Immutable methods (`map`, `filter`, `reduce`, `slice`, `flat`) return new arrays without modifying the original. Mutable methods (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`) alter the array in place. ES2023 introduced native immutable alternatives: `toSorted`, `toReversed`, `toSpliced`, and `with`.",
    "explanation": `Comprehensive breakdown of \`Array.prototype\` methods:

| Method | Purpose | Mutates original? |
|---|---|---|
| \`map(fn)\` | Transforms each element by projection | **No** (new array) |
| \`filter(fn)\` | Filters elements by predicate | **No** (new array) |
| \`reduce(fn, init)\` | Reduces collection into a single accumulated value | **No** |
| \`slice(start, end)\` | Extracts a shallow copy of a slice | **No** (new array) |
| \`flat(depth)\` / \`flatMap(fn)\` | Flattens nested arrays | **No** (new array) |
| \`concat(...items)\` | Concatenates multiple arrays or values | **No** (new array) |
| \`toSorted()\` / \`toReversed()\` | Immutably sorts or reverses (ES2023) | **No** (new array) |
| \`toSpliced()\` / \`with(idx, val)\` | Immutably replaces or deletes elements (ES2023) | **No** (new array) |
| \`push()\` / \`pop()\` | Appends to or removes from end | **Yes** (mutates) |
| \`unshift()\` / \`shift()\` | Prepends to or removes from beginning | **Yes** (mutates) |
| \`splice(start, count, ...items)\` | Removes/inserts elements at any index | **Yes** (mutates) |
| \`sort(comparator)\` | Sorts elements in place | **Yes** (mutates) |
| \`reverse()\` | Reverses elements in place | **Yes** (mutates) |

Major Pitfall with \`sort()\`: Without a comparator, it converts elements to strings: \`[10, 9, 2].sort()\` yields \`[10, 2, 9]\` because \`'10'\` precedes \`'2'\` alphabetically.`,
    "codeSnippet": "const nums = [3, 1, 2];\n[...nums].sort((a, b) => a - b);   // [1, 2, 3] without mutating original\nnums.toSorted((a, b) => a - b);    // Same, native ES2023 immutable method\n\n[10, 9, 1].sort();                  // [1, 10, 9]: sorts as strings without comparator\n[[1, 2], [3, [4]]].flat(Infinity);  // [1, 2, 3, 4]\n\n// reduce: grouping by property\nconst people = [{ age: 20 }, { age: 20 }, { age: 30 }];\nconst byAge = people.reduce((acc, p) => {\n  (acc[p.age] ||= []).push(p);\n  return acc;\n}, {});",
    "seniorTip": "In React, Zustand, or Redux applications, in-place mutation is the #1 cause of missing re-renders (because state comparison relies on Object.is reference equality). Never call .sort() or .reverse() directly on state arrays; always use [...arr].sort(...) or the modern arr.toSorted(...).",
    "tags": [
      "level-4",
      "javascript",
      "array",
      "immutability"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P36",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "What is destructuring?",
    "shortAnswer": "Destructuring is an assignment syntax that unpacks values from arrays or properties from objects directly into distinct variables. It supports variable renaming, default values, nested matching patterns, and gathering remaining elements with rest syntax.",
    "explanation": `Advanced capabilities and patterns:

1. **Object Destructuring:**
- Key-name matching: \`const { name, age } = user;\`
- Variable renaming: \`const { name: alias, id: userId } = user;\`
- Default fallback values: \`const { role = 'guest' } = user;\` (applied exclusively when \`undefined\`).
- Rest property: \`const { password, ...publicUser } = user;\` (ideal for data sanitization).

2. **Array Destructuring:**
- Positional index matching: \`const [first, second] = list;\`
- Skipping items with empty commas: \`const [first, , third] = list;\`
- Elegant variable swap: \`[a, b] = [b, a];\` without requiring an auxiliary temporary variable.
- Rest elements: \`const [head, ...tail] = list;\`

3. **Function Parameter Destructuring:**
Simulates named parameters with built-in default values:
\`function configure({ port = 3000, host = 'localhost', ssl = false } = {}) {}\`
*(Note the trailing \`= {}\` fallback to allow calling \`configure()\` with no arguments without throwing a TypeError).*`,
    "codeSnippet": "// Objects\nconst user = { name: 'Ana', role: 'admin' };\nconst { name: alias, age = 18, ...rest } = user;\n\n// Arrays: swapping variables without temp storage\nlet a = 1, b = 2;\n[a, b] = [b, a];\n\n// Function parameters with complete fallback\nfunction render({ x = 0, y = 0, color = 'red' } = {}) {\n  return `${color} at (${x}, ${y})`;\n}",
    "seniorTip": "Always watch out for deep destructuring traps with nullish parents: const { address: { street } } = user; throws a TypeError if address is undefined. The resilient approach provides a fallback at the intermediate level: const { address: { street } = {} } = user;.",
    "tags": [
      "level-4",
      "javascript",
      "destructuring",
      "es6"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P37",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "What is the difference between shallow and deep copying?",
    "shortAnswer": "A **shallow copy** only duplicates the top-level properties; nested object references continue pointing to the exact same heap memory locations. A **deep copy** recursively duplicates all levels of the object hierarchy, creating fully independent data structures.",
    "explanation": `Cloning techniques and trade-offs:

1. **Shallow Copying (\`{ ...obj }\`, \`Object.assign()\`, \`[...arr]\`, \`arr.slice()\`):**
- Fast and memory-efficient.
- **Gotcha:** If you mutate \`copy.user.address.street = 'new'\`, you mutate the original object as well because \`address\` was copied by reference.

2. **Deep Copying: \`structuredClone(obj)\` (Modern Web and Node 17+ Standard):**
- The official native standard API supported across browsers and runtimes.
- Correctly clones \`Date\`, \`Map\`, \`Set\`, \`RegExp\`, \`ArrayBuffer\`, and handles circular references without stack overflow.
- **Limitation:** Throws a \`DOMException\` if the object contains functions, methods, or \`Symbol\` properties.

3. **Deep Copying with \`JSON.parse(JSON.stringify(obj))\` (Legacy hack with pitfalls):**
- Silently strips \`undefined\`, functions, and \`Symbol\` properties.
- Converts \`Date\` instances to ISO strings, losing their \`Date\` methods.
- Converts \`NaN\` and \`Infinity\` to \`null\`.
- Throws an uncatchable fatal \`TypeError\` on circular references.`,
    "codeSnippet": "const original = { a: 1, nested: { b: 2 }, date: new Date() };\n\nconst shallow = { ...original };            // Also Object.assign, Array.slice\nshallow.nested.b = 99;\nconsole.log(original.nested.b);             // 99 (affected because references are shared!)\n\nconst deep = structuredClone(original);     // Modern native deep clone\ndeep.nested.b = 500;\nconsole.log(original.nested.b);             // 99 (intact)",
    "seniorTip": "In a senior interview, when asked how to clone complex state in modern frontend applications, state structuredClone() decisively. If functions or class prototypes need cloning, explain that a custom recursive cloning utility backed by a WeakMap is necessary to track circular references.",
    "tags": [
      "level-4",
      "javascript",
      "cloning",
      "structured-clone"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P38",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "What is the difference between `Object.freeze`, `Object.seal`, and `Object.preventExtensions`?",
    "shortAnswer": "`Object.preventExtensions` prevents adding new properties. `Object.seal` prevents adding or deleting properties, but allows modifying existing ones. `Object.freeze` prevents adding, deleting, and modifying properties (complete shallow immutability).",
    "explanation": `Object integrity comparison matrix:

| Method | Add properties | Delete properties | Modify existing values | Modify descriptors |
|---|---|---|---|---|
| \`Object.preventExtensions(obj)\` | **No** | Yes | Yes | Yes |
| \`Object.seal(obj)\` | **No** | **No** | Yes | **No** (\`configurable: false\`) |
| \`Object.freeze(obj)\` | **No** | **No** | **No** (\`writable: false\`) | **No** (\`configurable: false\`) |

Critical Factor: Freezing is **SHALLOW**:
If a frozen object contains properties whose values are objects or arrays, the internal properties of those nested objects **remain mutable**.

To achieve genuine deep immutability (*Deep Freeze*):
\`function deepFreeze(obj) { Object.keys(obj).forEach(prop => { if (typeof obj[prop] === 'object' && obj[prop] !== null) deepFreeze(obj[prop]); }); return Object.freeze(obj); }\``,
    "codeSnippet": "const o = Object.freeze({ a: 1, inner: { b: 2 } });\no.a = 5;            // Ignored silently (throws TypeError in 'use strict')\no.inner.b = 99;     // Works!: freeze is SHALLOW\nconsole.log(Object.isFrozen(o)); // true",
    "seniorTip": "In non-strict mode, attempting to modify a frozen object fails silently. In strict mode ('use strict'), it throws a TypeError: Cannot assign to read only property. This makes 'use strict' critical when working with immutable data architectures.",
    "tags": [
      "object",
      "level-4",
      "javascript",
      "immutability"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P39",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "When should you use `Map` and `Set` instead of plain Objects and Arrays?",
    "shortAnswer": "`Map` supports **any data type as keys** (including objects and functions), preserves insertion order, and offers superior performance for frequent additions and deletions. `Set` guarantees **unique elements** with $O(1)$ lookups. `WeakMap` and `WeakSet` hold weak references that do not prevent Garbage Collection.",
    "explanation": `Architectural criteria for data structure selection:

1. **\`Map\` vs Plain Object (\`{}\`):**
- **Key Types:** Plain objects only support \`string\` and \`symbol\` (anything else is stringified, leading to collisions like \`{[obj]: 1}\`); \`Map\` accepts objects, functions, and primitives differentiated by reference equality.
- **Size Checking:** \`map.size\` is an instant $O(1)$ property, whereas objects require \`Object.keys(obj).length\` ($O(n)$).
- **Performance:** \`Map\` is optimized at the C++ engine level for high-frequency key-value additions and removals.
- **Prototype Cleanliness:** Plain objects inherit prototype properties (\`toString\`, \`constructor\`); \`Map\` contains only explicitly set keys.

2. **\`Set\` vs Array (\`[]\`):**
- \`Set\` enforces uniqueness: ideal for deduplicating collections (\`[...new Set(array)]\`) in $O(n)$ time compared to expensive \`filter + indexOf\` ($O(n^2)$).
- Membership testing: \`set.has(x)\` operates in average **$O(1)$** constant time, whereas \`array.includes(x)\` performs an **$O(n)$** linear scan.

3. **\`WeakMap\` and \`WeakSet\`:**
- Only accept objects as keys/elements.
- References are **weak**: if an object key has no other strong references in the application, the Garbage Collector reclaims it automatically along with its entry, preventing memory leaks.`,
    "codeSnippet": "const m = new Map();\nconst key = { id: 1 };\nm.set(key, 'data').set('x', 1);\nconsole.log(m.get(key)); // 'data'\nconsole.log(m.size);     // 2\n\n// O(n) array deduplication\nconst unique = [...new Set([1, 2, 2, 3, 3])]; // [1, 2, 3]\n\n// WeakMap: associating metadata without memory leaks\nconst privateMeta = new WeakMap();\nclass Account { constructor() { privateMeta.set(this, { secret: 1 }); } }",
    "seniorTip": "The classic interview use case for WeakMap is attaching metadata or private caches to DOM elements or class instances without memory leak risk: once the DOM node is detached from the document, its corresponding entry in the WeakMap is automatically garbage-collected.",
    "tags": [
      "level-4",
      "javascript",
      "map",
      "set",
      "data-structures"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P40",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "What is a `Symbol`?",
    "shortAnswer": "A `Symbol` is a primitive data type guaranteed to be **unique and immutable**. It is primarily used as non-colliding property keys on objects and to customize core language behaviors through **Well-Known Symbols**.",
    "explanation": `Mechanics and core applications of \`Symbol\`:

1. **Guaranteed Uniqueness:**
Each call to \`Symbol('description')\` creates an entirely new, distinct symbol:
\`Symbol('id') === Symbol('id')\` is always \`false\`. The description parameter is solely a debugging label.

2. **Semi-Private / Hidden Properties:**
Properties keyed by symbols are excluded from \`for...in\` loops, \`Object.keys()\`, and \`JSON.stringify()\`. However, they are not private in an encapsulation sense, as they can be discovered via \`Object.getOwnPropertySymbols(obj)\` or \`Reflect.ownKeys(obj)\`.

3. **Global Symbol Registry:**
- \`Symbol.for('key')\`: Checks the runtime-wide global registry; retrieves the existing symbol if registered, or creates and registers a new one. Allows sharing identical symbols across iframes and independent execution contexts.

4. **Well-Known Symbols:**
Built-in language extension hooks:
- \`Symbol.iterator\`: Implements the iteration protocol for \`for...of\` loops and spread syntax.
- \`Symbol.hasInstance\`: Customizes the behavior of the \`instanceof\` operator.
- \`Symbol.toPrimitive\`: Controls type coercion algorithms on custom objects.`,
    "codeSnippet": "const id = Symbol('id');\nconst u = { [id]: 123, name: 'Ana' };\nconsole.log(Object.keys(u));                 // ['name'] (symbols are skipped)\nconsole.log(Object.getOwnPropertySymbols(u)); // [Symbol(id)]\n\nSymbol('a') === Symbol('a');         // false\nSymbol.for('a') === Symbol.for('a'); // true (shared global registry)",
    "seniorTip": "In interviews, highlight that Symbols solved JavaScript's historical prototype extension dilemma: TC39 can now introduce universal methods to Array.prototype or Object.prototype via Well-Known Symbols without colliding with user-defined methods previously injected by legacy libraries like MooTools or Prototype.js.",
    "tags": [
      "level-4",
      "javascript",
      "symbols",
      "primitives"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P41",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "What are getters, setters, and `Object.defineProperty`?",
    "shortAnswer": "Getters (`get`) and setters (`set`) are accessor descriptors that bind object properties to functions executed upon reading or writing. `Object.defineProperty` allows precise configuration of property descriptor attributes: `value`, `writable`, `enumerable`, and `configurable`.",
    "explanation": `Anatomy of Property Descriptors:

1. **Accessor Descriptors:**
- \`get prop()\`: Invoked when evaluating \`obj.prop\`. Enables on-the-fly computed values and access tracking.
- \`set prop(value)\`: Invoked when evaluating \`obj.prop = nextVal\`. Enables validation, formatting, and reactive update notifications.

2. **The 4 Configurable Attributes with \`Object.defineProperty\`:**
- **\`value\`:** The actual stored data.
- **\`writable\` (boolean):** If \`true\`, the value can be modified using the assignment operator.
- **\`enumerable\` (boolean):** If \`true\`, the property appears in \`for...in\` loops and \`Object.keys()\`. If \`false\`, it is omitted from enumeration.
- **\`configurable\` (boolean):** If \`true\`, the property can be deleted with \`delete\` and its descriptors altered. If \`false\`, it cannot be deleted or reconfigured.

3. **Historical Importance in UI Frameworks:**
Vue 2 built its entire reactivity system by recursively converting state properties into getters and setters via \`Object.defineProperty\`.`,
    "codeSnippet": "const person = {\n  first: 'Ana', last: 'Gomez',\n  get fullName() { return `${this.first} ${this.last}`; },\n  set fullName(v) { [this.first, this.last] = v.split(' '); },\n};\nperson.fullName = 'Luis Perez';\nconsole.log(person.first); // 'Luis'\n\nObject.defineProperty(person, 'id', {\n  value: 1,\n  writable: false,\n  enumerable: false,\n  configurable: false,\n});",
    "seniorTip": "Connecting Object.defineProperty with framework architectural evolution demonstrates seniority: explain how Vue 2 relied on Object.defineProperty (preventing it from detecting dynamic property addition or deletion without Vue.set), which led Vue 3 to adopt modern ES6 Proxies that intercept operations on the entire object target.",
    "tags": [
      "object",
      "level-4",
      "javascript",
      "reactivity",
      "getters-setters"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P42",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "What is the difference between `for...in` and `for...of`?",
    "shortAnswer": "`for...in` iterates over all **enumerable property names (keys)** of an object (including inherited prototype properties) as strings. `for...of` iterates over the **values produced by an iterable collection** (Arrays, Strings, Map, Set, generators) using the `Symbol.iterator` protocol.",
    "explanation": `Core technical differences:

1. **\`for...in\` (Designed for objects):**
- Iterates over **keys**.
- **Dangerous Pitfalls:** Traverses enumerable properties up the prototype chain. If a library augments \`Array.prototype\`, \`for...in\` on an array will include that method name.
- Yields keys as strings (\`'0'\`, \`'1'\`), never as numbers.
- Iteration order is not consistently guaranteed across older implementations.

2. **\`for...of\` (Designed for iterable collections):**
- Iterates over **values**.
- Only functions with objects implementing the iterable protocol \`[Symbol.iterator]()\`.
- Executing \`for...of\` on a plain object (\`{ a: 1 }\`) throws \`TypeError: obj is not iterable\`.
- To iterate plain objects with \`for...of\`, combine with object reflection methods:
  - \`for (const [key, value] of Object.entries(obj))\`
  - \`for (const key of Object.keys(obj))\`
  - \`for (const value of Object.values(obj))\``,
    "codeSnippet": "const arr = ['a', 'b'];\nfor (const i in arr) console.log(i);   // '0', '1' (string keys)\nfor (const v of arr) console.log(v);   // 'a', 'b' (iterable values)\n\n// Iterating objects with for...of\nfor (const [k, v] of Object.entries({ x: 1, y: 2 })) {\n  console.log(k, v); // x 1, y 2\n}",
    "seniorTip": "Golden rule for interviews: for...in is for object keys; for...of is for collection values. Never use for...in to iterate over arrays; use for...of, standard for loops, or functional methods like .forEach().",
    "tags": [
      "level-4",
      "javascript",
      "loops",
      "iterables"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P43",
    "level": 4,
    "levelTitle": "Objects, Prototypes, Classes & Arrays",
    "question": "What are the common pitfalls and quirks of `JSON.stringify`?",
    "shortAnswer": "`JSON.stringify` has important quirks: it omits properties with `undefined`, functions, and `Symbol` in objects (or converts them to `null` in arrays), turns `NaN` and `Infinity` into `null`, serializes `Date` as ISO strings, throws `TypeError` on `BigInt` or circular references, and accepts optional `replacer` and indentation parameters.",
    "explanation": `Unexpected behaviors in JSON serialization:

1. **Omitted and Coerced Values:**
- **In Object Literals:** Keys containing \`undefined\`, functions, or \`Symbol\` are **completely stripped**: \`JSON.stringify({ a: undefined, b: () => {} })\` yields \`"{}"\`.
- **In Arrays:** To preserve positional index integrity, they are converted to \`null\`: \`JSON.stringify([undefined, () => {}])\` yields \`"[null,null]"\`.
- **Special Numeric Values:** \`NaN\` e \`Infinity\` are serialized as \`null\`: \`JSON.stringify({ n: NaN })\` yields \`{"n":null}\`.

2. **Fatal Exceptions (\`TypeError\`):**
- **Circular References:** If an object references itself in its hierarchy, it throws \`TypeError: Converting circular structure to JSON\`.
- **BigInt:** \`JSON.stringify(10n)\` throws \`TypeError: Do not know how to serialize a BigInt\` (because standard JSON does not define syntax for BigInt).

3. **Advanced Parameters (\`replacer\` and \`space\`):**
\`JSON.stringify(value, replacer, space)\`
- \`replacer\`: Can be an array of permitted keys (whitelist) or a filter/transform function \`(key, value) => ...\`.
- \`space\`: Number of spaces for readable indentation formatting (e.g., \`2\`).
- \`.toJSON()\` Method: If an object defines a \`.toJSON()\` method, \`JSON.stringify\` serializes its return value.`,
    "codeSnippet": "JSON.stringify({ a: undefined, b: () => {}, c: Symbol('x') }); // '{}' (omitted)\nJSON.stringify([undefined, () => {}]);                          // '[null,null]'\nJSON.stringify({ d: new Date(0) });                             // date → ISO string\nJSON.stringify({ n: NaN, i: Infinity });                        // '{\"n\":null,\"i\":null}'\n// JSON.stringify(10n);                                         // TypeError (BigInt)\nJSON.stringify({ a: 1, b: 2 }, null, 2);                         // formatted with 2 spaces",
    "seniorTip": "If you need to serialize objects containing BigInt values, implement a custom replacer: JSON.stringify(data, (k, v) => typeof v === 'bigint' ? v.toString() : v). Also mention that JSON.stringify should never be used as a deep clone mechanism in production due to silent type degradation.",
    "tags": [
      "level-4",
      "javascript",
      "json",
      "serialization"
    ],
    "interactiveDemo": "console"
  }
];
