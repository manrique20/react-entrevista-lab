import { JsTopic } from '@/types/javascript';

export const level6Topics: JsTopic[] = [
  {
    "id": "P56",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Diferencia entre módulos ESM y CommonJS?",
    "shortAnswer": "| | ESM (`import/export`) | CommonJS (`require`) |",
    "explanation": "| | ESM (`import/export`) | CommonJS (`require`) |\n|---|---|---|\n| Carga | estática (se analiza antes de ejecutar) | dinámica (en ejecución) |\n| Asincronía | soporta *top-level await* | síncrono |\n| Tree shaking | sí | difícil |\n| Valores exportados | **enlaces vivos** (live bindings) | copia del valor |\n| `this` en nivel superior | `undefined` | `module.exports` |",
    "codeSnippet": "// ESM\nexport const PI = 3.14;\nexport default function area(r) { return PI * r ** 2; }\nimport area, { PI } from './geometria.js';\nconst modulo = await import('./pesado.js');   // import dinámico (lazy)\n\n// CommonJS\nconst fs = require('fs');\nmodule.exports = { area };",
    "seniorTip": "",
    "tags": [
      "nivel-6",
      "this",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P57",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué son los *template literals* y los *tagged templates*?",
    "shortAnswer": "¿Qué son los *template literals* y los *tagged templates*?",
    "explanation": "¿Qué son los *template literals* y los *tagged templates*?",
    "codeSnippet": "const nombre = 'Ana';\nconst mensaje = `Hola ${nombre},\nesto es multilínea y ${1 + 1} es una expresión`;\n\n// Tagged: una función procesa el template\nfunction resaltar(strings, ...valores) {\n  return strings.reduce((acc, s, i) => acc + s + (valores[i] !== undefined ? `<b>${valores[i]}</b>` : ''), '');\n}\nresaltar`Usuario ${nombre} tiene ${5} mensajes`; // 'Usuario <b>Ana</b> tiene <b>5</b> mensajes'\n// styled-components y graphql-tag usan esta técnica",
    "seniorTip": "",
    "tags": [
      "nivel-6",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P58",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué son iterables e iteradores?",
    "shortAnswer": "un **iterable** implementa `[Symbol.iterator]()`, que devuelve un **iterador** con un método `next()` que produce `{ value, done }`. Es lo que permite `for...of`, spread y desestructuración.",
    "explanation": "un **iterable** implementa `[Symbol.iterator]()`, que devuelve un **iterador** con un método `next()` que produce `{ value, done }`. Es lo que permite `for...of`, spread y desestructuración.",
    "codeSnippet": "const rango = {\n  desde: 1, hasta: 3,\n  [Symbol.iterator]() {\n    let actual = this.desde, hasta = this.hasta;\n    return { next: () => actual <= hasta ? { value: actual++, done: false } : { value: undefined, done: true } };\n  },\n};\n[...rango];                 // [1, 2, 3]\nfor (const n of rango) {}   // 1, 2, 3",
    "seniorTip": "",
    "tags": [
      "nivel-6",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P59",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué son los generadores?",
    "shortAnswer": "funciones (`function*`) que se pueden **pausar y reanudar** con `yield`. Devuelven un iterador y evalúan de forma perezosa (*lazy*).",
    "explanation": "funciones (`function*`) que se pueden **pausar y reanudar** con `yield`. Devuelven un iterador y evalúan de forma perezosa (*lazy*).",
    "codeSnippet": "function* idsInfinitos() {\n  let id = 1;\n  while (true) yield id++;\n}\nconst gen = idsInfinitos();\ngen.next().value; // 1\ngen.next().value; // 2\n\nfunction* tomar(n, iterable) {\n  let i = 0;\n  for (const x of iterable) { if (i++ >= n) return; yield x; }\n}\n[...tomar(3, idsInfinitos())]; // [1, 2, 3]",
    "seniorTip": "",
    "tags": [
      "nivel-6",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P60",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué son `Proxy` y `Reflect`?",
    "shortAnswer": "`Proxy` envuelve un objeto e intercepta operaciones (leer, escribir, borrar, `in`, llamar...). `Reflect` ofrece las operaciones por defecto. Vue 3 basa su reactividad en `Proxy`.",
    "explanation": "`Proxy` envuelve un objeto e intercepta operaciones (leer, escribir, borrar, `in`, llamar...). `Reflect` ofrece las operaciones por defecto. Vue 3 basa su reactividad en `Proxy`.",
    "codeSnippet": "const validador = new Proxy({}, {\n  set(obj, prop, valor) {\n    if (prop === 'edad' && !Number.isInteger(valor)) throw new TypeError('edad debe ser entero');\n    return Reflect.set(obj, prop, valor);\n  },\n  get(obj, prop) {\n    return prop in obj ? Reflect.get(obj, prop) : `sin ${String(prop)}`;\n  },\n});\nvalidador.edad = 30;     // ok\nvalidador.edad = 'x';    // TypeError",
    "seniorTip": "",
    "tags": [
      "proxy",
      "nivel-6",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P61",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué novedades útiles trajeron las versiones recientes (ES2022–ES2024)?",
    "shortAnswer": "`structuredClone` no es parte de ECMAScript sino una API web/Node, pero se usa ya de forma estándar.",
    "explanation": "`structuredClone` no es parte de ECMAScript sino una API web/Node, pero se usa ya de forma estándar.",
    "codeSnippet": "[1, 2, 3].at(-1);                          // 3   (ES2022) índice negativo\nObject.hasOwn(obj, 'x');                   // ES2022: reemplaza obj.hasOwnProperty\n[1, 2, 3].findLast((n) => n < 3);          // 2   (ES2023)\n[3, 1, 2].toSorted();                      // ES2023: inmutables (toSorted, toReversed, toSpliced, with)\nObject.groupBy(items, (i) => i.tipo);      // ES2024\nconst { promise, resolve } = Promise.withResolvers(); // ES2024\nconst datos = await fetch(url);            // top-level await en módulos (ES2022)\nclass A { static #x = 1; static { /* bloque de inicialización estático */ } }\n'a-b'.replaceAll('-', '_');                // ES2021",
    "seniorTip": "",
    "tags": [
      "nivel-6",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P62",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué es el *tree shaking*?",
    "shortAnswer": "la eliminación, durante el *build*, de los exports que nadie importa. Requiere módulos ESM (su análisis es estático) y código sin efectos secundarios al importarse; `\"sideEffects\": false` en `package.json` ayuda al bundler a descartar módulos enteros.",
    "explanation": "---",
    "codeSnippet": "// utils.js\nexport const usada = () => {};\nexport const noUsada = () => {};   // se elimina del bundle si nadie la importa\n// app.js\nimport { usada } from './utils.js';",
    "seniorTip": "",
    "tags": [
      "nivel-6",
      "javascript"
    ],
    "interactiveDemo": "console"
  }
];
