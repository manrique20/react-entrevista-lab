import { JsTopic } from '@/types/javascript';

export const level1Topics: JsTopic[] = [
  {
    "id": "P1",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "What data types does JavaScript have?",
    "shortAnswer": "JavaScript has **7 primitive types** (`string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`) and **1 reference type** (`object`, which encompasses plain objects, arrays, functions, dates, maps, and sets).",
    "explanation": `Key storage and mutability details:

1. **Primitives (Stored by value):**
- They are **immutable**: you cannot alter the value of a string or number in memory (operations like \`.toUpperCase()\` or \`str[0] = 'x'\` return a new string or fail silently).
- They are compared by their **intrinsic value**: \`'hello' === 'hello'\` is \`true\`.
- In modern engines (like V8), simple primitives are typically allocated directly on the stack.

2. **Objects (Stored by reference):**
- They are **mutable**: their internal properties can be added, modified, or removed.
- They are stored in the memory heap, and variables hold a pointer (reference) to that memory address.
- Two distinct objects with identical properties are never equal by value: \`{} === {}\` is \`false\` because they occupy different memory locations.

3. **Type System Oddities:**
- Functions are first-class objects with an internal callable \`[[Call]]\` slot.
- \`null\` is a primitive despite \`typeof null === 'object'\` (a historical JavaScript bug originating in 1995).`,
    "codeSnippet": "let a = 'hello';\na[0] = 'H';          // Does nothing: strings are immutable\nconsole.log(a);      // 'hello'\n\nconst x = { n: 1 };\nconst y = x;         // y points to the SAME object reference\ny.n = 2;\nconsole.log(x.n);    // 2",
    "seniorTip": "Interviewers frequently ask about BigInt and Symbol: clarify that BigInt bypasses the safe integer limit of Number.MAX_SAFE_INTEGER (2^53 - 1) but cannot be mixed with Numbers in direct arithmetic operations (10n + 5 throws a TypeError).",
    "tags": [
      "object",
      "level-1",
      "javascript",
      "array",
      "types"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P2",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "What is the difference between `var`, `let`, and `const`?",
    "shortAnswer": "`var` is function-scoped and hoisted initialized to `undefined`. `let` and `const` are block-scoped and remain in the Temporal Dead Zone (TDZ) until their declaration is evaluated. `const` prevents reassignment of the variable binding, but does not freeze mutable objects.",
    "explanation": `Comprehensive technical comparison:

1. **Scope:**
- \`var\` ignores blocks (\`if\`, \`for\`, \`while\`) and is only confined to a function body. In global scope, it attaches as a property of the global object (\`window\` / \`globalThis\`).
- \`let\` and \`const\` respect any block delimited by curly braces \`{ ... }\`, preventing variable leakage across loops and conditionals.

2. **Hoisting and the Temporal Dead Zone (TDZ):**
- \`var\` declarations are registered and initialized to \`undefined\` before code execution begins.
- \`let\` and \`const\` are registered in the lexical environment during the creation phase but **remain uninitialized**. Accessing them between entering scope and their lexical declaration triggers a \`ReferenceError\` due to the TDZ.

3. **Immutability and \`const\`:**
- \`const\` only guarantees that the **variable identifier binding** (the reference pointer in memory) cannot be reassigned.
- To achieve shallow object immutability, apply \`Object.freeze()\`; for deep immutability, recursive freezing or libraries like Immer are required.`,
    "codeSnippet": "if (true) {\n  var a = 1;\n  let b = 2;\n}\nconsole.log(a); // 1\nconsole.log(b); // ReferenceError\n\nconst user = { name: 'Ana' };\nuser.name = 'Luis';   // Allowed: mutating the object\nuser = {};            // TypeError: Assignment to constant variable",
    "seniorTip": "In a senior interview, emphasize the industry golden rule: use const by default to ensure predictable bindings, let only when reassignment is strictly necessary (such as loop counters), and never use var in modern code. If asked whether const makes an object immutable, clarify that it only freezes the variable binding, not the heap contents.",
    "tags": [
      "scope",
      "level-1",
      "javascript",
      "variables"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P3",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "What are hoisting and the TDZ?",
    "shortAnswer": "**Hoisting** is the execution context creation phase where the JavaScript engine allocates memory for declarations before executing code. Function declarations are hoisted with their entire body; `var` is hoisted initialized to `undefined`; `let` and `const` are hoisted uninitialized, placing them in the **Temporal Dead Zone (TDZ)**.",
    "explanation": `How the V8 engine operates internally:

1. **Execution Context Phases:**
- **Creation Phase:** The engine parses the code, constructs the Lexical Environment, and registers identifiers.
- **Execution Phase:** The engine executes code line by line, assigning values and invoking functions.

2. **Behavior by Declaration Type:**
- **Function Declarations (\`function greet(){}\`):** Hoisted along with their entire implementation. They can be safely called before their textual definition in the file.
- **\`var\`:** The identifier is allocated and immediately initialized with the primitive \`undefined\`. Consequently, \`console.log(a); var a = 10;\` logs \`undefined\` instead of throwing an error.
- **\`let\` and \`const\`:** The identifier is entered into the lexical environment, but accessing it prior to its declaration statement triggers the TDZ and throws \`ReferenceError: Cannot access 'x' before initialization\`.
- **Classes (\`class\`):** Like \`let\` and \`const\`, class declarations are not initialized during hoisting and are subject to the TDZ.

3. **Why the TDZ was introduced in ES6:**
To catch variable access bugs before logical assignment and eliminate silent runtime bugs caused by \`var\` hoisting.`,
    "codeSnippet": "console.log(a);   // undefined (hoisted var)\nvar a = 5;\n\nconsole.log(b);   // ReferenceError: Cannot access 'b' before initialization (TDZ)\nlet b = 5;\n\ngreet();          // Works: full function declaration is hoisted\nfunction greet() { console.log('hello'); }\n\nsayBye();         // TypeError: sayBye is not a function (hoisted var = undefined)\nvar sayBye = function () {};",
    "seniorTip": "Interviewers often ask: 'Are let and const declarations hoisted?'. The technically accurate answer is YES, they are hoisted during the lexical parsing phase; the difference from var is that they remain uninitialized in the TDZ until execution reaches their explicit declaration.",
    "tags": [
      "hoisting",
      "level-1",
      "javascript",
      "tdz"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P4",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "What is the difference between `==` and `===`?",
    "shortAnswer": "`===` (strict equality) compares both type and value without performing any type conversion. `==` (loose equality) invokes the **Abstract Equality Comparison Algorithm**, coercing operands to a common type before comparing them.",
    "explanation": `Equality algorithm rules and common pitfalls:

1. **Type Coercion in \`==\`:**
- When comparing a \`number\` to a \`string\`, the string is converted to a number: \`'42' == 42\` → \`Number('42') == 42\` (true).
- When comparing a \`boolean\` to any other type, the boolean is first coerced to a number (\`true → 1\`, \`false → 0\`). Thus, \`'2' == true\` evaluates to \`false\` because \`'2' == 1\` → \`2 == 1\`.
- When comparing an object or array to a primitive, the engine invokes \`ToPrimitive()\` using \`.valueOf()\` or \`.toString()\`: \`[] == 0\` is \`true\` because \`[].toString()\` is \`""\`, and \`Number("")\` is \`0\`.

2. **The Only Industry-Accepted Exception for \`==\`:**
\`if (value == null)\`: Simultaneously checks whether \`value\` is \`null\` or \`undefined\` in a single concise check, since according to the ECMAScript specification, \`null == undefined\` is always \`true\`.

3. **Golden Rule:**
Always default to \`===\` to prevent subtle bugs caused by implicit coercion, except for the explicit \`== null\` idiom.`,
    "codeSnippet": "0 == '0';          // true\n0 == '';           // true\n'0' == '';         // false  (loose equality is not transitive)\nnull == undefined; // true\nnull === undefined;// false\nNaN == NaN;        // false\n[] == ![];         // true   (classic interview puzzle)\n\nif (value == null) { /* handles both null and undefined */ }",
    "seniorTip": "A classic interview puzzle: Why does [] == ![] evaluate to true? Walk through the steps: ![] is a logical NOT and any object is truthy, so ![] evaluates to false. The expression becomes [] == false. When comparing an object to a boolean, false coerces to 0. Then [].toString() yields \"\", and \"\" == 0 coerces to 0 == 0, resulting in true.",
    "tags": [
      "level-1",
      "javascript",
      "coercion",
      "operators"
    ],
    "interactiveDemo": "coercion"
  },
  {
    "id": "P5",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "What is the difference between `null` and `undefined`?",
    "shortAnswer": "`undefined` means a variable has been declared but has not yet been assigned a value (or that an object property / function parameter does not exist). `null` is an intentional assignment representing the explicit absence of any object or value.",
    "explanation": `Semantic, technical, and runtime differences:

1. **Origin in Runtime:**
- **\`undefined\` is JavaScript's default:** It occurs when declaring \`let x;\`, when a function lacks a \`return\` statement, when accessing a non-existent property on an object (\`obj.missing\`), or when an argument is omitted in a function call.
- **\`null\` is an explicit assignment:** The developer or an API sets it deliberately to signal that a field is empty or that an object reference has been cleared.

2. **Behavior with Operators:**
- \`typeof undefined === 'undefined'\`.
- \`typeof null === 'object'\` (a historical bug from Brendan Eich's original 1995 engine implementation that cannot be fixed without breaking web backward compatibility).
- Arithmetic operations: \`1 + undefined\` yields \`NaN\`, whereas \`1 + null\` yields \`1\` (because \`null\` coerces to \`0\`).
- Default parameters: \`function f(x = 10) {}\`: calling \`f(undefined)\` triggers default \`10\`; calling \`f(null)\` preserves \`null\`.`,
    "codeSnippet": "let x;              // undefined\nconst o = {};\no.missing;          // undefined\nfunction f() {}\nf();                // undefined\n\nlet user = null;    // \"no user yet\", assigned deliberately\ntypeof undefined;   // 'undefined'\ntypeof null;        // 'object'  (historical language bug)",
    "seniorTip": "In TypeScript and modern API design, agree with your team on a single representation for 'empty' state (typically undefined for optional props and TypeScript conventions, and null for database/JSON payloads where the field is explicitly nullified).",
    "tags": [
      "level-1",
      "javascript",
      "primitives"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P6",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "What are the falsy values in JavaScript?",
    "shortAnswer": "There are exactly **8 falsy values** in JavaScript: `false`, `0`, `-0`, `0n` (BigInt), `\"\"` (empty string), `null`, `undefined`, and `NaN`. All other values are **truthy**, including `[]`, `{}`, `\"0\"`, and `\"false\"`.",
    "explanation": `Logical evaluation rules and critical UI pitfalls:

1. **What is a falsy value:**
Any value that evaluates to \`false\` when converted in a boolean context (such as an \`if\` statement, ternary operator, or \`Boolean(x)\`).

2. **Dangerous pitfalls with numeric values and strings:**
- \`0\` is a valid number in counters, prices, and coordinates, but since it is falsy, \`total || 10\` will incorrectly fall back to \`10\`.
- The empty string \`""\` is falsy, but non-empty strings such as \`"0"\` or \`"false"\` are truthy.
- Empty objects and arrays (\`{}\`, \`[]\`) are **truthy** because they are object instances on the heap: \`Boolean([]) === true\`.

3. **Modern Solution:**
- For default values, prefer the nullish coalescing operator **\`??\`** over **\`||\`**, as it only falls back on \`null\` and \`undefined\`, preserving valid falsy values like \`0\`, \`""\`, and \`false\`.`,
    "codeSnippet": "if ([]) console.log('an empty array is truthy');\nif ('0') console.log('\"0\" is truthy');\nif (!'') console.log('\"\" is falsy');\n\n// Common trap: 0 is a valid value\nconst count = 0;\nconst show1 = count || 10;  // 10 (bug: replaces valid 0)\nconst show2 = count ?? 10;  // 0  (correct: preserves 0)",
    "seniorTip": "In React and Next.js, a notorious interview gotcha is conditional rendering: {items.length && <List />}. If items.length is 0, the expression evaluates to 0, causing React to render a visible '0' on screen instead of nothing. The senior solution is {items.length > 0 && <List />} or {Boolean(items.length) && <List />}." ,
    "tags": [
      "level-1",
      "javascript",
      "boolean",
      "falsy"
    ],
    "interactiveDemo": "coercion"
  },
  {
    "id": "P7",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "What does `typeof` do and what are its quirks?",
    "shortAnswer": "`typeof` returns a string indicating the type of an unevaluated operand. Its primary quirks are `typeof null === 'object'`, `typeof [] === 'object'`, and `typeof NaN === 'number'`. To accurately check collections and precise object types, use `Array.isArray()`, `instanceof`, or `Object.prototype.toString.call()`.",
    "explanation": `Return mapping and professional type-checking techniques:

1. **Standard \`typeof\` Results:**
- Primitives: \`'string'\`, \`'number'\`, \`'bigint'\`, \`'boolean'\`, \`'symbol'\`, \`'undefined'\`.
- Functions: \`'function'\` (despite being objects, functions return \`'function'\` because they implement the internal \`[[Call]]\` slot).
- Undeclared variables: \`typeof undeclaredVar\` safely returns \`'undefined'\` without throwing a \`ReferenceError\`.

2. **Historical Anomalies:**
- \`typeof null === 'object'\`: In JavaScript's first implementation, values were represented with type tags in their lowest bits; the \`000\` tag signified an object, and \`null\` was represented as the null pointer (\`0x00\`), leading \`typeof\` to misidentify it as an object.
- \`typeof NaN === 'number'\`: Although it stands for 'Not a Number', it belongs to the IEEE 754 floating-point specification for numeric values.

3. **Robust Type Validation:**
- Arrays: \`Array.isArray(x)\`.
- Dates and RegExps: \`x instanceof Date\`, \`x instanceof RegExp\`.
- Universal deep type introspection: \`Object.prototype.toString.call(x)\` (returns \`[object Array]\`, \`[object Null]\`, \`[object Date]\`, etc.).`,
    "codeSnippet": "typeof 'a';          // 'string'\ntypeof 42;           // 'number'\ntypeof NaN;          // 'number'\ntypeof 10n;          // 'bigint'\ntypeof undefined;    // 'undefined'\ntypeof null;         // 'object'   <- quirk\ntypeof [];           // 'object'   <- use Array.isArray([])\ntypeof function(){}; // 'function'\ntypeof Symbol();     // 'symbol'\ntypeof undeclared;   // 'undefined' (does not throw)",
    "seniorTip": "Mention that instanceof can fail across execution contexts (iframes or web workers), because the Array prototype inside an iframe does not match the Array prototype of the parent window. That is why Array.isArray() is the bulletproof standard.",
    "tags": [
      "prototype",
      "object",
      "level-1",
      "javascript",
      "typeof"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P8",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "What is `NaN` and how should it be checked?",
    "shortAnswer": "`NaN` (*Not a Number*) is a special numeric value of type `number` representing an invalid or unrepresentable mathematical operation. It is the only value in JavaScript that **is not equal to itself** (`NaN === NaN` is `false`). It must be checked using `Number.isNaN()`.",
    "explanation": `Crucial difference between global \`isNaN\` and \`Number.isNaN\`:

1. **The Danger of Global \`isNaN(x)\`:**
The global \`isNaN()\` function coerces its argument to a number before evaluation:
- \`isNaN('hello')\` returns \`true\` because \`Number('hello')\` is \`NaN\`.
- \`isNaN(undefined)\` returns \`true\`.
This causes dangerous false positives when you only want to verify whether a variable actually holds \`NaN\`.

2. **The Reliable Solution: \`Number.isNaN(x)\` (ES6):**
\`Number.isNaN()\` performs no type coercion. It returns \`true\` if and only if the argument is strictly of type \`number\` and has the value \`NaN\`:
- \`Number.isNaN('hello')\` → \`false\`.
- \`Number.isNaN(NaN)\` → \`true\`.
- \`Number.isNaN(0 / 0)\` → \`true\`.

3. **Native Alternatives:**
- \`Object.is(NaN, NaN)\` returns \`true\` (SameValue algorithm).
- Self-comparison check: \`x !== x\` is \`true\` only when \`x\` is \`NaN\`.`,
    "codeSnippet": "0 / 0;                  // NaN\nparseInt('abc');        // NaN\nNaN === NaN;            // false\n\nisNaN('abc');           // true  (coerces 'abc' → NaN; misleading)\nNumber.isNaN('abc');    // false (not the NaN value)\nNumber.isNaN(NaN);      // true\nObject.is(NaN, NaN);    // true",
    "seniorTip": "If asked why NaN === NaN is false, explain that it strictly adheres to the IEEE 754 floating-point standard: two indeterminate floating-point results cannot be assumed equal because they can arise from completely different undefined operations (e.g., 0 / 0 vs Math.sqrt(-1)).",
    "tags": [
      "level-1",
      "javascript",
      "nan",
      "numbers"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P9",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "Why does `0.1 + 0.2 !== 0.3`?",
    "shortAnswer": "JavaScript numbers are stored using the **IEEE 754** 64-bit binary floating-point standard (double precision). Decimal fractions like 0.1 and 0.2 become repeating binary fractions, leading to slight precision rounding errors (`0.30000000000000004`).",
    "explanation": `Floating-point mechanics and production solutions:

1. **Why It Happens in Binary:**
Just as in base 10 the fraction 1/3 produces an infinite repeating decimal (\`0.33333...\`), in base 2 decimal fractions like 1/10 (0.1) and 2/10 (0.2) have no finite binary representation. With 53 bits of mantissa precision, the processor rounds to the nearest representable floating-point number.

2. **How to Safely Compare Floats:**
Never compare floating-point arithmetic results directly with \`===\`. Check within machine epsilon tolerance:
\`Math.abs(a + b - expected) < Number.EPSILON\` (where \`Number.EPSILON\` is the smallest difference between 1 and the next representable float).

3. **Handling Financial Calculations and Currency:**
In financial systems and payment integrations (Stripe, PayPal), **never store monetary values as raw floats**:
- Scale and calculate values in the smallest integer currency unit (cents): \`$19.99\` is stored and computed as \`1999\`.
- Alternatively, use \`BigInt\` or arbitrary-precision libraries such as \`decimal.js\` or \`bignumber.js\`.`,
    "codeSnippet": "0.1 + 0.2;                          // 0.30000000000000004\n0.1 + 0.2 === 0.3;                  // false\n\n// Solutions\nMath.abs(0.1 + 0.2 - 0.3) < Number.EPSILON;   // true\n+(0.1 + 0.2).toFixed(2);                      // 0.3 (rounded for display)\n(10 + 20) / 100;                              // work with integers (cents) for currency",
    "seniorTip": "Highlight that this is not unique to JavaScript: it behaves identically in Python, C++, Java, and any language employing IEEE 754 at the hardware level. Mention Number.EPSILON as the idiomatic tool for floating-point assertion checks in unit tests.",
    "tags": [
      "level-1",
      "javascript",
      "floats",
      "math"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P10",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "What is type coercion?",
    "shortAnswer": "**Type coercion** is the implicit or automatic conversion performed by the JavaScript engine when evaluating operations between incompatible types. With the `+` operator, if any operand is a `string`, string concatenation occurs; with arithmetic operators (`-`, `*`, `/`, `%`), operands are coerced to `number`.",
    "explanation": `Internal conversion algorithms in ECMAScript:

1. **Numeric Coercion (\`ToNumber\`):**
Operators like \`-\`, \`*\`, \`/\`, \`>\`, \`<\` convert operands to numbers:
- \`true → 1\`, \`false → 0\`, \`null → 0\`.
- \`undefined → NaN\`.
- Numeric strings: \`'5' - 2\` → \`3\`.

2. **The Binary \`+\` Operator Quirk:**
If **at least one** operand is a \`string\`, the engine performs \`ToString\` conversion and concatenates: \`'5' + 2\` yields \`'52'\`. If neither operand is a string, it performs numeric addition (\`true + 1\` yields \`2\`).

3. **Object-to-Primitive Conversion (\`ToPrimitive\`):**
When an object or array interacts with a primitive, the engine invokes \`[Symbol.toPrimitive]\`, falling back to \`.valueOf()\` and \`.toString()\`:
- \`[] + []\`: both arrays convert to empty strings: \`"" + ""\` → \`""\`.
- \`[] + {}\`: \`"" + "[object Object]"\` → \`"[object Object]"\`.

4. **Recommended Explicit Conversion:**
Avoid relying on implicit coercion. Write clear, intentional conversions using constructors: \`Number(str)\`, \`String(num)\`, \`Boolean(val)\`, or double negation \`!!val\`.`,
    "codeSnippet": "'5' + 2;        // '52'\n'5' - 2;        // 3\ntrue + 1;       // 2\n[] + [];        // ''\n[] + {};        // '[object Object]'\n+'42';          // 42   (unary +: coerces to number)\n!!'hello';      // true (coerces to boolean)\nString(123);    // '123' (explicit conversion, preferred)",
    "seniorTip": "In an interview, showcase knowledge of Symbol.toPrimitive: explain how you can customize exactly how an object converts to a string, number, or default depending on the hint received ('number', 'string', 'default').",
    "tags": [
      "level-1",
      "javascript",
      "coercion",
      "types"
    ],
    "interactiveDemo": "coercion"
  },
  {
    "id": "P11",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "Are arguments passed by value or by reference?",
    "shortAnswer": "JavaScript is **strictly call by value**. However, when passing an object, the value being copied and passed is the **reference (pointer)** to the object in memory. Mutating the object's properties affects the original; reassigning the parameter variable inside the function does not.",
    "explanation": `Mental model: 'Call by sharing' (Pass-by-value of a reference):

1. **Primitive Variables:**
Copied entirely by value. If you pass \`n = 5\` into a function and reassign \`n = 10\` inside, the original variable in the outer scope remains unchanged.

2. **Object Variables:**
The function parameter receives a **copy of the reference pointer**. Both pointers target the exact same heap memory object:
- **Property Mutation (\`obj.prop = 'new'\`):** Because both pointers reference the same memory block, mutations are reflected everywhere that object is referenced.
- **Parameter Reassignment (\`obj = { new: true }\`):** Reassigning the local parameter breaks its association with the original object and binds it to a new memory address. The original variable outside retains its reference.`,
    "codeSnippet": "function modify(obj, num) {\n  obj.value = 99;      // Mutates the original object\n  obj = { value: 0 };  // Reassigns only the local reference copy\n  num = 100;           // Modifies local primitive copy\n}\nconst o = { value: 1 };\nlet n = 1;\nmodify(o, n);\nconsole.log(o.value, n); // 99 1",
    "seniorTip": "A technical term highly valued in architecture interviews is 'Call by sharing'. Clarify that true pass-by-reference (such as C++ &var or C# ref) does not exist in JavaScript, because a function cannot modify the caller's original variable binding pointer from within its scope.",
    "tags": [
      "level-1",
      "javascript",
      "memory",
      "references"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P12",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "What is the difference between `??`, `||`, and `?.`?",
    "shortAnswer": "`||` (logical OR) returns the right-hand operand if the left-hand operand is any *falsy* value. `??` (nullish coalescing) returns the right-hand operand only if the left-hand operand is strictly `null` or `undefined`. `?.` (optional chaining) short-circuits and returns `undefined` if the target reference is `null` or `undefined`.",
    "explanation": `Comparison of modern control-flow operators:

1. **\`||\` vs \`??\` (The Default Value Problem):**
- \`||\` fails when valid, legitimate values are falsy (\`0\`, \`""\`, \`false\`):
  \`const timeout = config.timeout || 5000;\` // If timeout is 0, incorrectly assigns 5000.
- \`??\` only substitutes when values are truly missing (\`null\` or \`undefined\`):
  \`const timeout = config.timeout ?? 5000;\` // If timeout is 0, preserves 0.

2. **\`?.\` (Optional Chaining):**
- Prevents runtime \`TypeError: Cannot read properties of undefined\`:
  \`const email = user?.profile?.contact?.email;\`
- Supports optional function calls: \`callback?.()\`
- Supports dynamic properties and arrays: \`list?.[index]\`
- **Short-circuiting**: If the expression before \`?.\` evaluates to \`null\` or \`undefined\`, evaluation stops immediately and remaining chained expressions are not evaluated.`,
    "codeSnippet": "const config = { port: 0, host: '' };\nconfig.port || 3000;      // 3000 (0 is falsy → loses valid configuration)\nconfig.port ?? 3000;      // 0\nconfig.host ?? 'localhost'; // ''\n\nconst user = null;\nuser?.address?.street;    // undefined (no error thrown)\nuser?.greet?.();          // optional call\nuser?.list?.[0];          // optional index access\n\nlet x = null;\nx ??= 5;                  // logical nullish assignment: x = x ?? 5",
    "seniorTip": "Caution against overusing optional chaining: if your domain model dictates that an entity must exist, sprinkling ?. everywhere can silently mask upstream bugs rather than failing fast and explicitly. Use it strictly where data absence is a legitimate, expected state.",
    "tags": [
      "level-1",
      "javascript",
      "es2020",
      "operators"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P13",
    "level": 1,
    "levelTitle": "Fundamentals",
    "question": "What is strict mode?",
    "shortAnswer": "`'use strict'` enables ECMAScript **strict mode**, which eliminates silent language errors by converting them into explicit exceptions, prevents accidental global variable leaks, and sets `this` to `undefined` in freestanding function invocations. ES modules (ESM) and ES6 classes run in strict mode by default.",
    "explanation": `Key rules and advantages introduced by strict mode:

1. **Eliminating Silent Failures:**
- Assigning to undeclared variables (\`x = 10;\`) throws a \`ReferenceError\` instead of creating an implicit global on \`window\`.
- Assigning to non-writable properties (\`NaN = 5;\` or descriptors with \`writable: false\`) throws a \`TypeError\` instead of silently failing.
- Deleting non-configurable properties (\`delete Object.prototype\`) throws an error.

2. **Safe \`this\` Binding:**
In sloppy mode, invoking a standalone function \`f()\` binds \`this\` to the global object (\`window\` / \`globalThis\`). In strict mode, \`this\` remains \`undefined\`, preventing accidental global state pollution.

3. **Syntax Restrictions and Engine Optimizations:**
- Prohibits the legacy \`with\` statement.
- Disallows duplicate parameter names in functions: \`function sum(a, a, b)\` throws a \`SyntaxError\`.
- Decouples \`arguments\` mutations from named parameters.
- Allows JIT engines (like V8) to perform deeper code optimizations by eliminating dynamic scoping ambiguities.`,
    "codeSnippet": "'use strict';\nx = 10;                           // ReferenceError (in sloppy mode, creates a global)\nfunction f() { return this; }\nf();                              // undefined (in sloppy mode, window/globalThis)\ndelete Object.prototype;          // TypeError",
    "seniorTip": "In a modern interview, note that you rarely need to write 'use strict' manually today: all code within ES modules (import/export), TypeScript, or class bodies automatically executes in strict mode per the specification.",
    "tags": [
      "strict-mode",
      "level-1",
      "this",
      "javascript"
    ],
    "interactiveDemo": "console"
  }
];
