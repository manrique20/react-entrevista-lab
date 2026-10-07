import { JsTopic } from '@/types/javascript';

export const level2Topics: JsTopic[] = [
  {
    "id": "P14",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Diferencia entre declaración, expresión de función y arrow function?",
    "shortAnswer": "| | Declaración | Expresión | Arrow |",
    "explanation": "| | Declaración | Expresión | Arrow |\n|---|---|---|---|\n| Hoisting | sí (completa) | no (solo la variable) | no |\n| `this` propio | sí | sí | **no** (léxico) |\n| `arguments` | sí | sí | no |\n| Usable con `new` | sí | sí | **no** |",
    "codeSnippet": "function suma(a, b) { return a + b; }          // declaración\nconst resta = function (a, b) { return a - b; }; // expresión\nconst mult = (a, b) => a * b;                   // arrow (return implícito)\nconst crear = (id) => ({ id });                 // para devolver un objeto, paréntesis",
    "seniorTip": "",
    "tags": [
      "hoisting",
      "nivel-2",
      "this",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P15",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué son parámetros por defecto, *rest* y *spread*?",
    "shortAnswer": "¿Qué son parámetros por defecto, *rest* y *spread*?",
    "explanation": "¿Qué son parámetros por defecto, *rest* y *spread*?",
    "codeSnippet": "// Por defecto (se evalúan solo si el argumento es undefined)\nfunction saludar(nombre = 'invitado') { return `Hola ${nombre}`; }\nsaludar();            // 'Hola invitado'\nsaludar(null);        // 'Hola null' (null NO activa el default)\n\n// Rest: agrupa argumentos restantes en un array real\nfunction sumar(...nums) { return nums.reduce((a, b) => a + b, 0); }\nsumar(1, 2, 3);       // 6\n\n// Spread: expande un iterable\nconst a = [1, 2], b = [3];\nconst c = [...a, ...b];             // [1, 2, 3]\nMath.max(...c);                      // 3\nconst o2 = { ...{ x: 1 }, y: 2 };   // { x: 1, y: 2 }",
    "seniorTip": "",
    "tags": [
      "nivel-2",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P16",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es una función de orden superior?",
    "shortAnswer": "una función que **recibe funciones como argumento o devuelve una función**. Es posible porque las funciones son ciudadanos de primera clase (se pueden asignar, pasar y retornar).",
    "explanation": "una función que **recibe funciones como argumento o devuelve una función**. Es posible porque las funciones son ciudadanos de primera clase (se pueden asignar, pasar y retornar).",
    "codeSnippet": "const numeros = [1, 2, 3, 4, 5];\n\nnumeros.map((n) => n * 2);               // [2, 4, 6, 8, 10]\nnumeros.filter((n) => n % 2 === 0);      // [2, 4]\nnumeros.reduce((acc, n) => acc + n, 0);  // 15\n\n// Devuelve una función\nconst multiplicadorDe = (factor) => (n) => n * factor;\nconst doble = multiplicadorDe(2);\ndoble(7); // 14",
    "seniorTip": "",
    "tags": [
      "nivel-2",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P17",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es un callback?",
    "shortAnswer": "una función que se pasa a otra para que se ejecute más tarde (de forma síncrona o asíncrona).",
    "explanation": "Problema: anidar muchos callbacks produce el \"callback hell\"; se resuelve con promesas y `async/await`.",
    "codeSnippet": "// Síncrono\n[1, 2, 3].forEach((n) => console.log(n));\n\n// Asíncrono\nsetTimeout(() => console.log('después de 1s'), 1000);\n\n// Convención Node.js: error-first callback\nleerArchivo('a.txt', (err, datos) => {\n  if (err) return console.error(err);\n  console.log(datos);\n});",
    "seniorTip": "",
    "tags": [
      "async",
      "nivel-2",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P18",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es una IIFE y para qué sirve?",
    "shortAnswer": "*Immediately Invoked Function Expression*: una función que se define y ejecuta al instante. Antes de los módulos se usaba para crear un scope privado y no contaminar el global.",
    "explanation": "*Immediately Invoked Function Expression*: una función que se define y ejecuta al instante. Antes de los módulos se usaba para crear un scope privado y no contaminar el global.",
    "codeSnippet": "(function () {\n  const secreto = 'no accesible desde fuera';\n  console.log('me ejecuto ya');\n})();\n\nconst contador = (() => {\n  let n = 0;\n  return { inc: () => ++n, valor: () => n };\n})();\ncontador.inc();\ncontador.valor(); // 1",
    "seniorTip": "",
    "tags": [
      "scope",
      "nivel-2",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P19",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es una función pura y por qué importa?",
    "shortAnswer": "dado el mismo input, siempre devuelve el mismo output y **no tiene efectos secundarios** (no modifica nada externo, no hace I/O). Son fáciles de testear, razonar y memoizar. React y Redux dependen de ellas.",
    "explanation": "dado el mismo input, siempre devuelve el mismo output y **no tiene efectos secundarios** (no modifica nada externo, no hace I/O). Son fáciles de testear, razonar y memoizar. React y Redux dependen de ellas.",
    "codeSnippet": "// Impura\nlet total = 0;\nfunction agregar(n) { total += n; return total; }\n\n// Pura\nconst agregarPura = (total, n) => total + n;\n\n// Impura por mutar el argumento\nconst ordenarMal = (arr) => arr.sort();\n// Pura\nconst ordenarBien = (arr) => [...arr].sort();",
    "seniorTip": "",
    "tags": [
      "nivel-2",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P20",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es *currying* y qué es composición?",
    "shortAnswer": "*currying* transforma `f(a, b, c)` en `f(a)(b)(c)`. Composición combina funciones pequeñas en una: `compose(f, g)(x) = f(g(x))`.",
    "explanation": "*currying* transforma `f(a, b, c)` en `f(a)(b)(c)`. Composición combina funciones pequeñas en una: `compose(f, g)(x) = f(g(x))`.",
    "codeSnippet": "const sumar = (a) => (b) => (c) => a + b + c;\nsumar(1)(2)(3); // 6\n\nconst compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);\nconst pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);\n\nconst limpiar = pipe(\n  (s) => s.trim(),\n  (s) => s.toLowerCase(),\n  (s) => s.replace(/\\s+/g, '-')\n);\nlimpiar('  Hola Mundo JS '); // 'hola-mundo-js'",
    "seniorTip": "",
    "tags": [
      "nivel-2",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P21",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es el objeto `arguments`?",
    "shortAnswer": "un objeto *array-like* disponible en funciones tradicionales (no arrow) con todos los argumentos recibidos. Hoy se prefiere `...rest`, que es un array real.",
    "explanation": "---",
    "codeSnippet": "function vieja() {\n  console.log(arguments.length);          // 3\n  console.log(Array.from(arguments));     // [1, 2, 3] (convertir a array)\n  // arguments.map(...) → TypeError: no es un array\n}\nvieja(1, 2, 3);\n\nconst flecha = () => { /* arguments no existe aquí */ };",
    "seniorTip": "",
    "tags": [
      "nivel-2",
      "javascript",
      "array"
    ],
    "interactiveDemo": "console"
  }
];
