import { JsLevelInfo } from '@/types/javascript';

export const jsLevelsData: JsLevelInfo[] = [
  {
    id: 1,
    title: 'Level 1: Fundamentals',
    shortTitle: 'Fundamentals',
    description: 'Primitive types vs references, var/let/const, hoisting, TDZ, type coercion, equality algorithms, and modern operators.',
    color: 'from-amber-500 to-yellow-500',
    iconName: 'Zap',
    questionIds: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']
  },
  {
    id: 2,
    title: 'Level 2: Functions',
    shortTitle: 'Functions',
    description: 'Declarations vs expressions, arrow functions, rest/spread, higher-order functions, callbacks, IIFE, pure functions, and currying.',
    color: 'from-orange-500 to-amber-600',
    iconName: 'Code',
    questionIds: ['P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'P21']
  },
  {
    id: 3,
    title: 'Level 3: Scope, Closures & this',
    shortTitle: 'Scope, Closures & this',
    description: 'Lexical scope, deep-dive closures, "this" resolution, call/apply/bind, context loss, and data privacy.',
    color: 'from-rose-500 to-pink-600',
    iconName: 'Layers',
    questionIds: ['P22', 'P23', 'P24', 'P25', 'P26', 'P27', 'P28', 'P29']
  },
  {
    id: 4,
    title: 'Level 4: Objects, Prototypes, Classes & Arrays',
    shortTitle: 'Objects & Prototypes',
    description: 'Prototype chain, new operator, ES6 classes, private fields (#), immutability (freeze/seal), Map/Set, and Symbols.',
    color: 'from-emerald-500 to-teal-600',
    iconName: 'Boxes',
    questionIds: ['P30', 'P31', 'P32', 'P33', 'P34', 'P35', 'P36', 'P37', 'P38', 'P39', 'P40', 'P41', 'P42', 'P43']
  },
  {
    id: 5,
    title: 'Level 5: Asynchronous JS & Event Loop',
    shortTitle: 'Asynchrony & Event Loop',
    description: 'Event Loop, microtasks vs macrotasks, Promises, async/await, Promise combinators (all, race, any), cancellations, and exponential backoff retry.',
    color: 'from-blue-500 to-cyan-600',
    iconName: 'Clock',
    questionIds: ['P44', 'P45', 'P46', 'P47', 'P48', 'P49', 'P50', 'P51', 'P52', 'P53', 'P54', 'P55']
  },
  {
    id: 6,
    title: 'Level 6: ES6+ & Modules',
    shortTitle: 'ES6+ & Modules',
    description: 'ESM vs CommonJS, tagged templates, iterators, generators (yield), Proxy & Reflect, ES2022-ES2024 features, and tree shaking.',
    color: 'from-indigo-500 to-purple-600',
    iconName: 'Sparkles',
    questionIds: ['P56', 'P57', 'P58', 'P59', 'P60', 'P61', 'P62']
  },
  {
    id: 7,
    title: 'Level 7: DOM & Browser APIs',
    shortTitle: 'DOM & Browser',
    description: 'Event bubbling, capture phase, event delegation, web storage (local/session/cookies/IDB), fetch, CORS, debounce/throttle, reflow, and repaint.',
    color: 'from-violet-500 to-fuchsia-600',
    iconName: 'Globe',
    questionIds: ['P63', 'P64', 'P65', 'P66', 'P67', 'P68', 'P69', 'P70', 'P71', 'P72', 'P73']
  },
  {
    id: 8,
    title: 'Level 8: Advanced JavaScript',
    shortTitle: 'Advanced',
    description: 'Memory management, detecting memory leaks, design patterns, robust error handling, Node.js Event Loop, and WeakRef.',
    color: 'from-red-500 to-rose-700',
    iconName: 'Cpu',
    questionIds: ['P74', 'P75', 'P76', 'P77', 'P78', 'P79', 'P80', 'P81']
  }
];
