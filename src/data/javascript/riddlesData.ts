import { JsRiddle } from '@/types/javascript';

export const jsRiddlesData: JsRiddle[] = [
  {
    id: 'A1',
    title: 'Hoisting & Temporal Dead Zone (TDZ)',
    codeSnippet: `console.log(a);
var a = 1;
console.log(b);
let b = 2;`,
    expectedOutput: 'undefined then ReferenceError (TDZ for b)',
    explanation:
      'var is hoisted and initialized to undefined during the creation phase. let is hoisted but remains in the Temporal Dead Zone (TDZ) uninitialized until execution reaches its declaration line.',
    trapExplanation:
      'Classic interview trap: Believing let and const are not hoisted. They are hoisted, but accessing them before their declaration line throws a ReferenceError.',
    options: [
      'undefined then ReferenceError (TDZ for b)',
      'undefined then undefined',
      'ReferenceError immediately on line 1',
      '1 then 2'
    ]
  },
  {
    id: 'A2',
    title: 'Classic Type Coercions',
    codeSnippet: `console.log([] + []);
console.log([] + {});
console.log('5' + 3);
console.log('5' - 3);
console.log(true + true);
console.log([] == ![]);`,
    expectedOutput: `"" , "[object Object]" , "53" , 2 , 2 , true`,
    explanation:
      '1. [] + [] converts both arrays to empty strings: "" + "" = "".\n2. [] + {} converts [] to "" and {} to "[object Object]".\n3. \'5\' + 3 prioritizes string concatenation: "53".\n4. \'5\' - 3 only supports numeric subtraction, coercing \'5\' to 5: 5 - 3 = 2.\n5. true + true coerce to 1: 1 + 1 = 2.\n6. ![] is false. Then [] == false coerces both to numbers: 0 == 0 -> true.',
    trapExplanation:
      'The + operator concatenates if either operand is or coerces to a string; the - operator always forces numeric conversion.',
    options: [
      `"" , "[object Object]" , "53" , 2 , 2 , true`,
      `"[object Object]" , "[object Object]" , 8 , 2 , 2 , false`,
      `"" , "[object Object]" , "53" , NaN , true , true`,
      `undefined , "[object Object]" , 8 , 2 , 2 , false`
    ]
  },
  {
    id: 'A3',
    title: '"this" Binding: Detached Method vs Arrow Function',
    codeSnippet: `const obj = {
  name: 'Ana',
  normal() { return this?.name; },
  arrow: () => this?.name,
};
const f = obj.normal;

console.log(obj.normal());
console.log(f());
console.log(obj.arrow());`,
    expectedOutput: `'Ana', undefined, undefined`,
    explanation:
      '1. obj.normal() is invoked with obj on the left, so this is obj -> "Ana".\n2. f() is a detached function call without a receiver object; this is undefined in strict mode (or window in non-strict).\n3. obj.arrow() has no this of its own and retains the enclosing lexical scope (module/global), where name does not exist.',
    trapExplanation:
      'Detaching a method from an object breaks its implicit this binding. Arrow functions never have their own this.',
    options: [
      `'Ana', undefined, undefined`,
      `'Ana', 'Ana', 'Ana'`,
      `'Ana', 'Ana', undefined`,
      `'Ana', TypeError, undefined`
    ]
  },
  {
    id: 'A4',
    title: 'Closures & Loops: var vs let',
    codeSnippet: `const fns = [];
for (var i = 0; i < 3; i++) fns.push(() => i);
console.log(fns.map((f) => f()));

const fns2 = [];
for (let j = 0; j < 3; j++) fns2.push(() => j);
console.log(fns2.map((f) => f()));`,
    expectedOutput: '[3, 3, 3] then [0, 1, 2]',
    explanation:
      'var has function scope; every closure captures the identical mutated variable i whose final value is 3. let has block scope, allocating a fresh lexical binding for each loop iteration.',
    trapExplanation:
      'Closures capture variables by reference, not by their snapshot value at the instant the function was defined.',
    options: [
      '[3, 3, 3] then [0, 1, 2]',
      '[0, 1, 2] then [0, 1, 2]',
      '[3, 3, 3] then [3, 3, 3]',
      '[undefined, undefined, undefined] then [0, 1, 2]'
    ]
  },
  {
    id: 'A5',
    title: 'Execution Order: Promises, Async/Await & Timers',
    codeSnippet: `console.log('A');
setTimeout(() => console.log('B'), 0);
new Promise((res) => { console.log('C'); res(); }).then(() => console.log('D'));
(async () => { console.log('E'); await null; console.log('F'); })();
console.log('G');`,
    expectedOutput: 'A C E G D F B',
    explanation:
      '1. Synchronous Code: Logs A. Enqueues timer B as macrotask. Promise executor runs synchronously: logs C and queues D in microtasks. Async function runs synchronously up to await: logs E and queues F in microtasks. Logs G.\n2. Microtask Queue: D and F execute in queued order.\n3. Macrotask Queue: B executes last.',
    trapExplanation:
      'The executor of new Promise(fn) runs immediately and synchronously on the Call Stack; it is not a microtask.',
    options: [
      'A C E G D F B',
      'A B C D E F G',
      'A C E G B D F',
      'A E C G D F B'
    ]
  },
  {
    id: 'A6',
    title: 'Array.map with parseInt and Hidden Arguments',
    codeSnippet: `console.log(['1', '2', '3'].map(parseInt));`,
    expectedOutput: '[1, NaN, NaN]',
    explanation:
      'map passes three arguments: (value, index, array). parseInt accepts (string, radix). Thus map executes: parseInt("1", 0) -> 1 (radix 0 defaults to base 10); parseInt("2", 1) -> NaN (radix 1 is invalid); parseInt("3", 2) -> NaN ("3" is an invalid binary digit).',
    trapExplanation:
      'Passing functions accepting optional parameters directly into .map() causes unintended side effects due to the index argument.',
    options: [
      '[1, NaN, NaN]',
      '[1, 2, 3]',
      '[1, 2, NaN]',
      '[NaN, NaN, NaN]'
    ]
  },
  {
    id: 'A7',
    title: 'Array.prototype.sort Default Lexicographical Ordering',
    codeSnippet: `console.log([10, 9, 1, 100].sort());
console.log([10, 9, 1, 100].sort((a, b) => a - b));`,
    expectedOutput: '[1, 10, 100, 9] then [1, 9, 10, 100]',
    explanation:
      '.sort() without a comparator converts elements to strings and compares UTF-16 code units: "1" < "10" < "100" < "9". For ascending numeric sorting, you must provide (a, b) => a - b.',
    trapExplanation:
      '.sort() does NOT sort numbers numerically by default in JavaScript; it sorts them as lexicographical strings and mutates the original array in place.',
    options: [
      '[1, 10, 100, 9] then [1, 9, 10, 100]',
      '[1, 9, 10, 100] then [1, 9, 10, 100]',
      '[100, 10, 9, 1] then [1, 9, 10, 100]',
      '[1, 10, 9, 100] then [1, 9, 10, 100]'
    ]
  },
  {
    id: 'A8',
    title: 'Identity, NaN Comparisons & Object.is',
    codeSnippet: `console.log({} === {});
console.log([1] == [1]);
console.log([1] == 1);
console.log(NaN === NaN);
console.log(Object.is(NaN, NaN));
console.log(Object.is(0, -0));`,
    expectedOutput: 'false, false, true, false, true, false',
    explanation:
      '1. {} === {} and [1] == [1] are false because they compare distinct memory references.\n2. [1] == 1 is true because [1] coerces to primitive "1" then numeric 1.\n3. NaN === NaN is false per IEEE 754 specification.\n4. Object.is(NaN, NaN) is true.\n5. Object.is(0, -0) is false (it distinguishes signs on zero).',
    trapExplanation:
      'NaN is the only value in JavaScript that is not strictly equal (===) to itself.',
    options: [
      'false, false, true, false, true, false',
      'true, true, true, false, true, false',
      'false, false, false, false, true, true',
      'false, true, true, true, true, false'
    ]
  },
  {
    id: 'A9',
    title: 'Loss of "this" Context in setTimeout Callback',
    codeSnippet: `const counter = {
  n: 0,
  withFunction() { setTimeout(function () { console.log(this?.n); }, 0); },
  withArrow() { setTimeout(() => { console.log(this?.n); }, 0); },
};
counter.withFunction();
counter.withArrow();`,
    expectedOutput: 'undefined then 0',
    explanation:
      'In withFunction(), standard function() invoked by setTimeout executes in global context where this is undefined (or window). In withArrow(), arrow function inherits lexical this from withArrow (the counter object where n is 0).',
    trapExplanation:
      'Passing traditional functions as callbacks to setTimeout or event listeners detaches their receiver object.',
    options: [
      'undefined then 0',
      '0 then 0',
      'undefined then undefined',
      'TypeError on first call'
    ]
  },
  {
    id: 'A10',
    title: 'The finally Block & Return Priority',
    codeSnippet: `function f() {
  try { return 'try'; }
  finally { console.log('finally'); }
}
console.log(f());`,
    expectedOutput: `'finally' then 'try'`,
    explanation:
      'The finally block ALWAYS executes before a function finishes returning its value, even if the try block already encountered a return statement.',
    trapExplanation:
      'finally does not abort try\'s return value unless the finally block itself issues an explicit return (which would overwrite it).',
    options: [
      `'finally' then 'try'`,
      `'try' then 'finally'`,
      `'try' only ('finally' skipped after return)`,
      `'finally' only (try return discarded)`
    ]
  },
  {
    id: 'A11',
    title: 'Function Declaration vs Variable Hoisting Precedence',
    codeSnippet: `console.log(typeof foo);
var foo = 1;
function foo() {}
console.log(typeof foo);`,
    expectedOutput: `'function' then 'number'`,
    explanation:
      'Function declarations are hoisted before variable declarations and take precedence over var foo. When foo = 1 executes at runtime, it overwrites the identifier with number 1.',
    trapExplanation:
      'function foo() is hoisted along with its full implementation; var foo only hoists the uninitialized identifier.',
    options: [
      `'function' then 'number'`,
      `'undefined' then 'number'`,
      `'function' then 'function'`,
      `'number' then 'number'`
    ]
  },
  {
    id: 'A12',
    title: 'Spread Operator & Shallow Cloning',
    codeSnippet: `const a = { x: { y: 1 } };
const b = { ...a };
b.x.y = 2;

console.log(a.x.y);`,
    expectedOutput: '2',
    explanation:
      'The spread operator {...a} creates a shallow copy. Top-level primitive properties are cloned, but nested objects (like x) retain shared references in heap memory.',
    trapExplanation:
      'Assuming {...obj} or Object.assign({}, obj) deeply clones nested objects.',
    options: [
      '2',
      '1',
      'undefined',
      'TypeError: Cannot assign to read only property'
    ]
  },
  {
    id: 'A13',
    title: 'Double Negation (!!) & Truthy / Falsy Values',
    codeSnippet: `console.log(!![]);
console.log(!!{});
console.log(!!0);
console.log(!!1);
console.log(!!-1);
console.log(!!"");
console.log(!!(() => null));`,
    expectedOutput: 'true, true, false, true, true, false, true',
    explanation:
      'In JavaScript, ALL objects and arrays (even empty ones like [] and {}) are truthy. Any number other than 0 (including negative numbers like -1) is truthy. Only 0, -0, 0n, "", null, undefined, and NaN are falsy. Functions are objects and always evaluate to truthy.',
    trapExplanation:
      'In languages like Python, empty lists [] or dicts {} are falsy. In JavaScript, EVERY object reference is truthy regardless of contents.',
    options: [
      'true, true, false, true, true, false, true',
      'false, false, false, true, true, false, true',
      'true, true, false, true, false, false, true',
      'false, true, false, true, true, false, false'
    ]
  },
  {
    id: 'A14',
    title: 'Array Mutation: Direct Reference vs Spread Shallow Clone',
    codeSnippet: `const original = [ 1, 2, 3, 4, 5 ];

const copy1 = original;
const copy2 = [ ...original ];

copy1[2] = 9;

console.log(original[2]);
console.log(copy1[2]);
console.log(copy2[2]);`,
    expectedOutput: '9, 9, 3',
    explanation:
      'copy1 = original does not clone the array; it copies the reference pointer. Mutating copy1[2] = 9 directly modifies the original array in heap memory. In contrast, copy2 = [...original] created an independent array instance, so copy2[2] remains 3.',
    trapExplanation:
      'Assigning an array or object variable with = never clones; both variables point to the identical heap address.',
    options: [
      '9, 9, 3',
      '3, 9, 3',
      '9, 9, 9',
      '3, 9, 5'
    ]
  },
  {
    id: 'A15',
    title: 'Loose Equality (==) vs Strict Equality (===)',
    codeSnippet: `console.log(2 == "2");
console.log(3 === "3");`,
    expectedOutput: 'true, false',
    explanation:
      'Loose equality (==) performs type coercion if types differ; "2" coerces to number 2 before comparing (2 == 2 is true). Strict equality (===) checks both type and value without coercion; number !== string, returning false.',
    trapExplanation:
      'Always prefer === in production to prevent unexpected coercion behaviors outlined in the Abstract Equality Comparison Algorithm.',
    options: [
      'true, false',
      'true, true',
      'false, false',
      'false, true'
    ]
  },
  {
    id: 'A16',
    title: 'Advanced Execution Order: Promise Executor, Microtasks & Timers',
    codeSnippet: `console.log(1);

new Promise((resolve) => {
  console.log(2);
  setTimeout(() => console.log(3));
  resolve(4);
}).then(console.log);

setTimeout(() => console.log(5));

console.log(6);`,
    expectedOutput: '1, 2, 6, 4, 3, 5',
    explanation:
      '1. Synchronous Execution:\n   - console.log(1) logs 1.\n   - new Promise executor runs SYNCHRONOUSLY: logs 2.\n   - setTimeout(3) enqueues macrotask #1.\n   - resolve(4) resolves promise.\n   - .then(console.log) enqueues microtask with 4.\n   - setTimeout(5) enqueues macrotask #2.\n   - console.log(6) logs 6.\n2. Microtask Queue:\n   - .then reaction logs 4.\n3. Macrotask Queue:\n   - First timer callback logs 3.\n   - Second timer callback logs 5.\nFinal order: 1 -> 2 -> 6 -> 4 -> 3 -> 5.',
    trapExplanation:
      'The executor callback passed to new Promise((resolve) => ...) is NOT asynchronous; it executes immediately on the main Call Stack.',
    options: [
      '1, 2, 6, 4, 3, 5',
      '1, 2, 4, 6, 3, 5',
      '1, 6, 2, 4, 3, 5',
      '1, 2, 6, 3, 5, 4'
    ]
  },
  {
    id: 'A17',
    title: 'Object Keys & Coercion to "[object Object]"',
    codeSnippet: `const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);`,
    expectedOutput: '456',
    explanation:
      'Object keys in JavaScript are strings or Symbols. When using an object as a key (a[b]), JS invokes b.toString() which returns "[object Object]". Thus a[b] sets a["[object Object]"] = 123, and a[c] overwrites the identical key with 456. Reading a[b] returns 456. Use Map if you need objects as distinct keys.',
    trapExplanation:
      'Plain objects cannot use object references as distinct keys without string coercion.',
    options: [
      '456',
      '123',
      'undefined',
      'TypeError: Invalid object key'
    ]
  },
  {
    id: 'A18',
    title: 'Chained Assignment & Global Scope Leak',
    codeSnippet: `(function() {
  var a = b = 3;
})();

console.log(typeof a);
console.log(typeof b);`,
    expectedOutput: `'undefined' and 'number'`,
    explanation:
      'The expression var a = b = 3 evaluates right-to-left as b = 3; var a = b;. Without strict mode, b has no var/let/const declaration and leaks into the global object (window.b = 3). However, a is scoped with var inside the function and is unreachable outside.',
    trapExplanation:
      'Never chain variable declarations (var a = b = 3) because the second variable leaks to global scope.',
    options: [
      `'undefined' and 'number'`,
      `'number' and 'number'`,
      `'undefined' and 'undefined'`,
      `ReferenceError on console.log(a)`
    ]
  }
];
