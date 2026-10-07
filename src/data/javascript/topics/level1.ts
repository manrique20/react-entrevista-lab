import { JsTopic } from '@/types/javascript';

export const level1Topics: JsTopic[] = [
  {
    "id": "P1",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué tipos de datos tiene JavaScript?",
    "shortAnswer": "7 primitivos (`string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`) y 1 tipo de referencia (`object`, que incluye arrays, funciones, fechas, etc.).",
    "explanation": "los primitivos son **inmutables** y se copian **por valor**. Los objetos se asignan **por referencia**: dos variables pueden apuntar al mismo objeto en memoria.",
    "codeSnippet": "let a = 'hola';\na[0] = 'H';          // no hace nada: los strings son inmutables\nconsole.log(a);      // 'hola'\n\nconst x = { n: 1 };\nconst y = x;         // y apunta al MISMO objeto\ny.n = 2;\nconsole.log(x.n);    // 2",
    "seniorTip": "",
    "tags": [
      "object",
      "nivel-1",
      "javascript",
      "array"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P2",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Diferencia entre `var`, `let` y `const`?",
    "shortAnswer": "`var` tiene scope de función y se \"eleva\" inicializado en `undefined`; `let` y `const` tienen scope de bloque y viven en la zona muerta temporal (TDZ) hasta su declaración. `const` no permite reasignar, pero **no vuelve inmutable** al objeto.",
    "explanation": "**Buena práctica:** usa `const` por defecto, `let` si necesitas reasignar y evita `var`.",
    "codeSnippet": "if (true) {\n  var a = 1;\n  let b = 2;\n}\nconsole.log(a); // 1\nconsole.log(b); // ReferenceError\n\nconst user = { nombre: 'Ana' };\nuser.nombre = 'Luis';   // permitido: se muta el objeto\nuser = {};              // TypeError: no se puede reasignar",
    "seniorTip": "Buena práctica: usa `const` por defecto, `let` si necesitas reasignar y evita `var`.",
    "tags": [
      "scope",
      "nivel-1",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P3",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué es el hoisting y la TDZ?",
    "shortAnswer": "el motor registra las declaraciones antes de ejecutar el código. Las funciones declaradas se pueden usar antes de su línea; `var` existe pero vale `undefined`; `let`/`const` existen pero acceder a ellas antes de la declaración lanza `ReferenceError` (TDZ).",
    "explanation": "el motor registra las declaraciones antes de ejecutar el código. Las funciones declaradas se pueden usar antes de su línea; `var` existe pero vale `undefined`; `let`/`const` existen pero acceder a ellas antes de la declaración lanza `ReferenceError` (TDZ).",
    "codeSnippet": "console.log(a);   // undefined (var elevada)\nvar a = 5;\n\nconsole.log(b);   // ReferenceError: Cannot access 'b' before initialization (TDZ)\nlet b = 5;\n\nsaludar();        // funciona: la declaración completa se eleva\nfunction saludar() { console.log('hola'); }\n\ndespedir();       // TypeError: despedir is not a function (var elevada = undefined)\nvar despedir = function () {};",
    "seniorTip": "",
    "tags": [
      "hoisting",
      "nivel-1",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P4",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Diferencia entre `==` y `===`?",
    "shortAnswer": "`===` compara valor y tipo sin convertir; `==` aplica **coerción de tipos** antes de comparar, con reglas poco intuitivas. Usa `===` salvo `x == null` (que cubre `null` y `undefined`).",
    "explanation": "`===` compara valor y tipo sin convertir; `==` aplica **coerción de tipos** antes de comparar, con reglas poco intuitivas. Usa `===` salvo `x == null` (que cubre `null` y `undefined`).",
    "codeSnippet": "0 == '0';          // true\n0 == '';           // true\n'0' == '';         // false  (no es transitivo)\nnull == undefined; // true\nnull === undefined;// false\nNaN == NaN;        // false\n[] == ![];         // true   (acertijo clásico)\n\nif (valor == null) { /* null o undefined */ }",
    "seniorTip": "",
    "tags": [
      "nivel-1",
      "javascript"
    ],
    "interactiveDemo": "coercion"
  },
  {
    "id": "P5",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Diferencia entre `null` y `undefined`?",
    "shortAnswer": "`undefined` es el valor por defecto de algo **sin asignar** (variable declarada, parámetro omitido, propiedad inexistente, función sin return). `null` es una **ausencia intencional** de valor que asigna el programador.",
    "explanation": "`undefined` es el valor por defecto de algo **sin asignar** (variable declarada, parámetro omitido, propiedad inexistente, función sin return). `null` es una **ausencia intencional** de valor que asigna el programador.",
    "codeSnippet": "let x;              // undefined\nconst o = {};\no.inexistente;      // undefined\nfunction f() {}\nf();                // undefined\n\nlet usuario = null; // \"aún no hay usuario\", asignado a propósito\ntypeof undefined;   // 'undefined'\ntypeof null;        // 'object'  (bug histórico del lenguaje)",
    "seniorTip": "",
    "tags": [
      "nivel-1",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P6",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Cuáles son los valores *falsy*?",
    "shortAnswer": "`false`, `0`, `-0`, `0n`, `\"\"` (string vacío), `null`, `undefined` y `NaN`. **Todo lo demás es *truthy***, incluidos `[]`, `{}`, `\"0\"` y `\"false\"`.",
    "explanation": "`false`, `0`, `-0`, `0n`, `\"\"` (string vacío), `null`, `undefined` y `NaN`. **Todo lo demás es *truthy***, incluidos `[]`, `{}`, `\"0\"` y `\"false\"`.",
    "codeSnippet": "if ([]) console.log('un array vacío es truthy');\nif ('0') console.log('\"0\" es truthy');\nif (!'') console.log('\"\" es falsy');\n\n// Trampa común: 0 es un valor válido\nconst cantidad = 0;\nconst mostrar = cantidad || 10;  // 10 (incorrecto)\nconst mostrar2 = cantidad ?? 10; // 0  (correcto)",
    "seniorTip": "",
    "tags": [
      "nivel-1",
      "javascript"
    ],
    "interactiveDemo": "coercion"
  },
  {
    "id": "P7",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué hace `typeof` y cuáles son sus rarezas?",
    "shortAnswer": "Para distinguir tipos de objeto: `Array.isArray(x)`, `x instanceof Date`, `Object.prototype.toString.call(x)`.",
    "explanation": "Para distinguir tipos de objeto: `Array.isArray(x)`, `x instanceof Date`, `Object.prototype.toString.call(x)`.",
    "codeSnippet": "typeof 'a';          // 'string'\ntypeof 42;           // 'number'\ntypeof NaN;          // 'number'\ntypeof 10n;          // 'bigint'\ntypeof undefined;    // 'undefined'\ntypeof null;         // 'object'   <- rareza\ntypeof [];           // 'object'   <- usa Array.isArray([])\ntypeof function(){}; // 'function'\ntypeof Symbol();     // 'symbol'\ntypeof sinDeclarar;  // 'undefined' (no lanza error)",
    "seniorTip": "",
    "tags": [
      "prototype",
      "object",
      "nivel-1",
      "javascript",
      "array"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P8",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué es `NaN` y cómo se comprueba?",
    "shortAnswer": "\"Not a Number\" es el resultado de una operación numérica inválida. Es de tipo `number` y es el único valor que **no es igual a sí mismo**. Compruébalo con `Number.isNaN()` (estricto), no con `isNaN()` global (que convierte antes).",
    "explanation": "\"Not a Number\" es el resultado de una operación numérica inválida. Es de tipo `number` y es el único valor que **no es igual a sí mismo**. Compruébalo con `Number.isNaN()` (estricto), no con `isNaN()` global (que convierte antes).",
    "codeSnippet": "0 / 0;                  // NaN\nparseInt('abc');        // NaN\nNaN === NaN;            // false\n\nisNaN('abc');           // true  (convierte 'abc' → NaN; engañoso)\nNumber.isNaN('abc');    // false (no es el valor NaN)\nNumber.isNaN(NaN);      // true\nObject.is(NaN, NaN);    // true",
    "seniorTip": "",
    "tags": [
      "nivel-1",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P9",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Por qué `0.1 + 0.2 !== 0.3`?",
    "shortAnswer": "los números son punto flotante binario (IEEE 754) y 0.1 y 0.2 no se pueden representar exactamente en binario. Se acumula un error mínimo.",
    "explanation": "los números son punto flotante binario (IEEE 754) y 0.1 y 0.2 no se pueden representar exactamente en binario. Se acumula un error mínimo.",
    "codeSnippet": "0.1 + 0.2;                          // 0.30000000000000004\n0.1 + 0.2 === 0.3;                  // false\n\n// Soluciones\nMath.abs(0.1 + 0.2 - 0.3) < Number.EPSILON;   // true\n+(0.1 + 0.2).toFixed(2);                      // 0.3 (redondeo para mostrar)\n(10 + 20) / 100;                              // trabajar en enteros (centavos) para dinero",
    "seniorTip": "",
    "tags": [
      "nivel-1",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P10",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué es la coerción de tipos?",
    "shortAnswer": "conversión automática de un tipo a otro. Con `+`, si algún operando es string, concatena; con `-`, `*`, `/` convierte a número.",
    "explanation": "conversión automática de un tipo a otro. Con `+`, si algún operando es string, concatena; con `-`, `*`, `/` convierte a número.",
    "codeSnippet": "'5' + 2;        // '52'\n'5' - 2;        // 3\ntrue + 1;       // 2\n[] + [];        // ''\n[] + {};        // '[object Object]'\n+'42';          // 42   (unario +: convierte a número)\n!!'hola';       // true (convierte a booleano)\nString(123);    // '123' (conversión explícita, preferible)",
    "seniorTip": "",
    "tags": [
      "nivel-1",
      "javascript"
    ],
    "interactiveDemo": "coercion"
  },
  {
    "id": "P11",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Se pasa por valor o por referencia?",
    "shortAnswer": "JavaScript siempre **pasa por valor**, pero en objetos ese valor es una **referencia**. Mutar el objeto dentro de una función afecta al original; reasignar el parámetro no.",
    "explanation": "JavaScript siempre **pasa por valor**, pero en objetos ese valor es una **referencia**. Mutar el objeto dentro de una función afecta al original; reasignar el parámetro no.",
    "codeSnippet": "function cambiar(obj, num) {\n  obj.valor = 99;      // muta el objeto original\n  obj = { valor: 0 };  // reasigna solo la copia local de la referencia\n  num = 100;           // copia del primitivo\n}\nconst o = { valor: 1 };\nlet n = 1;\ncambiar(o, n);\nconsole.log(o.valor, n); // 99 1",
    "seniorTip": "",
    "tags": [
      "nivel-1",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P12",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Diferencia entre `??`, `||` y `?.`?",
    "shortAnswer": "`||` usa el valor por defecto con cualquier *falsy*; `??` solo con `null`/`undefined`; `?.` corta la evaluación y devuelve `undefined` si algo es `null`/`undefined`.",
    "explanation": "`||` usa el valor por defecto con cualquier *falsy*; `??` solo con `null`/`undefined`; `?.` corta la evaluación y devuelve `undefined` si algo es `null`/`undefined`.",
    "codeSnippet": "const config = { puerto: 0, host: '' };\nconfig.puerto || 3000;      // 3000 (0 es falsy → pierde el valor válido)\nconfig.puerto ?? 3000;      // 0\nconfig.host ?? 'localhost'; // ''\n\nconst usuario = null;\nusuario?.direccion?.calle;     // undefined (sin error)\nusuario?.saludar?.();          // llamada opcional\nusuario?.lista?.[0];           // acceso opcional por índice\n\nlet x = null;\nx ??= 5;    // asignación lógica: x = x ?? 5",
    "seniorTip": "",
    "tags": [
      "nivel-1",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P13",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué es el *strict mode*?",
    "shortAnswer": "`'use strict'` activa una variante más estricta del lenguaje: convierte errores silenciosos en excepciones, prohíbe variables no declaradas y hace que `this` sea `undefined` en funciones sueltas. Los módulos ES y las clases ya lo usan automáticamente.",
    "explanation": "---",
    "codeSnippet": "'use strict';\nx = 10;                           // ReferenceError (sin strict crearía una global)\nfunction f() { return this; }\nf();                              // undefined (sin strict sería window/globalThis)\ndelete Object.prototype;          // TypeError",
    "seniorTip": "",
    "tags": [
      "strict-mode",
      "nivel-1",
      "this",
      "javascript"
    ],
    "interactiveDemo": "console"
  }
];
