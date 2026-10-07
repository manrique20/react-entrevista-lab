import { JsRiddle } from '@/types/javascript';

export const jsRiddlesData: JsRiddle[] = [
  {
    "id": "A1",
    "title": "Hoisting",
    "codeSnippet": "console.log(a);\nvar a = 1;\nconsole.log(b);\nlet b = 2;",
    "expectedOutput": "undefined y luego ReferenceError (TDZ de b).",
    "explanation": "**Salida:** `undefined` y luego `ReferenceError` (TDZ de `b`).",
    "trapExplanation": "Trampa clásica de Hoisting y Temporal Dead Zone (TDZ). Las variables con let/const no pueden accederse antes de inicializarse.",
    "options": [
      "undefined y luego ReferenceError (TDZ de b).",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  },
  {
    "id": "A2",
    "title": "Coerciones clásicas",
    "codeSnippet": "console.log([] + []);            // ''\nconsole.log([] + {});            // '[object Object]'\nconsole.log('5' + 3);            // '53'\nconsole.log('5' - 3);            // 2\nconsole.log(true + true);        // 2\nconsole.log([] == ![]);          // true\nconsole.log(null >= 0);          // true  (>= convierte a número: 0 >= 0)\nconsole.log(null > 0);           // false\nconsole.log(null == 0);          // false (== con null solo iguala a undefined)\nconsole.log('b' + 'a' + +'a' + 'a'); // 'baNaNa'\nconsole.log(typeof NaN);         // 'number'",
    "expectedOutput": "Comprobar ejecución",
    "explanation": "",
    "trapExplanation": "Atención con el orden de ejecución, coerción de tipos o binding implícito de 'this'.",
    "options": [
      "Comprobar ejecución",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  },
  {
    "id": "A3",
    "title": "Funciones como método extraído",
    "codeSnippet": "const obj = {\n  nombre: 'Ana',\n  normal() { return this?.nombre; },\n  flecha: () => this?.nombre,\n};\nconst f = obj.normal;\nconsole.log(obj.normal()); // 'Ana'\nconsole.log(f());          // undefined (this perdido)\nconsole.log(obj.flecha()); // undefined (this de la flecha es el del scope exterior)",
    "expectedOutput": "Comprobar ejecución",
    "explanation": "",
    "trapExplanation": "Atención con el orden de ejecución, coerción de tipos o binding implícito de 'this'.",
    "options": [
      "Comprobar ejecución",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  },
  {
    "id": "A4",
    "title": "Closures y bucles",
    "codeSnippet": "const fns = [];\nfor (var i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns.map((f) => f())); // [3, 3, 3]\n\nconst fns2 = [];\nfor (let j = 0; j < 3; j++) fns2.push(() => j);\nconsole.log(fns2.map((f) => f())); // [0, 1, 2]",
    "expectedOutput": "Comprobar ejecución",
    "explanation": "",
    "trapExplanation": "Atención con el orden de ejecución, coerción de tipos o binding implícito de 'this'.",
    "options": [
      "Comprobar ejecución",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  },
  {
    "id": "A5",
    "title": "Orden con promesas y timers",
    "codeSnippet": "console.log('A');\nsetTimeout(() => console.log('B'), 0);\nnew Promise((res) => { console.log('C'); res(); }).then(() => console.log('D'));\n(async () => { console.log('E'); await null; console.log('F'); })();\nconsole.log('G');",
    "expectedOutput": "A C E G D F B.",
    "explanation": "el *executor* de la promesa corre síncrono (`C`); `E` se imprime antes del primer `await`; `D` y `F` son microtareas en orden de encolado; `B` es macrotarea.",
    "trapExplanation": "Microtareas (Promise.then, async/await) se vacían SIEMPRE antes de la siguiente macrotarea (setTimeout/setInterval).",
    "options": [
      "A C E G D F B.",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  },
  {
    "id": "A6",
    "title": "`map` con `parseInt`",
    "codeSnippet": "console.log(['1', '2', '3'].map(parseInt)); // [1, NaN, NaN]",
    "expectedOutput": "map pasa (valor, índice); parseInt('2', 1) y parseInt('3', 2) usan el índice como base y fallan. Correcto: .map(Number) o .map((s) => parseInt(s, 10)).",
    "explanation": "`map` pasa `(valor, índice)`; `parseInt('2', 1)` y `parseInt('3', 2)` usan el índice como base y fallan. Correcto: `.map(Number)` o `.map((s) => parseInt(s, 10))`.",
    "trapExplanation": "Array.prototype.map pasa 3 argumentos: (elemento, índice, array). parseInt recibe (string, radix) usando el índice como base numérica.",
    "options": [
      "map pasa (valor, índice); parseInt('2', 1) y parseInt('3', 2) usan el índice como base y fallan. Correcto: .map(Number) o .map((s) => parseInt(s, 10)).",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  },
  {
    "id": "A7",
    "title": "`sort` por defecto",
    "codeSnippet": "console.log([10, 9, 1, 100].sort());                    // [1, 10, 100, 9]\nconsole.log([10, 9, 1, 100].sort((a, b) => a - b));     // [1, 9, 10, 100]",
    "expectedOutput": "Comprobar ejecución",
    "explanation": "",
    "trapExplanation": "Atención con el orden de ejecución, coerción de tipos o binding implícito de 'this'.",
    "options": [
      "Comprobar ejecución",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  },
  {
    "id": "A8",
    "title": "Igualdad de objetos y arrays",
    "codeSnippet": "console.log({} === {});            // false (distintas referencias)\nconsole.log([1] == [1]);           // false\nconsole.log([1] == 1);             // true  ([1] → '1' → 1)\nconsole.log(NaN === NaN);          // false\nconsole.log(Object.is(NaN, NaN));  // true\nconsole.log(Object.is(0, -0));     // false",
    "expectedOutput": "Comprobar ejecución",
    "explanation": "",
    "trapExplanation": "Atención con el orden de ejecución, coerción de tipos o binding implícito de 'this'.",
    "options": [
      "Comprobar ejecución",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  },
  {
    "id": "A9",
    "title": "`this` en `setTimeout`",
    "codeSnippet": "const contador = {\n  n: 0,\n  conFuncion() { setTimeout(function () { console.log(this.n); }, 0); },   // undefined\n  conFlecha() { setTimeout(() => { console.log(this.n); }, 0); },         // 0\n};",
    "expectedOutput": "Comprobar ejecución",
    "explanation": "",
    "trapExplanation": "Pérdida de contexto 'this': al pasar una función como callback o invocarla sin objeto a la izquierda, this se pierde (undefined o window).",
    "options": [
      "Comprobar ejecución",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  },
  {
    "id": "A10",
    "title": "`finally` y `return`",
    "codeSnippet": "function f() {\n  try { return 'try'; }\n  finally { console.log('finally'); }   // se ejecuta ANTES de devolver\n}\nconsole.log(f()); // finally, luego 'try'",
    "expectedOutput": "Comprobar ejecución",
    "explanation": "",
    "trapExplanation": "Atención con el orden de ejecución, coerción de tipos o binding implícito de 'this'.",
    "options": [
      "Comprobar ejecución",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  },
  {
    "id": "A11",
    "title": "Hoisting de funciones vs. variables",
    "codeSnippet": "console.log(typeof foo); // 'function'\nvar foo = 1;\nfunction foo() {}\nconsole.log(typeof foo); // 'number'",
    "expectedOutput": "Las declaraciones de función se elevan por encima de var; luego la asignación foo = 1 la sobrescribe.",
    "explanation": "Las declaraciones de función se elevan por encima de `var`; luego la asignación `foo = 1` la sobrescribe.",
    "trapExplanation": "Trampa clásica de Hoisting y Temporal Dead Zone (TDZ). Las variables con let/const no pueden accederse antes de inicializarse.",
    "options": [
      "Las declaraciones de función se elevan por encima de var; luego la asignación foo = 1 la sobrescribe.",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  },
  {
    "id": "A12",
    "title": "Spread y copias",
    "codeSnippet": "const a = { x: { y: 1 } };\nconst b = { ...a };\nb.x.y = 2;\nconsole.log(a.x.y); // 2 (copia superficial)",
    "expectedOutput": "---",
    "explanation": "---",
    "trapExplanation": "Atención con el orden de ejecución, coerción de tipos o binding implícito de 'this'.",
    "options": [
      "---",
      "undefined",
      "Error en tiempo de ejecución (TypeError / ReferenceError)",
      "[object Object]"
    ]
  }
];
